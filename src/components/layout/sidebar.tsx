import { useState } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronUp, ChevronsLeft, ChevronsRight, Globe, LogOut, Settings, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, apiFetch } from '#/lib/api'
import { authMeQueryOptions } from '#/lib/auth'
import { useWebsiteStats } from '#/hooks/use-websites'
import { cn } from '#/lib/utils'

const SIDEBAR_KEY = 'sitely-sidebar-collapsed'

function getStoredSidebarState() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(SIDEBAR_KEY) === 'true'
}

function getStoredRefreshToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

function clearStoredTokens() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

function initials(name?: string) {
  if (!name) return 'S'
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

export function AppLayoutSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user } = useQuery(authMeQueryOptions)
  const { data: stats } = useWebsiteStats()
  const [collapsed, setCollapsed] = useState(getStoredSidebarState)

  const toggle = () => {
    setCollapsed((prev) => {
      window.localStorage.setItem(SIDEBAR_KEY, String(!prev))
      return !prev
    })
  }

  const logoutMutation = useMutation({
    mutationFn: () =>
      apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: getStoredRefreshToken() }),
      }),
    onSettled: () => {
      clearStoredTokens()
      queryClient.clear()
      navigate({ to: '/login', search: { redirect: undefined } })
    },
  })

  const overdueCount = stats ? stats.maintenance_overdue_count + stats.domain_overdue_count : 0
  const isWebsitesActive = pathname === '/' || pathname.startsWith('/websites')
  const isClientsActive  = pathname.startsWith('/clients')

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 select-none flex-col border-r border-[#E5E7EB] bg-white transition-[width] duration-200 ease-in-out overflow-hidden',
        collapsed ? 'w-[60px]' : 'w-[220px]',
      )}
    >
      {/* Brand */}
      <div className={cn('flex items-center border-b border-[#E5E7EB] px-[12px] py-[14px]', collapsed ? 'justify-center' : 'justify-between gap-[10px]')}>
        <div className="flex shrink-0 items-center gap-[10px]">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[#4F5DF5] text-[14px] font-bold text-white">S</div>
          {!collapsed && (
            <span className="whitespace-nowrap text-[15px] font-bold tracking-tight text-[#11141A]">Sitely</span>
          )}
        </div>
        {!collapsed && (
          <button
            type="button"
            onClick={toggle}
            title="Collapse sidebar"
            className="flex size-[26px] shrink-0 items-center justify-center rounded-[7px] text-[#A8ACB4] transition hover:bg-[#F4F5F7] hover:text-[#4F5DF5]"
          >
            <ChevronsLeft className="size-[15px]" />
          </button>
        )}
      </div>

      {/* Toggle button — below logo when collapsed */}
      {collapsed && (
        <div className="flex justify-center border-b border-[#E5E7EB] py-[10px]">
          <button
            type="button"
            onClick={toggle}
            title="Expand sidebar"
            className="flex size-[28px] items-center justify-center rounded-[7px] text-[#A8ACB4] transition hover:bg-[#EEEFFE] hover:text-[#4F5DF5]"
          >
            <ChevronsRight className="size-[15px]" />
          </button>
        </div>
      )}

      {/* Menu */}
      <div className={cn('mt-[10px] px-[8px]')}>
        <SbItem
          icon={<Globe className="size-[17px]" />} label="Websites" active={isWebsitesActive}
          badge={overdueCount > 0 ? String(overdueCount) : undefined} collapsed={collapsed}
          onClick={() => navigate({ to: '/', search: { page: 1, limit: 15, showFilters: false } })}
        />
        <SbItem icon={<Users className="size-[17px]" />} label="Clients" active={isClientsActive} collapsed={collapsed}
          onClick={() => navigate({ to: '/clients', search: { page: 1, limit: 20 } })} />
      </div>

      <div className="flex-1" />

      {/* User bottom */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className={cn(
                'flex cursor-pointer items-center border-t border-[#E5E7EB] transition hover:bg-[#F7F8FA]',
                collapsed ? 'w-full justify-center px-0 py-[11px]' : 'gap-[10px] px-[11px] py-[11px]',
              )}
            />
          }
        >
          <Avatar className="size-8 shrink-0 rounded-full">
            <AvatarFallback className="rounded-full bg-[#4F5DF5] text-[12px] font-bold text-white">
              {initials(user?.name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <div className="truncate text-[12.5px] font-semibold text-[#11141A]">{user?.name ?? 'Actnos Admin'}</div>
                <div className="text-[11px] capitalize text-[#8A8F98]">{(user?.role ?? 'owner').replace('_', ' ')}</div>
              </div>
              <ChevronUp className="size-[15px] shrink-0 text-[#A8ACB4]" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" sideOffset={8} className="min-w-[200px] rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-lg">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer gap-2 rounded-lg px-2 py-2 text-[12.5px] font-medium text-[#11141A] focus:bg-[#F4F5F7]"
              onClick={() => navigate({ to: '/settings' })}
            >
              <Settings className="size-4 text-[#8A8F98]" /> Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer gap-2 rounded-lg px-2 py-2 text-[12.5px] font-medium text-[#DC2626] focus:bg-[#FEF2F2] focus:text-[#DC2626]"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="size-4" />
              {logoutMutation.isPending ? 'Signing out…' : 'Sign out'}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SbItem({
  icon, label, active, badge, collapsed, onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  badge?: string
  collapsed?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'relative mb-[1px] flex w-full items-center rounded-[9px] transition-all duration-150',
        collapsed ? 'justify-center px-0 py-[10px]' : 'gap-[10px] px-[11px] py-[9px]',
        active ? 'bg-[#EEEFFE] font-semibold text-[#4F5DF5]' : 'text-[#5C6270] hover:bg-[#F7F8FA] hover:text-[#11141A]',
      )}
    >
      <span className={cn('shrink-0', active ? 'text-[#4F5DF5]' : 'text-[#8A8F98]')}>{icon}</span>
      {!collapsed && <span className="flex-1 text-left text-[13px] font-medium">{label}</span>}
      {badge && !collapsed && (
        <span className="rounded-[10px] bg-[#DC2626] px-[7px] py-[1px] text-[10.5px] font-bold text-white">{badge}</span>
      )}
      {badge && collapsed && (
        <span className="absolute right-[8px] top-[8px] size-[7px] rounded-full bg-[#DC2626]" />
      )}
    </button>
  )
}

