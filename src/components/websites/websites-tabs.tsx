import { cn } from '#/lib/utils'
import type { WebsiteStats, WebsitesFilters } from './types'

export type WebsitesTabKey = 'all' | 'inProgress' | 'maintenanceOverdue' | 'domainOverdue' | 'dueSoon'

export const TAB_FILTERS: Record<WebsitesTabKey, Partial<WebsitesFilters>> = {
  all:                {},
  inProgress:         { websiteStatus: 'In Progress' },
  maintenanceOverdue: { maintenanceOverdueOnly: true },
  domainOverdue:      { domainOverdueOnly: true },
  dueSoon:            { maintenanceStatus: 'Due Soon' },
}

interface WebsitesTabsProps {
  active: WebsitesTabKey
  stats: WebsiteStats | undefined
  onChange: (tab: WebsitesTabKey, filters: Partial<WebsitesFilters>) => void
}

interface TabDef {
  key: WebsitesTabKey
  label: string
  count: number | undefined
  color?: 'red' | 'amber'
}

export function WebsitesTabs({ active, stats, onChange }: WebsitesTabsProps) {
  const tabs: TabDef[] = [
    { key: 'all',                label: 'All',                 count: stats?.websites },
    { key: 'inProgress',         label: 'In Progress',         count: stats?.in_progress,            color: 'amber' },
    { key: 'maintenanceOverdue', label: 'Maintenance Overdue', count: stats?.maintenance_overdue_count, color: 'red' },
    { key: 'domainOverdue',      label: 'Domain Overdue',      count: stats?.domain_overdue_count,     color: 'red' },
    { key: 'dueSoon',            label: 'Due Soon',            count: stats?.due_soon,                color: 'amber' },
  ]

  return (
    <div className="flex items-center gap-0.5">
      {tabs.map((tab) => {
        const isActive = active === tab.key
        const isRed = tab.color === 'red'
        const isAmber = tab.color === 'amber'

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key, TAB_FILTERS[tab.key])}
            className={cn(
              'flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[12.5px] font-medium transition-all border border-transparent',
              'text-[#8A8F98] hover:bg-[#F4F5F7] hover:text-[#1F2430]',
              'dark:text-[#6B7280] dark:hover:bg-[#1c2045] dark:hover:text-[#E5E7EB]',
              isActive && !isRed && !isAmber && 'bg-[#EEEFFE] text-[#4F5DF5] font-bold hover:bg-[#EEEFFE] hover:text-[#4F5DF5] dark:bg-[#1c2045] dark:text-[#818CF8]',
              isActive && isRed   && 'bg-[#FEF2F2] text-[#DC2626] font-bold hover:bg-[#FEF2F2] hover:text-[#DC2626] dark:bg-[#450A0A] dark:text-[#F87171]',
              isActive && isAmber && 'bg-[#FEF3C7] text-[#D97706] font-bold hover:bg-[#FEF3C7] hover:text-[#D97706] dark:bg-[#451A03] dark:text-[#FCD34D]',
            )}
          >
            {tab.label}
            <span className={cn(
              'rounded-full px-1.5 py-0.5 text-[10.5px] font-bold',
              !isActive && 'bg-[#F3F4F6] text-[#6B7280] dark:bg-[#1F2937] dark:text-[#6B7280]',
              isActive && !isRed && !isAmber && 'bg-[#BFDBFE] text-[#3B82F6] dark:bg-[#2e3370] dark:text-[#818CF8]',
              isActive && isRed   && 'bg-[#FECACA] text-[#DC2626] dark:bg-[#7F1D1D] dark:text-[#F87171]',
              isActive && isAmber && 'bg-[#FDE68A] text-[#D97706] dark:bg-[#78350F] dark:text-[#FCD34D]',
            )}>
              {tab.count ?? '—'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
