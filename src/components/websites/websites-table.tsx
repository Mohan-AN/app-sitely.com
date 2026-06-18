import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Clock, Globe, MoreVertical, Pencil, RefreshCw, Trash2, Eye } from 'lucide-react'
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

const gridClass = 'grid grid-cols-[44px_2fr_1fr_0.65fr_0.9fr_1fr_0.9fr_1.1fr_64px]'

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
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#c7ddb5] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
      {/* Header — uses same grid, padded right to match scrollbar */}
      <div className={cn(gridClass, 'shrink-0 border-b border-[#c7ddb5] bg-[#ddead1] pr-[var(--scrollbar-w,0px)] dark:border-[#2f4a32] dark:bg-[#203423]')}>
        <HeaderCell center />
        <HeaderCell>Project Name</HeaderCell>
        <HeaderCell>Client</HeaderCell>
        <SortableHeaderCell field="siteType" label="Type" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
        <SortableHeaderCell field="platform" label="Platform" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
        <SortableHeaderCell field="websiteStatus" label="Website Status" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
        <SortableHeaderCell field="maintenanceStatus" label="Maintenance" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
        <SortableHeaderCell field="renewalDate" label="Renewal Date" sortBy={sortBy} sortOrder={sortOrder} onSort={onSortChange} />
        <HeaderCell center>Action</HeaderCell>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <StateRow>Loading...</StateRow>
        ) : isError ? (
          <StateRow className="text-destructive">{error?.message ?? 'Something went wrong.'}</StateRow>
        ) : !websites || websites.length === 0 ? (
          <NoResults message="No websites found." />
        ) : (
          websites.map((site) => <WebsiteRow key={site.websiteId} site={site} onDelete={onDelete} dueSoonDays={dueSoonDays} />)
        )}
      </div>

      {pagination ? (
        <footer className="flex shrink-0 items-center justify-between border-t border-[#c7ddb5] bg-white px-5 py-3 text-sm text-[#64745F] dark:border-[#2f4a32] dark:bg-[#101912] dark:text-[#b7c8b3]">
          <PageSizeSelector value={pageSize} onChange={onPageSizeChange} total={pagination.total} />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-lg" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)} aria-label="Previous page">
              <ChevronLeft />
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === pagination.page ? 'default' : 'ghost'}
                size="icon-lg"
                className={cn(
                  'rounded-lg border border-transparent',
                  pageNumber === pagination.page && 'border-[#08712f] bg-white text-[#08712f] hover:bg-[#eef7ed] dark:bg-[#101912]',
                )}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
            <Button variant="outline" size="icon-lg" disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)} aria-label="Next page">
              <ChevronRight />
            </Button>
          </div>
        </footer>
      ) : null}
    </div>
  )
}

function WebsiteRow({ site, onDelete, dueSoonDays }: { site: Website; onDelete?: (site: Website) => void; dueSoonDays: number }) {
  const navigate = useNavigate()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div
      className={cn(
        gridClass,
        'min-h-[68px] items-center border-b border-[#c7ddb5]/40 text-[13px] hover:bg-[#ddead1]/30 dark:border-[#2f4a32]/70 dark:hover:bg-[#203423]/70',
      )}
    >
      <Cell className="flex items-center justify-center">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#08712f] dark:bg-[#163c25] dark:text-[#85e0a3]">
          <Globe className="size-4" />
        </span>
      </Cell>

      <Cell>
        <div className="truncate font-bold text-[#102315] dark:text-[#edf7ee]">{site.projectName}</div>
        {site.url ? <div className="truncate text-xs font-medium text-[#64745F] dark:text-[#9fb49b]">{site.url.replace(/^https?:\/\//, '')}</div> : null}
      </Cell>

      <Cell className="truncate font-medium text-[#334155] dark:text-[#b7c8b3]">{site.clientName}</Cell>
      <Cell className="truncate font-medium capitalize text-[#334155] dark:text-[#b7c8b3]">{site.siteType}</Cell>

      <Cell className="font-medium capitalize text-[#334155] dark:text-[#b7c8b3]">
        <span className="inline-flex items-center gap-2">
          <PlatformMark platform={site.platform} />
          {site.platform}
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

      {/* Actions cell — wider + right-aligned so button is never clipped */}
      <Cell className="flex items-center justify-end pr-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#e8f0e4] hover:text-[#102315] dark:hover:bg-[#203423] dark:hover:text-[#edf7ee]"
                aria-label={`Actions for ${site.projectName}`}
              />
            }
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="end" sideOffset={6} className="w-40 rounded-xl border border-[#dde5d8] bg-white p-1 shadow-lg dark:border-[#2f4a32] dark:bg-[#132018]">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#102315] focus:bg-[#f2f6ee] dark:text-[#edf7ee] dark:focus:bg-[#203423]"
                onClick={() => navigate({ to: '/websites/$websiteId', params: { websiteId: site.websiteId } })}
              >
                <Eye className="size-3.5 text-[#64745F]" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#102315] focus:bg-[#f2f6ee] dark:text-[#edf7ee] dark:focus:bg-[#203423]"
                onClick={() => setUpdateOpen(true)}
              >
                <RefreshCw className="size-3.5 text-[#64745F]" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#102315] focus:bg-[#f2f6ee] dark:text-[#edf7ee] dark:focus:bg-[#203423]"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="size-3.5 text-[#64745F]" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30"
                onClick={() => onDelete?.(site)}
              >
                <Trash2 className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <WebsiteUpdateDialog websiteId={site.websiteId} open={updateOpen} onOpenChange={setUpdateOpen} />
        <WebsiteEditDialog websiteId={site.websiteId} open={editOpen} onOpenChange={setEditOpen} />
      </Cell>
    </div>
  )
}

function PlatformMark({ platform }: { platform: string }) {
  if (platform.toLowerCase() === 'wpx') return <span className="text-base font-black text-blue-600">W</span>
  return <span className="size-4 rotate-45 border-2 border-black dark:border-[#edf7ee]" />
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
  if (!renewalDate) return <span className="text-[#9fb49b]">—</span>

  const diff = dayDiff(renewalDate)
  const dueSoon = !isOverdue && diff >= 0 && diff <= dueSoonDays

  if (isOverdue) {
    const overdueDays = Math.abs(diff)
    return (
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 shrink-0 text-red-500" />
        <div className="flex flex-col">
          <span className="font-bold text-red-600 dark:text-red-400">{formatDate(renewalDate)}</span>
          <span className="text-[10px] font-bold text-red-500 dark:text-red-400">
            by {overdueDays} {overdueDays === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
    )
  }

  if (dueSoon) {
    return (
      <div className="flex items-center gap-2">
        <Clock className="size-4 shrink-0 text-yellow-500" />
        <div className="flex flex-col">
          <span className="font-bold text-yellow-600 dark:text-yellow-400">{formatDate(renewalDate)}</span>
          <span className="text-[10px] font-bold text-yellow-500 dark:text-yellow-400">
            in {diff} {diff === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
    )
  }

  return <span className="font-bold text-[#102315] dark:text-[#edf7ee]">{formatDate(renewalDate)}</span>
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
    <div className="flex h-14 min-w-0 items-center overflow-hidden px-2 py-2">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3F6F39] transition hover:text-[#102315] dark:text-[#b6d7a8] dark:hover:text-[#edf7ee]"
      >
        {label}
        {active ? (
          sortOrder === 'asc' ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
        ) : (
          <ArrowUpDown className="size-3.5 opacity-50" />
        )}
      </button>
    </div>
  )
}

function HeaderCell({ children, center }: { children?: React.ReactNode; center?: boolean }) {
  return (
    <div className={cn('flex h-14 min-w-0 items-center overflow-hidden px-2 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#3F6F39] dark:text-[#b6d7a8]', center && 'justify-center')}>
      {children}
    </div>
  )
}

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('min-w-0 overflow-hidden px-2 py-2', className)}>{children}</div>
}

function StateRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-40 items-center justify-center text-[#64745F]', className)}>{children}</div>
}
