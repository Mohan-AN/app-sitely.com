import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { TopBarSlot } from '#/components/layout/top-bar-slot'
import { WebsiteForm } from '#/components/websites/website-form'

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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-[#0b1020]">
      <TopBarSlot routeKey="/websites/new">
        <div className="min-w-0">
          <nav className="mb-1 flex items-center gap-1.5 text-[13px] text-[#667085]">
            <Link to="/" search={{ page: 1, limit: 10, showFilters: false }} className="font-medium text-[#5b38f6] transition-colors hover:text-[#4e30e0]">Websites</Link>
            <ChevronRight className="size-3 text-[#94a3b8]" />
            <span>Add Website</span>
          </nav>
          <h1 className="text-[24px] font-semibold leading-none text-[#111827] dark:text-[#edf2ff]">Add Website</h1>
        </div>
      </TopBarSlot>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-10 pb-0 pt-5">
        <WebsiteForm
          initialClientId={clientId}
          onCreated={(website) => navigate({ to: '/websites/$websiteId', params: { websiteId: website.websiteId } })}
          onCancel={() => navigate({ to: '/', search: { page: 1, limit: 10, showFilters: false } })}
        />
      </main>
    </div>
  )
}
