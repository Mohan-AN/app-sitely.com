import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { ACCESS_TOKEN_KEY } from '#/lib/api'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && localStorage.getItem(ACCESS_TOKEN_KEY)) {
      throw redirect({ to: '/', search: { page: 1, limit: 10, showFilters: false } })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-white text-[#0f172a]">
      <div className="relative flex flex-1 flex-col bg-white">
        <div className="relative z-10 flex flex-1 items-center justify-center p-6 sm:p-12">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
