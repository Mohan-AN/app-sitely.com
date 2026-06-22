import { apiFetch } from '#/lib/api'

export type ServiceOptionCategory =
  | 'build_type'
  | 'hosting_provider'
  | 'hosting_type'
  | 'domain_provider'
  | 'payment_mode'

export interface ServiceOption {
  option_id: string
  category: ServiceOptionCategory
  name: string
  is_active: boolean
}

export function listServiceOptions(category?: ServiceOptionCategory) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  return apiFetch<ServiceOption[]>(`/settings/options?${params.toString()}`)
}

export function createServiceOption(category: ServiceOptionCategory, name: string) {
  return apiFetch<ServiceOption>('/settings/options', {
    method: 'POST',
    body: JSON.stringify({ category, name }),
  })
}

export function updateServiceOption(option_id: string, input: Partial<Pick<ServiceOption, 'name' | 'is_active'>>) {
  return apiFetch<ServiceOption>(`/settings/options/${option_id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}
