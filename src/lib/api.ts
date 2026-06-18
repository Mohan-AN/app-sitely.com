const API_URL = import.meta.env.VITE_API_URL

export const ACCESS_TOKEN_KEY = 'sitely_access_token'
export const REFRESH_TOKEN_KEY = 'sitely_refresh_token'

export class ApiError extends Error {
  code?: string
  status?: number
  errors?: string[]

  constructor(message: string, code?: string, status?: number, errors?: string[]) {
    super(message)
    this.code = code
    this.status = status
    this.errors = errors
  }
}

interface TokenPair {
  accessToken: string
  refreshToken?: string
}

type QueueEntry = { resolve: () => void; reject: (err: unknown) => void }

let isRefreshing = false
let pendingQueue: QueueEntry[] = []

const SKIP_REFRESH_PATHS = ['/auth/refresh', '/auth/login', '/auth/reset-password']

function getAccessToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null
}

function getRefreshToken() {
  return typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null
}

function clearTokens() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

function redirectToLogin() {
  if (typeof window === 'undefined') return
  if (window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

function drainQueue(error?: unknown) {
  const queue = pendingQueue
  pendingQueue = []
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()))
}

async function parseJson(res: Response) {
  try {
    return await res.json()
  } catch {
    throw new ApiError('Something went wrong', undefined, res.status)
  }
}

async function performRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })

  const json = await parseJson(res)
  if (!res.ok || !json.success) return false

  const tokens = json.data as TokenPair
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  if (tokens.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  return true
}

export async function apiFetch<T>(path: string, options: RequestInit = {}, hasRetried = false): Promise<T> {
  const accessToken = getAccessToken()

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401 && !hasRetried && !SKIP_REFRESH_PATHS.includes(path)) {
    // A refresh is already in progress — park this request in the queue
    if (isRefreshing) {
      return new Promise<T>((resolve, reject) => {
        pendingQueue.push({
          resolve: () => resolve(apiFetch<T>(path, options, true)),
          reject,
        })
      })
    }

    isRefreshing = true
    let refreshed = false
    try {
      refreshed = await performRefresh()
    } catch {
      // network or parse error — treat as failed refresh
    } finally {
      isRefreshing = false
    }

    if (refreshed) {
      drainQueue()
      return apiFetch<T>(path, options, true)
    }

    const err = new ApiError('Session expired. Please sign in again.', 'UNAUTHORIZED', 401)
    drainQueue(err)
    clearTokens()
    redirectToLogin()
    throw err
  }

  const json = await parseJson(res)

  if (!json.success) {
    throw new ApiError(
      json.error?.message ?? json.message ?? 'Something went wrong',
      json.error?.code,
      res.status,
      Array.isArray(json.errors) ? (json.errors as string[]) : undefined,
    )
  }

  return json.data as T
}
