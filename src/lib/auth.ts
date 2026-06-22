import { apiFetch } from './api'

export interface CurrentUser {
  user_id: string
  name: string
  email: string
  role: string
  is_active: boolean
}

export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const
export const AUTH_ME_STALE_TIME = 5 * 60 * 1000

export function fetchCurrentUser() {
  return apiFetch<CurrentUser>('/auth/me')
}

export const authMeQueryOptions = {
  queryKey: AUTH_ME_QUERY_KEY,
  queryFn: fetchCurrentUser,
  staleTime: AUTH_ME_STALE_TIME,
  gcTime: 30 * 60 * 1000,
  retry: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const
