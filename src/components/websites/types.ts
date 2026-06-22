export interface WebsitesFilters {
  search?: string
  clientId?: string
  websiteStatus?: string
  maintenanceStatus?: string
  platform?: string
  siteType?: string
  overdueOnly?: boolean
  maintenanceOverdueOnly?: boolean
  domainOverdueOnly?: boolean
  domainNotSetUp?: boolean
  transferPending?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Website {
  id: number
  website_id: string
  client_row_id?: number
  client_id: string
  project_name: string
  url: string | null
  site_type: string
  platform: string
  website_status: string
  maintenance_status: string
  start_date: string | null
  completed_date: string | null
  hosted_date: string | null
  build_cost: string | null
  maintenance_amount: string | null
  billing_cycle: 'monthly' | 'yearly' | null
  build_type: string | null
  hosting_provider: string | null
  hosting_type: string | null
  hosting_cost: string | null
  hosting_renewal_date: string | null
  domain_name: string | null
  domain_handled_by: 'our_side' | 'client_side' | null
  domain_provider: string | null
  domain_renewal_date: string | null
  domain_cost: string | null
  source?: string | null
  remarks: string | null
  created_at: string
  updated_at: string
  client_name?: string
  is_maintenance_overdue?: boolean
  is_domain_overdue?: boolean
  current_billing_status?: string
  current_billing_due_date?: string | null
  last_payment_received: string | null
  last_payment_amount: string | null
  last_invoice_sent: string | null
  transfer_completed?: boolean
}

export type WebsiteAction = 'mark-live' | 'record-payment' | 'mark-transfer-completed' | 'put-on-hold' | 'discontinue'

export interface WebsiteDetail extends Website {
  client_name: string
  allowed_actions: WebsiteAction[]
  total_requests?: number
  pending_features?: number
  latest_rate?: string | null
}

export interface WebsiteActivity {
  log_id: string
  action: string
  description: string
  old_value: unknown
  new_value: unknown
  created_at: string
  user_name: string
}

// ── Timeline ──────────────────────────────────────────────────────────────────
// Matches GET /websites/:id/timeline?year=YYYY
// Backend returns pre-formatted title/subtitle — frontend only renders.

export type TimelineEventType = 'payment' | 'bug' | 'feature' | 'rate_change' | 'hosting_event' | 'domain_event' | 'note'
export type TimelineIconColor = 'green' | 'red' | 'indigo' | 'amber' | 'teal' | 'purple' | 'gray'

export interface TimelineEvent {
  event_type: TimelineEventType
  event_date: string
  icon_code: string
  icon_text: string
  icon_color: TimelineIconColor
  title: string
  subtitle?: string | null
  amount?: string | null
  display_amount?: string | null
  meta?: Record<string, unknown>
}

export interface TimelineBilling {
  billing_id: string
  amount: string
  display_amount: string
  due_date: string
  status: 'paid' | 'pending' | 'overdue' | 'upcoming'
  status_label: string
  payment_received_date?: string | null
  days_delayed?: number | null
  invoice_file_url?: string | null
  invoice_file_name?: string | null
}

export interface TimelinePeriod {
  period_key: string
  period_label: string
  period_start: string
  period_end: string
  billing: TimelineBilling | null
  events: TimelineEvent[]
}

export interface TimelineSummary {
  anchor_date: string
  window_start: string
  window_end: string
  total_periods: number
  paid_periods: number
  overdue_periods: number
  pending_periods: number
}

export interface TimelineProfitSummary {
  window_label: string
  maintenance_received_display: string
  paid_features_received_display: string
  costs_total_display: string
  profit_total_display: string
}

export interface WebsiteTimeline {
  website: {
    id: number
    website_id: string
    project_name: string
    website_url?: string | null
    website_status: string
    maintenance_status: string
    billing_cycle: string
    hosted_date: string
  }
  timeline_summary: TimelineSummary
  periods: TimelinePeriod[]
  profit_summary: TimelineProfitSummary
}

// ── Profit (standalone endpoint, kept for backward compat) ────────────────────

export interface WebsiteProfit {
  yearStart?: string
  yearEnd?: string
  maintenanceCollected?: number
  paidFeatures?: number
  costs?: number
  profit?: number
}

export interface WebsiteStats {
  websites: number
  clients: number
  live: number
  live_websites?: number
  in_progress: number
  maintenance_overdue_count: number
  domain_overdue_count: number
  due_soon: number
  domain_not_set_up_count?: number
  pending_collection?: string
  pending_collection_display?: string
  pending_collection_amount?: number
}

export interface Paginated<T> {
  items: T[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export interface ClientOption {
  id: number
  client_id: string
  name: string
  company?: string | null
}

export interface CreateWebsiteInput {
  clientId: number | string
  projectName: string
  url?: string | null
  siteType: 'static' | 'wordpress'
  platform: 'netlify' | 'wpx'
  startDate?: string | null
  completedDate?: string | null
  hostedDate?: string | null
  buildCost?: string | null
  buildType?: string | null
  hostingProvider?: string | null
  hostingType?: string | null
  hostingCost?: string | null
  hostingRenewalDate?: string | null
  domainName?: string | null
  domainHandledBy?: 'our_side' | 'client_side' | null
  domainProvider?: string | null
  domainRenewalDate?: string | null
  domainCost?: string | null
  billingCycle?: 'monthly' | 'yearly' | null
  maintenanceAmount?: string | null
  remarks?: string | null
}

export interface UpdateWebsiteInput {
  clientId?: number | string
  projectName?: string
  url?: string | null
  siteType?: string
  platform?: string
  websiteStatus?: string
  maintenanceStatus?: string
  startDate?: string | null
  completedDate?: string | null
  hostedDate?: string | null
  buildCost?: string | null
  buildType?: string | null
  hostingProvider?: string | null
  hostingType?: string | null
  hostingCost?: string | null
  hostingRenewalDate?: string | null
  domainName?: string | null
  domainHandledBy?: 'our_side' | 'client_side' | null
  domainProvider?: string | null
  domainRenewalDate?: string | null
  domainCost?: string | null
  billingCycle?: 'monthly' | 'yearly' | null
  maintenanceAmount?: string | null
  lastPaymentAmount?: string | null
  lastPaymentReceived?: string | null
  renewalDate?: string | null
  transferCompleted?: boolean
  remarks?: string | null
}
