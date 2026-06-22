import { cn } from '#/lib/utils'

// Colors extracted from design spec
const STATUS_CFG: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  Live:               { bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]', text: 'text-[#059669]', dot: 'bg-[#10B981]' },
  Active:             { bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]', text: 'text-[#059669]', dot: 'bg-[#10B981]' },
  Overdue:            { bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', text: 'text-[#DC2626]', dot: 'bg-[#EF4444]' },
  'Maintenance Overdue': { bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', text: 'text-[#DC2626]', dot: 'bg-[#EF4444]' },
  'In Progress':      { bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]', text: 'text-[#D97706]', dot: 'bg-[#F59E0B]' },
  'Due Soon':         { bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]', text: 'text-[#D97706]', dot: 'bg-[#F59E0B]' },
  Completed:          { bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', text: 'text-[#3B82F6]', dot: 'bg-[#3B82F6]' },
  'Transfer Pending': { bg: 'bg-[#F3E8FF]', border: 'border-[#DDD6FE]', text: 'text-[#8B5CF6]', dot: 'bg-[#8B5CF6]' },
  'On Hold':          { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', dot: 'bg-[#9CA3AF]' },
  Paused:             { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', dot: 'bg-[#9CA3AF]' },
  Discontinued:       { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', dot: 'bg-[#9CA3AF]' },
  'Not Started':      { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', dot: 'bg-[#9CA3AF]' },
  Cancelled:          { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', dot: 'bg-[#9CA3AF]' },
  Expired:            { bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', text: 'text-[#DC2626]', dot: 'bg-[#EF4444]' },
}

const DEFAULT_CFG = { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', dot: 'bg-[#9CA3AF]' }

export function StatusPill({ label }: { label: string }) {
  const cfg = STATUS_CFG[label] ?? DEFAULT_CFG
  return (
    <span className={cn(
      'inline-flex w-fit items-center gap-1.5 rounded-[6px] border px-[12px] py-[4px] text-[11.5px] font-medium tracking-[.01em] whitespace-nowrap',
      cfg.bg, cfg.border, cfg.text,
    )}>
      <span className={cn('size-[6px] rounded-full', cfg.dot)} />
      {label}
    </span>
  )
}

export function MaintenanceBadge({ label }: { label: string }) {
  const cfg = STATUS_CFG[label] ?? DEFAULT_CFG
  return (
    <span className={cn(
      'inline-flex w-fit items-center gap-1.5 rounded-[6px] border px-[12px] py-[4px] text-[11.5px] font-medium tracking-[.01em] whitespace-nowrap',
      cfg.bg, cfg.border, cfg.text,
    )}>
      <span className={cn('size-[6px] rounded-full', cfg.dot)} />
      {label}
    </span>
  )
}
