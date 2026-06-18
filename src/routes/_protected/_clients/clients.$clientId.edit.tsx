import { useState } from 'react'
import { Link, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { Skeleton } from '#/components/ui/skeleton'
import { TopBarSlot } from '#/components/layout/top-bar-slot'
import { ClientForm } from '#/components/clients/client-form'
import { useClient, useDeleteClient } from '#/hooks/use-clients'

export const Route = createFileRoute('/_protected/_clients/clients/$clientId/edit')({ component: EditClientPage })

function EditClientPage() {
  const { clientId } = Route.useParams()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navigate = useNavigate()
  const clientQuery = useClient(clientId)
  const client = clientQuery.data
  const deleteMutation = useDeleteClient(clientId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteDialog(false)
        navigate({ to: '/clients', search: { page: 1, limit: 20 } })
      },
    })
  }

  return (
    <>
      <TopBarSlot routeKey={pathname}>
        <div className="flex w-full items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-sm text-[#64745F] dark:text-[#9fb49b]">
            <Link
              to="/clients"
              search={{ page: 1, limit: 20 }}
              className="transition hover:text-[#102315] dark:hover:text-[#edf7ee]"
            >
              Clients
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              to="/clients/$clientId"
              params={{ clientId }}
              className="transition hover:text-[#102315] dark:hover:text-[#edf7ee]"
            >
              {client?.name ?? 'Client'}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-semibold text-[#102315] dark:text-[#edf7ee]">Edit Client</span>
          </nav>

          <Button
            variant="outline"
            className="gap-2 rounded-xl border-[#dde5d8] text-[#334155] dark:border-[#2f4a32] dark:text-[#d6e8cf]"
            render={<Link to="/clients/$clientId" params={{ clientId }} />}
          >
            <ArrowLeft className="size-4" />
            Back to Client
          </Button>
        </div>
      </TopBarSlot>

      <div className="flex flex-1 flex-col overflow-auto bg-[#f8faf7] dark:bg-[#0b110d]">
        <div className="px-8 pb-4 pt-5">
          <h1 className="text-2xl font-bold text-[#102315] dark:text-[#edf7ee]">Edit Client</h1>
          <p className="mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]">
            Update client contact and company details.
          </p>
        </div>

        <div className="flex flex-1 flex-col px-8 pb-8">
          {clientQuery.isLoading ? <Skeleton className="h-80 rounded-xl" /> : null}
          {clientQuery.isError ? (
            <p className="text-sm text-destructive">{(clientQuery.error as Error).message}</p>
          ) : null}
          {client ? (
            <ClientForm
              mode="edit"
              client={client}
              onUpdated={() => navigate({ to: '/clients/$clientId', params: { clientId } })}
              onCancel={() => navigate({ to: '/clients/$clientId', params: { clientId } })}
              onDelete={() => setShowDeleteDialog(true)}
              isDeleting={deleteMutation.isPending}
            />
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Client"
        description={`Are you sure you want to delete "${client?.name}"? All associated data will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
