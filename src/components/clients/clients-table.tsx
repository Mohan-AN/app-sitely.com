import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { NoResults } from '#/components/ui/no-results'
import { formatDate } from '#/lib/format'
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
}

const gridClass = 'grid grid-cols-[0.85fr_1.2fr_1.3fr_1fr_0.8fr_0.8fr_1fr_0.7fr]'

// Columns that support sorting (by their API field name)
const SORTABLE: Record<string, string> = {
  Company:  'company',
  City:     'city',
  Websites: 'websiteCount',
  Status:   'isActive',
  Created:  'createdAt',
}

export function ClientsTable({ clients, isLoading, isError, error, sortBy, sortOrder, onSortChange, onEdit }: ClientsTableProps) {
  // Always render active clients first, inactive at bottom (client-side within current page)
  const sorted = clients
    ? [...clients].sort((a, b) => {
        if (a.isActive === b.isActive) return 0
        return a.isActive ? -1 : 1
      })
    : undefined

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#c7ddb5] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
      {/* Header */}
      <div className={cn(gridClass, 'shrink-0 border-b border-[#c7ddb5] bg-[#ddead1] dark:border-[#2f4a32] dark:bg-[#203423]')}>
        <HeaderCell>Client ID</HeaderCell>
        <HeaderCell>Name</HeaderCell>
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
                'grid min-h-[54px] grid-cols-[0.85fr_1.2fr_1.3fr_1fr_0.8fr_0.8fr_1fr_0.7fr] items-center border-b border-[#c7ddb5]/40 text-[13px] dark:border-[#2f4a32]/70',
                client.isActive
                  ? 'hover:bg-[#ddead1]/30 dark:hover:bg-[#203423]/70'
                  : 'opacity-60 hover:opacity-80',
                index % 2 === 1 && 'bg-[#ddead1]/20 dark:bg-[#17251b]',
              )}
            >
              <Cell className="font-bold text-[#102315] dark:text-[#edf7ee]">{client.clientId}</Cell>
              <Cell className="font-bold text-[#102315] dark:text-[#edf7ee]">{client.name}</Cell>
              <Cell className="font-medium text-[#64745F] dark:text-[#b7c8b3]">{client.company ?? '-'}</Cell>
              <Cell className="font-medium text-[#64745F] dark:text-[#b7c8b3]">{client.city ?? '-'}</Cell>
              <Cell className="font-bold text-[#102315] dark:text-[#edf7ee]">{client.websiteCount}</Cell>
              <Cell>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-bold',
                    client.isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400',
                  )}
                >
                  {client.isActive ? 'Active' : 'Inactive'}
                </span>
              </Cell>
              <Cell className="font-medium text-[#64745F] dark:text-[#b7c8b3]">{formatDate(client.createdAt)}</Cell>
              <Cell className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" aria-label="Open actions" className="border-[#c7ddb5] dark:border-[#2f4a32]" />}>
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border border-[#c7ddb5] bg-white dark:border-[#2f4a32] dark:bg-[#132018]">
                    <DropdownMenuItem render={<Link to="/clients/$clientId" params={{ clientId: client.clientId }} />}>View details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(client)}>Edit client</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Cell>
            </div>
          ))
        )}
      </div>
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
    <div className={cn('flex h-14 items-center px-3 py-2', className)}>
      <button
        type="button"
        onClick={() => onSort?.(field)}
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

function HeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-14 min-w-0 items-center overflow-hidden px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#3F6F39] dark:text-[#b6d7a8]', className)}>{children}</div>
}

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('min-w-0 px-3 py-2', className)}>{children}</div>
}

function StateRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-40 items-center justify-center text-[#64745F]', className)}>{children}</div>
}
