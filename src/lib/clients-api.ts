import { apiFetch } from '#/lib/api'
import type { Client, ClientDetail, ClientInput, ClientsFilters, ClientWithCount, Paginated } from '#/components/clients/types'
import type { ClientOption } from '#/components/websites/types'

export function listClientOptions(search?: string) {
  const params = new URLSearchParams()
  params.set('limit', '100')
  if (search) params.set('search', search)
  return apiFetch<Paginated<ClientOption>>(`/clients?${params.toString()}`)
}

export function listClients(filters: ClientsFilters, page: number, limit = 20) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (filters.search) params.set('search', filters.search)
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive))
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
  return apiFetch<Paginated<ClientWithCount>>(`/clients?${params.toString()}`)
}

export function createClient(input: ClientInput) {
  return apiFetch<Client>('/clients', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getClient(clientId: string) {
  return apiFetch<ClientDetail>(`/clients/${clientId}`)
}

export function updateClient(clientId: string, input: ClientInput) {
  return apiFetch<Client>(`/clients/${clientId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteClient(clientId: string) {
  return apiFetch<void>(`/clients/${clientId}`, { method: 'DELETE' })
}
