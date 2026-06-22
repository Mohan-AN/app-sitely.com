import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageSizeSelector } from '#/components/ui/page-size-selector'
import { cn, toPositiveInt } from '#/lib/utils'
import { useDebounce } from '#/hooks/use-debounce'
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
  const filters: ClientsFilters = { search: routeSearch.search, sortBy: routeSearch.sortBy, sortOrder: routeSearch.sortOrder }
  const [searchQuery, setSearchQuery] = useState(routeSearch.search ?? '')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ClientWithCount | null>(null)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const clientsQuery = useClients(filters, routeSearch.page, routeSearch.limit, { keepPrevious: true })
  const pagination = clientsQuery.data?.pagination

  const handleClientCreated = (_client: Client) => {
    navigate({ search: (old) => ({ ...old, page: 1 }) })
  }

  useEffect(() => { setSearchQuery(routeSearch.search ?? '') }, [routeSearch.search])

  useEffect(() => {
    if (debouncedSearch === (routeSearch.search ?? '')) return
    navigate({ search: (old) => ({ ...old, search: debouncedSearch || undefined, page: 1 }), replace: true })
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
    <main className="flex min-h-0 flex-1 flex-col gap-[22px] overflow-hidden bg-[#F4F5F7] px-[30px] py-[26px]">
      {/* Page bar */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[21px] font-bold tracking-tight text-[#11141A]">Clients</div>
          <div className="mt-[3px] text-[12.5px] text-[#8A8F98]">Search, manage, and open each client's linked websites</div>
        </div>
        <button
          type="button"
          onClick={() => setAddDialogOpen(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]"
        >
          + Add Client
        </button>
      </div>

      {/* Table card */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]">
        {/* Toolbar */}
        <div className="border-b border-[#E5E7EB] px-[18px] py-[14px]">
          <div className="flex items-center gap-2 rounded-[9px] border border-[#E5E7EB] bg-[#F7F8FA] px-3 py-2 max-w-[300px]">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="w-full border-none bg-transparent text-[12.5px] text-[#1F2430] outline-none placeholder:text-[#A8ACB4]"
            />
          </div>
        </div>

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

        {pagination ? (
          <footer className="flex shrink-0 items-center justify-between border-t border-[#E5E7EB] bg-white px-5 py-3 text-sm text-[#8A8F98]">
            <PageSizeSelector value={routeSearch.limit} onChange={(limit) => updateSearch({ limit, page: 1 })} total={pagination.total} />
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-[#8A8F98]">
                Page <span className="font-semibold text-[#5C6270]">{pagination.page}</span> of <span className="font-semibold text-[#5C6270]">{pagination.totalPages}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button type="button" disabled={pagination.page <= 1} onClick={() => updateSearch({ page: pagination.page - 1 })} aria-label="Previous page"
                  className="flex size-[29px] items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} type="button" onClick={() => updateSearch({ page: n })}
                    className={cn('flex size-[29px] items-center justify-center rounded-[7px] text-[12px] font-semibold transition',
                      n === pagination.page ? 'bg-[#4F5DF5] text-white' : 'text-[#5C6270] hover:bg-[#F4F5F7]')}>
                    {n}
                  </button>
                ))}
                <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => updateSearch({ page: pagination.page + 1 })} aria-label="Next page"
                  className="flex size-[29px] items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </footer>
        ) : null}
      </div>

      <AddClientDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onCreated={handleClientCreated} />
      <EditClientDialog
        open={editTarget !== null}
        onOpenChange={(open) => { if (!open) setEditTarget(null) }}
        client={editTarget}
      />
    </main>
  )
}
