import { useState } from 'react'
import { Link, createFileRoute, useRouterState } from '@tanstack/react-router'
import { ChevronRight, Pencil } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { TopBarSlot } from '#/components/layout/top-bar-slot'
import { WebsiteDetail, WebsiteDetailSkeleton } from '#/components/websites/website-detail'
import { WebsiteEditDialog } from '#/components/websites/website-edit-dialog'
import { useWebsite } from '#/hooks/use-websites'

export const Route = createFileRoute('/_protected/_websites/websites/$websiteId')({ component: WebsiteDetailPage })

function WebsiteDetailPage() {
  const { websiteId } = Route.useParams()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const websiteQuery = useWebsite(websiteId)
  const website = websiteQuery.data
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <TopBarSlot routeKey={pathname}>
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            {websiteQuery.isLoading ? (
              <Skeleton className="h-5 w-64 rounded" />
            ) : (
              <nav className="flex items-center gap-1.5 text-sm text-[#64745F] dark:text-[#9fb49b]">
                <Link
                  to="/"
                  search={{ page: 1, limit: 10, showFilters: false }}
                  className="transition hover:text-[#102315] dark:hover:text-[#edf7ee]"
                >
                  Websites
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="font-semibold text-[#102315] dark:text-[#edf7ee]">
                  {website?.projectName ?? 'Website Details'}
                </span>
                {website ? (
                  <span className="rounded-md bg-[#e8f0e4] px-2 py-0.5 text-xs font-bold text-[#64745F] dark:bg-[#203423] dark:text-[#9fb49b]">
                    {website.websiteId}
                  </span>
                ) : null}
              </nav>
            )}
            <p className="text-sm text-[#64745F] dark:text-[#9fb49b]">
              Review website information, status, and renewal details.
            </p>
          </div>

          <Button
            className="shrink-0 gap-2 rounded-xl bg-[#658354] font-bold text-white hover:bg-[#4b6043]"
            disabled={!website}
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-4" />
            Edit Website
          </Button>
        </div>
      </TopBarSlot>

      <div className="flex flex-1 flex-col overflow-auto bg-[#f8faf7] dark:bg-[#0b110d]">
        <main className="flex flex-1 flex-col gap-4 px-8 py-8">
          {websiteQuery.isLoading ? <WebsiteDetailSkeleton /> : null}
          {websiteQuery.isError ? (
            <p className="text-sm text-destructive">{(websiteQuery.error as Error).message}</p>
          ) : null}
          {website ? <WebsiteDetail website={website} /> : null}
        </main>
      </div>

      <WebsiteEditDialog websiteId={websiteId} open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}
