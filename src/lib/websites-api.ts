import { apiFetch } from '#/lib/api'
import type { CreateWebsiteInput, Paginated, UpdateWebsiteInput, Website, WebsiteActivity, WebsiteDetail, WebsiteProfit, WebsiteStats, WebsiteTimeline, WebsitesFilters } from '#/components/websites/types'

// Normalize snake_case `total_pages` → camelCase `totalPages` returned by some API versions
function normalizePagination<T>(raw: Paginated<T> & { pagination: { total_pages?: number } }): Paginated<T> {
  const p = raw.pagination
  return {
    ...raw,
    pagination: {
      ...p,
      totalPages: p.totalPages ?? p.total_pages ?? 1,
    },
  }
}

export async function listWebsites(filters: WebsitesFilters, page: number, limit = 10) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params.set(key, String(value).replace(/ /g, '_'))
  }
  const raw = await apiFetch<Paginated<Website> & { pagination: { total_pages?: number } }>(`/websites?${params.toString()}`)
  return normalizePagination(raw)
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

// GET /websites/:id/timeline?year=YYYY
// Returns one pre-grouped response: yearStart/yearEnd header + all months with billing + events
export function getWebsiteTimeline(websiteId: string, year: number) {
  return apiFetch<WebsiteTimeline>(`/websites/${websiteId}/timeline?year=${year}`)
}

// GET /websites/:id/profit?year=YYYY
// Returns annual profit breakdown: maintenance collected, paid features, costs, net profit
export function getWebsiteProfit(websiteId: string, year: number) {
  return apiFetch<WebsiteProfit>(`/websites/${websiteId}/profit?year=${year}`)
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
