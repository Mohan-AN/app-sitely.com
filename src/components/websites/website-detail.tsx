import { useEffect, useState } from 'react'
import {
  AlertCircle, CalendarCheck2, CalendarClock, CalendarDays, CheckCircle2,
  CreditCard, ExternalLink, FileText, Globe, Link2, Layers, PauseCircle,
  RefreshCw, Server, XCircle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { Input } from '#/components/ui/input'
import { Skeleton } from '#/components/ui/skeleton'
import { formatDate } from '#/lib/format'
import { cn } from '#/lib/utils'
import { useUpdateWebsite, useWebsiteActivity } from '#/hooks/use-websites'
import { StatusPill } from './status-badges'
import type { UpdateWebsiteInput, WebsiteAction, WebsiteDetail as WebsiteDetailType } from './types'

// ─── Action config ─────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<WebsiteAction, { label: string; icon: React.ReactNode; variant: 'default' | 'destructive' | 'outline' | 'warning' }> = {
  'mark-live':              { label: 'Mark Live',               icon: <CheckCircle2 className="size-4" />,   variant: 'outline' },
  'record-payment':         { label: 'Record Payment & Renew',  icon: <CreditCard className="size-4" />,     variant: 'outline' },
  'mark-transfer-completed':{ label: 'Mark Transfer Completed', icon: <CalendarCheck2 className="size-4" />, variant: 'outline' },
  'put-on-hold':            { label: 'Put On Hold',             icon: <PauseCircle className="size-4" />,    variant: 'outline' },
  discontinue:              { label: 'Discontinue',             icon: <XCircle className="size-4" />,        variant: 'destructive' },
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function WebsiteDetail({ website }: { website: WebsiteDetailType }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid auto-rows-min gap-4">
        <OverviewCard website={website} />
        <KeyDatesCard website={website} />
        <NotesCard website={website} />
        <ActivityCard websiteId={website.websiteId} />
      </div>
      <div className="grid auto-rows-min gap-4">
        <ActionsCard website={website} />
        <RenewalSummaryCard website={website} />
      </div>
    </div>
  )
}

export function WebsiteDetailSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-4">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
      <div className="grid gap-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewCard({ website }: { website: WebsiteDetailType }) {
  return (
    <Card>
      <CardHeader title="Overview" />
      <div className="grid divide-y divide-[#f0f4ee] dark:divide-[#2f4a32]/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <OverviewItem icon={<Globe className="size-4" />} label="Client">
          <a href={`/clients/${website.clientId}`} className="font-bold text-[#102315] underline-offset-2 hover:underline dark:text-[#edf7ee]">
            {website.clientName}
          </a>
        </OverviewItem>
        <OverviewItem icon={<Layers className="size-4" />} label="Type">
          <span className="font-bold text-[#102315] dark:text-[#edf7ee] capitalize">{website.siteType}</span>
        </OverviewItem>
        <OverviewItem icon={<Server className="size-4" />} label="Platform">
          <span className="font-bold text-[#102315] dark:text-[#edf7ee] uppercase">{website.platform}</span>
        </OverviewItem>
      </div>
      <div className="grid divide-y divide-[#f0f4ee] dark:divide-[#2f4a32]/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0 border-t border-[#f0f4ee] dark:border-[#2f4a32]/60">
        <OverviewItem icon={<Link2 className="size-4" />} label="URL">
          {website.url ? (
            <a href={website.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-[#658354] underline-offset-2 hover:underline dark:text-[#85e0a3]">
              {website.url.replace(/^https?:\/\//, '')}
              <ExternalLink className="size-3" />
            </a>
          ) : (
            <span className="text-sm text-[#64745F] dark:text-[#9fb49b]">Not set</span>
          )}
        </OverviewItem>
        <OverviewItem icon={<RefreshCw className="size-4" />} label="Website Status">
          <StatusPill label={website.websiteStatus} />
        </OverviewItem>
        <OverviewItem icon={<CalendarClock className="size-4" />} label="Maintenance">
          <StatusPill label={website.maintenanceStatus} />
        </OverviewItem>
      </div>
      {website.isOverdue ? (
        <div className="border-t border-[#f0f4ee] dark:border-[#2f4a32]/60">
          <OverviewItem icon={<RefreshCw className="size-4" />} label="Renewal State">
            <StatusPill label="Overdue" />
          </OverviewItem>
        </div>
      ) : null}
    </Card>
  )
}

function OverviewItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64745F] dark:text-[#9fb49b]">
        <span className="text-[#a0b89a] dark:text-[#6a9b70]">{icon}</span>
        {label}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  )
}

// ─── Key Dates ────────────────────────────────────────────────────────────────

function KeyDatesCard({ website }: { website: WebsiteDetailType }) {
  const dates = [
    { label: 'Start Date',             value: website.startDate },
    { label: 'Hosted Date',            value: website.hostedDate },
    { label: 'Last Invoice Sent',      value: website.lastInvoiceSent },
    { label: 'Last Payment Received',  value: website.lastPaymentReceived },
    { label: 'Renewal Date',           value: website.renewalDate, overdue: website.isOverdue },
  ]

  return (
    <Card>
      <CardHeader title="Key Dates" />
      <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {dates.map((date) => (
          <div
            key={date.label}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3',
              date.overdue
                ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20'
                : 'border-[#e8f0e4] bg-[#f8faf7] dark:border-[#2f4a32] dark:bg-[#132018]',
            )}
          >
            <span className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-full',
              date.overdue
                ? 'bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400'
                : 'bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]',
            )}>
              <CalendarDays className="size-4" />
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#64745F] dark:text-[#9fb49b]">{date.label}</div>
              <div className={cn('mt-0.5 text-sm font-bold', date.overdue ? 'text-red-600 dark:text-red-400' : 'text-[#102315] dark:text-[#edf7ee]')}>
                {formatDate(date.value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Notes ────────────────────────────────────────────────────────────────────

function NotesCard({ website }: { website: WebsiteDetailType }) {
  return (
    <Card>
      <div className="flex items-start gap-4 p-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]">
          <FileText className="size-5" />
        </span>
        <div>
          <h3 className="font-bold text-[#102315] dark:text-[#edf7ee]">Notes / Remarks</h3>
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-[#475467] dark:text-[#9fb49b]">
            {website.remarks || 'No remarks added.'}
          </p>
        </div>
      </div>
    </Card>
  )
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function ActionsCard({ website }: { website: WebsiteDetailType }) {
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false)
  const [discontinueOpen, setDiscontinueOpen] = useState(false)
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]!)
  const [renewalDate, setRenewalDate] = useState('')
  const updateMutation = useUpdateWebsite(website.websiteId)

  const runAction = (action: WebsiteAction) => {
    const payload = actionPayload(action, website)
    if (!payload) return
    updateMutation.mutate(payload)
  }

  return (
    <Card>
      <CardHeader title="Actions" subtitle="Quick actions you can take for this website." />
      <div className="grid gap-2.5 p-5 pt-0">
        {website.allowedActions.length === 0 ? (
          <p className="text-sm text-[#64745F] dark:text-[#9fb49b]">No actions available.</p>
        ) : null}

        {website.allowedActions.map((action) => {
          const cfg = ACTION_CONFIG[action]
          const isDestructive = cfg.variant === 'destructive'

          if (action === 'record-payment') {
            return (
              <div key={action}>
                <ActionButton
                  icon={cfg.icon}
                  label={cfg.label}
                  destructive={false}
                  onClick={() => setRecordPaymentOpen((o) => !o)}
                />
                {recordPaymentOpen ? (
                  <div className="mt-2 grid gap-3 rounded-xl border border-[#e8f0e4] bg-[#f8faf7] p-4 dark:border-[#2f4a32] dark:bg-[#132018]">
                    <label className="grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">
                      Payment date
                      <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                    </label>
                    <label className="grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">
                      New renewal date
                      <Input type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} />
                    </label>
                    <Button
                      disabled={updateMutation.isPending || !paymentDate || !renewalDate}
                      className="rounded-lg bg-[#658354] text-white hover:bg-[#4b6043]"
                      onClick={() => updateMutation.mutate({ lastPaymentReceived: paymentDate, renewalDate, maintenanceStatus: 'Active' })}
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save payment'}
                    </Button>
                  </div>
                ) : null}
              </div>
            )
          }

          if (action === 'discontinue') {
            return (
              <div key={action}>
                <ActionButton icon={cfg.icon} label={cfg.label} destructive onClick={() => setDiscontinueOpen(true)} />
                <ConfirmDialog
                  open={discontinueOpen}
                  onOpenChange={setDiscontinueOpen}
                  title="Discontinue Website"
                  description="This will mark the website as Discontinued and cancel maintenance. This action is final."
                  confirmLabel="Discontinue"
                  onConfirm={() => { runAction('discontinue'); setDiscontinueOpen(false) }}
                  isPending={updateMutation.isPending}
                />
              </div>
            )
          }

          return (
            <ActionButton
              key={action}
              icon={cfg.icon}
              label={cfg.label}
              destructive={isDestructive}
              disabled={updateMutation.isPending}
              onClick={() => runAction(action)}
            />
          )
        })}

        {updateMutation.isError ? (
          <p className="text-xs text-destructive">{(updateMutation.error as Error).message}</p>
        ) : null}
      </div>
    </Card>
  )
}

function ActionButton({
  icon, label, destructive, disabled, onClick,
}: {
  icon: React.ReactNode
  label: string
  destructive?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
        destructive
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40'
          : 'border-[#dde5d8] bg-white text-[#102315] hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:bg-[#132018] dark:text-[#edf7ee] dark:hover:bg-[#203423]',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Renewal Summary ──────────────────────────────────────────────────────────

function RenewalSummaryCard({ website }: { website: WebsiteDetailType }) {
  const nextAction = website.isOverdue ? 'Payment Required' : website.maintenanceStatus === 'Active' ? 'On Track' : 'Review Needed'
  const nextActionColor = website.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'

  return (
    <Card>
      <CardHeader title="Renewal Summary" />
      <div className="grid gap-0 divide-y divide-[#f0f4ee] p-5 pt-0 dark:divide-[#2f4a32]/60">
        <SummaryRow icon={<CalendarDays className="size-4" />} label="Website ID" value={website.websiteId} />
        <SummaryRow icon={<Server className="size-4" />} label="Current Plan / Platform" value={website.platform.toUpperCase()} />
        <SummaryRow
          icon={<CalendarClock className="size-4" />}
          label="Renewal Status"
          value={
            <span className="flex items-center gap-1.5">
              <span className={cn('size-2 rounded-full', website.isOverdue ? 'bg-red-500' : 'bg-emerald-500')} />
              <span className={cn('font-bold', website.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400')}>
                {website.isOverdue ? 'Overdue' : 'Active'}
              </span>
            </span>
          }
        />
        <SummaryRow
          icon={<AlertCircle className="size-4" />}
          label="Next Action"
          value={
            <span className={cn('flex items-center gap-1 font-bold', nextActionColor)}>
              {nextAction}
              {website.isOverdue ? <AlertCircle className="size-3.5" /> : null}
            </span>
          }
        />
      </div>
    </Card>
  )
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-2 text-sm text-[#64745F] dark:text-[#9fb49b]">
        <span className="text-[#a0b89a]">{icon}</span>
        {label}
      </div>
      <div className="text-right text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">{value}</div>
    </div>
  )
}

// ─── Activity ─────────────────────────────────────────────────────────────────

function ActivityCard({ websiteId }: { websiteId: string }) {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<ActivityItem[]>([])
  const activityQuery = useWebsiteActivity(websiteId, page)
  const activity = activityQuery.data

  useEffect(() => { setPage(1); setItems([]) }, [websiteId])

  useEffect(() => {
    if (!activity) return
    setItems((prev) => {
      const existing = new Set(prev.map((i) => i.logId))
      return [...prev, ...activity.items.filter((i) => !existing.has(i.logId))]
    })
  }, [activity])

  return (
    <Card>
      <CardHeader title="History" />
      <div className="grid gap-2 p-5 pt-0">
        {activityQuery.isLoading ? <Skeleton className="h-20 rounded-xl" /> : null}
        {activityQuery.isError ? <p className="text-sm text-destructive">{(activityQuery.error as Error).message}</p> : null}
        {activity && items.length === 0 ? <p className="text-sm text-[#64745F] dark:text-[#9fb49b]">No history yet.</p> : null}
        {items.map((item) => (
          <div key={item.logId} className="rounded-xl border border-[#e8f0e4] bg-[#f8faf7] p-3 dark:border-[#2f4a32] dark:bg-[#132018]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">{item.description}</span>
              <span className="text-xs text-[#64745F] dark:text-[#9fb49b]">{formatDate(item.createdAt)}</span>
            </div>
            <div className="mt-1 text-xs text-[#64745F] dark:text-[#9fb49b]">{item.action} · {item.userName}</div>
          </div>
        ))}
        {activity && activity.pagination.page < activity.pagination.totalPages ? (
          <button
            type="button"
            className="w-full rounded-xl border border-[#dde5d8] py-2 text-sm font-semibold text-[#64745F] transition hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:text-[#9fb49b] dark:hover:bg-[#203423]"
            onClick={() => setPage((p) => p + 1)}
          >
            Load more
          </button>
        ) : null}
      </div>
    </Card>
  )
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e5ebe2] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
      {children}
    </div>
  )
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-[#f0f4ee] px-5 py-4 dark:border-[#2f4a32]/60">
      <h3 className="font-extrabold text-[#102315] dark:text-[#edf7ee]">{title}</h3>
      {subtitle ? <p className="mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]">{subtitle}</p> : null}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ActivityItem = { logId: string; action: string; description: string; createdAt: string; userName: string }

function actionPayload(action: WebsiteAction, website: WebsiteDetailType): UpdateWebsiteInput | null {
  if (action === 'mark-live') return { websiteStatus: 'Live' }
  if (action === 'mark-transfer-completed') return { transferCompleted: true }
  if (action === 'put-on-hold') return { websiteStatus: 'On Hold', maintenanceStatus: website.maintenanceStatus === 'Active' ? 'Paused' : website.maintenanceStatus }
  if (action === 'discontinue') return { websiteStatus: 'Discontinued', maintenanceStatus: 'Cancelled' }
  return null
}
