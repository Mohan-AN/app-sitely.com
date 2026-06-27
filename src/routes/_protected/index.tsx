import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { cn, toPositiveInt } from '#/lib/utils'
import { formatCurrency } from '#/lib/format'
import { useDebounce } from '#/hooks/use-debounce'
import { WebsitesFiltersBar } from '#/components/websites/websites-filters'
import { WebsitesTable } from '#/components/websites/websites-table'
import { WebsitesTabs, TAB_FILTERS, type WebsitesTabKey } from '#/components/websites/websites-tabs'
import { useWebsites, useWebsiteStats, useClientOptions, useDeleteWebsite } from '#/hooks/use-websites'
import { useSettings } from '#/hooks/use-settings'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { RecordPaymentDialog } from '#/components/websites/record-payment-dialog'
import { AddRequestDialog } from '#/components/websites/add-request-dialog'
import type { WebsitesFilters, WebsiteStats, Website } from '#/components/websites/types'

type WebsitesSearch = WebsitesFilters & {
  tab?: WebsitesTabKey
  page: number
  limit: number
  showFilters: boolean
}

const FILTER_KEYS: Array<keyof WebsitesFilters> = [
  'clientId',
  'websiteStatus',
  'maintenanceStatus',
  'platform',
  'siteType',
  'overdueOnly',
  'maintenanceOverdueOnly',
  'domainOverdueOnly',
  'domainNotSetUp',
  'sortBy',
  'sortOrder',
]

export const Route = createFileRoute('/_protected/')({
  validateSearch: (search: Record<string, unknown>): WebsitesSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    clientId: typeof search.clientId === 'string' ? search.clientId : undefined,
    websiteStatus: typeof search.websiteStatus === 'string' ? search.websiteStatus : undefined,
    maintenanceStatus: typeof search.maintenanceStatus === 'string' ? search.maintenanceStatus : undefined,
    platform: typeof search.platform === 'string' ? search.platform : undefined,
    siteType: typeof search.siteType === 'string' ? search.siteType : undefined,
    overdueOnly: search.overdueOnly === true || search.overdueOnly === 'true' ? true : undefined,
    maintenanceOverdueOnly: search.maintenanceOverdueOnly === true || search.maintenanceOverdueOnly === 'true' ? true : undefined,
    domainOverdueOnly: search.domainOverdueOnly === true || search.domainOverdueOnly === 'true' ? true : undefined,
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
    sortOrder: search.sortOrder === 'asc' || search.sortOrder === 'desc' ? search.sortOrder : undefined,
    tab: isWebsiteTab(search.tab) ? search.tab : 'all',
    page: toPositiveInt(search.page, 1),
    limit: toPositiveInt(search.limit, 15),
    showFilters: search.showFilters === true || search.showFilters === 'true',
  }),
  component: WebsitesPage,
})

function isWebsiteTab(value: unknown): value is WebsitesTabKey {
  return value === 'all' || value === 'inProgress' || value === 'dueSoon'
}

function pickFilters(search: WebsitesSearch): WebsitesFilters {
  const tabFilters = TAB_FILTERS[search.tab ?? 'all']
  return {
    search: search.search,
    clientId: search.clientId,
    websiteStatus: tabFilters.websiteStatus ?? search.websiteStatus,
    maintenanceStatus: tabFilters.maintenanceStatus ?? search.maintenanceStatus,
    platform: search.platform,
    siteType: search.siteType,
    overdueOnly: search.overdueOnly,
    maintenanceOverdueOnly: tabFilters.maintenanceOverdueOnly ?? search.maintenanceOverdueOnly,
    domainOverdueOnly: tabFilters.domainOverdueOnly ?? search.domainOverdueOnly,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
  }
}

function clearFilterFields(): Partial<WebsitesSearch> {
  return Object.fromEntries(FILTER_KEYS.map((key) => [key, undefined])) as Partial<WebsitesSearch>
}

function WebsitesPage() {
  const routeSearch = Route.useSearch()
  const navigate = Route.useNavigate()
  const filters = pickFilters(routeSearch)
  const [searchQuery, setSearchQuery] = useState(routeSearch.search ?? '')
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Global payment dialog state
  const [paymentSite, setPaymentSite] = useState<Website | null>(null)
  const [requestSite, setRequestSite] = useState<Website | null>(null)
  const [sitePickerMode, setSitePickerMode] = useState<'payment' | 'request' | null>(null)

  useEffect(() => {
    setSearchQuery(routeSearch.search ?? '')
  }, [routeSearch.search])

  useEffect(() => {
    if (debouncedSearch === (routeSearch.search ?? '')) return
    navigate({
      search: (old) => ({ ...old, search: debouncedSearch || undefined, page: 1 }),
      replace: true,
    })
  }, [debouncedSearch, navigate, routeSearch.search])

  const statsQuery = useWebsiteStats()
  const clientsQuery = useClientOptions()
  const settingsQuery = useSettings()
  const dueSoonDays = settingsQuery.data ? parseInt(settingsQuery.data.renewal_window_days, 10) : 30
  const websitesQuery = useWebsites(filters, routeSearch.page, routeSearch.limit)
  const allSitesQuery = useWebsites({}, 1, 100)
  const [deleteTarget, setDeleteTarget] = useState<Website | null>(null)
  const deleteMutation = useDeleteWebsite(deleteTarget ? String(deleteTarget.id) : '')

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(undefined, { onSuccess: () => setDeleteTarget(null) })
  }

  const pagination = websitesQuery.data?.pagination

  const updateSearch = (next: Partial<WebsitesSearch>) => {
    navigate({ search: (old) => ({ ...old, ...next }) })
  }

  const updateFilters = (nextFilters: WebsitesFilters) => {
    navigate({ search: (old) => ({ ...old, ...clearFilterFields(), ...nextFilters, page: 1 }) })
  }

  const handleTabChange = (nextTab: WebsitesTabKey, tabFilters: Partial<WebsitesFilters>) => {
    navigate({ search: (old) => ({ ...old, ...clearFilterFields(), search: old.search, tab: nextTab, ...tabFilters, page: 1 }) })
  }

  const handleSortChange = (sortBy: string) => {
    updateSearch({
      sortBy,
      sortOrder: filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    })
  }

  const allSites = allSitesQuery.data?.items ?? []

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-[14px] overflow-hidden bg-[#F4F5F7] px-[30px] py-[18px]">
      {/* Page bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[19px] font-bold tracking-tight text-[#11141A]">Websites</div>
          <div className="mt-[2px] text-[12px] text-[#9CA3AF]">Every site you manage — sorted by what needs attention first</div>
        </div>
        <div className="flex items-center gap-[10px] flex-wrap">
          <button
            type="button"
            onClick={() => setSitePickerMode('payment')}
            className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]"
          >
            Record Payment
          </button>
          <button
            type="button"
            onClick={() => setSitePickerMode('request')}
            className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]"
          >
            Add Request
          </button>
          <Link
            to="/websites/import"
            className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]"
          >
            Import
          </Link>
          <Link
            to="/websites/new"
            search={{ clientId: undefined }}
            className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]"
          >
            + Add Website
          </Link>
        </div>
      </div>

      {/* Metric cards */}
      <MetricCards stats={statsQuery.data} />

      {/* Table card — flex-1 so it fills remaining height and footer sticks to bottom */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]">
        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#E5E7EB] px-[18px] py-[14px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <WebsitesTabs active={routeSearch.tab ?? 'all'} stats={statsQuery.data} onChange={handleTabChange} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 rounded-[9px] border border-[#E5E7EB] bg-[#F7F8FA] px-3 py-2 min-w-[230px]">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search website, client, domain..."
                className="w-full border-none bg-transparent text-[12.5px] text-[#1F2430] outline-none placeholder:text-[#A8ACB4]"
              />
            </div>
            <button
              type="button"
              onClick={() => updateSearch({ showFilters: !routeSearch.showFilters })}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-[9px] border px-3 text-[12.5px] font-semibold transition',
                routeSearch.showFilters
                  ? 'border-[#D6D9FC] bg-[#EEEFFE] text-[#4F5DF5]'
                  : 'border-[#E5E7EB] bg-white text-[#5C6270] hover:border-[#D6D9FC] hover:text-[#4F5DF5]',
              )}
            >
              Filter
            </button>
          </div>
        </div>

        {routeSearch.showFilters ? (
          <div className="border-b border-[#E5E7EB] px-[18px] py-2">
            <WebsitesFiltersBar filters={filters} onChange={updateFilters} clients={clientsQuery.data?.items ?? []} />
          </div>
        ) : null}

        <WebsitesTable
          websites={websitesQuery.data?.items}
          isLoading={websitesQuery.isLoading}
          isFetching={websitesQuery.isFetching}
          isError={websitesQuery.isError}
          error={websitesQuery.error as Error | null}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
          pagination={pagination}
          pageSize={routeSearch.limit}
          onPageSizeChange={(limit) => updateSearch({ limit, page: 1 })}
          onPageChange={(page) => updateSearch({ page })}
          onDelete={(site) => setDeleteTarget(site)}
          dueSoonDays={dueSoonDays}
        />
      </div>

      {/* Global delete confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Delete Website"
        description={`Are you sure you want to delete "${deleteTarget?.project_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />

      {/* Website picker modal (for global payment / request) */}
      {sitePickerMode && !paymentSite && !requestSite ? (
        <WebsitePickerDialog
          mode={sitePickerMode}
          sites={allSites}
          onPick={(site) => {
            setSitePickerMode(null)
            if (sitePickerMode === 'payment') setPaymentSite(site)
            else setRequestSite(site)
          }}
          onClose={() => setSitePickerMode(null)}
        />
      ) : null}

      {/* Global payment dialog */}
      {paymentSite ? (
        <RecordPaymentDialog
          websiteId={String(paymentSite.id)}
          projectName={paymentSite.project_name}
          hostedDate={paymentSite.hosted_date ?? null}
          maintenanceAmount={paymentSite.maintenance_amount}
          open
          onOpenChange={(open) => { if (!open) setPaymentSite(null) }}
        />
      ) : null}

      {/* Global request dialog */}
      {requestSite ? (
        <AddRequestDialog
          websiteId={String(requestSite.id)}
          projectName={requestSite.project_name}
          open
          onOpenChange={(open) => { if (!open) setRequestSite(null) }}
        />
      ) : null}

    </main>
  )
}

// ── Website Picker Dialog ──────────────────────────────────────────────────────

function WebsitePickerDialog({ mode, sites, onPick, onClose }: {
  mode: 'payment' | 'request'
  sites: Website[]
  onPick: (site: Website) => void
  onClose: () => void
}) {
  const [q, setQ] = useState('')
  const filtered = sites.filter((s) =>
    s.project_name.toLowerCase().includes(q.toLowerCase()) ||
    (s.client_name ?? '').toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-[16px] font-bold text-[#11141A]">Select Website</h2>
          <p className="mt-0.5 text-[12px] text-[#8A8F98]">Choose a website to {mode === 'payment' ? 'record payment for' : 'add a request to'}.</p>
        </div>
        <div className="p-4">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search websites..."
            className="mb-3 w-full rounded-[9px] border border-[#E5E7EB] bg-[#F7F8FA] px-3 py-2 text-[12.5px] outline-none focus:border-[#4F5DF5]"
          />
          <div className="max-h-[280px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-[12.5px] text-[#8A8F98]">No websites found.</p>
            ) : (
              filtered.map((site) => (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => onPick(site)}
                  className="flex w-full items-center gap-3 rounded-[9px] px-3 py-2.5 text-left transition hover:bg-[#EEEFFE]"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#EEEFFE]">
                    <span className="text-[11px] font-bold text-[#4F5DF5]">{site.project_name[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-[#11141A]">{site.project_name}</div>
                    <div className="text-[11px] text-[#8A8F98]">{site.client_name}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-end border-t border-[#E5E7EB] px-6 py-3">
          <button type="button" onClick={onClose} className="rounded-[9px] border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-semibold text-[#5C6270] transition hover:bg-[#F4F5F7]">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Metric Cards ──────────────────────────────────────────────────────────────

function MetricCards({ stats }: { stats: WebsiteStats | undefined }) {
  const cards = [
    {
      label: 'Maintenance Overdue',
      value: stats ? String(stats.maintenance_overdue_count) : '—',
      foot: 'Unpaid past due date',
      valueClr: stats && stats.maintenance_overdue_count > 0 ? 'text-[#DC2626]' : 'text-[#11141A]',
    },
    {
      label: 'Domain Overdue',
      value: stats ? String(stats.domain_overdue_count) : '—',
      foot: 'Renewal date passed',
      valueClr: stats && stats.domain_overdue_count > 0 ? 'text-[#DC2626]' : 'text-[#11141A]',
    },
    {
      label: 'Due Soon',
      value: stats ? String(stats.due_soon) : '—',
      foot: 'Within renewal window',
      valueClr: stats && stats.due_soon > 0 ? 'text-[#D97706]' : 'text-[#11141A]',
    },
    {
      label: 'Pending Collection',
      value: stats
        ? (stats.pending_collection_display
            ?? (stats.pending_collection != null ? formatCurrency(stats.pending_collection) : null)
            ?? (stats.pending_collection_amount != null ? formatCurrency(String(stats.pending_collection_amount)) : null)
            ?? '—')
        : '—',
      foot: 'Maintenance only',
      valueClr: 'text-[#11141A]',
    },
    {
      label: 'Live Websites',
      value: stats ? String(stats.live_websites ?? stats.live) : '—',
      foot: 'Active maintenance',
      valueClr: stats && (stats.live_websites ?? stats.live) > 0 ? 'text-[#047857]' : 'text-[#11141A]',
    },
  ]

  return (
    <div className="grid shrink-0 grid-cols-5 gap-2.5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[12px] border border-[#E5E7EB] bg-white px-[14px] py-[10px] shadow-[0_1px_2px_rgba(17,20,26,.04)]">
          <div className="text-[10px] font-semibold uppercase tracking-[.05em] text-[#9CA3AF]">{card.label}</div>
          <div className={cn('mt-[4px] text-[18px] font-bold leading-none tracking-tight', card.valueClr)}>{card.value}</div>
          <div className="mt-[3px] text-[10.5px] text-[#9CA3AF]">{card.foot}</div>
        </div>
      ))}
    </div>
  )
}
