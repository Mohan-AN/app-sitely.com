import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  CalendarCheck2, CheckCircle2,
  ExternalLink, XCircle, ChevronRight,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { Input } from '#/components/ui/input'
import { Skeleton } from '#/components/ui/skeleton'
import { formatCurrency, formatDate } from '#/lib/format'
import { cn } from '#/lib/utils'
import { useUpdateWebsite, useWebsiteTimeline } from '#/hooks/use-websites'
import { useRequests } from '#/hooks/use-requests'
import type { TimelineEvent, TimelinePeriod, TimelineProfitSummary, WebsiteDetail as WebsiteDetailType } from './types'
import type { WebsiteRequest } from '#/lib/requests-api'

// ─── Root ─────────────────────────────────────────────────────────────────────

export function WebsiteDetail({ website }: { website: WebsiteDetailType }) {
  const websiteId = String(website.id)

  const defaultYear = website.hosted_date
    ? new Date(website.hosted_date).getFullYear()
    : new Date().getFullYear()
  const [year, setYear] = useState(defaultYear)

  // Single query drives both left (periods) and right (profit_summary) panels
  const timelineQuery = useWebsiteTimeline(websiteId, year)
  const timeline = timelineQuery.data

  const requestsQuery = useRequests(websiteId)
  const requests = requestsQuery.data?.items ?? []

  return (
    <div className="grid items-stretch gap-[20px] xl:grid-cols-[370px_1fr]">
      {/* Left wrapper has no intrinsic height — right card sets the row height.
          TimelineCard fills the wrapper with absolute positioning and scrolls inside. */}
      <div className="relative">
        <TimelineCard
          periods={timeline?.periods}
          isLoading={timelineQuery.isLoading}
          isError={timelineQuery.isError}
          isFetching={timelineQuery.isFetching}
          year={year}
          onYearChange={setYear}
        />
      </div>

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
              { label: 'Hosting Type', value: website.hosting_type ?? '—' },
              { label: 'Provider', value: website.hosting_provider },
              { label: 'Hosting Cost', value: website.hosting_cost ? formatCurrency(website.hosting_cost) + ' / year' : '—' },
              { label: 'Renewal Date', value: formatDate(website.hosting_renewal_date) },
            ]} />
          </InfoSection>
        ) : null}
        <RequestsSection requests={requests} isLoading={requestsQuery.isLoading} />
        <RateHistorySection website={website} />
        <WorkflowActionsSection website={website} />
      </div>
    </div>
  )
}

export function WebsiteDetailSkeleton() {
  return (
    <div className="grid gap-[20px] xl:grid-cols-[370px_1fr]">

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

function TimelineCard({ periods, isLoading, isError, isFetching, year, onYearChange }: {
  periods: TimelinePeriod[] | undefined
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  year: number
  onYearChange: (y: number) => void
}) {
  // Header range uses chronological first/last (original API order), not display order
  const headerLabel = periods?.length
    ? `${periods[0].period_label} — ${periods[periods.length - 1].period_label}`
    : String(year)

  // Display order: overdue first, then pending (due soon), then rest in original order
  const sortedPeriods = periods
    ? [...periods].sort((a, b) => periodSortKey(a) - periodSortKey(b))
    : []

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-[18px] py-[14px]">
        <div className="text-[14px] font-bold text-[#11141A]">{headerLabel}</div>
        <div className="flex gap-1">
          <button type="button" onClick={() => onYearChange(year - 1)} disabled={isFetching}
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
            <PeriodRow key={period.period_key} period={period} />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Period Row ────────────────────────────────────────────────────────────────

function PeriodRow({ period }: { period: TimelinePeriod }) {
  const hasData = (period.events?.length ?? 0) > 0
  const [open, setOpen] = useState(hasData)

  const billing = period.billing
  const { iconBg, iconContent, amtClr } = getBillingDisplay(billing?.status ?? '')

  return (
    <div className="border-b border-[#EEF0F2] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-[10px] px-[18px] py-[13px] transition hover:bg-[#FAFBFC]"
      >
        <ChevronRight className={cn('size-[14px] shrink-0 text-[#8A8F98] transition-transform', open && 'rotate-90')} />
        <span className={cn('flex-1 text-left text-[13px] font-semibold', hasData ? 'text-[#11141A]' : 'text-[#94A3B8]')}>
          {period.period_label}
        </span>
        <div className="flex items-center gap-[6px]">
          <span className={cn('text-[12.5px]', amtClr)}>
            {billing?.display_amount ?? '—'}
          </span>
          {iconBg ? (
            <span className={cn('flex size-[19px] items-center justify-center rounded-full text-[10px] font-bold text-white', iconBg)}>
              {iconContent}
            </span>
          ) : null}
        </div>
      </button>
      {open && hasData ? (
        <div className="pb-4 pl-[43px] pr-[18px] pt-0">
          {period.events.map((ev, i) => <EventRow key={i} ev={ev} />)}
        </div>
      ) : null}
    </div>
  )
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

function EventRow({ ev }: { ev: TimelineEvent }) {
  const iconBg = ICON_COLOR_MAP[ev.icon_color] ?? 'bg-[#9CA3AF]'

  return (
    <div className="flex items-start gap-[9px] py-[6px]">
      <div className={cn('mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-white', iconBg)}>
        {ev.icon_text}
      </div>
      <div className="flex-1">
        <div className="text-[13.5px] font-semibold text-[#111827]">{ev.title}</div>
        {ev.subtitle ? <div className="mt-[1px] text-[12px] text-[#9CA3AF]">{ev.subtitle}</div> : null}
        {ev.display_amount ? <div className="mt-[2px] text-[11.5px] font-bold text-[#4F5DF5]">{ev.display_amount}</div> : null}
      </div>
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

function RequestsSection({ requests, isLoading }: { requests: WebsiteRequest[]; isLoading: boolean }) {
  const statusConfig: Record<string, { label: string; cls: string }> = {
    open:        { label: 'Pending',     cls: 'bg-[#F3F4F6] text-[#6B7280]' },
    in_progress: { label: 'In Progress', cls: 'bg-[#FEF3C7] text-[#D97706]' },
    completed:   { label: 'Done',        cls: 'bg-[#ECFDF5] text-[#059669]' },
    wont_fix:    { label: 'Rejected',    cls: 'bg-[#FEF2F2] text-[#DC2626]' },
  }

  return (
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
              <div key={req.request_id}
                className={cn('flex items-center gap-[9px] py-[9px]', i < requests.length - 1 && 'border-b border-[#EEF0F2]')}>
                <div className={cn('flex size-[22px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-white',
                  req.type === 'bug' ? 'bg-[#EF4444]' : 'bg-[#3B82F6]')}>
                  {req.type === 'bug' ? 'B' : 'F'}
                </div>
                <div className="flex-1 text-[12.5px] text-[#5C6270]">{req.title}</div>
                <span className={cn('rounded-[6px] px-[9px] py-[3px] text-[10.5px] font-bold uppercase', status.cls)}>
                  {status.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
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

// ─── Workflow Actions ─────────────────────────────────────────────────────────

function WorkflowActionsSection({ website }: { website: WebsiteDetailType }) {
  const [markLiveOpen, setMarkLiveOpen] = useState(false)
  const [discontinueOpen, setDiscontinueOpen] = useState(false)
  const [liveUrl, setLiveUrl] = useState(website.url ?? '')
  const [liveHostedDate, setLiveHostedDate] = useState(website.hosted_date ?? '')
  const [liveRenewalDate, setLiveRenewalDate] = useState(website.current_billing_due_date ?? '')
  const updateMutation = useUpdateWebsite(String(website.id))

  const isInProgress = website.website_status === 'In Progress'
  const isOnHold = website.website_status === 'On Hold'
  const showMarkLive = isInProgress || isOnHold
  const showDiscontinue = website.allowed_actions.includes('discontinue')
  const showTransfer = website.allowed_actions.includes('mark-transfer-completed')

  if (!showMarkLive && !showDiscontinue && !showTransfer) return null

  return (
    <div className="border-b border-[#EEF0F2] p-[16px_18px]">
      <div className="mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]">Actions</div>
      <div className="flex flex-col gap-2">
        {showMarkLive ? (
          <div>
            <ActionBtn icon={<CheckCircle2 className="size-4" />} label="Mark as Live"
              disabled={updateMutation.isPending} onClick={() => setMarkLiveOpen((o) => !o)} />
            {markLiveOpen ? (
              <div className="mt-2 grid gap-3 rounded-[10px] border border-[#E5E7EB] bg-[#FAFBFC] p-4">
                <label className="grid gap-1 text-[12px] font-semibold text-[#5C6270]">
                  URL <span className="text-[#DC2626]">*</span>
                  <Input placeholder="https://example.com" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="h-9 rounded-[8px] border-[#E5E7EB] text-[12px]" />
                </label>
                <label className="grid gap-1 text-[12px] font-semibold text-[#5C6270]">
                  Hosted Date <span className="text-[#DC2626]">*</span>
                  <Input type="date" value={liveHostedDate} onChange={(e) => setLiveHostedDate(e.target.value)} className="h-9 rounded-[8px] border-[#E5E7EB] text-[12px]" />
                </label>
                <label className="grid gap-1 text-[12px] font-semibold text-[#5C6270]">
                  Renewal Date <span className="text-[#DC2626]">*</span>
                  <Input type="date" value={liveRenewalDate} onChange={(e) => setLiveRenewalDate(e.target.value)} className="h-9 rounded-[8px] border-[#E5E7EB] text-[12px]" />
                </label>
                <Button
                  disabled={updateMutation.isPending || !liveUrl || !liveHostedDate || !liveRenewalDate}
                  className="h-9 rounded-[8px] bg-[#4F5DF5] text-[12.5px] text-white hover:bg-[#3F4DE0]"
                  onClick={() => updateMutation.mutate({ websiteStatus: 'Live', maintenanceStatus: 'Active', url: liveUrl, hostedDate: liveHostedDate, renewalDate: liveRenewalDate })}
                >
                  {updateMutation.isPending ? 'Saving…' : 'Mark as Live'}
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        {showTransfer ? (
          <ActionBtn icon={<CalendarCheck2 className="size-4" />} label="Mark Transfer Completed"
            disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate({ transferCompleted: true })} />
        ) : null}

        {showDiscontinue ? (
          <div>
            <ActionBtn icon={<XCircle className="size-4" />} label="Discontinue" destructive onClick={() => setDiscontinueOpen(true)} />
            <ConfirmDialog
              open={discontinueOpen}
              onOpenChange={setDiscontinueOpen}
              title="Discontinue Website"
              description="This will mark the website as Discontinued and cancel maintenance. This action is final."
              confirmLabel="Discontinue"
              onConfirm={() => { updateMutation.mutate({ websiteStatus: 'Discontinued', maintenanceStatus: 'Cancelled' }); setDiscontinueOpen(false) }}
              isPending={updateMutation.isPending}
            />
          </div>
        ) : null}
      </div>
      {updateMutation.isError ? (
        <p className="mt-2 text-[12px] text-[#DC2626]">{(updateMutation.error as Error).message}</p>
      ) : null}
    </div>
  )
}

function ActionBtn({ icon, label, destructive, disabled, onClick }: {
  icon: React.ReactNode; label: string; destructive?: boolean; disabled?: boolean; onClick?: () => void
}) {
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-[9px] border px-4 py-2.5 text-[12.5px] font-semibold transition',
        destructive ? 'border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FECACA]'
          : 'border-[#E5E7EB] bg-white text-[#3D4250] hover:bg-[#F4F5F7]',
        disabled && 'cursor-not-allowed opacity-50',
      )}>
      {icon}{label}
    </button>
  )
}

// ─── Utilities ────────────────────────────────────────────────────────────────

// Not used for rendering (backend sends pre-formatted labels) but kept for any edge fallbacks.
