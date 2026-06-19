import { RefreshCw, Users } from 'lucide-react'
import { cn } from '#/lib/utils'

export type ClientsTabKey = 'all' | 'active' | 'inactive'

export interface ClientsStats {
  all?: number
  active?: number
  inactive?: number
}

interface ClientsTabsProps {
  active: ClientsTabKey
  stats: ClientsStats
  onChange: (tab: ClientsTabKey) => void
  onRefresh?: () => void
}

function ActiveDot({ className }: { className?: string }) {
  return <span className={cn('inline-block size-3 rounded-full bg-[#22c55e]', className)} />
}

function InactiveDot({ className }: { className?: string }) {
  return <span className={cn('inline-block size-3 rounded-full bg-[#94a3b8]', className)} />
}

export function ClientsTabs({ active, stats, onChange, onRefresh }: ClientsTabsProps) {
  const tabs = [
    { key: 'all' as const, label: 'All', count: stats.all, icon: Users, tone: 'text-[#5b38f6]' },
    { key: 'active' as const, label: 'Active', count: stats.active, icon: ActiveDot, tone: '' },
    { key: 'inactive' as const, label: 'Inactive', count: stats.inactive, icon: InactiveDot, tone: '' },
  ]

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="-mb-px flex min-w-0 gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                'flex h-12 shrink-0 items-center gap-2.5 border-b-2 border-transparent px-1 text-[14px] font-medium text-[#1f2937] transition',
                isActive && 'border-[#5b38f6] text-[#5b38f6]',
              )}
            >
              <Icon className={cn('size-4', tab.tone, isActive && tab.key === 'all' && 'text-[#5b38f6]')} />
              <span>{tab.label}</span>
              <span className="rounded-full bg-[#eef2f7] px-2 py-0.5 text-[12px] font-semibold text-[#334155]">
                {tab.count ?? '-'}
              </span>
            </button>
          )
        })}
      </div>

      {onRefresh ? (
        <button
          type="button"
          onClick={onRefresh}
          className="mb-2 flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e7ebf3] bg-white text-[#64748b] transition hover:border-[#d9dfec] hover:text-[#5b38f6]"
          aria-label="Refresh clients"
          title="Refresh clients"
        >
          <RefreshCw className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
