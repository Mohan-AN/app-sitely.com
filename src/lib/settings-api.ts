import { apiFetch } from '#/lib/api'

export interface AppSettings {
  renewal_window_days: string
}

export function getSettings() {
  return apiFetch<AppSettings>('/settings')
}

export function updateRenewalWindowDays(value: number) {
  return apiFetch<{ key: string; value: string }>('/settings/renewal_window_days', {
    method: 'PUT',
    body: JSON.stringify({ value: String(value) }),
  })
}
