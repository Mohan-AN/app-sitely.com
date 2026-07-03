import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayoutSidebar } from '#/components/layout/sidebar'
import { ACCESS_TOKEN_KEY } from '#/lib/api'
import { authMeQueryOptions } from '#/lib/auth'
import { queryClient } from '#/lib/query-client'

function hasBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ location }) => {
    if (!hasBrowserStorage()) return

    // Redirect immediately if no token; no network call needed.
    if (!window.localStorage.getItem(ACCESS_TOKEN_KEY)) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }

    // If the auth query previously failed within 10s, redirect without retrying.
    const state = queryClient.getQueryState(authMeQueryOptions.queryKey)
    if (state?.status === 'error' && state.errorUpdatedAt > Date.now() - 10_000) {
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
