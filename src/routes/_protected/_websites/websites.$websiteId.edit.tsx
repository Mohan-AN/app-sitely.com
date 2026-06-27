import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { Skeleton } from '#/components/ui/skeleton'
import { WebsiteWizard } from '#/components/websites/website-wizard'
import { useWebsite, useDeleteWebsite } from '#/hooks/use-websites'

export const Route = createFileRoute('/_protected/_websites/websites/$websiteId/edit')({ component: EditWebsitePage })

function EditWebsitePage() {
  const { websiteId } = Route.useParams()
  const navigate = useNavigate()
  const websiteQuery = useWebsite(websiteId)
  const website = websiteQuery.data
  const deleteMutation = useDeleteWebsite(websiteId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (websiteQuery.isLoading) {
    return (
      <div className="flex h-full flex-col gap-4 bg-[#f4f5f8] p-6">
        <Skeleton className="h-16 rounded-[14px]" />
        <Skeleton className="h-[72px] rounded-[14px]" />
        <Skeleton className="flex-1 rounded-[14px]" />
      </div>
    )
  }

  if (websiteQuery.isError) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-[13px] text-[#DC2626]">{(websiteQuery.error as Error).message}</p>
      </div>
    )
  }

  return (
    <>
      {website && (
        <div className="flex h-full flex-col overflow-hidden">
          <WebsiteWizard
            mode="edit"
            website={website}
            cancelHref={`/websites/${websiteId}`}
            onUpdated={() => navigate({ to: '/websites/$websiteId', params: { websiteId } })}
            onDelete={() => setShowDeleteDialog(true)}
            isDeleting={deleteMutation.isPending}
          />
        </div>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Website"
        description={`Are you sure you want to delete "${website?.project_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() =>
          deleteMutation.mutate(undefined, {
            onSuccess: () => {
              setShowDeleteDialog(false)
              navigate({ to: '/', search: { page: 1, limit: 10, showFilters: false } })
            },
          })
        }
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
