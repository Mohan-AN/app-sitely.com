import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react'
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

const gridClass = 'grid grid-cols-[1.2fr_1.9fr_1fr_1.2fr_1fr_0.6fr_0.8fr_1fr_0.5fr]'

const SORTABLE: Record<string, string> = {
  Company:  'company',
  Address:  'city',
  Websites: 'website_count',
  Status:   'is_active',
  Created:  'created_at',
}

export function ClientsTable({ clients, isLoading, isError, error, sortBy, sortOrder, onSortChange, onEdit }: ClientsTableProps) {
  const sorted = clients
    ? [...clients].sort((a, b) => {
        if (a.is_active === b.is_active) return 0
        return a.is_active ? -1 : 1
      })
    : undefined

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className={cn(gridClass, 'shrink-0 border-b border-[#E5E7EB] bg-[#FAFBFC] dark:border-[#1e2244] dark:bg-[#131624]')}>
        <HeaderCell>Name</HeaderCell>
        <HeaderCell>Email</HeaderCell>
        <HeaderCell>Phone</HeaderCell>
        {Object.keys(SORTABLE).map((label) => (
          <SortableHeaderCell
            key={label}
            label={label}
            field={SORTABLE[label]!}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={onSortChange}
          />
        ))}
        <HeaderCell className="justify-end">Actions</HeaderCell>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {isLoading ? (
          <StateRow>Loading...</StateRow>
        ) : isError ? (
          <StateRow className="text-[#DC2626]">{error?.message ?? 'Something went wrong.'}</StateRow>
        ) : !sorted || sorted.length === 0 ? (
          <NoResults message="No clients found." />
        ) : (
          sorted.map((client) => (
            <div
              key={client.id}
              className={cn(
                gridClass,
                'min-h-[54px] items-center border-b border-[#EEF0F2] text-[13px] transition-colors dark:border-[#252847]',
                client.is_active
                  ? 'hover:bg-[#F7F8FA] dark:hover:bg-[#131624]'
                  : 'opacity-60 hover:opacity-80',
              )}
            >
              <Cell className="font-semibold text-[#11141A] dark:text-[#E5E7EB]">{client.name}</Cell>
              <Cell className="overflow-hidden text-[#5C6270] dark:text-[#9CA3AF]">
                {client.email
                  ? <a href={`mailto:${client.email}`} className="block truncate hover:text-[#4F5DF5] hover:underline">{client.email}</a>
                  : '—'}
              </Cell>
              <Cell className="text-[#5C6270] dark:text-[#9CA3AF]">
                {client.phone
                  ? <a href={`tel:${client.phone}`} className="hover:text-[#4F5DF5] hover:underline">{client.phone}</a>
                  : '—'}
              </Cell>
              <Cell className="text-[#5C6270] dark:text-[#9CA3AF]">{client.company ?? '—'}</Cell>
              <Cell className="text-[#5C6270] dark:text-[#9CA3AF]">{client.city ?? '—'}</Cell>
              <Cell className="font-semibold text-[#11141A] dark:text-[#E5E7EB]">{client.website_count}</Cell>
              <Cell>
                <span
                  className={cn(
                    'inline-flex items-center rounded-[7px] px-[11px] py-[4px] text-[11px] font-bold uppercase tracking-[.02em]',
                    client.is_active
                      ? 'bg-[#ECFDF5] text-[#059669] dark:bg-[#064E3B] dark:text-[#34D399]'
                      : 'bg-[#F3F4F6] text-[#6B7280] dark:bg-[#1F2937] dark:text-[#9CA3AF]',
                  )}
                >
                  {client.is_active ? 'Active' : 'Inactive'}
                </span>
              </Cell>
              <Cell className="text-[#5C6270] dark:text-[#9CA3AF]">{formatDate(client.created_at)}</Cell>
              <Cell className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <button
                      type="button"
                      className="flex size-7 items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] dark:hover:bg-[#1c2045]"
                      aria-label="Open actions"
                    />
                  }>
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0_10px_30px_rgba(17,20,26,.12)] dark:border-[#1e2244] dark:bg-[#181b2d]">
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7] dark:text-[#E5E7EB] dark:focus:bg-[#1c2045]"
                      render={<Link to="/clients/$clientId" params={{ clientId: String(client.id) }} />}
                    >
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7] dark:text-[#E5E7EB] dark:focus:bg-[#1c2045]"
                      onClick={() => onEdit?.(client)}
                    >
                      Edit client
                    </DropdownMenuItem>
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
    <div className={cn('flex h-12 items-center px-3 py-2', className)}>
      <button
        type="button"
        onClick={() => onSort?.(field)}
        className={cn(
          'inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[.03em] transition',
          active ? 'text-[#4F5DF5]' : 'text-[#8A8F98] hover:text-[#3D4250] dark:hover:text-[#E5E7EB]',
        )}
      >
        {label}
        {active ? (
          sortOrder === 'asc' ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
        ) : (
          <ArrowUpDown className="size-3 opacity-40" />
        )}
      </button>
    </div>
  )
}

function HeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-12 min-w-0 items-center overflow-hidden px-3 py-2 text-[11px] font-semibold uppercase tracking-[.03em] text-[#8A8F98]', className)}>{children}</div>
}

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('min-w-0 px-3 py-2', className)}>{children}</div>
}

function StateRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex h-40 items-center justify-center text-[13px] text-[#8A8F98]', className)}>{children}</div>
}
