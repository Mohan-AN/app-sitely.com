import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarClock, ChevronsUpDown, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '#/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip'
import { ManageDueDateDialog } from '#/components/manage-due-date-dialog'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, apiFetch } from '#/lib/api'
import { authMeQueryOptions } from '#/lib/auth'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function UserInfoHeader({ name, email }: { name?: string; email?: string }) {
  return (
    <div className="flex flex-col px-1.5 py-1.5">
      <span className="truncate text-sm font-semibold">{name ?? '—'}</span>
      <span className="truncate text-xs text-muted-foreground">{email}</span>
    </div>
  )
}

export function UserMenu({ collapsed }: { collapsed?: boolean }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [dueDateOpen, setDueDateOpen] = useState(false)

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

  const avatarEl = (
    <Avatar className="size-8 rounded-lg">
      <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-700">
        {user ? initials(user.name) : '··'}
      </AvatarFallback>
    </Avatar>
  )

  const menuContent = (
    <>
      <UserInfoHeader name={user?.name} email={user?.email} />
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={() => setDueDateOpen(true)}>
          <CalendarClock />
          Manage Due Date
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30"
        >
          <LogOut />
          {logoutMutation.isPending ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )

  const dueDateDialog = (
    <ManageDueDateDialog open={dueDateOpen} onClose={() => setDueDateOpen(false)} />
  )

  if (collapsed) {
    return (
      <>
        <Tooltip>
          <TooltipTrigger
            render={
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button type="button" className="flex size-8 items-center justify-center rounded-lg hover:bg-sidebar-accent" />
                  }
                >
                  {avatarEl}
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" sideOffset={8} className="w-56">
                  {menuContent}
                </DropdownMenuContent>
              </DropdownMenu>
            }
          />
          <TooltipContent side="right">
            <p>{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </TooltipContent>
        </Tooltip>
        {dueDateDialog}
      </>
    )
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
              {avatarEl}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name ?? 'Loading…'}</span>
                <span className="truncate text-xs text-muted-foreground capitalize">{user?.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" sideOffset={8} className="w-56">
              {menuContent}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      {dueDateDialog}
    </>
  )
}
