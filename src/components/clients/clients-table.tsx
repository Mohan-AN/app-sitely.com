import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { NoResults } from '#/components/ui/no-results'
import { PageSizeSelector } from '#/components/ui/page-size-selector'
import { cn } from '#/lib/utils'
import type { ClientWithCount } from './types'

interface ClientsTableProps {
  clients: ClientWithCount[] | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (col: string) => void
  onEdit?: (client: ClientWithCount) => void
  pagination?: { page: number; limit: number; total: number; totalPages: number }
  onPageChange?: (page: number) => void
  onPageSizeChange?: (limit: number) => void
}

const gridClass = 'grid grid-cols-[1.35fr_1.25fr_1.1fr_1.6fr_1fr_0.85fr_0.75fr_0.6fr]'

// Columns that support sorting (by their API field name)
const SORTABLE: Record<string, string> = {
  Company:  'company',
  Phone:    'phone',
  Email:    'email',
  City:     'city',
  Status:   'isActive',
  Websites: 'websiteCount',
}

export function ClientsTable({ clients, isLoading, isError, error, sortBy, sortOrder, onSortChange, onEdit, pagination, onPageChange, onPageSizeChange }: ClientsTableProps) {
  const sorted = clients
    ? [...clients].sort((a, b) => {
        if (a.isActive === b.isActive) return 0
        return a.isActive ? -1 : 1
      })
    : undefined

  const pageNumbers = useMemo(
    () => (pagination ? Array.from({ length: pagination.totalPages }, (_, i) => i + 1) : []),
    [pagination],
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-[#e7ebf3] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)] dark:border-[#25304a] dark:bg-[#111827]">
      {/* Header */}
      <div className={cn(gridClass, 'shrink-0 border-b border-[#dce3ef] bg-[#f8fafc] px-1 dark:border-[#25304a] dark:bg-[#111827]')}>
        <HeaderCell>Client Name</HeaderCell>
        {Object.keys(SORTABLE).map((label) => (
          <SortableHeaderCell
            key={label}
            label={label}
            field={SORTABLE[label]}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSortChange}
            className={label === 'Actions' ? 'justify-end' : undefined}
          />
        ))}
        <HeaderCell className="justify-end">Actions</HeaderCell>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {isLoading ? (
          <StateRow>Loading...</StateRow>
        ) : isError ? (
          <StateRow className="text-destructive">{error?.message ?? 'Something went wrong.'}</StateRow>
        ) : !sorted || sorted.length === 0 ? (
          <NoResults message="No clients found." />
        ) : (
          sorted.map((client, index) => (
            <div
              key={client.clientId}
              className={cn(
                'grid grid-cols-[1.35fr_1.25fr_1.1fr_1.6fr_1fr_0.85fr_0.75fr_0.6fr] items-center border-b border-[#dce3ef] text-[13px] last:border-b-0 dark:border-[#25304a]',
                client.isActive
                  ? 'hover:bg-[#fbfcff] dark:hover:bg-[#172033]'
                  : 'opacity-60 hover:opacity-80',
                index % 2 === 1 && 'bg-white dark:bg-[#111827]',
              )}
            >
              <Cell>
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1edff] text-[10px] font-bold text-[#4f2df5]">
                    {client.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-[#0b1020] dark:text-[#edf2ff]">{client.name}</div>
                    <div className="truncate text-[11px] text-[#667085] dark:text-[#a6b2cf]">{client.email ?? '-'}</div>
                  </div>
                </div>
              </Cell>
              <Cell className="text-[13px] text-[#334155] dark:text-[#a6b2cf]">{client.company ?? '-'}</Cell>
              <Cell className="text-[13px] text-[#334155] dark:text-[#a6b2cf]">{client.phone ?? '-'}</Cell>
              <Cell className="text-[13px] text-[#4f2df5] dark:text-[#a78bfa]">{client.email ?? '-'}</Cell>
              <Cell className="text-[13px] text-[#334155] dark:text-[#a6b2cf]">{client.city ?? '-'}</Cell>
              <Cell>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-[12px] font-semibold',
                    client.isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
                  )}
                >
                  <span className={cn('size-1.5 rounded-full', client.isActive ? 'bg-emerald-500' : 'bg-red-500')} />
                  {client.isActive ? 'Active' : 'Inactive'}
                </span>
              </Cell>
              <Cell className="text-[13px] font-semibold text-[#334155] dark:text-[#edf2ff]">{client.websiteCount}</Cell>
              <Cell className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Open actions" className="text-[#172554]" />}>
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border border-[#dce3ef] bg-white dark:border-[#25304a] dark:bg-[#111827]">
                    <DropdownMenuItem render={<Link to="/clients/$clientId" params={{ clientId: client.clientId }} />}>View details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(client)}>Edit client</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Cell>
            </div>
          ))
        )}
      </div>

      {pagination ? (
        <footer className="sticky bottom-0 z-10 flex shrink-0 items-center justify-between border-t border-[#edf1f7] bg-white px-4 py-2.5 shadow-[0_-8px_24px_rgba(15,23,42,0.03)] dark:border-[#25304a] dark:bg-[#111827]">
          <PageSizeSelector
            value={pagination.limit}
            onChange={(limit) => onPageSizeChange?.(limit)}
            total={pagination.total}
            page={pagination.page}
            limit={pagination.limit}
            className="justify-start"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg" className="h-9 rounded-xl px-3 text-[13px]" disabled={pagination.page <= 1} onClick={() => onPageChange?.(pagination.page - 1)}>
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            {pageNumbers.map((p) => (
              <Button
                key={p}
                variant={p === pagination.page ? 'default' : 'outline'}
                size="icon-lg"
                className={cn(
                  'size-9 rounded-xl border-[#e5e7ef] text-[13px] shadow-none',
                  p === pagination.page
                    ? 'bg-[#ede9fe] text-[#5b38f6] hover:bg-[#e4ddff]'
                    : 'bg-white text-[#334155] hover:text-[#5b38f6] dark:bg-transparent dark:text-[#a6b2cf]',
                )}
                onClick={() => onPageChange?.(p)}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="lg" className="h-9 rounded-xl px-3 text-[13px]" disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange?.(pagination.page + 1)}>
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </footer>
      ) : null}
    </div>
  )
}

function SortableHeaderCell({
  label,
  field,
  sortBy,
  sortOrder,
  onSort,
  className,
}: {
  label: string
  field: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (field: string) => void
  className?: string
}) {
  const active = sortBy === field
  return (
    <div className={cn('flex h-13 items-center px-2 py-2', className)}>
      <button
        type="button"
        onClick={() => onSort?.(field)}
        className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#344054] transition hover:text-[#5b38f6] dark:text-[#a6b2cf] dark:hover:text-[#edf2ff] xl:text-[12px]"
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

function HeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-13 min-w-0 items-center overflow-hidden px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#344054] dark:text-[#a6b2cf] xl:text-[12px]', className)}>{children}</div>
}

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('min-w-0 px-2 py-2', className)}>{children}</div>
}

function StateRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-40 items-center justify-center text-[#253858]', className)}>{children}</div>
}
