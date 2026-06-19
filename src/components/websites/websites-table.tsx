import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, CalendarDays, ChevronLeft, ChevronRight, Eye, Globe2, MoreVertical, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { NoResults } from '#/components/ui/no-results'
import { PageSizeSelector } from '#/components/ui/page-size-selector'
import { formatDate } from '#/lib/format'
import { cn } from '#/lib/utils'
import { MaintenanceBadge, StatusPill } from './status-badges'
import { WebsiteEditDialog } from './website-edit-dialog'
import { WebsiteUpdateDialog } from './website-update-dialog'
import type { Website } from './types'

interface WebsitesTableProps {
  websites: Website[] | undefined
  isLoading: boolean
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

const gridClass = 'grid min-w-[900px] grid-cols-[40px_minmax(170px,1.55fr)_minmax(112px,0.94fr)_minmax(80px,0.68fr)_minmax(92px,0.82fr)_minmax(92px,0.78fr)_minmax(108px,0.86fr)_minmax(124px,0.9fr)_40px]'
export function WebsitesTable({
  websites,
  isLoading,
  isError,
  error,
  sortBy,
  sortOrder,
  onSortChange,
  pagination,
  pageSize,
  onPageSizeChange,
  onPageChange,
  onDelete,
  dueSoonDays = 30,
}: WebsitesTableProps) {
  const pageNumbers = useMemo(() => {
    if (!pagination) return []
    return Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
  }, [pagination])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-[#e7ebf3] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="hidden min-h-0 flex-1 flex-col overflow-hidden lg:flex">
        <div className="overflow-x-auto">
          <div className={cn(gridClass, 'border-b border-[#edf1f7] bg-[#f8fafc] px-3')}>
            <HeaderCell center>
              <div className="flex size-7 items-center justify-center rounded-full border border-[#dbe3ef] text-[#64748b]">
                <Globe2 className="size-3.5" />
              </div>
            </HeaderCell>
            <HeaderCell>Project Name</HeaderCell>
            <HeaderCell>Client</HeaderCell>
            <SortableHeaderCell field="siteType" label="Type" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
            <SortableHeaderCell field="platform" label="Platform" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
            <SortableHeaderCell field="websiteStatus" label="Status" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
            <SortableHeaderCell field="maintenanceStatus" label="Maintenance" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
            <SortableHeaderCell field="renewalDate" label="Renewal Date" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
            <HeaderCell center>Actions</HeaderCell>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <TableState
            websites={websites}
            isLoading={isLoading}
            isError={isError}
            error={error}
            dueSoonDays={dueSoonDays}
            onDelete={onDelete}
          />
        </div>
      </div>

      <div className="flex min-h-[340px] flex-1 flex-col gap-3 p-4 lg:hidden">
        {isLoading ? (
          <StateRow>Loading...</StateRow>
        ) : isError ? (
          <StateRow className="text-destructive">{error?.message ?? 'Something went wrong.'}</StateRow>
        ) : !websites || websites.length === 0 ? (
          <NoResults message="No websites found." />
        ) : (
          websites.map((site) => <WebsiteCard key={site.websiteId} site={site} onDelete={onDelete} dueSoonDays={dueSoonDays} />)
        )}
      </div>

      {pagination ? (
        <footer className="sticky bottom-0 z-10 flex shrink-0 flex-col gap-2 border-t border-[#edf1f7] bg-white px-4 py-2.5 shadow-[0_-8px_24px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <PageSizeSelector
              value={pageSize}
              onChange={onPageSizeChange}
              total={pagination.total}
              page={pagination.page}
              limit={pagination.limit}
              className="justify-start"
            />
            <div className="flex flex-wrap items-center gap-2 md:justify-center">
              <Button variant="outline" size="lg" className="h-9 rounded-xl px-3 text-[13px]" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              {pageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === pagination.page ? 'default' : 'outline'}
                  size="icon-lg"
                  className={cn(
                    'size-9 rounded-xl border-[#e5e7ef] shadow-none text-[13px]',
                    pageNumber === pagination.page
                      ? 'bg-[#ede9fe] text-[#5b38f6] hover:bg-[#e4ddff]'
                      : 'bg-white text-[#334155] hover:text-[#5b38f6]',
                  )}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}
              <Button variant="outline" size="lg" className="h-9 rounded-xl px-3 text-[13px]" disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)}>
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  )
}

function TableState({
  websites,
  isLoading,
  isError,
  error,
  onDelete,
  dueSoonDays,
}: {
  websites: Website[] | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  onDelete?: (website: Website) => void
  dueSoonDays: number
}) {
  if (isLoading) return <StateRow>Loading...</StateRow>
  if (isError) return <StateRow className="text-destructive">{error?.message ?? 'Something went wrong.'}</StateRow>
  if (!websites || websites.length === 0) return <NoResults message="No websites found." />

  return websites.map((site) => <WebsiteRow key={site.websiteId} site={site} onDelete={onDelete} dueSoonDays={dueSoonDays} />)
}

function WebsiteRow({ site, onDelete, dueSoonDays }: { site: Website; onDelete?: (site: Website) => void; dueSoonDays: number }) {
  return (
    <div className={cn(gridClass, 'items-center border-b border-[#edf1f7] px-3 text-[13px] text-[#0f172a] last:border-b-0 hover:bg-[#fcfcfe]')}>
      <Cell className="flex items-center justify-center">
        <ProjectAvatar site={site} />
      </Cell>
      <Cell>
        <div className="truncate text-[13px] font-semibold text-[#111827]">{site.projectName}</div>
        {site.url ? <div className="truncate text-[11px] text-[#667085]">{site.url.replace(/^https?:\/\//, '')}</div> : null}
      </Cell>
      <Cell className="truncate text-[13px] text-[#334155]">{site.clientName}</Cell>
      <Cell className="truncate text-[13px] capitalize text-[#334155]">{site.siteType}</Cell>
      <Cell>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-[#334155]">
          <PlatformMark platform={site.platform} />
          <span>{site.platform === 'WPX' ? 'Wpx' : site.platform}</span>
        </span>
      </Cell>
      <Cell>
        <StatusPill label={site.websiteStatus} />
      </Cell>
      <Cell>
        <MaintenanceBadge label={site.maintenanceStatus} />
      </Cell>
      <Cell>
        <RenewalDateCell renewalDate={site.renewalDate} isOverdue={site.isOverdue} dueSoonDays={dueSoonDays} />
      </Cell>
      <Cell className="flex justify-center">
        <WebsiteActions site={site} onDelete={onDelete} />
      </Cell>
    </div>
  )
}

function WebsiteCard({ site, onDelete, dueSoonDays }: { site: Website; onDelete?: (site: Website) => void; dueSoonDays: number }) {
  return (
    <div className="rounded-2xl border border-[#e7ebf3] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <ProjectAvatar site={site} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold text-[#111827]">{site.projectName}</div>
              {site.url ? <div className="mt-0.5 truncate text-[13px] text-[#667085]">{site.url.replace(/^https?:\/\//, '')}</div> : null}
            </div>
            <WebsiteActions site={site} onDelete={onDelete} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <MetaItem label="Client" value={site.clientName ?? '-'} />
            <MetaItem label="Type" value={site.siteType} capitalize />
            <MetaItem label="Platform" valueNode={<span className="inline-flex items-center gap-2"><PlatformMark platform={site.platform} />{site.platform}</span>} />
            <MetaItem label="Status" valueNode={<StatusPill label={site.websiteStatus} />} />
            <MetaItem label="Maintenance" valueNode={<MaintenanceBadge label={site.maintenanceStatus} />} />
            <MetaItem label="Renewal" valueNode={<RenewalDateCell renewalDate={site.renewalDate} isOverdue={site.isOverdue} dueSoonDays={dueSoonDays} />} />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaItem({
  label,
  value,
  valueNode,
  capitalize = false,
}: {
  label: string
  value?: string
  valueNode?: React.ReactNode
  capitalize?: boolean
}) {
  return (
    <div className="rounded-xl bg-[#f8fafc] px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-normal text-[#94a3b8]">{label}</div>
      <div className={cn('mt-1 text-[14px] text-[#334155]', capitalize && 'capitalize')}>
        {valueNode ?? value}
      </div>
    </div>
  )
}

function ProjectAvatar({ site }: { site: Website }) {
  return (
    <span className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-[#e8faf0] text-[#12b76a]">
      <Globe2 className="size-3.5" />
    </span>
  )
}

function WebsiteActions({ site, onDelete }: { site: Website; onDelete?: (site: Website) => void }) {
  const navigate = useNavigate()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-xl text-[#111827] transition hover:bg-[#f5f7fb] hover:text-[#5b38f6]"
              aria-label={`Actions for ${site.projectName}`}
            />
          }
        >
          <MoreVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-40 rounded-2xl border border-[#e4e8f0] bg-white p-1.5 shadow-xl">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-[#0f172a] focus:bg-[#f4f1ff]" onClick={() => navigate({ to: '/websites/$websiteId', params: { websiteId: site.websiteId } })}>
              <Eye className="size-4 text-[#64748b]" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-[#0f172a] focus:bg-[#f4f1ff]" onClick={() => setUpdateOpen(true)}>
              <RefreshCw className="size-4 text-[#64748b]" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-[#0f172a] focus:bg-[#f4f1ff]" onClick={() => setEditOpen(true)}>
              <Pencil className="size-4 text-[#64748b]" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-red-600 focus:bg-red-50" onClick={() => onDelete?.(site)}>
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <WebsiteUpdateDialog websiteId={site.websiteId} open={updateOpen} onOpenChange={setUpdateOpen} />
      <WebsiteEditDialog websiteId={site.websiteId} open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}

function PlatformMark({ platform }: { platform: string }) {
  if (platform.toLowerCase() === 'wpx') {
    return <span className="text-[16px] font-black leading-none text-[#2457ff]">W</span>
  }

  return (
    <span className="relative block size-3.5 rotate-45 rounded-[3px] border-2 border-[#111827]">
      <span className="absolute inset-[2px] rounded-[2px] bg-white" />
    </span>
  )
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function dayDiff(renewalDate: string | null | undefined): number {
  if (!renewalDate) return 0
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const due = new Date(renewalDate)
  due.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - now.getTime()) / MS_PER_DAY)
}

function RenewalDateCell({ renewalDate, isOverdue, dueSoonDays }: { renewalDate: string | null | undefined; isOverdue?: boolean; dueSoonDays: number }) {
  if (!renewalDate) return <span className="text-[#94a3b8]">-</span>

  const diff = dayDiff(renewalDate)
  const dueSoon = !isOverdue && diff >= 0 && diff <= dueSoonDays

  if (isOverdue) {
    const overdueDays = Math.abs(diff)
    return (
      <div className="flex items-start gap-1.5">
        <AlertTriangle className="mt-0.5 size-3 shrink-0 text-[#ef4444]" />
        <div className="min-w-0">
          <div className="font-medium text-[#ef4444]">{formatDate(renewalDate)}</div>
          <div className="text-[10px] text-[#ef4444]">by {overdueDays} days</div>
        </div>
      </div>
    )
  }

  if (dueSoon) {
    return (
      <div className="flex items-start gap-1.5">
        <AlertTriangle className="mt-0.5 size-3 shrink-0 text-[#94a3b8]" />
        <div className="min-w-0">
          <div className="font-medium text-[#334155]">{formatDate(renewalDate)}</div>
          <div className="text-[10px] text-[#64748b]">in {diff} days</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="size-3 shrink-0 text-[#94a3b8]" />
      <span className="font-medium text-[#334155]">{formatDate(renewalDate)}</span>
    </div>
  )
}

function SortableHeaderCell({
  field,
  label,
  sortBy,
  sortOrder,
  onSort,
}: {
  field: string
  label: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort: (field: string) => void
}) {
  const active = sortBy === field
  return (
    <div className="flex h-13 min-w-0 items-center px-2 py-2">
      <button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#344054] transition hover:text-[#5b38f6] xl:text-[12px]">
        {label}
        {active ? (sortOrder === 'asc' ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />) : <ArrowUpDown className="size-3.5 opacity-40" />}
      </button>
    </div>
  )
}

function HeaderCell({ children, center }: { children?: React.ReactNode; center?: boolean }) {
  return (
    <div className={cn('flex h-13 min-w-0 items-center px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#344054] xl:text-[12px]', center && 'justify-center')}>
      {children}
    </div>
  )
}

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('min-w-0 px-2 py-1.5', className)}>{children}</div>
}

function StateRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-40 items-center justify-center text-[#64748b]', className)}>{children}</div>
}
