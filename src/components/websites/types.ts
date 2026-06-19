export interface WebsitesFilters {
  search?: string
  clientId?: string
  websiteStatus?: string
  maintenanceStatus?: string
  platform?: string
  siteType?: string
  overdueOnly?: boolean
  transferPending?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Website {
  websiteId: string
  clientId: string
  projectName: string
  url: string | null
  siteType: string
  platform: string
  websiteStatus: string
  maintenanceStatus: string
  startDate: string | null
  hostedDate: string | null
  lastInvoiceSent: string | null
  lastPaymentReceived: string | null
  renewalDate: string | null
  transferCompleted: boolean
  remarks: string | null
  createdAt: string
  updatedAt: string
  clientName?: string
  isOverdue?: boolean
}

export type WebsiteAction = 'mark-live' | 'record-payment' | 'mark-transfer-completed' | 'put-on-hold' | 'discontinue'

export interface WebsiteDetail extends Website {
  clientName: string
  isOverdue: boolean
  allowedActions: WebsiteAction[]
}

export interface WebsiteActivity {
  logId: string
  action: string
  description: string
  oldValue: unknown
  newValue: unknown
  createdAt: string
  userName: string
}

export interface WebsiteStats {
  websites: number
  clients: number
  live: number
  inProgress: number
  expired: number
  dueSoon: number
  transferPending: number
}

export interface Paginated<T> {
  items: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface ClientOption {
  clientId: string
  name: string
  company?: string | null
}

export interface CreateWebsiteInput {
  clientId: string
  projectName: string
  url?: string | null
  siteType: 'static' | 'wordpress'
  platform: 'netlify' | 'wpx'
  startDate?: string | null
  hostedDate?: string | null
  lastInvoiceSent?: string | null
  lastPaymentReceived?: string | null
  renewalDate?: string | null
  remarks?: string | null
}

export interface UpdateWebsiteInput {
  clientId?: string
  projectName?: string
  url?: string | null
  siteType?: string
  platform?: string
  websiteStatus?: string
  maintenanceStatus?: string
  startDate?: string | null
  hostedDate?: string | null
  lastInvoiceSent?: string | null
  lastPaymentReceived?: string | null
  renewalDate?: string | null
  transferCompleted?: boolean
  remarks?: string | null
}
