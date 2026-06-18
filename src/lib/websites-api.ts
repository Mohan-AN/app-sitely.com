import { apiFetch } from '#/lib/api'
import type { CreateWebsiteInput, Paginated, UpdateWebsiteInput, Website, WebsiteActivity, WebsiteDetail, WebsiteStats, WebsitesFilters } from '#/components/websites/types'

export function listWebsites(filters: WebsitesFilters, page: number, limit = 10) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  return apiFetch<Paginated<Website>>(`/websites?${params.toString()}`)
}

export function getWebsiteStats() {
  return apiFetch<WebsiteStats>('/websites/stats')
}

export function createWebsite(input: CreateWebsiteInput) {
  return apiFetch<Website>('/websites', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getWebsite(websiteId: string) {
  return apiFetch<WebsiteDetail>(`/websites/${websiteId}`)
}

export function getWebsiteActivity(websiteId: string, page: number, limit = 20) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  return apiFetch<Paginated<WebsiteActivity>>(`/websites/${websiteId}/activity?${params.toString()}`)
}

export function updateWebsite(websiteId: string, input: UpdateWebsiteInput) {
  return apiFetch<Website>(`/websites/${websiteId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteWebsite(websiteId: string) {
  return apiFetch<void>(`/websites/${websiteId}`, { method: 'DELETE' })
}
