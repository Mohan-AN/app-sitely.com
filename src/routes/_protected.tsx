import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayoutSidebar } from '#/components/layout/sidebar'
import { ACCESS_TOKEN_KEY } from '#/lib/api'
import { authMeQueryOptions } from '#/lib/auth'
import { queryClient } from '#/lib/query-client'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return

    if (!localStorage.getItem(ACCESS_TOKEN_KEY)) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }

    // If we already have a valid cached user, skip the network call entirely
    const cached = queryClient.getQueryData(authMeQueryOptions.queryKey)
    if (cached) return

    // If the query already failed recently (within 10s), redirect immediately
    // without hammering the API on every navigation
    const state = queryClient.getQueryState(authMeQueryOptions.queryKey)
    if (state?.status === 'error' && state.errorUpdatedAt > Date.now() - 10_000) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }

    try {
      await queryClient.ensureQueryData(authMeQueryOptions)
    } catch {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }
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
