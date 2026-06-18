import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ClientForm } from '#/components/clients/client-form'

export const Route = createFileRoute('/_protected/_clients/clients/new')({ component: NewClientPage })

function NewClientPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4">
        <div className="grid gap-2">
          <Button variant="link" className="h-auto justify-start p-0 text-muted-foreground" render={<Link to="/clients" search={{ page: 1, limit: 20 }} />}>
            <ArrowLeft />
            Clients
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add Client</h1>
            <p className="text-sm text-muted-foreground">Create a client record before adding websites.</p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-6">
        <ClientForm onCreated={(client) => navigate({ to: '/clients/$clientId', params: { clientId: client.clientId } })} />
      </main>
    </div>
  )
}
