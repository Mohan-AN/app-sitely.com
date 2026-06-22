import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Building2, ChevronLeft, Mail, MapPin, Phone, Plus } from 'lucide-react'
import { Skeleton } from '#/components/ui/skeleton'
import { ClientWebsitesTable } from '#/components/clients/client-websites-table'
import { EditClientDialog } from '#/components/clients/edit-client-dialog'
import { useClient } from '#/hooks/use-clients'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/_protected/_clients/clients/$clientId')({ component: ClientDetailPage })

function ClientDetailPage() {
  const { clientId } = Route.useParams()
  const clientQuery = useClient(clientId)
  const client = clientQuery.data
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-[#F4F5F7]">
      <main className="flex flex-1 flex-col gap-[20px] px-[30px] py-[26px]">

        {/* Back button */}
        <Link
          to="/clients"
          search={{ page: 1, limit: 20 }}
          className="flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#5C6270] transition hover:text-[#4F5DF5]"
        >
          <ChevronLeft className="size-4" />
          Back to Clients
        </Link>

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            {clientQuery.isLoading ? (
              <Skeleton className="h-7 w-48 rounded" />
            ) : (
              <div className="text-[22px] font-bold tracking-tight text-[#11141A]">
                {client?.name ?? 'Client Details'}
              </div>
            )}
            {client ? (
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-[7px] bg-[#F7F8FA] px-[11px] py-1 text-[11.5px] font-semibold text-[#5C6270]">{client.client_id}</span>
                <span className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-[11px] py-1 text-[11.5px] font-bold',
                  client.is_active ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#F3F4F6] text-[#6B7280]',
                )}>
                  <span className={cn('size-[5px] rounded-full', client.is_active ? 'bg-[#10B981]' : 'bg-[#9CA3AF]')} />
                  {client.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!client}
              onClick={() => setEditOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Client
            </button>
            <Link
              to="/websites/new"
              search={{ clientId }}
              className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]"
            >
              <Plus className="size-4" />
              Add Website for this Client
            </Link>
          </div>
        </div>

        {clientQuery.isLoading ? (
          <div className="grid gap-4">
            <Skeleton className="h-52 rounded-[14px]" />
            <Skeleton className="h-96 rounded-[14px]" />
          </div>
        ) : null}
        {clientQuery.isError ? (
          <p className="text-[13px] text-[#DC2626]">{(clientQuery.error as Error).message}</p>
        ) : null}

        {client ? (
          <>
            {/* Client Info Card */}
            <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]">
              <div className="border-b border-[#EEF0F2] px-[18px] py-[14px]">
                <div className="text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]">Contact Information</div>
              </div>
              <div className="grid grid-cols-4 gap-0 divide-x divide-[#EEF0F2]">
                <InfoCell icon={<Building2 className="size-4" />} label="Contact Name">{client.name ?? <Dash />}</InfoCell>
                <InfoCell icon={<Phone className="size-4" />} label="Phone">{client.phone ?? <Dash />}</InfoCell>
                <InfoCell icon={<Mail className="size-4" />} label="Email">
                  {client.email ? (
                    <a href={`mailto:${client.email}`} className="text-[#4F5DF5] underline-offset-2 hover:underline">{client.email}</a>
                  ) : <Dash />}
                </InfoCell>
                <InfoCell icon={<MapPin className="size-4" />} label="Address">{client.city ?? <Dash />}</InfoCell>
              </div>
            </div>

            {/* Websites Card */}
            <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#EEF0F2] px-[18px] py-[14px]">
                <strong className="text-[13px] font-bold text-[#11141A]">
                  Linked Websites ({client.websites?.length ?? 0})
                </strong>
              </div>
              <div className="px-0">
                <ClientWebsitesTable websites={client.websites ?? []} />
              </div>
            </div>
          </>
        ) : null}
      </main>

      <EditClientDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={client ?? null}
        onUpdated={() => clientQuery.refetch()}
        onDeleted={() => {/* navigated by edit dialog */}}
      />
    </div>
  )
}

function InfoCell({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-[18px] py-[14px]">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.03em] text-[#8A8F98]">
        <span className="text-[#8A8F98]">{icon}</span>{label}
      </div>
      <div className="text-[13px] font-semibold text-[#11141A]">{children}</div>
    </div>
  )
}

function Dash() {
  return <span className="font-normal text-[#C7CAD1]">—</span>
}

