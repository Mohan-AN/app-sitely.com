import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, MoreVertical, Eye, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { NoResults } from '#/components/ui/no-results'
import { PageSizeSelector } from '#/components/ui/page-size-selector'
import { Skeleton } from '#/components/ui/skeleton'
import { formatCurrency, formatDate } from '#/lib/format'
import { cn } from '#/lib/utils'
import { StatusPill } from './status-badges'
import { WebsiteEditDialog } from './website-edit-dialog'
import { RenewDomainDialog } from './renew-domain-dialog'
import type { Website } from './types'

interface WebsitesTableProps {
  websites: Website[] | undefined
  isLoading: boolean
  isFetching?: boolean
  isError: boolean
  error: Error | null
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortChange: (sortBy: string) => void
  pagination?: { page: number; limit: number; total: number; totalPages: number }
  pageSize: number
  onPageSizeChange: (value: number) => void
  onPageChange: (page: number) => void
  onDelete?: (website: Website) => void
  dueSoonDays?: number
}

// 8 columns: Project Name | Client | Build/Host Type | Domain | Maintenance | Next Due | Status | Actions
const gridClass = 'grid grid-cols-[2.2fr_0.85fr_1.5fr_1.25fr_0.8fr_1.1fr_110px_42px]'

function rowPriority(site: Website): number {
  const domainDiff = site.domain_renewal_date ? dayDiff(site.domain_renewal_date) : null
  const isDomainOverdue = domainDiff !== null && domainDiff < 0
  const isDueSoon = site.maintenance_status === 'Due Soon' || (domainDiff !== null && domainDiff >= 0 && domainDiff <= 30)

  if (site.is_maintenance_overdue) return 0
  if (isDomainOverdue) return 1
  if (isDueSoon) return 2
  if (site.website_status === 'Live') return 3
  if (site.website_status === 'In Progress') return 4
  return 5
}

export function WebsitesTable({
  websites, isLoading, isFetching, isError, error,
  sortBy, sortOrder, onSortChange,
  pagination, pageSize, onPageSizeChange, onPageChange,
  onDelete, dueSoonDays = 30,
}: WebsitesTableProps) {
  const showSkeleton = isLoading || isFetching

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className={cn(gridClass, 'shrink-0 border-b border-[#E5E7EB] bg-[#FAFBFC]')}>
        <Th>Project Name</Th>
        <Th>Client</Th>
        <SortTh field="siteType" label="Build/Host Type" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
        <Th>Domain</Th>
        <Th>Maintenance</Th>
        <SortTh field="renewalDate" label="Next Due" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
        <Th center>Status</Th>
        <Th />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {showSkeleton ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={cn(gridClass, 'min-h-[56px] items-center border-b border-[#EEF0F2] px-0')}>
              <div className="px-3 py-3"><Skeleton className="h-4 w-[70%] rounded-[6px]" /><Skeleton className="mt-1.5 h-3 w-[45%] rounded-[6px]" /></div>
              <div className="px-3"><Skeleton className="h-3.5 w-[60%] rounded-[6px]" /></div>
              <div className="px-3"><Skeleton className="h-3.5 w-[50%] rounded-[6px]" /></div>
              <div className="px-3"><Skeleton className="h-3.5 w-[65%] rounded-[6px]" /><Skeleton className="mt-1.5 h-3 w-[40%] rounded-[6px]" /></div>
              <div className="px-3"><Skeleton className="h-6 w-[70%] rounded-[7px]" /></div>
              <div className="px-3"><Skeleton className="h-3.5 w-[55%] rounded-[6px]" /></div>
              <div className="flex justify-center px-3"><Skeleton className="h-6 w-14 rounded-[7px]" /></div>
              <div className="px-3"><Skeleton className="h-6 w-6 rounded-[6px]" /></div>
            </div>
          ))
        ) : isError ? (
          <StateRow className="text-[#DC2626]">{error?.message ?? 'Something went wrong.'}</StateRow>
        ) : !websites || websites.length === 0 ? (
          <NoResults message="No websites found." />
        ) : (
          [...websites]
            .sort((a, b) => rowPriority(a) - rowPriority(b))
            .map((site) => <WebsiteRow key={site.id} site={site} onDelete={onDelete} dueSoonDays={dueSoonDays} />)
        )}
      </div>

      {pagination ? (
        <footer className="flex shrink-0 items-center justify-between border-t border-[#E5E7EB] bg-white px-5 py-3 text-sm text-[#8A8F98]">
          <PageSizeSelector value={pageSize} onChange={onPageSizeChange} total={pagination.total} />
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#8A8F98]">
              Page <span className="font-semibold text-[#5C6270]">{pagination.page}</span> of <span className="font-semibold text-[#5C6270]">{pagination.totalPages}</span>
            </span>
            <div className="flex items-center gap-1.5">
            <button type="button" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}
              className="flex size-[29px] items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Previous page">
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" onClick={() => onPageChange(n)}
                className={cn('flex size-[29px] items-center justify-center rounded-[7px] text-[12px] font-semibold transition',
                  n === pagination.page ? 'bg-[#4F5DF5] text-white' : 'text-[#5C6270] hover:bg-[#F4F5F7]')}>
                {n}
              </button>
            ))}
            <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)}
              className="flex size-[29px] items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed" aria-label="Next page">
              <ChevronRight className="size-4" />
            </button>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  )
}

// ── Row ───────────────────────────────────────────────────────────────────────

function WebsiteRow({ site, onDelete, dueSoonDays }: { site: Website; onDelete?: (site: Website) => void; dueSoonDays: number }) {
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [renewOpen, setRenewOpen] = useState(false)

  const isOverdue = site.is_maintenance_overdue
  const isDueSoon = !isOverdue && site.maintenance_status === 'Due Soon'

  return (
    <div
      className={cn(
        gridClass,
        'min-h-[60px] cursor-pointer items-center border-b border-[#EEF0F2] text-[13px] transition-colors',
        isOverdue ? 'bg-[#FFF8F7] hover:bg-[#FEF0EE]' : isDueSoon ? 'bg-[#FFFCF4] hover:bg-[#FEF7E6]' : 'hover:bg-[#F7F8FA]',
      )}
      onClick={() => navigate({ to: '/websites/$websiteId', params: { websiteId: String(site.id) } })}
    >
      {/* Project */}
      <Cell>
        <div className="flex items-center gap-[11px]">
          <div className={cn('flex size-[34px] shrink-0 items-center justify-center rounded-[10px]',
            isOverdue ? 'bg-[#FEF2F2]' : isDueSoon ? 'bg-[#FEF3C7]' : 'bg-[#EFF6FF]')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn('size-[17px]', isOverdue ? 'text-[#DC2626]' : isDueSoon ? 'text-[#D97706]' : 'text-[#3B82F6]')}>
              <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-[#11141A]">{site.project_name}</div>
            {site.url ? <div className="truncate text-[11.5px] text-[#8A8F98]">{site.url.replace(/^https?:\/\//, '')}</div> : null}
          </div>
        </div>
      </Cell>

      {/* Client */}
      <Cell><span className="truncate text-[#5C6270]">{site.client_name}</span></Cell>

      {/* Type: "build_type / platform" */}
      <Cell>
        <div className="min-w-0 w-full">
          <div className="truncate font-semibold text-[#3D4250]">
            {[site.build_type || site.site_type, site.platform].filter(Boolean).join(' / ')}
          </div>
        </div>
      </Cell>

      {/* Domain */}
      <Cell><DomainCell site={site} dueSoonDays={dueSoonDays} onRenew={() => setRenewOpen(true)} /></Cell>

      {/* Maintenance */}
      <Cell>
        {site.maintenance_amount ? (
          <div>
            <div className="font-bold text-[#3D4250]">{formatCurrency(site.maintenance_amount)}<span className="font-normal text-[#8A8F98]"> / {site.billing_cycle === 'yearly' ? 'y' : 'mo'}</span></div>
            <div className="text-[11px] text-[#8A8F98] capitalize">{site.billing_cycle ?? 'Monthly'}</div>
          </div>
        ) : (
          <span className="text-[#C7CAD1]">—</span>
        )}
      </Cell>

      {/* Next Due */}
      <Cell><NextDueCell site={site} dueSoonDays={dueSoonDays} /></Cell>

      {/* Website status */}
      <Cell className="justify-center"><StatusPill label={site.website_status} /></Cell>

      {/* Actions */}
      <Cell className="justify-center pr-2" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button type="button" className="flex size-7 shrink-0 items-center justify-center rounded-[7px] text-[#A8ACB4] transition hover:bg-[#F4F5F7] hover:text-[#3D4250]" aria-label={`Actions for ${site.project_name}`} />
          }>
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" sideOffset={6} className="w-[165px] rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0_10px_30px_rgba(17,20,26,.12)]">
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7]"
                onClick={() => navigate({ to: '/websites/$websiteId', params: { websiteId: String(site.id) } })}>
                <Eye className="size-3.5 text-[#8A8F98]" /> View
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7]"
                onClick={() => setEditOpen(true)}>
                <Pencil className="size-3.5 text-[#8A8F98]" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7]"
                onClick={() => setRenewOpen(true)}>
                <RefreshCw className="size-3.5 text-[#8A8F98]" /> Renew Domain
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#DC2626] focus:bg-[#FEF2F2] focus:text-[#DC2626]"
                onClick={() => onDelete?.(site)}>
                <Trash2 className="size-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

<WebsiteEditDialog websiteId={String(site.id)} open={editOpen} onOpenChange={setEditOpen} />
        <RenewDomainDialog website={site} open={renewOpen} onOpenChange={setRenewOpen} />
      </Cell>
    </div>
  )
}

// ── Domain Cell ───────────────────────────────────────────────────────────────

function DomainCell({ site, dueSoonDays, onRenew }: { site: Website; dueSoonDays: number; onRenew?: () => void }) {
  const handledBy = site.domain_handled_by
  if (!handledBy && !site.domain_name) return <span className="text-[#C7CAD1]">—</span>

  const handledByLabel = handledBy === 'our_side' ? 'Our side' : handledBy === 'client_side' ? 'Client side' : '—'
  const diff = site.domain_renewal_date ? dayDiff(site.domain_renewal_date) : null
  const isDomainOverdue = diff !== null && diff < 0
  const isDomainDueSoon = diff !== null && diff >= 0 && diff <= dueSoonDays

  return (
    <div className="min-w-0">
      <div className={cn('truncate font-semibold text-[#3D4250]', isDomainOverdue && 'text-[#DC2626]', isDomainDueSoon && !isDomainOverdue && 'text-[#D97706]')}>
        {handledByLabel}{site.domain_provider ? ` · ${site.domain_provider}` : ''}
      </div>
      {site.domain_renewal_date ? (
        <div className="text-[11px] text-[#8A8F98]">{formatDate(site.domain_renewal_date)}</div>
      ) : (
        <div className="text-[11px] text-[#8A8F98]">Renewal unknown</div>
      )}
      {isDomainOverdue && diff !== null ? (
        <button type="button"
          onClick={(e) => { e.stopPropagation(); onRenew?.() }}
          className="text-[11px] font-semibold text-[#DC2626] underline decoration-dotted hover:text-[#B91C1C]">
          overdue by {Math.abs(diff)} days
        </button>
      ) : isDomainDueSoon && diff !== null ? (
        <button type="button"
          onClick={(e) => { e.stopPropagation(); onRenew?.() }}
          className="text-[11px] font-semibold text-[#D97706] underline decoration-dotted hover:text-[#B45309]">
          due in {diff} days
        </button>
      ) : null}
    </div>
  )
}

// ── Next Due Cell ─────────────────────────────────────────────────────────────

function NextDueCell({ site, dueSoonDays }: { site: Website; dueSoonDays: number }) {
  const renewalDate = site.current_billing_due_date
  if (!renewalDate) return <span className="text-[#C7CAD1]">—</span>

  const diff = dayDiff(renewalDate)
  const isOverdue = site.is_maintenance_overdue
  const isDueSoon = !isOverdue && diff >= 0 && diff <= dueSoonDays

  let iconBg = 'bg-[#059669]'
  let iconContent = '✓'
  let dateClr = 'text-[#059669]'
  if (isOverdue) { iconBg = 'bg-[#DC2626]'; iconContent = '!'; dateClr = 'text-[#DC2626]' }
  else if (isDueSoon) { iconBg = 'bg-[#D97706]'; iconContent = '⏳'; dateClr = 'text-[#D97706]' }

  return (
    <div className="flex items-start gap-2">
      <div className={cn('mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white', iconBg)}>
        {iconContent}
      </div>
      <div className="min-w-0">
        <div className={cn('font-bold', dateClr)}>{formatDate(renewalDate)}</div>
        {isOverdue ? (
          <div className="text-[10.5px] font-semibold text-[#DC2626]">overdue by {Math.abs(diff)} {Math.abs(diff) === 1 ? 'day' : 'days'}</div>
        ) : isDueSoon ? (
          <div className="text-[10.5px] font-semibold text-[#D97706]">due in {diff} {diff === 1 ? 'day' : 'days'}</div>
        ) : (
          <div className="text-[10.5px] text-[#8A8F98]">in {diff} days</div>
        )}
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const MS_PER_DAY = 24 * 60 * 60 * 1000

function dayDiff(dateStr: string | null | undefined): number {
  if (!dateStr) return 0
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const due = new Date(dateStr); due.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - now.getTime()) / MS_PER_DAY)
}

function Th({ children, center }: { children?: React.ReactNode; center?: boolean }) {
  return (
    <div className={cn('flex h-12 min-w-0 items-center overflow-hidden px-3 text-[11px] font-semibold uppercase tracking-[.03em] text-[#8A8F98]', center && 'justify-center')}>
      {children}
    </div>
  )
}

function SortTh({ field, label, sortBy, sortOrder, onSort }: { field: string; label: string; sortBy?: string; sortOrder?: 'asc' | 'desc'; onSort: (f: string) => void }) {
  const active = sortBy === field
  return (
    <div className="flex h-12 min-w-0 items-center overflow-hidden px-3">
      <button type="button" onClick={() => onSort(field)}
        className={cn('inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[.03em] transition',
          active ? 'text-[#4F5DF5]' : 'text-[#8A8F98] hover:text-[#3D4250]')}>
        {label}
        <span className="text-[10px]">{active ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}</span>
      </button>
    </div>
  )
}

function Cell({ children, className, onClick }: { children?: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return <div className={cn('flex min-w-0 items-center overflow-hidden px-3 py-2', className)} onClick={onClick}>{children}</div>
}

function StateRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-40 items-center justify-center text-[#8A8F98] text-[13px]', className)}>{children}</div>
}
