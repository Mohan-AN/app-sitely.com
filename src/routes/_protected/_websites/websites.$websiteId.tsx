import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { Skeleton } from '#/components/ui/skeleton'
import { WebsiteDetail, WebsiteDetailSkeleton } from '#/components/websites/website-detail'
import { WebsiteEditDialog } from '#/components/websites/website-edit-dialog'
import { RecordPaymentDialog } from '#/components/websites/record-payment-dialog'
import { AddRequestDialog } from '#/components/websites/add-request-dialog'
import { StatusPill, MaintenanceBadge } from '#/components/websites/status-badges'
import { useCurrentBillingId, useWebsite } from '#/hooks/use-websites'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/_protected/_websites/websites/$websiteId')({ component: WebsiteDetailPage })

function WebsiteDetailPage() {
  const { websiteId } = Route.useParams()
  const websiteQuery = useWebsite(websiteId)
  const website = websiteQuery.data
  const { data: currentBillingId } = useCurrentBillingId(websiteId)
  const [editOpen, setEditOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-[#F4F5F7]">
      <main className="flex flex-1 flex-col gap-[20px] px-[30px] py-[26px]">

        {/* Back button */}
        <Link
          to="/"
          search={{ page: 1, limit: 10, showFilters: false }}
          className="flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#5C6270] transition hover:text-[#4F5DF5]"
        >
          <ChevronLeft className="size-4" />
          Back to Websites
        </Link>

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            {websiteQuery.isLoading ? (
              <>
                <Skeleton className="h-7 w-52 rounded-[8px]" />
                <div className="mt-2 flex items-center gap-2">
                  <Skeleton className="h-6 w-20 rounded-[7px]" />
                  <Skeleton className="h-6 w-16 rounded-[7px]" />
                  <Skeleton className="h-6 w-24 rounded-[7px]" />
                </div>
              </>
            ) : (
              <div className="text-[22px] font-bold tracking-tight text-[#11141A]">
                {website?.project_name ?? 'Website Details'}
              </div>
            )}
            {website ? (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="rounded-[7px] bg-[#F7F8FA] px-[11px] py-1 text-[11.5px] font-semibold text-[#5C6270]">
                  WEB-{String(website.id).padStart(3, '0')}
                </span>
                <StatusPill label={website.website_status} />
                <MaintenanceBadge label={website.maintenance_status} />
                {website.build_type ? (
                  <span className="rounded-[7px] bg-[#F7F8FA] px-[11px] py-1 text-[11.5px] font-semibold text-[#5C6270]">
                    {website.build_type} / {website.platform}
                  </span>
                ) : null}
                {website.domain_handled_by ? (
                  <span className="rounded-[7px] bg-[#F7F8FA] px-[11px] py-1 text-[11.5px] font-semibold text-[#5C6270]">
                    Domain: {website.domain_handled_by === 'our_side' ? 'Our side' : 'Client side'}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {websiteQuery.isLoading ? (
              <>
                <Skeleton className="h-9 w-28 rounded-[9px]" />
                <Skeleton className="h-9 w-28 rounded-[9px]" />
                <Skeleton className="h-9 w-32 rounded-[9px]" />
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={!website}
                  onClick={() => setRequestOpen(true)}
                  className={cn('inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]', !website && 'opacity-50 cursor-not-allowed')}
                >
                  Add Request
                </button>
                <button
                  type="button"
                  disabled={!website}
                  onClick={() => setEditOpen(true)}
                  className={cn('inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]', !website && 'opacity-50 cursor-not-allowed')}
                >
                  Edit Website
                </button>
                <button
                  type="button"
                  disabled={!website}
                  onClick={() => setPaymentOpen(true)}
                  className={cn('inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]', !website && 'opacity-50 cursor-not-allowed')}
                >
                  Record Payment
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {websiteQuery.isLoading ? <WebsiteDetailSkeleton /> : null}
        {websiteQuery.isError ? (
          <p className="text-[13px] text-[#DC2626]">{(websiteQuery.error as Error).message}</p>
        ) : null}
        {website ? <WebsiteDetail website={website} /> : null}
      </main>

      {website ? (
        <>
          <WebsiteEditDialog websiteId={websiteId} open={editOpen} onOpenChange={setEditOpen} />
          <RecordPaymentDialog
            websiteId={websiteId}
            billingId={currentBillingId}
            projectName={website.project_name}
            maintenanceAmount={website.maintenance_amount}
            open={paymentOpen}
            onOpenChange={setPaymentOpen}
          />
          <AddRequestDialog
            websiteId={websiteId}
            projectName={website.project_name}
            open={requestOpen}
            onOpenChange={setRequestOpen}
          />
        </>
      ) : null}
    </div>
  )
}
