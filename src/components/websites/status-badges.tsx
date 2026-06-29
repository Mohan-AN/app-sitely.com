import { cn } from '#/lib/utils'

// Colors extracted from design spec
const STATUS_CFG: Record<string, { bg: string; border: string; text: string; color: string }> = {
  Live:               { bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]', text: 'text-[#059669]', color: '#10B981' },
  Active:             { bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]', text: 'text-[#059669]', color: '#10B981' },
  Overdue:            { bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', text: 'text-[#DC2626]', color: '#EF4444' },
  'Maintenance Overdue': { bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', text: 'text-[#DC2626]', color: '#EF4444' },
  'In Progress':      { bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]', text: 'text-[#D97706]', color: '#F59E0B' },
  'Due Soon':         { bg: 'bg-[#FEF3C7]', border: 'border-[#FDE68A]', text: 'text-[#D97706]', color: '#F59E0B' },
  Completed:          { bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', text: 'text-[#3B82F6]', color: '#3B82F6' },
  'Transfer Pending': { bg: 'bg-[#F3E8FF]', border: 'border-[#DDD6FE]', text: 'text-[#8B5CF6]', color: '#8B5CF6' },
  'On Hold':          { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', color: '#9CA3AF' },
  Paused:             { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', color: '#9CA3AF' },
  Discontinued:       { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', color: '#9CA3AF' },
  'Not Started':      { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', color: '#9CA3AF' },
  Cancelled:          { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', color: '#9CA3AF' },
  Expired:            { bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', text: 'text-[#DC2626]', color: '#EF4444' },
}

const DEFAULT_CFG = { bg: 'bg-[#F3F4F6]', border: 'border-[#E5E7EB]', text: 'text-[#6B7280]', color: '#9CA3AF' }

function CurveIcon({ color }: { color: string }) {
  return (
    <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M1 6 Q4.5 0.5 8 6"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function StatusPill({ label }: { label: string }) {
  const cfg = STATUS_CFG[label] ?? DEFAULT_CFG
  return (
    <span className={cn(
      'inline-flex w-fit items-center gap-1.5 rounded-full border px-[10px] py-[3px] text-[11.5px] font-medium tracking-[.01em] whitespace-nowrap',
      cfg.bg, cfg.border, cfg.text,
    )}>
      <CurveIcon color={cfg.color} />
      {label}
    </span>
  )
}

export function MaintenanceBadge({ label }: { label: string }) {
  const cfg = STATUS_CFG[label] ?? DEFAULT_CFG
  return (
    <span className={cn(
      'inline-flex w-fit items-center gap-1.5 rounded-full border px-[10px] py-[3px] text-[11.5px] font-medium tracking-[.01em] whitespace-nowrap',
      cfg.bg, cfg.border, cfg.text,
    )}>
      <CurveIcon color={cfg.color} />
      {label}
    </span>
  )
}
