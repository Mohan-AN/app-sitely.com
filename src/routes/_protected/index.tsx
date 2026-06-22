import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ListFilter, Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { SearchBar } from '#/components/ui/search-bar'
import { cn } from '#/lib/utils'
import { toPositiveInt } from '#/lib/utils'
import { useDebounce } from '#/hooks/use-debounce'
import { TopBarSlot } from '#/components/layout/top-bar-slot'
import { WebsitesFiltersBar } from '#/components/websites/websites-filters'
import { WebsitesTable } from '#/components/websites/websites-table'
import { WebsitesTabs, TAB_FILTERS, type WebsitesTabKey } from '#/components/websites/websites-tabs'
import { useWebsites, useWebsiteStats, useClientOptions, useDeleteWebsite } from '#/hooks/use-websites'
import { useSettings } from '#/hooks/use-settings'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import type { WebsitesFilters, Website } from '#/components/websites/types'

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
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
    sortOrder: search.sortOrder === 'asc' || search.sortOrder === 'desc' ? search.sortOrder : undefined,
    tab: isWebsiteTab(search.tab) ? search.tab : 'all',
    page: toPositiveInt(search.page, 1),
    limit: toPositiveInt(search.limit, 10),
    showFilters: search.showFilters === true || search.showFilters === 'true',
  }),
  component: WebsitesPage,
})

function isWebsiteTab(value: unknown): value is WebsitesTabKey {
  return value === 'all' || value === 'inProgress' || value === 'overdue' || value === 'dueSoon'
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

  useEffect(() => {
    setSearchQuery(routeSearch.search ?? '')
  }, [routeSearch.search])

  useEffect(() => {
    if (debouncedSearch === (routeSearch.search ?? '')) return
    navigate({
      search: (old) => ({
        ...old,
        search: debouncedSearch || undefined,
        page: 1,
      }),
      replace: true,
    })
  }, [debouncedSearch, navigate, routeSearch.search])

  const statsQuery = useWebsiteStats()
  const clientsQuery = useClientOptions()
  const settingsQuery = useSettings()
  const dueSoonDays = settingsQuery.data ? parseInt(settingsQuery.data.renewal_window_days, 10) : 30
  const websitesQuery = useWebsites(filters, routeSearch.page, routeSearch.limit)
  const [deleteTarget, setDeleteTarget] = useState<Website | null>(null)
  const deleteMutation = useDeleteWebsite(deleteTarget?.websiteId ?? '')

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(undefined, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const pagination = websitesQuery.data?.pagination
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'sortBy' && key !== 'sortOrder' && key !== 'search' && value !== undefined && value !== '' && value !== false,
  ).length

  const updateSearch = (next: Partial<WebsitesSearch>) => {
    navigate({ search: (old) => ({ ...old, ...next }) })
  }

  const updateFilters = (nextFilters: WebsitesFilters) => {
    navigate({
      search: (old) => ({
        ...old,
        ...clearFilterFields(),
        ...nextFilters,
        page: 1,
      }),
    })
  }

  const handleTabChange = (nextTab: WebsitesTabKey, tabFilters: Partial<WebsitesFilters>) => {
    navigate({
      search: (old) => ({
        ...old,
        ...clearFilterFields(),
        search: old.search,
        tab: nextTab,
        ...tabFilters,
        page: 1,
      }),
    })
  }

  const handleSortChange = (sortBy: string) => {
    updateSearch({
      sortBy,
      sortOrder: filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    })
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden bg-[#f2f6ee] p-4 dark:bg-[#0b110d]">
      <TopBarSlot routeKey="/">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center gap-4">
            <h1 className="shrink-0 whitespace-nowrap text-[22px] font-extrabold leading-none tracking-normal text-[#102315] dark:text-[#edf7ee]">
              Websites
            </h1>
            <div className="flex flex-1 items-center justify-end gap-2 flex-nowrap">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search websites..." className="w-[200px]" />
              <WebsitesTabs active={routeSearch.tab ?? 'all'} stats={statsQuery.data} onChange={handleTabChange} />
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  'relative h-10 shrink-0 rounded-xl border-[#dde5d8] bg-white px-4 text-[#334155] shadow-sm hover:bg-[#f8faf7] hover:text-[#08712f] dark:border-[#2f4a32] dark:bg-[#132018] dark:text-[#d6e8cf] dark:hover:bg-[#203423]',
                  routeSearch.showFilters && 'bg-[#ddead1]/60 text-[#658354]',
                )}
                onClick={() => updateSearch({ showFilters: !routeSearch.showFilters })}
                aria-label="Toggle filters"
              >
                <ListFilter className="size-4" />
                Filter
                {activeFilterCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#658354] text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </Button>
              <Button className="h-10 shrink-0 rounded-xl bg-[#658354] px-4 font-bold text-white hover:bg-[#4b6043]" render={<Link to="/websites/new" search={{ clientId: undefined }} />}>
                <Plus className="size-4" />
                Add Website
              </Button>
            </div>
          </div>
          {routeSearch.showFilters ? (
            <div className="flex justify-end">
              <WebsitesFiltersBar filters={filters} onChange={updateFilters} clients={clientsQuery.data?.items ?? []} />
            </div>
          ) : null}
        </div>
      </TopBarSlot>

      <WebsitesTable
        websites={websitesQuery.data?.items}
        isLoading={websitesQuery.isLoading}
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

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Delete Website"
        description={`Are you sure you want to delete "${deleteTarget?.projectName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </main>
  )
}
