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
          <nav className="flex items-center gap-1.5 text-sm text-[#253858] dark:text-[#a6b2cf]">
            <Link
              to="/"
              search={{ page: 1, limit: 10, showFilters: false }}
              className="font-semibold text-[#4f2df5] transition hover:text-[#3f22d8]"
            >
              Websites
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              to="/websites/$websiteId"
              params={{ websiteId }}
              className="transition hover:text-[#0f172a] dark:hover:text-[#edf2ff]"
            >
              {website?.projectName ?? 'Website'}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="font-semibold text-[#0f172a] dark:text-[#edf2ff]">Edit Website</span>
          </nav>

          <Button
            variant="outline"
            className="gap-2 rounded-lg border-[#dce3ef] text-[#172554] dark:border-[#25304a] dark:text-[#a6b2cf]"
            render={<Link to="/websites/$websiteId" params={{ websiteId }} />}
          >
            <ArrowLeft className="size-4" />
            Back to Website
          </Button>
        </div>
      </TopBarSlot>

      <div className="flex flex-1 flex-col overflow-auto bg-white dark:bg-[#0b1020]">
        <div className="px-10 pb-7 pt-5">
          <h1 className="text-[34px] font-extrabold text-[#0b1020] dark:text-[#edf2ff]">Edit Website</h1>
          <p className="mt-4 text-xl font-bold text-[#0f172a] dark:text-[#edf2ff]">{website?.projectName ?? 'Website'}</p>
        </div>

        <div className="flex flex-1 flex-col px-10 pb-8">
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
