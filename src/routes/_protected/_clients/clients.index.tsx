import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus, Search } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { toPositiveInt } from '#/lib/utils'
import { useDebounce } from '#/hooks/use-debounce'
import { TopBarSlot, TopBarTabsSlot, TopBarActionsSlot } from '#/components/layout/top-bar-slot'
import { ClientsTable } from '#/components/clients/clients-table'
import { ClientsTabs, type ClientsTabKey } from '#/components/clients/clients-tabs'
import { AddClientDialog } from '#/components/clients/add-client-dialog'
import { EditClientDialog } from '#/components/clients/edit-client-dialog'
import { useClients, useClientStats } from '#/hooks/use-clients'
import type { Client, ClientsFilters, ClientWithCount } from '#/components/clients/types'

type ClientsSearch = ClientsFilters & {
  tab?: ClientsTabKey
  page: number
  limit: number
}

const TAB_FILTERS: Record<ClientsTabKey, Partial<ClientsFilters>> = {
  all: {},
  active: { isActive: true },
  inactive: { isActive: false },
}

function isClientsTab(value: unknown): value is ClientsTabKey {
  return value === 'all' || value === 'active' || value === 'inactive'
}

export const Route = createFileRoute('/_protected/_clients/clients/')({
  validateSearch: (search: Record<string, unknown>): ClientsSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
    sortOrder: search.sortOrder === 'asc' || search.sortOrder === 'desc' ? search.sortOrder : undefined,
    tab: isClientsTab(search.tab) ? search.tab : 'all',
    page: toPositiveInt(search.page, 1),
    limit: toPositiveInt(search.limit, 20),
  }),
  component: ClientsPage,
})

function ClientsPage() {
  const routeSearch = Route.useSearch()
  const navigate = Route.useNavigate()
  const globalNavigate = useNavigate()
  const tab = routeSearch.tab ?? 'all'
  const filters: ClientsFilters = {
    search: routeSearch.search,
    ...TAB_FILTERS[tab],
    sortBy: routeSearch.sortBy,
    sortOrder: routeSearch.sortOrder,
  }
  const [searchQuery, setSearchQuery] = useState(routeSearch.search ?? '')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ClientWithCount | null>(null)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const isMounted = useRef(false)
  const clientsQuery = useClients(filters, routeSearch.page, routeSearch.limit, { keepPrevious: true })
  const stats = useClientStats()
  const pagination = clientsQuery.data?.pagination

  const handleClientCreated = (client: Client) => {
    globalNavigate({ to: '/clients/$clientId', params: { clientId: client.clientId } })
  }

  useEffect(() => {
    setSearchQuery(routeSearch.search ?? '')
  }, [routeSearch.search])

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

  const updateSearch = (next: Partial<ClientsSearch>) => {
    navigate({ search: (old) => ({ ...old, ...next }) })
  }

  const handleTabChange = (nextTab: ClientsTabKey) => {
    navigate({
      search: (old) => ({ ...old, tab: nextTab, page: 1 }),
    })
  }

  const handleSortChange = (col: string) => {
    updateSearch({
      sortBy: col,
      sortOrder: routeSearch.sortBy === col && routeSearch.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    })
  }

  return (
    <>
      <TopBarSlot routeKey="/clients">
        <div className="min-w-0">
          <h1 className="text-[24px] font-semibold leading-none text-[#111827] dark:text-[#edf2ff]">Clients</h1>
          <p className="mt-1.5 text-[14px] text-[#475467] dark:text-[#a6b2cf]">Manage and monitor all your clients in one place.</p>
        </div>
      </TopBarSlot>

      <TopBarActionsSlot routeKey="/clients">
        <Button
          className="h-9 rounded-xl bg-[#5b38f6] px-3.5 text-[13px] font-medium text-white shadow-[0_14px_24px_rgba(91,56,246,0.22)] hover:bg-[#4e30e0] xl:h-10 xl:px-4 xl:text-[14px]"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="size-4" />
          Add Client
        </Button>
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="h-9 w-[170px] rounded-xl border border-[#e5e7ef] bg-[#f8fafc] pl-10 pr-4 text-[13px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#c7bdfd] dark:border-[#2a2a3a] dark:bg-[#1a1a2e] dark:text-white xl:h-10 xl:w-[220px] xl:text-[14px]"
          />
        </div>
      </TopBarActionsSlot>

      <TopBarTabsSlot routeKey="/clients">
        <ClientsTabs
          active={tab}
          stats={stats}
          onChange={handleTabChange}
          onRefresh={() => {
            clientsQuery.refetch()
            stats.refetch()
          }}
        />
      </TopBarTabsSlot>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fafbfd] px-3 pb-3 pt-3 lg:px-5 xl:px-6">
        <div className="flex min-h-0 flex-1 flex-col">
          <ClientsTable
            clients={clientsQuery.data?.items}
            isLoading={clientsQuery.isLoading}
            isError={clientsQuery.isError}
            error={clientsQuery.error as Error | null}
            sortBy={routeSearch.sortBy}
            sortOrder={routeSearch.sortOrder}
            onSortChange={handleSortChange}
            onEdit={setEditTarget}
            pagination={pagination}
            onPageChange={(page) => updateSearch({ page })}
            onPageSizeChange={(limit) => updateSearch({ limit, page: 1 })}
          />
        </div>
      </main>

      <AddClientDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onCreated={handleClientCreated}
      />

      <EditClientDialog
        open={editTarget !== null}
        onOpenChange={(open) => { if (!open) setEditTarget(null) }}
        client={editTarget}
      />
    </>
  )
}
