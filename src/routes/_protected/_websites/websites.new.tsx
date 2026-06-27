import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { WebsiteWizard } from '#/components/websites/website-wizard'

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
    <div className="flex h-full flex-col overflow-hidden">
      <WebsiteWizard
        initialClientId={clientId}
        cancelHref={clientId ? `/clients/${clientId}` : '/'}
        onCreated={(website) => navigate({ to: '/websites/$websiteId', params: { websiteId: String(website.id) } })}
      />
    </div>
  )
}
