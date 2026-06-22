import { useState } from 'react'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayoutSidebar } from '#/components/layout/sidebar'
import { TopBar } from '#/components/layout/top-bar'
import { TopBarSlotProvider } from '#/components/layout/top-bar-slot'
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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  return (
    <TopBarSlotProvider>
      <div className="flex h-screen min-w-[1200px] overflow-hidden bg-[#f2f6ee] text-[#102315] selection:bg-[#658354] selection:text-white dark:bg-[#0b110d] dark:text-[#edf7ee]">
        <AppLayoutSidebar isExpanded={isSidebarExpanded} onToggle={() => setIsSidebarExpanded((value) => !value)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopBar />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </TopBarSlotProvider>
  )
}
