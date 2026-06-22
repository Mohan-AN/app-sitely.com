import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronsLeft, ChevronsRight, ChevronsUpDown, Globe, LogOut, Settings, Users } from 'lucide-react'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, apiFetch } from '#/lib/api'
import { authMeQueryOptions } from '#/lib/auth'
import { cn } from '#/lib/utils'
import { ThemeToggle } from '#/components/theme-toggle'

interface AppLayoutSidebarProps {
  isExpanded: boolean
  onToggle: () => void
}

const NAV_ITEMS = [
  { icon: Globe, path: '/', label: 'Websites', id: 'websites' },
  { icon: Users, path: '/clients', label: 'Clients', id: 'clients' },
]

function SitelyMark() {
  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#658354] bg-[#ddead1] text-lg font-black text-[#658354] shadow-sm">
      S
    </div>
  )
}

function initials(name?: string) {
  if (!name) return 'S'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function SidebarUserMenu({ isExpanded }: { isExpanded: boolean }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: user } = useQuery(authMeQueryOptions)

  const logoutMutation = useMutation({
    mutationFn: () =>
      apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) }),
      }),
    onSettled: () => {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      queryClient.clear()
      navigate({ to: '/login', search: { redirect: undefined } })
    },
  })

  const roleDisplay = (user?.role ?? 'admin').toUpperCase().replace('_', ' ')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              'flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#c7ddb5] bg-white p-2 shadow-sm transition hover:bg-[#ddead1]/40 dark:border-[#2f4a32] dark:bg-[#132018] dark:hover:bg-[#203423]',
              !isExpanded && 'justify-center',
            )}
          />
        }
      >
        <Avatar className="size-9 shrink-0 rounded-full">
          <AvatarFallback className="rounded-full bg-[#658354] text-[12px] font-bold text-white">{initials(user?.name)}</AvatarFallback>
        </Avatar>
        {isExpanded ? (
          <>
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate text-[13px] font-bold leading-none text-[#102315] dark:text-[#edf7ee]">{user?.name ?? 'Loading...'}</div>
              <div className="mt-1 truncate text-[9px] font-extrabold uppercase tracking-wider text-[#64745F]">{roleDisplay}</div>
            </div>
            <ChevronsUpDown className="size-3.5 shrink-0 text-[#64745F] dark:text-[#9fb49b]" />
          </>
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="min-w-[220px] rounded-xl border border-[#c7ddb5] bg-white p-1.5 shadow-lg dark:border-[#2f4a32] dark:bg-[#132018]"
      >
        {/* User info header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-9 shrink-0 rounded-full">
            <AvatarFallback className="rounded-full bg-[#658354] text-[12px] font-bold text-white">{initials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-[#102315] dark:text-[#edf7ee]">{user?.name ?? '—'}</p>
            <p className="truncate text-[11px] text-[#64745F] dark:text-[#9fb49b]">{user?.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-[#102315] focus:bg-[#f2f6ee] dark:text-[#edf7ee] dark:focus:bg-[#203423]"
            onClick={() => navigate({ to: '/settings' })}
          >
            <Settings className="size-4 text-[#64745F]" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="size-4" />
            {logoutMutation.isPending ? 'Signing out…' : 'Sign out'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppLayoutSidebar({ isExpanded, onToggle }: AppLayoutSidebarProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const ToggleIcon = isExpanded ? ChevronsLeft : ChevronsRight

  return (
    <aside
      className={cn(
        'relative flex h-full shrink-0 select-none flex-col justify-between border-r border-[#c7ddb5] bg-white pb-6 pt-3 text-[#102315] transition-all duration-300 ease-in-out dark:border-[#2f4a32] dark:bg-[#0f1712] dark:text-[#edf7ee]',
        isExpanded ? 'w-56 px-4' : 'w-[72px] px-3',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-4 top-7 z-30 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#dde5d8] bg-white text-[#64745F] shadow-sm transition hover:border-[#c7ddb5] hover:bg-[#f2f6ee] hover:text-[#658354] dark:border-[#2f4a32] dark:bg-[#101912] dark:text-[#d6e8cf] dark:hover:bg-[#203423]"
        title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <ToggleIcon className="size-4" />
      </button>
      <div className="flex flex-col">
        <div className={cn('mb-2 flex items-center gap-3 py-1.5 transition-all duration-300', isExpanded ? 'justify-start px-3' : 'justify-center px-1')}>
          <SitelyMark />
          <div className={cn('min-w-0 overflow-hidden transition-all duration-300', isExpanded ? 'w-auto opacity-100' : 'h-0 w-0 opacity-0')}>
            <div className="whitespace-nowrap text-[17px] font-extrabold tracking-normal text-[#102015] dark:text-[#edf7ee]">Sitely</div>
          </div>
        </div>

        <div className="mb-4 w-full border-b border-[#c7ddb5] dark:border-[#2f4a32]" />

        <nav className="flex w-full flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === '/' ? pathname === '/' || pathname.startsWith('/websites') : pathname === item.path || pathname.startsWith(`${item.path}/`)

            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-xl py-2.5 text-[14px] font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#b6d7a8]'
                    : 'text-[#64745F] hover:bg-[#ddead1]/60 hover:text-[#658354] dark:text-[#9fb49b] dark:hover:bg-[#203423] dark:hover:text-[#b6d7a8]',
                  isExpanded ? 'justify-start px-4' : 'justify-center px-0',
                )}
                title={isExpanded ? undefined : item.label}
              >
                <item.icon className={cn('size-4 shrink-0 transition-transform duration-200', isActive ? 'text-[#658354]' : 'text-[#64745F]')} />
                <span
                  className={cn(
                    'whitespace-nowrap transition-all duration-300',
                    isExpanded ? 'w-auto translate-x-0 opacity-100' : 'pointer-events-none w-0 -translate-x-2 overflow-hidden opacity-0',
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex flex-col gap-2">
        <ThemeToggle compact={!isExpanded} />
        <SidebarUserMenu isExpanded={isExpanded} />
      </div>
    </aside>
  )
}
