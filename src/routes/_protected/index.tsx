import { useEffect, useMemo, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { TopBarSlot, TopBarTabsSlot, TopBarActionsSlot } from '#/components/layout/top-bar-slot'
import { WebsitesTable } from '#/components/websites/websites-table'
import { WebsitesTabs, TAB_FILTERS, type WebsitesTabKey } from '#/components/websites/websites-tabs'
import { AddWebsiteDialog } from '#/components/websites/add-website-dialog'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { useDebounce } from '#/hooks/use-debounce'
import { useSettings } from '#/hooks/use-settings'
import { useClientOptions, useDeleteWebsite, useWebsites, useWebsiteStats } from '#/hooks/use-websites'
import { toPositiveInt } from '#/lib/utils'
import type { WebsitesFilters, Website } from '#/components/websites/types'

type WebsitesSearch = WebsitesFilters & {
  tab?: WebsitesTabKey
  page: number
  limit: number
  showFilters: boolean
}

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
  return value === 'all' || value === 'live' || value === 'inProgress' || value === 'overdue' || value === 'dueSoon'
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

function WebsitesPage() {
  const routeSearch = Route.useSearch()
  const navigate = Route.useNavigate()
  const filters = pickFilters(routeSearch)
  const [searchQuery, setSearchQuery] = useState(routeSearch.search ?? '')
  const debouncedSearch = useDebounce(searchQuery, 300)
  const isMounted = useRef(false)

  const statsQuery = useWebsiteStats()
  const settingsQuery = useSettings()
  const clientsQuery = useClientOptions()
  const websitesQuery = useWebsites(filters, routeSearch.page, routeSearch.limit)
  const dueSoonDays = settingsQuery.data ? parseInt(settingsQuery.data.renewal_window_days, 10) : 30
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Website | null>(null)
  const deleteMutation = useDeleteWebsite(deleteTarget?.websiteId ?? '')

  // Sync input when URL search changes externally (e.g. tab change clears search)
  useEffect(() => {
    setSearchQuery(routeSearch.search ?? '')
  }, [routeSearch.search])

  // Navigate on debounced input, skip mount to avoid resetting page on load
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    if (debouncedSearch === (routeSearch.search ?? '')) return
    navigate({
      search: (old) => ({ ...old, search: debouncedSearch || undefined, page: 1 }),
      replace: true,
    })
  }, [debouncedSearch, navigate, routeSearch.search])

  const pagination = websitesQuery.data?.pagination
  const clientOptions = useMemo(
    () => (clientsQuery.data?.items ?? []).map((client) => ({ clientId: client.clientId, name: client.name })),
    [clientsQuery.data],
  )

  const updateSearch = (next: Partial<WebsitesSearch>) => {
    navigate({ search: (old) => ({ ...old, ...next }) })
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(undefined, { onSuccess: () => setDeleteTarget(null) })
  }

  const handleTabChange = (nextTab: WebsitesTabKey, tabFilters: Partial<WebsitesFilters>) => {
    navigate({
      search: (old) => ({
        ...old,
        tab: nextTab,
        websiteStatus: tabFilters.websiteStatus,
        maintenanceStatus: tabFilters.maintenanceStatus,
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
    <>
      <TopBarSlot routeKey="/">
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold leading-none text-[#111827]">Websites</h1>
          <p className="mt-1.5 text-[14px] text-[#475467]">Manage and monitor all your websites in one place.</p>
        </div>
      </TopBarSlot>

      <TopBarActionsSlot routeKey="/">
        <Button
          size="lg"
          className="h-9 rounded-xl bg-[#5b38f6] px-3.5 text-[13px] font-medium text-white shadow-[0_14px_24px_rgba(91,56,246,0.22)] hover:bg-[#4e30e0] xl:h-10 xl:px-4 xl:text-[14px]"
          onClick={() => setAddDialogOpen(true)}
        >
          + Add Website
        </Button>
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search websites..."
            className="h-9 w-[170px] rounded-xl border border-[#e5e7ef] bg-[#f8fafc] pl-10 pr-4 text-[13px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#c7bdfd] dark:border-[#2a2a3a] dark:bg-[#1a1a2e] dark:text-white xl:h-10 xl:w-[220px] xl:text-[14px]"
          />
        </div>
      </TopBarActionsSlot>

      <TopBarTabsSlot routeKey="/">
        <WebsitesTabs
          active={routeSearch.tab ?? 'all'}
          stats={statsQuery.data}
          onChange={handleTabChange}
          onRefresh={() => {
            websitesQuery.refetch()
            statsQuery.refetch()
          }}
        />
      </TopBarTabsSlot>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fafbfd] px-3 pb-3 pt-3 lg:px-5 xl:px-6">
        <div className="flex min-h-0 flex-1 flex-col">
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
        </div>

        <ConfirmDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null)
          }}
          title="Delete Website"
          description={`Are you sure you want to delete "${deleteTarget?.projectName}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          isPending={deleteMutation.isPending}
        />
      </main>

      <AddWebsiteDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onCreated={() => websitesQuery.refetch()}
      />
    </>
  )
}
