import { Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

export function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f6ee] p-6 text-[#102315]">
      <div className="max-w-md rounded-2xl border border-[#c7ddb5] bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-extrabold">Page not found</h1>
        <p className="mt-2 text-sm font-medium text-[#64745F]">The page you are looking for does not exist.</p>
        <Button className="mt-6 bg-[#658354] hover:bg-[#4b6043]" render={<Link to="/" search={{ page: 1, limit: 10, showFilters: false }} />}>
          Back to Websites
        </Button>
      </div>
    </main>
  )
}
