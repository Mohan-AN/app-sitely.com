import { cn } from '#/lib/utils'
import type { WebsiteStats, WebsitesFilters } from './types'

export type WebsitesTabKey = 'all' | 'inProgress' | 'overdue' | 'dueSoon'

export const TAB_FILTERS: Record<WebsitesTabKey, Partial<WebsitesFilters>> = {
  all: {},
  inProgress: { websiteStatus: 'In Progress' },
  overdue: { maintenanceStatus: 'Expired' },
  dueSoon: { maintenanceStatus: 'Due Soon' },
}

interface WebsitesTabsProps {
  active: WebsitesTabKey
  stats: WebsiteStats | undefined
  onChange: (tab: WebsitesTabKey, filters: Partial<WebsitesFilters>) => void
}

export function WebsitesTabs({ active, stats, onChange }: WebsitesTabsProps) {
  const tabs: Array<{ key: WebsitesTabKey; label: string; count: number | undefined; dot?: string }> = [
    { key: 'all',        label: 'All',         count: stats?.websites },
    { key: 'inProgress', label: 'In Progress', count: stats?.inProgress, dot: 'bg-amber-400' },
    { key: 'overdue',    label: 'Overdue',     count: stats?.expired,    dot: 'bg-red-500' },
    { key: 'dueSoon',    label: 'Due Soon',    count: stats?.dueSoon,    dot: 'bg-yellow-400' },
  ]

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key, TAB_FILTERS[tab.key])}
            className={cn(
              'flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-sm font-semibold text-[#334155] transition hover:bg-[#eef7ed] hover:text-[#08712f] dark:text-[#d6e8cf] dark:hover:bg-[#203423]',
              isActive && 'bg-[#e8f6eb] text-[#08712f] dark:bg-[#203423] dark:text-[#b6d7a8]',
            )}
          >
            {tab.dot ? <span className={cn('size-2 rounded-full', tab.dot)} /> : null}
            {tab.label}
            <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', isActive ? 'bg-[#ccefd8] text-[#08712f]' : 'bg-slate-100 text-slate-600 dark:bg-[#26342a] dark:text-[#d6e8cf]')}>
              {tab.count ?? '-'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
