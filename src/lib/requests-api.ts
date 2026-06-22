import { apiFetch } from '#/lib/api'

export type RequestType = 'bug' | 'feature'
export type RequestStatus = 'open' | 'in_progress' | 'completed' | 'wont_fix'

export interface WebsiteRequest {
  request_id: string
  website_id: string
  type: RequestType
  title: string
  description: string | null
  status: RequestStatus
  requested_date: string | null
  cost: string | null
  payment_status: string | null
  created_at: string
  updated_at: string
  reported_by: string
}

export interface CreateRequestInput {
  websiteId: string
  type: RequestType
  title: string
  description?: string | null
  status?: RequestStatus
  requestedDate?: string | null
  cost?: string | null
  paymentStatus?: 'not_paid' | 'paid'
  paymentDate?: string | null
  invoiceFile?: File | null
}

export interface UpdateRequestInput {
  status?: RequestStatus
  title?: string
  description?: string | null
}

export function listRequests(websiteId: string, page = 1, limit = 20) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  return apiFetch<{ items: WebsiteRequest[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
    `/websites/${websiteId}/requests?${params.toString()}`,
  )
}

export function createRequest(input: CreateRequestInput) {
  if (input.invoiceFile) {
    const fd = new FormData()
    fd.append('type', input.type)
    fd.append('title', input.title)
    if (input.description) fd.append('description', input.description)
    if (input.status) fd.append('status', input.status)
    if (input.requestedDate) fd.append('requestedDate', input.requestedDate)
    if (input.cost) fd.append('cost', input.cost)
    if (input.paymentStatus) fd.append('paymentStatus', input.paymentStatus)
    if (input.paymentDate) fd.append('paymentDate', input.paymentDate)
    fd.append('invoiceFile', input.invoiceFile)
    return apiFetch<WebsiteRequest>(`/websites/${input.websiteId}/requests`, { method: 'POST', body: fd })
  }
  const { websiteId: _wid, invoiceFile: _f, ...rest } = input
  return apiFetch<WebsiteRequest>(`/websites/${input.websiteId}/requests`, {
    method: 'POST',
    body: JSON.stringify(rest),
  })
}

export function updateRequest(websiteId: string, requestId: string, input: UpdateRequestInput) {
  return apiFetch<WebsiteRequest>(`/websites/${websiteId}/requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}
