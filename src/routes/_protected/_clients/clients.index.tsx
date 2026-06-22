import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { SearchBar } from '#/components/ui/search-bar'
import { PageSizeSelector } from '#/components/ui/page-size-selector'
import { cn, toPositiveInt } from '#/lib/utils'
import { useDebounce } from '#/hooks/use-debounce'
import { TopBarSlot } from '#/components/layout/top-bar-slot'
import { ClientsTable } from '#/components/clients/clients-table'
import { AddClientDialog } from '#/components/clients/add-client-dialog'
import { EditClientDialog } from '#/components/clients/edit-client-dialog'
import { useClients } from '#/hooks/use-clients'
import type { Client, ClientsFilters, ClientWithCount } from '#/components/clients/types'

type ClientsSearch = ClientsFilters & {
  page: number
  limit: number
}

export const Route = createFileRoute('/_protected/_clients/clients/')({
  validateSearch: (search: Record<string, unknown>): ClientsSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
    sortOrder: search.sortOrder === 'asc' || search.sortOrder === 'desc' ? search.sortOrder : undefined,
    page: toPositiveInt(search.page, 1),
    limit: toPositiveInt(search.limit, 20),
  }),
  component: ClientsPage,
})

function ClientsPage() {
  const routeSearch = Route.useSearch()
  const navigate = Route.useNavigate()
  const globalNavigate = useNavigate()
  const filters: ClientsFilters = { search: routeSearch.search, sortBy: routeSearch.sortBy, sortOrder: routeSearch.sortOrder }
  const [searchQuery, setSearchQuery] = useState(routeSearch.search ?? '')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ClientWithCount | null>(null)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const clientsQuery = useClients(filters, routeSearch.page, routeSearch.limit, { keepPrevious: true })
  const pagination = clientsQuery.data?.pagination

  const handleClientCreated = (client: Client) => {
    globalNavigate({ to: '/clients/$clientId', params: { clientId: client.clientId } })
  }

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

  const updateSearch = (next: Partial<ClientsSearch>) => {
    navigate({ search: (old) => ({ ...old, ...next }) })
  }

  const handleSortChange = (col: string) => {
    updateSearch({
      sortBy: col,
      sortOrder: routeSearch.sortBy === col && routeSearch.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1,
    })
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden bg-[#f2f6ee] p-4 dark:bg-[#0b110d]">
      <TopBarSlot routeKey="/clients">
        <section className="flex min-w-0 flex-wrap items-center justify-end gap-2">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by name or company..." className="w-[300px]" />

          <Button
            className="h-10 rounded-xl bg-[#658354] px-5 font-bold text-white hover:bg-[#4b6043]"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="size-4" />
            Add Client
          </Button>
        </section>
      </TopBarSlot>

      <ClientsTable
        clients={clientsQuery.data?.items}
        isLoading={clientsQuery.isLoading}
        isError={clientsQuery.isError}
        error={clientsQuery.error as Error | null}
        sortBy={routeSearch.sortBy}
        sortOrder={routeSearch.sortOrder}
        onSortChange={handleSortChange}
        onEdit={setEditTarget}
      />

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

      {pagination ? (
        <footer className="flex shrink-0 items-center justify-between rounded-xl border border-[#c7ddb5] bg-white px-5 py-3.5 text-sm text-[#64745F] shadow-sm dark:border-[#2f4a32] dark:bg-[#101912] dark:text-[#b7c8b3]">
          <PageSizeSelector value={routeSearch.limit} onChange={(limit) => updateSearch({ limit, page: 1 })} total={pagination.total} />
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon-lg" disabled={pagination.page <= 1} onClick={() => updateSearch({ page: pagination.page - 1 })} aria-label="Previous page">
              <ChevronLeft />
            </Button>
            {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                variant={pageNumber === pagination.page ? 'default' : 'ghost'}
                size="icon-lg"
                className={cn(pageNumber === pagination.page && 'bg-[#ddead1] text-[#658354] hover:bg-[#c7ddb5]')}
                onClick={() => updateSearch({ page: pageNumber })}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon-lg"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => updateSearch({ page: pagination.page + 1 })}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
          </div>
        </footer>
      ) : null}
    </main>
  )
}
