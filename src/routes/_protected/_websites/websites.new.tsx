import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { WebsiteForm } from '#/components/websites/website-form'

const FORM_ID = 'new-website-form'

export const Route = createFileRoute('/_protected/_websites/websites/new')({
  validateSearch: (search: Record<string, unknown>) => ({
    clientId: typeof search.clientId === 'string' ? search.clientId : undefined,
  }),
  component: NewWebsitePage,
})

function NewWebsitePage() {
  const navigate = useNavigate()
  const { clientId } = Route.useSearch()

  return (
    <div className="flex flex-1 flex-col overflow-auto bg-[#F4F5F7]">
      <main className="flex flex-1 flex-col gap-[12px] px-[24px] py-[16px]">

        {/* Page bar — matches prototype exactly: title + subtitle on left, Cancel + Save Website on right */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[21px] font-bold tracking-tight text-[#11141A]">Add Website</div>
            <div className="mt-[3px] text-[12.5px] text-[#8A8F98]">Capture website, type, domain ownership, maintenance, costs, and dates</div>
          </div>
          <div className="flex items-center gap-2">
            {clientId ? (
              <Link
                to="/clients/$clientId"
                params={{ clientId }}
                className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]"
              >
                Cancel
              </Link>
            ) : (
              <Link
                to="/"
                search={{ page: 1, limit: 10, showFilters: false }}
                className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]"
              >
                Cancel
              </Link>
            )}
            <button
              type="submit"
              form={FORM_ID}
              className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]"
            >
              Save Website
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-[#8A8F98]">
          {clientId ? (
            <Link to="/clients/$clientId" params={{ clientId }} className="transition hover:text-[#4F5DF5]">Client</Link>
          ) : (
            <Link to="/" search={{ page: 1, limit: 10, showFilters: false }} className="flex items-center gap-1 transition hover:text-[#4F5DF5]">
              <ChevronLeft className="size-3.5" />Websites
            </Link>
          )}
          <ChevronRight className="size-3.5" />
          <span className="font-semibold text-[#11141A]">Add Website</span>
        </nav>

        <WebsiteForm
          formId={FORM_ID}
          initialClientId={clientId}
          onCreated={(website) => navigate({ to: '/websites/$websiteId', params: { websiteId: String(website.id) } })}
          onCancel={() => navigate({ to: '/', search: { page: 1, limit: 10, showFilters: false } })}
        />
      </main>
    </div>
  )
}
