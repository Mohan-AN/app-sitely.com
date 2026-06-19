import { cn } from '#/lib/utils'

const STATUS_PILL_COLORS: Record<string, string> = {
  'In Progress': 'text-orange-600 bg-orange-50',
  Live: 'text-emerald-600 bg-emerald-50',
  'On Hold': 'text-gray-700 bg-gray-100',
  Completed: 'text-blue-700 bg-blue-50',
  Discontinued: 'text-gray-700 bg-gray-100',
  Overdue: 'text-red-700 bg-red-50',
  'Transfer Pending': 'text-orange-700 bg-orange-50',
  'Not Started': 'text-gray-700 bg-gray-100',
  Active: 'text-emerald-700 bg-emerald-50',
  Paused: 'text-gray-700 bg-gray-100',
  'Due Soon': 'text-orange-600 bg-orange-50',
  Cancelled: 'text-gray-700 bg-gray-100',
}

const MAINTENANCE_BADGE_COLORS: Record<string, string> = {
  Standard: 'border-emerald-500 text-emerald-700',
  'Updates Only': 'border-blue-400 text-blue-700',
  None: 'border-gray-300 text-gray-500',
  'Not Started': 'border-gray-300 text-gray-500',
  Active: 'border-emerald-500 text-emerald-700',
  Paused: 'border-gray-300 text-gray-500',
  Cancelled: 'border-gray-300 text-gray-500',
  'Over Due': 'border-transparent bg-red-50 text-red-600',
  Overdue: 'border-transparent bg-red-50 text-red-600',
  'Due Soon': 'border-transparent bg-orange-50 text-orange-600',
  'Up to Date': 'border-transparent bg-emerald-50 text-emerald-600',
}

export function StatusPill({ label }: { label: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
        STATUS_PILL_COLORS[label] ?? 'bg-gray-100 text-gray-700',
      )}
    >
      <span className={cn('size-1.5 rounded-full', label === 'Live' ? 'bg-emerald-500' : label === 'In Progress' ? 'bg-orange-500' : 'bg-slate-400')} />
      {label}
    </span>
  )
}

const MAINTENANCE_DOT: Record<string, string> = {
  'Over Due': 'bg-red-500',
  Overdue: 'bg-red-500',
  'Due Soon': 'bg-amber-400',
  'Up to Date': 'bg-emerald-500',
}

export function MaintenanceBadge({ label }: { label: string }) {
  const dot = MAINTENANCE_DOT[label]
  return (
    <span
      className={cn(
        'inline-flex h-6 w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap',
        MAINTENANCE_BADGE_COLORS[label] ?? 'border-gray-300 text-gray-500',
      )}
    >
      {dot ? <span className={cn('size-1.5 shrink-0 rounded-full', dot)} /> : null}
      {label}
    </span>
  )
}
