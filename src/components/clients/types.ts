export interface ClientsFilters {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Client {
  id: number
  client_id: string
  name: string
  company: string | null
  phone: string | null
  email: string | null
  city: string | null
  is_active: boolean
  source?: string | null
  created_at: string
  updated_at: string
}

export interface ClientWithCount extends Client {
  website_count: number
}

export interface ClientWebsiteSummary {
  id: number
  website_id: string
  project_name: string
  url: string | null
  website_status: string
  maintenance_status: string
  site_type?: string
  platform?: string
  current_billing_due_date?: string | null
}

export interface ClientDetail extends Client {
  websites: ClientWebsiteSummary[]
}

export interface ClientInput {
  name: string
  company: string
  email: string
  phone?: string
  city?: string
  isActive?: boolean
}

export interface Paginated<T> {
  items: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}
