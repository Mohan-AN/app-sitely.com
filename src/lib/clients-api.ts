import { apiFetch } from '#/lib/api'
import type { Client, ClientDetail, ClientInput, ClientsFilters, ClientWithCount, Paginated } from '#/components/clients/types'
import type { ClientOption } from '#/components/websites/types'

export function listClientOptions(search?: string) {
  const params = new URLSearchParams()
  params.set('limit', '100')
  if (search) params.set('search', search)
  return apiFetch<Paginated<ClientOption>>(`/clients?${params.toString()}`)
}

export async function listClients(filters: ClientsFilters, page: number, limit = 20) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
  const raw = await apiFetch<Paginated<ClientWithCount> & { pagination: { total_pages?: number } }>(`/clients?${params.toString()}`)
  const p = raw.pagination
  return { ...raw, pagination: { ...p, totalPages: p.totalPages ?? p.total_pages ?? 1 } }
}

export function createClient(input: ClientInput) {
  return apiFetch<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getClient(id: string) {
  return apiFetch<ClientDetail>(`/clients/${id}`)
}

export function updateClient(id: string, input: ClientInput) {
  return apiFetch<Client>(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteClient(id: string) {
  return apiFetch<void>(`/clients/${id}`, { method: 'DELETE' })
}
