export interface ClientsFilters {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Client {
  clientId: string
  name: string
  company: string | null
  phone: string | null
  email: string | null
  city: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ClientWithCount extends Client {
  websiteCount: number
}

export interface ClientWebsiteSummary {
  websiteId: string
  projectName: string
  url: string | null
  websiteStatus: string
  maintenanceStatus: string
  siteType?: string
  platform?: string
  renewalDate?: string | null
}

export interface ClientDetail extends Client {
  websites: ClientWebsiteSummary[]
}

export interface ClientInput {
  name: string
  company?: string
  phone?: string
  email?: string
  city?: string
  isActive?: boolean
}

export interface Paginated<T> {
  items: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}
