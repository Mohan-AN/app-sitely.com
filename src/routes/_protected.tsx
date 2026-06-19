import { useState } from 'react'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayoutSidebar } from '#/components/layout/sidebar'
import { TopBar } from '#/components/layout/top-bar'
import { TopBarSlotProvider } from '#/components/layout/top-bar-slot'
import { useIsMobile } from '#/hooks/use-mobile'
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
  const isMobile = useIsMobile()
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <TopBarSlotProvider>
      <div className="flex h-screen overflow-hidden bg-[#f7f8fc] text-[#0f172a] selection:bg-[#4f2df5] selection:text-white dark:bg-[#0b1020] dark:text-[#edf2ff]">
        <AppLayoutSidebar
          isExpanded={isSidebarExpanded}
          isMobile={isMobile}
          mobileOpen={isSidebarOpen}
          onMobileOpenChange={setIsSidebarOpen}
          onToggle={() => {
            if (isMobile) {
              setIsSidebarOpen((value) => !value)
              return
            }
            setIsSidebarExpanded((value) => !value)
          }}
        />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopBar onMenuClick={() => setIsSidebarOpen(true)} showMenuButton={isMobile} />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </TopBarSlotProvider>
  )
}
