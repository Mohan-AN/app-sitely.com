import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { ChevronDown, LogOut, Menu, Moon, Settings, Sun } from 'lucide-react'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, apiFetch } from '#/lib/api'
import { authMeQueryOptions } from '#/lib/auth'
import { useTheme } from '#/hooks/use-theme'
import { useTopBarSlot, useTopBarTabsSlot, useTopBarActionsSlot } from './top-bar-slot'

function initials(name?: string) {
  if (!name) return 'A'
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}


function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex size-9 items-center justify-center rounded-xl border border-[#e5e7ef] bg-[#f8fafc] text-[#334155] transition hover:border-[#c7bdfd] hover:bg-[#f3eeff] hover:text-[#5b38f6] dark:border-[#2a2a3a] dark:bg-[#1a1a2e] dark:text-[#94a3b8] xl:size-10"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

function ProfileDropdown() {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-[#f8fafc] dark:hover:bg-[#1a1a2e]"
          />
        }
      >
        <Avatar className="size-9 rounded-full xl:size-10">
          <AvatarFallback className="rounded-full bg-[#5b38f6] text-[13px] font-semibold text-white">
            {initials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="size-4 text-[#64748b]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-48 rounded-2xl border border-[#e4e8f0] bg-white p-1.5 shadow-xl dark:border-[#2a2a3a] dark:bg-[#111827]">
        <div className="px-3 py-2 border-b border-[#f1f5f9] dark:border-[#1f2937] mb-1">
          <div className="text-[13px] font-semibold text-[#111827] dark:text-white">{user?.name ?? 'Admin'}</div>
          <div className="text-[11px] text-[#64748b]">{user?.role?.replace('_', ' ') ?? 'admin'}</div>
        </div>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-[#0f172a] focus:bg-[#f4f1ff] dark:text-white dark:focus:bg-[#1f2937]"
            onClick={() => navigate({ to: '/settings' })}
          >
            <Settings className="size-4 text-[#64748b]" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="size-4" />
            {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function TopBar({
  onMenuClick,
  showMenuButton = false,
}: {
  onMenuClick?: () => void
  showMenuButton?: boolean
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const slot = useTopBarSlot()
  const slotContent = slot.routeKey === pathname ? slot.content : null
  const tabsSlot = useTopBarTabsSlot()
  const tabsContent = tabsSlot.routeKey === pathname ? tabsSlot.content : null
  const actionsSlot = useTopBarActionsSlot()
  const actionsContent = actionsSlot.routeKey === pathname ? actionsSlot.content : null

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-[#e7ecf3] bg-white dark:border-[#1f2937] dark:bg-[#0b1020]">
      <div className="flex items-center gap-3 px-4 py-3 lg:px-5 xl:gap-4 xl:px-7 xl:py-4">
        {showMenuButton ? (
          <Button variant="outline" size="icon-lg" className="shrink-0 xl:hidden" onClick={onMenuClick} aria-label="Open navigation">
            <Menu className="size-4" />
          </Button>
        ) : null}

        <div className="min-w-0 flex-1">
          {slotContent}
        </div>

        <div className="hidden min-w-0 shrink-0 items-center gap-3 lg:flex xl:gap-4">
          {actionsContent}

          <ThemeToggleButton />

          <ProfileDropdown />
        </div>
      </div>

      {tabsContent ? (
        <div className="px-4 lg:px-5 xl:px-7">
          {tabsContent}
        </div>
      ) : null}
    </header>
  )
}
