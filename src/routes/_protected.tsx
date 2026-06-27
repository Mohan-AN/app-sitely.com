import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayoutSidebar } from '#/components/layout/sidebar'
import { ACCESS_TOKEN_KEY } from '#/lib/api'
import { authMeQueryOptions } from '#/lib/auth'
import { queryClient } from '#/lib/query-client'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ location }) => {
    if (typeof window === 'undefined') return

    // Redirect immediately if no token — no network call needed.
    if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }

    // If the auth query previously failed (within 10s), redirect without retrying.
    const state = queryClient.getQueryState(authMeQueryOptions.queryKey)
    if (state?.status === 'error' && state.errorUpdatedAt > Date.now() - 10_000) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }
    // Auth is verified in the background by the sidebar's useQuery(authMeQueryOptions).
    // apiFetch handles 401 by clearing tokens and redirecting to /login automatically.
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F7]">
      <AppLayoutSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
