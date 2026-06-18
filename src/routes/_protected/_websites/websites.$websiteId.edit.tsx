import { useState } from 'react'
import { Link, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { Skeleton } from '#/components/ui/skeleton'
import { TopBarSlot } from '#/components/layout/top-bar-slot'
import { WebsiteForm } from '#/components/websites/website-form'
import { useWebsite, useDeleteWebsite } from '#/hooks/use-websites'

export const Route = createFileRoute('/_protected/_websites/websites/$websiteId/edit')({ component: EditWebsitePage })

function EditWebsitePage() {
  const { websiteId } = Route.useParams()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
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
    <>
      <TopBarSlot routeKey={pathname}>
        <div className="flex w-full items-center justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-sm text-[#64745F] dark:text-[#9fb49b]">
            <Link
              to="/"
              search={{ page: 1, limit: 10, showFilters: false }}
              className="transition hover:text-[#102315] dark:hover:text-[#edf7ee]"
            >
              Websites
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              to="/websites/$websiteId"
              params={{ websiteId }}
              className="transition hover:text-[#102315] dark:hover:text-[#edf7ee]"
            >
              {website?.projectName ?? 'Website'}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-semibold text-[#102315] dark:text-[#edf7ee]">Edit Website</span>
          </nav>

          <Button
            variant="outline"
            className="gap-2 rounded-xl border-[#dde5d8] text-[#334155] dark:border-[#2f4a32] dark:text-[#d6e8cf]"
            render={<Link to="/websites/$websiteId" params={{ websiteId }} />}
          >
            <ArrowLeft className="size-4" />
            Back to Website
          </Button>
        </div>
      </TopBarSlot>

      <div className="flex flex-1 flex-col overflow-auto bg-[#f8faf7] dark:bg-[#0b110d]">
        <div className="px-8 pb-4 pt-5">
          <h1 className="text-2xl font-bold text-[#102315] dark:text-[#edf7ee]">Update Website</h1>
          <p className="mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]">Update website information and settings.</p>
        </div>

        <div className="flex flex-1 flex-col px-8 pb-8">
          {websiteQuery.isLoading ? <Skeleton className="h-[520px] rounded-xl" /> : null}
          {websiteQuery.isError ? (
            <p className="text-sm text-destructive">{(websiteQuery.error as Error).message}</p>
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
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Website"
        description={`Are you sure you want to delete "${website?.projectName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
