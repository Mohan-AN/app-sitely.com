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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fbfdf8] dark:bg-[#0b110d]">
      <TopBarSlot routeKey="/websites/new">
        <div>
          <nav className="flex items-center gap-2 text-sm text-[#64745F] dark:text-[#b7c8b3]">
            <Link to="/" search={{ page: 1, limit: 10, showFilters: false }} className="transition-colors hover:text-[#08712f] dark:hover:text-[#b6d7a8]">Websites</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-base font-extrabold text-[#102315] dark:text-[#edf7ee]">Add Website</span>
          </nav>
          <p className="mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]">Create a new website project and assign it to an existing client.</p>
        </div>
      </TopBarSlot>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 pb-0 pt-6">
        <WebsiteForm
          initialClientId={clientId}
          onCreated={(website) => navigate({ to: '/websites/$websiteId', params: { websiteId: website.websiteId } })}
          onCancel={() => navigate({ to: '/', search: { page: 1, limit: 10, showFilters: false } })}
        />
      </main>
    </div>
  )
}
