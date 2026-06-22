import { cn } from '#/lib/utils'

const DOT_COLORS: Record<string, string> = {
  'In Progress': 'bg-amber-500',
  Live: 'bg-emerald-500',
  'On Hold': 'bg-gray-400',
  Completed: 'bg-blue-500',
  Discontinued: 'bg-gray-400',
  Expired: 'bg-red-500',
  'Transfer Pending': 'bg-orange-500',
  'Not Started': 'bg-gray-400',
  Active: 'bg-emerald-500',
  Paused: 'bg-gray-400',
  'Due Soon': 'bg-amber-500',
  Cancelled: 'bg-gray-400',
  Overdue: 'bg-red-500',
}

const STATUS_PILL_COLORS: Record<string, string> = {
  'In Progress': 'text-amber-700 bg-amber-50',
  Live: 'text-emerald-700 bg-emerald-50',
  'On Hold': 'text-gray-700 bg-gray-100',
  Completed: 'text-blue-700 bg-blue-50',
  Discontinued: 'text-gray-700 bg-gray-100',
  Expired: 'text-red-700 bg-red-50',
  'Transfer Pending': 'text-orange-700 bg-orange-50',
  'Not Started': 'text-gray-700 bg-gray-100',
  Active: 'text-emerald-700 bg-emerald-50',
  Paused: 'text-gray-700 bg-gray-100',
  'Due Soon': 'text-amber-700 bg-amber-50',
  Cancelled: 'text-gray-700 bg-gray-100',
  Overdue: 'text-red-700 bg-red-50',
}

const MAINTENANCE_BADGE_COLORS: Record<string, string> = {
  Standard: 'border-emerald-500 text-emerald-700',
  'Updates Only': 'border-blue-400 text-blue-700',
  None: 'border-gray-300 text-gray-500',
  'Not Started': 'border-gray-300 text-gray-500',
  Active: 'border-emerald-500 text-emerald-700',
  Paused: 'border-gray-300 text-gray-500',
  Expired: 'border-red-400 bg-red-50 text-red-600',
  Cancelled: 'border-gray-300 text-gray-500',
  'Over Due': 'border-red-400 bg-red-50 text-red-600',
  Overdue: 'border-red-400 bg-red-50 text-red-600',
  'Due Soon': 'border-yellow-400 bg-yellow-50 text-yellow-600',
}

export function StatusPill({ label }: { label: string }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        STATUS_PILL_COLORS[label] ?? 'bg-gray-100 text-gray-700',
      )}
    >
      <span className={cn('size-1.5 rounded-full', DOT_COLORS[label] ?? 'bg-gray-400')} />
      {label}
    </span>
  )
}

const MAINTENANCE_DOT: Record<string, string> = {
  'Over Due': 'bg-red-500',
  Overdue: 'bg-red-500',
  Expired: 'bg-red-500',
  'Due Soon': 'bg-yellow-400',
}

export function MaintenanceBadge({ label }: { label: string }) {
  const dot = MAINTENANCE_DOT[label]
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        MAINTENANCE_BADGE_COLORS[label] ?? 'border-gray-300 text-gray-500',
      )}
    >
      {dot ? <span className={cn('size-1.5 shrink-0 rounded-full', dot)} /> : null}
      {label}
    </span>
  )
}
