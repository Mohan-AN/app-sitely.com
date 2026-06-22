import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { Skeleton } from '#/components/ui/skeleton'
import { ClientForm } from '#/components/clients/client-form'
import { useClient, useDeleteClient } from '#/hooks/use-clients'

export const Route = createFileRoute('/_protected/_clients/clients/$clientId/edit')({ component: EditClientPage })

function EditClientPage() {
  const { clientId } = Route.useParams()
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
    <div className="flex flex-1 flex-col overflow-auto bg-[#F4F5F7]">
      <main className="flex flex-1 flex-col gap-[22px] px-[30px] py-[26px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-[#8A8F98]">
          <Link to="/clients" search={{ page: 1, limit: 20 }} className="flex items-center gap-1 transition hover:text-[#4F5DF5]">
            <ChevronLeft className="size-3.5" />
            Clients
          </Link>
          <ChevronRight className="size-3.5" />
          <Link to="/clients/$clientId" params={{ clientId }} className="transition hover:text-[#4F5DF5]">
            {client?.name ?? 'Client'}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-semibold text-[#11141A]">Edit Client</span>
        </nav>

        {/* Page bar */}
        <div>
          <div className="text-[21px] font-bold tracking-tight text-[#11141A]">Edit Client</div>
          <div className="mt-[3px] text-[12.5px] text-[#8A8F98]">Update client contact and company details.</div>
        </div>

        {clientQuery.isLoading ? <Skeleton className="h-80 rounded-[14px]" /> : null}
        {clientQuery.isError ? (
          <p className="text-[13px] text-[#DC2626]">{(clientQuery.error as Error).message}</p>
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
      </main>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Client"
        description={`Are you sure you want to delete "${client?.name}"? All associated data will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
