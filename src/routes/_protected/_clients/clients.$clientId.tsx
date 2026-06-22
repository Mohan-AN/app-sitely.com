import { useState } from 'react'
import { Link, createFileRoute, useRouterState } from '@tanstack/react-router'
import { Building2, Calendar, ChevronRight, Globe, Mail, MapPin, MoreHorizontal, Pencil, Phone, Plus, Users } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { TopBarSlot } from '#/components/layout/top-bar-slot'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { ClientWebsitesTable } from '#/components/clients/client-websites-table'
import { EditClientDialog } from '#/components/clients/edit-client-dialog'
import { useClient } from '#/hooks/use-clients'
import { formatDate } from '#/lib/format'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/_protected/_clients/clients/$clientId')({ component: ClientDetailPage })

function ClientDetailPage() {
  const { clientId } = Route.useParams()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const clientQuery = useClient(clientId)
  const client = clientQuery.data
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <TopBarSlot routeKey={pathname}>
        <div className="flex w-full items-center justify-between gap-4">
          <div className="min-w-0">
            <nav className="flex items-center gap-1.5 text-sm text-[#64745F] dark:text-[#9fb49b]">
              <Link
                to="/clients"
                search={{ page: 1, limit: 20 }}
                className="transition hover:text-[#102315] dark:hover:text-[#edf7ee]"
              >
                Clients
              </Link>
              <ChevronRight className="size-3.5" />
            </nav>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#102315] dark:text-[#edf7ee]">
                {client?.name ?? ''}
              </h1>
              {client ? (
                <span className="rounded-md bg-[#e8f0e4] px-2 py-0.5 text-xs font-bold text-[#64745F] dark:bg-[#203423] dark:text-[#9fb49b]">
                  {client.clientId}
                </span>
              ) : null}
            </div>
            {client ? (
              <span className={cn(
                'mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold',
                client.isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
              )}>
                <span className={cn('size-2 rounded-full', client.isActive ? 'bg-emerald-500' : 'bg-gray-400')} />
                {client.isActive ? 'Active' : 'Inactive'}
              </span>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-[#dde5d8] text-[#334155] dark:border-[#2f4a32] dark:text-[#d6e8cf]"
              disabled={!client}
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-4" />
              Edit Client
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-lg"
                    aria-label="More actions"
                    className="rounded-xl border-[#dde5d8] dark:border-[#2f4a32]"
                    disabled={!client}
                  />
                }
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem render={<Link to="/websites/new" search={{ clientId }} />}>
                  <Plus className="size-4" />
                  Add Website
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </TopBarSlot>

      <EditClientDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client ?? null}
        onUpdated={() => clientQuery.refetch()}
        onDeleted={() => {/* navigated by edit dialog */}}
      />

      <div className="flex flex-1 flex-col overflow-auto bg-[#f8faf7] dark:bg-[#0b110d]">
        <main className="flex flex-1 flex-col gap-5 px-8 py-6">
          {clientQuery.isLoading ? (
            <div className="grid gap-4">
              <Skeleton className="h-52 rounded-xl" />
              <Skeleton className="h-96 rounded-xl" />
            </div>
          ) : null}
          {clientQuery.isError ? (
            <p className="text-sm text-destructive">{(clientQuery.error as Error).message}</p>
          ) : null}

          {client ? (
            <>
              <div className="rounded-xl border border-[#e5ebe2] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
                <div className="flex items-center gap-3 px-6 py-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]">
                    <Users className="size-4" />
                  </div>
                  <h3 className="font-extrabold text-[#102315] dark:text-[#edf7ee]">Client Information</h3>
                </div>

                <div className="border-t border-[#f0f4ee] dark:border-[#2f4a32]/60">
                  <div className="grid divide-x divide-[#f0f4ee] sm:grid-cols-3 dark:divide-[#2f4a32]/60">
                    <InfoCell icon={<Building2 className="size-4" />} label="Company">
                      {client.company ?? <Dash />}
                    </InfoCell>
                    <InfoCell icon={<Phone className="size-4" />} label="Phone">
                      {client.phone ?? <Dash />}
                    </InfoCell>
                    <InfoCell icon={<Mail className="size-4" />} label="Email">
                      {client.email ? (
                        <a href={`mailto:${client.email}`} className="font-semibold text-[#658354] underline-offset-2 hover:underline dark:text-[#85e0a3]">
                          {client.email}
                        </a>
                      ) : <Dash />}
                    </InfoCell>
                  </div>
                  <div className="grid divide-x divide-[#f0f4ee] border-t border-[#f0f4ee] sm:grid-cols-3 dark:divide-[#2f4a32]/60 dark:border-[#2f4a32]/60">
                    <InfoCell icon={<MapPin className="size-4" />} label="City">
                      {client.city ?? <Dash />}
                    </InfoCell>
                    <InfoCell icon={<Calendar className="size-4" />} label="Created At">
                      {formatDate(client.createdAt)}
                    </InfoCell>
                    <div />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#e5ebe2] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]">
                      <Globe className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#102315] dark:text-[#edf7ee]">Websites</h3>
                      <p className="text-xs text-[#64745F] dark:text-[#9fb49b]">Websites associated with this client.</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2 rounded-xl border-[#dde5d8] text-[#334155] dark:border-[#2f4a32] dark:text-[#d6e8cf]"
                    render={<Link to="/websites/new" search={{ clientId }} />}
                  >
                    <Plus className="size-4" />
                    Add Website
                  </Button>
                </div>

                <div className="border-t border-[#f0f4ee] px-6 py-4 dark:border-[#2f4a32]/60">
                  <ClientWebsitesTable websites={client.websites} />
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </>
  )
}

function InfoCell({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-6 py-4">
      <div className="mt-0.5 shrink-0 text-[#658354] dark:text-[#85e0a3]">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#64745F] dark:text-[#9fb49b]">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">{children}</p>
      </div>
    </div>
  )
}

function Dash() {
  return <span className="font-normal text-[#a0b89a] dark:text-[#6a9b70]">—</span>
}
