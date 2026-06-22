import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { Skeleton } from '#/components/ui/skeleton'
import { WebsiteForm } from '#/components/websites/website-form'
import { useWebsite, useDeleteWebsite } from '#/hooks/use-websites'

export const Route = createFileRoute('/_protected/_websites/websites/$websiteId/edit')({ component: EditWebsitePage })

function EditWebsitePage() {
  const { websiteId } = Route.useParams()
  const navigate = useNavigate()
  const websiteQuery = useWebsite(websiteId)
  const website = websiteQuery.data
  const deleteMutation = useDeleteWebsite(websiteId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteDialog(false)
        navigate({ to: '/', search: { page: 1, limit: 10, showFilters: false } })
      },
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-[#F4F5F7]">
      <main className="flex flex-1 flex-col gap-[22px] px-[30px] py-[26px]">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-[#8A8F98]">
          <Link to="/" search={{ page: 1, limit: 10, showFilters: false }} className="flex items-center gap-1 transition hover:text-[#4F5DF5]">
            <ChevronLeft className="size-3.5" />
            Websites
          </Link>
          <ChevronRight className="size-3.5" />
          <Link to="/websites/$websiteId" params={{ websiteId }} className="transition hover:text-[#4F5DF5]">
            {website?.project_name ?? 'Website'}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-semibold text-[#11141A]">Edit Website</span>
        </nav>

        {/* Page bar */}
        <div>
          <div className="text-[21px] font-bold tracking-tight text-[#11141A]">Edit Website</div>
          <div className="mt-[3px] text-[12.5px] text-[#8A8F98]">Update website information and settings.</div>
        </div>

        {websiteQuery.isLoading ? <Skeleton className="h-[520px] rounded-[14px]" /> : null}
        {websiteQuery.isError ? (
          <p className="text-[13px] text-[#DC2626]">{(websiteQuery.error as Error).message}</p>
        ) : null}
        {website ? (
          <WebsiteForm
            mode="edit"
            website={website}
            onUpdated={() => navigate({ to: '/websites/$websiteId', params: { websiteId } })}
            onCancel={() => navigate({ to: '/websites/$websiteId', params: { websiteId } })}
            onDelete={() => setShowDeleteDialog(true)}
            isDeleting={deleteMutation.isPending}
          />
        ) : null}
      </main>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Website"
        description={`Are you sure you want to delete "${website?.project_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
