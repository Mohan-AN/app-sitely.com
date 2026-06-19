import { AlertTriangle, Clock3, Globe2, RefreshCw } from 'lucide-react'
import { cn } from '#/lib/utils'
import type { WebsiteStats, WebsitesFilters } from './types'

export type WebsitesTabKey = 'all' | 'live' | 'inProgress' | 'overdue' | 'dueSoon'

export const TAB_FILTERS: Record<WebsitesTabKey, Partial<WebsitesFilters>> = {
  all: {},
  live: { websiteStatus: 'Live' },
  inProgress: { websiteStatus: 'In Progress' },
  overdue: { maintenanceStatus: 'Overdue' },
  dueSoon: { maintenanceStatus: 'Due Soon' },
}

interface WebsitesTabsProps {
  active: WebsitesTabKey
  stats: WebsiteStats | undefined
  onChange: (tab: WebsitesTabKey, filters: Partial<WebsitesFilters>) => void
  onRefresh?: () => void
}

function LiveDot({ className }: { className?: string }) {
  return <span className={cn('inline-block size-3 rounded-full bg-[#22c55e]', className)} />
}

export function WebsitesTabs({ active, stats, onChange, onRefresh }: WebsitesTabsProps) {
  const tabs = [
    { key: 'all', label: 'All', count: stats?.websites, icon: Globe2, tone: 'text-[#5b38f6]' },
    { key: 'live', label: 'Live', count: stats?.live, icon: LiveDot, tone: '' },
    { key: 'inProgress', label: 'In Progress', count: stats?.inProgress, icon: Clock3, tone: 'text-[#f97316]' },
    { key: 'overdue', label: 'Overdue', count: stats?.expired, icon: AlertTriangle, tone: 'text-[#ef4444]' },
    { key: 'dueSoon', label: 'Due Soon', count: stats?.dueSoon, icon: RefreshCw, tone: 'text-[#2563eb]' },
  ] as const

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
              onClick={() => onChange(tab.key, TAB_FILTERS[tab.key])}
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
          aria-label="Refresh websites"
          title="Refresh websites"
        >
          <RefreshCw className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
