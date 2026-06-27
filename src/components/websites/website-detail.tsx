import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ExternalLink, ChevronRight, Pencil } from 'lucide-react'
import { Skeleton } from '#/components/ui/skeleton'
import { formatCurrency, formatDate } from '#/lib/format'
import { cn } from '#/lib/utils'
import { useWebsiteTimeline } from '#/hooks/use-websites'
import { useRequests } from '#/hooks/use-requests'
import type { TimelineEvent, TimelinePeriod, TimelineProfitSummary, WebsiteDetail as WebsiteDetailType } from './types'
import type { WebsiteRequest } from '#/lib/requests-api'
import { EditRequestDialog } from './edit-request-dialog'
import { AttachInvoiceDialog } from './attach-invoice-dialog'

// ─── Root ─────────────────────────────────────────────────────────────────────

export function WebsiteDetail({ website }: { website: WebsiteDetailType }) {
  const websiteId = String(website.id)

  // Billing year starts on the month the site was hosted (e.g., Jul → billing year Jul–Jun)
  const hostedDate = website.hosted_date ? new Date(website.hosted_date) : new Date()
  const billingStartMonth = hostedDate.getMonth() // 0-indexed
  const defaultYear = hostedDate.getFullYear()
  const [year, setYear] = useState(defaultYear)

  const minYear = website.start_date
    ? new Date(website.start_date).getFullYear()
    : defaultYear

  // Single query drives both left (periods) and right (profit_summary) panels
  const timelineQuery = useWebsiteTimeline(websiteId, year)
  const timeline = timelineQuery.data

  // Inject synthetic domain renewal event if backend doesn't include one
  const periodsWithDomain = useDomainEvent(timeline?.periods, website)

  const requestsQuery = useRequests(websiteId)
  const requests = requestsQuery.data?.items ?? []

  const [editingRequest, setEditingRequest] = useState<import('#/lib/requests-api').WebsiteRequest | null>(null)

  return (
    <div className="grid items-stretch gap-[14px] lg:grid-cols-[370px_1fr]">
      {/* Left wrapper has no intrinsic height — right card sets the row height.
          TimelineCard fills the wrapper with absolute positioning and scrolls inside. */}
      <div className="relative">
        <TimelineCard
          websiteId={websiteId}
          periods={periodsWithDomain}
          isLoading={timelineQuery.isLoading}
          isError={timelineQuery.isError}
          isFetching={timelineQuery.isFetching}
          year={year}
          minYear={minYear}
          billingStartMonth={billingStartMonth}
          onYearChange={setYear}
          onEditRequest={setEditingRequest}
        />
      </div>

      {editingRequest && (
        <EditRequestDialog
          websiteId={websiteId}
          request={editingRequest}
          open={!!editingRequest}
          onOpenChange={(o) => { if (!o) setEditingRequest(null) }}
        />
      )}

      {/* Right: info panel — natural height, determines row height */}
      <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]">
        <ProfitSection profitSummary={timeline?.profit_summary} isLoading={timelineQuery.isLoading} />
        <InfoSection title="Website Details">
          <InfoGrid items={[
            { label: 'Client', value: <Link to="/clients/$clientId" params={{ clientId: String(website.client_row_id) }} className="font-bold text-[#4F5DF5] underline-offset-2 hover:underline">{website.client_name}</Link> },
            { label: 'URL', value: website.url ? <a href={website.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#4F5DF5] underline-offset-2 hover:underline">{website.url.replace(/^https?:\/\//, '')}<ExternalLink className="size-3" /></a> : '—' },
            { label: 'Type', value: website.build_type || website.site_type || '—' },
            { label: 'Build Cost', value: website.build_cost ? formatCurrency(website.build_cost) : '—' },
            { label: 'Start Date', value: formatDate(website.start_date) },
            { label: 'Completed Date', value: formatDate(website.completed_date) },
            { label: 'Hosted Date', value: formatDate(website.hosted_date) },
            { label: 'Billing', value: website.maintenance_amount ? `${formatCurrency(website.maintenance_amount)} / ${website.billing_cycle ?? 'month'}` : '—' },
          ]} />
        </InfoSection>
        {website.domain_name ? (
          <InfoSection title="Domain Details">
            <InfoGrid items={[
              { label: 'Domain Name', value: website.domain_name },
              { label: 'Handled By', value: website.domain_handled_by === 'our_side' ? 'Our side' : website.domain_handled_by === 'client_side' ? 'Client side' : '—' },
              { label: 'Provider', value: website.domain_provider ?? '—' },
              { label: 'Renewal Date', value: formatDate(website.domain_renewal_date) },
              { label: 'Domain Cost', value: website.domain_cost ? formatCurrency(website.domain_cost) + ' / year' : '—' },
              { label: 'Profit Rule', value: website.domain_handled_by === 'our_side' ? 'Deduct from profit' : 'Client managed' },
            ]} />
          </InfoSection>
        ) : null}
        {website.hosting_provider ? (
          <InfoSection title="Hosting Details">
            <InfoGrid items={[
              { label: 'Provider', value: website.hosting_provider },
              { label: 'Hosting Cost', value: website.hosting_cost ? formatCurrency(website.hosting_cost) + ' / year' : '—' },
              { label: 'Renewal Date', value: formatDate(website.hosting_renewal_date) },
            ]} />
          </InfoSection>
        ) : null}
        <RequestsSection websiteId={websiteId} requests={requests} isLoading={requestsQuery.isLoading} />
        <RateHistorySection website={website} />
      </div>
    </div>
  )
}

export function WebsiteDetailSkeleton() {
  return (
    <div className="grid gap-[20px] lg:grid-cols-[370px_1fr]">

      {/* Left — timeline card */}
      <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]">
        {/* header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-[18px] py-[14px]">
          <Skeleton className="h-4 w-32 rounded" />
          <div className="flex gap-1">
            <Skeleton className="size-[27px] rounded-[7px]" />
            <Skeleton className="size-[27px] rounded-[7px]" />
          </div>
        </div>
        {/* legend */}
        <div className="flex gap-[10px] border-b border-[#E5E7EB] bg-[#F9FAFB] px-[18px] py-[10px]">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-3 w-14 rounded" />)}
        </div>
        {/* period rows */}
        <div className="flex flex-col gap-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-[#EEF0F2] px-[18px] py-[13px]">
              <Skeleton className="size-[14px] rounded" />
              <Skeleton className="h-4 w-28 rounded" />
              <div className="ml-auto flex items-center gap-2">
                <Skeleton className="h-3.5 w-14 rounded" />
                <Skeleton className="size-[19px] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — info panel */}
      <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]">
        {/* profit tiles */}
        <div className="border-b border-[#EEF0F2] p-[16px_18px]">
          <Skeleton className="mb-3 h-3 w-36 rounded" />
          <div className="grid grid-cols-4 gap-[10px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[11px] border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                <Skeleton className="h-2.5 w-16 rounded" />
                <Skeleton className="mt-2 h-5 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* info sections */}
        {Array.from({ length: 3 }).map((_, s) => (
          <div key={s} className="border-b border-[#EEF0F2] p-[16px_18px]">
            <Skeleton className="mb-3 h-3 w-28 rounded" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-[11px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-2.5 w-16 rounded" />
                  <Skeleton className="mt-1.5 h-3.5 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

// ─── Timeline Card ─────────────────────────────────────────────────────────────

// ── Design-spec colors ────────────────────────────────────────────────────────
// Vivid = icons/dots  |  Text = labels/amounts  |  Bg = tile backgrounds

// Priority: overdue → pending (due soon) → everything else (paid, upcoming)
const PERIOD_PRIORITY: Record<string, number> = { overdue: 0, pending: 1 }
function periodSortKey(p: TimelinePeriod): number {
  return PERIOD_PRIORITY[p.billing?.status ?? ''] ?? 2
}

const MONTH_ABBRS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function parsePeriodDate(label: string): { month: number; year: number } | null {
  const parts = label.trim().split(' ')
  if (parts.length !== 2) return null
  const m = MONTH_ABBRS.indexOf(parts[0])
  const y = parseInt(parts[1])
  return (m !== -1 && !isNaN(y)) ? { month: m, year: y } : null
}

function TimelineCard({ websiteId, periods, isLoading, isError, isFetching, year, minYear, billingStartMonth, onYearChange, onEditRequest }: {
  websiteId: string
  periods: TimelinePeriod[] | undefined
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  year: number
  minYear: number
  billingStartMonth: number
  onYearChange: (y: number) => void
  onEditRequest: (req: import('#/lib/requests-api').WebsiteRequest) => void
}) {
  // Filter periods to exactly the 12-month billing window for `year`
  // Billing year Y: months [billingStartMonth, 11] of year Y + months [0, billingStartMonth-1] of year Y+1
  const yearPeriods = periods?.filter((p) => {
    const d = parsePeriodDate(p.period_label)
    if (!d) return false
    if (d.year === year && d.month >= billingStartMonth) return true
    if (d.year === year + 1 && d.month < billingStartMonth) return true
    return false
  }) ?? []

  // Header: "Jul 2024 — Jun 2025" computed from year + billing window
  const endMonth = billingStartMonth === 0 ? 11 : billingStartMonth - 1
  const endYear  = billingStartMonth === 0 ? year : year + 1
  const headerLabel = `${MONTH_ABBRS[billingStartMonth]} ${year} — ${MONTH_ABBRS[endMonth]} ${endYear}`

  // Display order: overdue first, then pending (due soon), then rest in original order
  const sortedPeriods = [...yearPeriods].sort((a, b) => periodSortKey(a) - periodSortKey(b))

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-[18px] py-[14px]">
        <div className="text-[14px] font-bold text-[#11141A]">{headerLabel}</div>
        <div className="flex gap-1">
          <button type="button" onClick={() => onYearChange(year - 1)} disabled={isFetching || year <= minYear}
            className="flex size-[27px] items-center justify-center rounded-[7px] border border-[#E5E7EB] bg-white text-[12px] text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] disabled:opacity-40">‹</button>
          <button type="button" onClick={() => onYearChange(year + 1)} disabled={isFetching}
            className="flex size-[27px] items-center justify-center rounded-[7px] border border-[#E5E7EB] bg-white text-[12px] text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] disabled:opacity-40">›</button>
        </div>
      </div>

      {/* Legend — 9px circles, spec vivid colors */}
      <div className="flex shrink-0 flex-wrap gap-[10px] border-b border-[#E5E7EB] bg-[#F9FAFB] px-[18px] py-[10px]">
        {[
          { dot: 'bg-[#10B981]', label: 'Payment' },
          { dot: 'bg-[#EF4444]', label: 'Bug' },
          { dot: 'bg-[#3B82F6]', label: 'Feature' },
          { dot: 'bg-[#F59E0B]', label: 'Rate Change' },
          { dot: 'bg-[#8B5CF6]', label: 'Domain' },
          { dot: 'bg-[#06B6D4]', label: 'Hosting' },
        ].map((leg) => (
          <div key={leg.label} className="flex items-center gap-[5px]">
            <span className={cn('size-[9px] rounded-full', leg.dot)} />
            <span className="text-[12px] font-medium text-[#6B7280]">{leg.label}</span>
          </div>
        ))}
      </div>

      {/* Period list — scrollable, fills remaining height */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-10 rounded-[8px]" />
            <Skeleton className="h-10 rounded-[8px]" />
            <Skeleton className="h-10 rounded-[8px]" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-8 text-[12.5px] text-[#DC2626]">
            Failed to load timeline.
          </div>
        ) : !sortedPeriods.length ? (
          <div className="flex items-center justify-center py-10 text-[13px] text-[#8A8F98]">
            No activity yet.
          </div>
        ) : (
          sortedPeriods.map((period) => (
            <PeriodRow key={period.period_key} period={period} websiteId={websiteId} onEditRequest={onEditRequest} />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Period Row ────────────────────────────────────────────────────────────────

function PeriodRow({ period, websiteId, onEditRequest }: {
  period: TimelinePeriod
  websiteId: string
  onEditRequest: (req: import('#/lib/requests-api').WebsiteRequest) => void
}) {
  const hasData = (period.events?.length ?? 0) > 0
  const [open, setOpen] = useState(hasData)
  const [attachOpen, setAttachOpen] = useState(false)

  const billing = period.billing
  const { iconBg, iconContent, amtClr } = getBillingDisplay(billing?.status ?? '')

  // Backend writes "· unpaid" in subtitle for unpaid features; paid ones say "· paid ..."
  const isFeatureUnpaid = (ev: TimelineEvent) =>
    ev.event_type === 'feature' && !!ev.amount && !!ev.subtitle?.toLowerCase().includes('unpaid')

  const unpaidFeatureTotal = period.events
    .filter(isFeatureUnpaid)
    .reduce((sum, ev) => sum + Number(ev.amount ?? 0), 0)
  const paidFeatureTotal = period.events
    .filter((ev) => ev.event_type === 'feature' && !!ev.amount && !isFeatureUnpaid(ev))
    .reduce((sum, ev) => sum + Number(ev.amount ?? 0), 0)

  const maintenanceAmount = Number(billing?.amount ?? 0)
  const periodTotal = maintenanceAmount + paidFeatureTotal + unpaidFeatureTotal

  // When maintenance is paid but features are unpaid, show two separate amounts
  const maintenancePaid = billing?.status === 'paid'
  const hasMixedSettlement = maintenancePaid && unpaidFeatureTotal > 0

  const paidTotal = maintenanceAmount + paidFeatureTotal
  const periodTotalDisplay = periodTotal > 0
    ? `₹${periodTotal.toLocaleString('en-IN')}`
    : (billing?.display_amount ?? '—')
  const paidTotalDisplay = `₹${paidTotal.toLocaleString('en-IN')}`
  const unpaidTotalDisplay = `₹${unpaidFeatureTotal.toLocaleString('en-IN')}`

  const canAttachInvoice = billing?.status === 'paid' && !billing.invoice_file_url

  return (
    <div className="border-b border-[#EEF0F2] last:border-b-0">
      <div className="flex w-full items-center gap-[10px] px-[18px] py-[13px]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-[10px] transition hover:opacity-80"
        >
          <ChevronRight className={cn('size-[14px] shrink-0 text-[#8A8F98] transition-transform', open && 'rotate-90')} />
          <span className={cn('flex-1 text-left text-[13px] font-semibold', hasData ? 'text-[#11141A]' : 'text-[#94A3B8]')}>
            {period.period_label}
          </span>
        </button>
        <div className="flex items-center gap-[6px]">
          {hasMixedSettlement ? (
            <>
              {/* Paid portion with green ✓ */}
              <span className="text-[12.5px] font-bold text-[#059669]">{paidTotalDisplay}</span>
              <span className="flex size-[19px] items-center justify-center rounded-full bg-[#059669] text-[10px] font-bold text-white">✓</span>
              {/* Unpaid feature portion with amber badge */}
              <span className="flex items-center gap-[3px] rounded-full bg-[#FEF3C7] px-[7px] py-[2px] text-[10.5px] font-bold text-[#D97706]">
                +{unpaidTotalDisplay} feature unpaid
              </span>
            </>
          ) : (
            <>
              <span className={cn('text-[12.5px]', amtClr)}>{periodTotalDisplay}</span>
              {iconBg && (
                <span className={cn('flex size-[19px] items-center justify-center rounded-full text-[10px] font-bold text-white', iconBg)}>
                  {iconContent}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {attachOpen && billing && (
        <AttachInvoiceDialog
          websiteId={websiteId}
          billingId={billing.billing_id}
          periodLabel={period.period_label}
          open={attachOpen}
          onOpenChange={setAttachOpen}
        />
      )}

      {open && hasData && (
        <div className="pb-4 pl-[43px] pr-[18px] pt-0">
          {period.events.map((ev, i) => (
            <EventRow
              key={i}
              ev={ev}
              invoiceUrl={ev.event_type === 'payment' ? billing?.invoice_file_url : null}
              onAttachInvoice={ev.event_type === 'payment' && canAttachInvoice ? () => setAttachOpen(true) : undefined}
              onEditRequest={onEditRequest}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Domain event injection ───────────────────────────────────────────────────
// Backend doesn't generate domain renewal events — build one from website data.

function useDomainEvent(
  periods: TimelinePeriod[] | undefined,
  website: import('./types').WebsiteDetail,
): TimelinePeriod[] | undefined {
  if (!periods || !website.domain_renewal_date || website.domain_handled_by !== 'our_side') return periods

  const renewalDate = new Date(website.domain_renewal_date)
  const renewalMonth = renewalDate.getMonth()   // 0-indexed
  const renewalYear  = renewalDate.getFullYear()
  const renewalLabel = `${MONTH_ABBRS[renewalMonth]} ${renewalYear}`

  // Don't inject if backend already has a domain_event in that period
  const existing = periods.find((p) => p.period_label === renewalLabel)
  if (existing?.events.some((e) => e.event_type === 'domain_event')) return periods

  // Compare calendar dates only — strip time by using date strings so DST has no effect
  const todayStr   = new Date().toLocaleDateString('en-CA')      // YYYY-MM-DD local
  const renewalStr = renewalDate.toLocaleDateString('en-CA')
  const msPerDay   = 86400000
  const diffDays   = Math.round(
    (new Date(renewalStr).getTime() - new Date(todayStr).getTime()) / msPerDay,
  )
  const isOverdue = diffDays < 0
  const isDueSoon = !isOverdue && diffDays <= 30

  const syntheticEvent: TimelineEvent = {
    event_type:     'domain_event',
    event_date:     website.domain_renewal_date,
    icon_code:      'D',
    icon_text:      'D',
    icon_color:     isOverdue ? 'red' : isDueSoon ? 'amber' : 'purple',
    title:          isOverdue
      ? `Domain overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`
      : isDueSoon
        ? `Domain due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`
        : `Domain renewal`,
    subtitle:       [website.domain_name, website.domain_provider].filter(Boolean).join(' · ') || null,
    display_amount: website.domain_cost ? `₹${Number(website.domain_cost).toLocaleString('en-IN')} / year` : null,
  }

  if (existing) {
    // Period exists — prepend the domain event
    return periods.map((p) =>
      p.period_label === renewalLabel
        ? { ...p, events: [syntheticEvent, ...p.events] }
        : p,
    )
  }

  // Period doesn't exist (domain renewal month has no billing activity) — create it
  const newPeriod: TimelinePeriod = {
    period_key:   `domain-${renewalLabel}`,
    period_label: renewalLabel,
    period_start: website.domain_renewal_date,
    period_end:   website.domain_renewal_date,
    billing:      null,
    events:       [syntheticEvent],
  }
  return [...periods, newPeriod]
}

function getBillingDisplay(status: string): { iconBg: string; iconContent: string; amtClr: string } {
  switch (status) {
    case 'paid':    return { iconBg: 'bg-[#059669]', iconContent: '✓', amtClr: 'text-[#059669] font-bold' }
    case 'overdue': return { iconBg: 'bg-[#DC2626]', iconContent: '!', amtClr: 'text-[#DC2626] font-bold' }
    case 'pending': return { iconBg: 'bg-[#D97706]', iconContent: '⏳', amtClr: 'text-[#D97706] font-bold' }
    default:        return { iconBg: '', iconContent: '', amtClr: 'text-[#9CA3AF] font-normal' }
  }
}

// ─── Event Row ─────────────────────────────────────────────────────────────────
// Backend sends pre-formatted title + subtitle. Frontend only renders + applies icon color.

// Vivid icon backgrounds per spec §7 + §14
const ICON_COLOR_MAP: Record<string, string> = {
  green:  'bg-[#10B981]',
  red:    'bg-[#EF4444]',
  indigo: 'bg-[#3B82F6]',
  amber:  'bg-[#F59E0B]',
  teal:   'bg-[#06B6D4]',
  purple: 'bg-[#8B5CF6]',
  gray:   'bg-[#9CA3AF]',
}

function EventRow({ ev, invoiceUrl, onAttachInvoice, onEditRequest }: {
  ev: TimelineEvent
  invoiceUrl?: string | null
  onAttachInvoice?: () => void
  onEditRequest: (req: import('#/lib/requests-api').WebsiteRequest) => void
}) {
  const iconBg = ICON_COLOR_MAP[ev.icon_color] ?? 'bg-[#9CA3AF]'

  // ── Payment event — normal row with inline invoice action ────────────────
  if (ev.event_type === 'payment') {
    const subtitleClean = ev.subtitle
      ?.replace(/\s*[·-]?\s*invoice (attached|not attached)/i, '')
      .trim() ?? null

    return (
      <div className="group flex items-start gap-[9px] py-[6px]">
        <div className="mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px] bg-[#10B981] text-[11px] font-bold text-white">
          {ev.icon_text}
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-semibold text-[#111827]">{ev.title}</div>
          {subtitleClean && (
            <div className="mt-[1px] flex items-center gap-2 text-[12px] text-[#9CA3AF]">
              <span>{subtitleClean}</span>
              {invoiceUrl ? (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#4F5DF5] underline underline-offset-2 hover:text-[#3F4DE0]"
                >
                  · invoice attached
                </a>
              ) : onAttachInvoice ? (
                <button
                  type="button"
                  onClick={onAttachInvoice}
                  className="font-medium text-[#9CA3AF] underline underline-offset-2 hover:text-[#4F5DF5]"
                >
                  · invoice not attached
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── All other events ──────────────────────────────────────────────────────
  const subtitleNode = ev.subtitle
    ? <div className="mt-[1px] text-[12px] text-[#9CA3AF]">{ev.subtitle}</div>
    : null

  const isRequest = ev.event_type === 'bug' || ev.event_type === 'feature'
  const editableRequest: import('#/lib/requests-api').WebsiteRequest | null = isRequest && ev.meta?.request_id
    ? {
        request_id:        String(ev.meta.request_id),
        website_id:        String(ev.meta.website_id ?? ''),
        type:              ev.event_type as 'bug' | 'feature',
        title:             String(ev.meta.title ?? ev.title),
        description:       ev.meta.description != null ? String(ev.meta.description) : null,
        status:            String(ev.meta.status ?? 'open') as import('#/lib/requests-api').RequestStatus,
        requested_date:    ev.meta.requested_date != null ? String(ev.meta.requested_date) : null,
        delivered_date:    ev.meta.delivered_date != null ? String(ev.meta.delivered_date) : null,
        cost:              ev.meta.cost != null ? String(ev.meta.cost) : null,
        payment_status:    ev.meta.payment_status != null ? String(ev.meta.payment_status) : null,
        payment_date:      ev.meta.payment_date != null ? String(ev.meta.payment_date) : null,
        invoice_file_url:  ev.meta.invoice_file_url != null ? String(ev.meta.invoice_file_url) : null,
        invoice_file_name: ev.meta.invoice_file_name != null ? String(ev.meta.invoice_file_name) : null,
        created_at:        String(ev.meta.created_at ?? ev.event_date),
        updated_at:        String(ev.meta.updated_at ?? ev.event_date),
        reported_by:       String(ev.meta.reported_by ?? ''),
      }
    : null

  return (
    <div className="group flex items-start gap-[9px] py-[6px]">
      <div className={cn('mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-white', iconBg)}>
        {ev.icon_text}
      </div>
      <div className="flex-1">
        <div className="text-[13.5px] font-semibold text-[#111827]">{ev.title}</div>
        {subtitleNode}
        {ev.display_amount && <div className="mt-[2px] text-[11.5px] font-bold text-[#4F5DF5]">{ev.display_amount}</div>}
      </div>
      {editableRequest && (() => {
        const isUnpaid = ev.event_type === 'feature' && ev.subtitle?.toLowerCase().includes('unpaid')
        return (
          <button
            type="button"
            onClick={() => onEditRequest(editableRequest)}
            title="Edit request"
            className={cn(
              'mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px] transition hover:bg-[#F0F1FF] hover:text-[#4F5DF5]',
              isUnpaid
                ? 'text-[#D97706] opacity-100'
                : 'text-[#C4C9D4] opacity-0 group-hover:opacity-100',
            )}
          >
            <Pencil className="size-[12px]" />
          </button>
        )
      })()}
    </div>
  )
}

// ─── Profit Section ───────────────────────────────────────────────────────────
// Data comes from profit_summary inside the timeline response — no separate API call.

function ProfitSection({ profitSummary, isLoading }: {
  profitSummary: TimelineProfitSummary | undefined
  isLoading: boolean
}) {
  const rangeLabel = profitSummary?.window_label
    ? `${profitSummary.window_label} (view only)`
    : '(view only)'

  const tiles = isLoading
    ? [
        { label: 'Maintenance', value: '…' },
        { label: 'Paid Features', value: '…' },
        { label: 'Costs', value: '…' },
        { label: 'Profit so far', value: '…', highlight: true },
      ]
    : [
        { label: 'Maintenance',  value: profitSummary?.maintenance_received_display ?? '—' },
        { label: 'Paid Features', value: profitSummary?.paid_features_received_display ?? '—' },
        { label: 'Costs',         value: profitSummary?.costs_total_display ? `−${profitSummary.costs_total_display}` : '—' },
        { label: 'Profit so far', value: profitSummary?.profit_total_display ?? '—', highlight: true },
      ]

  return (
    <div className="border-b border-[#EEF0F2] p-[16px_18px]">
      <div className="mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]">
        Annual Profit — {rangeLabel}
      </div>
      <div className="grid grid-cols-4 gap-[10px]">
        {tiles.map((tile) => (
          <ProfitTile key={tile.label} label={tile.label} value={tile.value} highlight={tile.highlight} />
        ))}
      </div>
    </div>
  )
}

function ProfitTile({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn('rounded-[11px] border p-3', highlight ? 'border-[#A7F3D0] bg-[#ECFDF5]' : 'border-[#E5E7EB] bg-[#F9FAFB]')}>
      <div className={cn('text-[10px] font-bold uppercase tracking-[.05em]', highlight ? 'text-[#059669]' : 'text-[#9CA3AF]')}>{label}</div>
      <div className={cn('mt-[5px] font-bold', highlight ? 'text-[18px] text-[#059669]' : 'text-[16px] text-[#111827]')}>{value}</div>
    </div>
  )
}

// ─── Info Section ─────────────────────────────────────────────────────────────

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#EEF0F2] p-[16px_18px]">
      <div className="mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]">{title}</div>
      {children}
    </div>
  )
}

function InfoGrid({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-[11px]">
      {items.map(({ label, value }) => (
        <div key={label}>
          <div className="text-[11px] text-[#8A8F98]">{label}</div>
          <div className="mt-[3px] text-[13px] font-semibold text-[#11141A]">{value ?? '—'}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Requests Section ─────────────────────────────────────────────────────────

function RequestsSection({ websiteId, requests, isLoading }: { websiteId: string; requests: WebsiteRequest[]; isLoading: boolean }) {
  const [editingRequest, setEditingRequest] = useState<WebsiteRequest | null>(null)

  const statusConfig: Record<string, { label: string; cls: string }> = {
    open:        { label: 'Pending',     cls: 'bg-[#F3F4F6] text-[#6B7280]' },
    in_progress: { label: 'In Progress', cls: 'bg-[#FEF3C7] text-[#D97706]' },
    completed:   { label: 'Done',        cls: 'bg-[#ECFDF5] text-[#059669]' },
    wont_fix:    { label: 'Rejected',    cls: 'bg-[#FEF2F2] text-[#DC2626]' },
  }

  return (
    <>
      <div className="border-b border-[#EEF0F2] p-[16px_18px]">
        <div className="mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]">
          Requests {isLoading ? '' : `(${requests.length})`}
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-2"><Skeleton className="h-8 rounded" /><Skeleton className="h-8 rounded" /></div>
        ) : requests.length === 0 ? (
          <p className="text-[12.5px] text-[#8A8F98]">No requests yet.</p>
        ) : (
          <div>
            {requests.map((req, i) => {
              const status = statusConfig[req.status] ?? statusConfig.open!
              return (
                <button
                  key={req.request_id}
                  type="button"
                  onClick={() => setEditingRequest(req)}
                  className={cn(
                    'flex w-full items-center gap-[9px] rounded-[8px] px-1 py-[9px] text-left transition hover:bg-[#F7F8FA]',
                    i < requests.length - 1 && 'border-b border-[#EEF0F2]',
                  )}
                >
                  <div className={cn('flex size-[22px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-white',
                    req.type === 'bug' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]')}>
                    {req.type === 'bug' ? 'B' : 'F'}
                  </div>
                  <div className="flex-1 text-[12.5px] text-[#5C6270]">{req.title}</div>
                  <span className={cn('rounded-[6px] px-[9px] py-[3px] text-[10.5px] font-bold uppercase', status.cls)}>
                    {status.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {editingRequest && (
        <EditRequestDialog
          websiteId={websiteId}
          request={editingRequest}
          open={!!editingRequest}
          onOpenChange={(o) => { if (!o) setEditingRequest(null) }}
        />
      )}
    </>
  )
}

// ─── Rate History Section ─────────────────────────────────────────────────────

function RateHistorySection({ website }: { website: WebsiteDetailType }) {
  const currentRate = website.maintenance_amount
  if (!currentRate) return null

  return (
    <div className="border-b border-[#EEF0F2] p-[16px_18px]">
      <div className="mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]">Rate History</div>
      <div className="flex items-center gap-2 py-[7px] text-[12.5px]">
        <span className="text-[#8A8F98]">Initial</span>
        <span className="text-[#8A8F98]">→</span>
        <span className="font-bold text-[#11141A]">{formatCurrency(currentRate)}</span>
        {website.hosted_date ? (
          <span className="ml-auto text-[11px] text-[#8A8F98]">{formatDate(website.hosted_date)}</span>
        ) : null}
      </div>
    </div>
  )
}


// ─── Utilities ────────────────────────────────────────────────────────────────

// Not used for rendering (backend sends pre-formatted labels) but kept for any edge fallbacks.
