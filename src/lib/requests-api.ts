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
  delivered_date?: string | null
  cost: string | null
  payment_status: string | null
  payment_date?: string | null
  invoice_file_url?: string | null
  invoice_file_name?: string | null
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
  deliveredDate?: string | null
  cost?: string | null
  paymentStatus?: 'not_paid' | 'paid'
  paymentDate?: string | null
  invoiceFile?: File | null
}

export interface UpdateRequestInput {
  title?: string
  description?: string | null
  status?: RequestStatus
  requestedDate?: string | null
  deliveredDate?: string | null
  cost?: string | null
  paymentStatus?: 'not_paid' | 'paid'
  paymentDate?: string | null
  invoiceFile?: File | null
}

export function listRequests(websiteId: string, page = 1, limit = 20) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  return apiFetch<{ items: WebsiteRequest[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
    `/websites/${websiteId}/requests?${params.toString()}`,
  )
}

// Maps frontend CreateRequestInput → backend-accepted fields
function buildCreatePayload(input: CreateRequestInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    type:  input.type,
    title: input.title,
  }
  if (input.description)   payload.description          = input.description
  if (input.status)        payload.status               = input.status
  if (input.requestedDate) payload.requestedDate        = input.requestedDate
  if (input.deliveredDate) payload.deliveredDate        = input.deliveredDate
  if (input.cost)          payload.cost                 = input.cost
  if (input.paymentStatus !== undefined) payload.isPaid = input.paymentStatus === 'paid'
  if (input.paymentDate)   payload.paymentReceivedDate  = input.paymentDate
  return payload
}

export function createRequest(input: CreateRequestInput) {
  if (input.invoiceFile) {
    const fd = new FormData()
    const payload = buildCreatePayload(input)
    for (const [key, value] of Object.entries(payload)) {
      if (value !== null && value !== undefined) fd.append(key, String(value))
    }
    fd.append('invoiceFile', input.invoiceFile)
    return apiFetch<WebsiteRequest>(`/websites/${input.websiteId}/requests`, { method: 'POST', body: fd })
  }
  return apiFetch<WebsiteRequest>(`/websites/${input.websiteId}/requests`, {
    method: 'POST',
    body: JSON.stringify(buildCreatePayload(input)),
  })
}

// Maps frontend UpdateRequestInput → backend-accepted fields:
//   paymentStatus ('paid'|'not_paid') → isPaid (boolean)
//   paymentDate                       → paymentReceivedDate
//   description                       → remarks
//   title / requestedDate / deliveredDate are not accepted by the backend update route
function buildUpdatePayload(input: UpdateRequestInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {}
  if (input.status !== undefined)        payload.status              = input.status
  if (input.cost    !== undefined)        payload.cost                = input.cost
  if (input.description !== undefined)   payload.remarks             = input.description
  if (input.paymentStatus !== undefined) payload.isPaid              = input.paymentStatus === 'paid'
  if (input.paymentDate   !== undefined) payload.paymentReceivedDate = input.paymentDate || null
  return payload
}

export function updateRequest(_websiteId: string, requestId: string, input: UpdateRequestInput) {
  if (input.invoiceFile) {
    const fd = new FormData()
    const payload = buildUpdatePayload(input)
    for (const [key, value] of Object.entries(payload)) {
      if (value !== null && value !== undefined) fd.append(key, String(value))
    }
    fd.append('invoiceFile', input.invoiceFile)
    return apiFetch<WebsiteRequest>(`/requests/${requestId}`, { method: 'PUT', body: fd })
  }
  return apiFetch<WebsiteRequest>(`/requests/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify(buildUpdatePayload(input)),
  })
}
