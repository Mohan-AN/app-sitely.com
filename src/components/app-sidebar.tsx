import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { CalendarClock, Globe, Users } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '#/components/ui/sidebar'
import { ManageDueDateDialog } from '#/components/manage-due-date-dialog'
import { UserMenu } from '#/components/user-menu'

const NAV_ITEMS = [
  { title: 'Websites', to: '/', icon: Globe },
  { title: 'Clients', to: '/clients', icon: Users },
]

function SitelyLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      {/* Green background */}
      <rect width="32" height="32" rx="8" fill="#15803d" />

      {/* Crown — 3 spikes */}
      <path
        d="M7 17 L7 12 L11 15 L16 7 L21 15 L25 12 L25 17 Z"
        fill="white"
      />

      {/* Eye outline — almond shape */}
      <path
        d="M4 22 C7 17 11 15 16 15 C21 15 25 17 28 22 C25 27 21 29 16 29 C11 29 7 27 4 22 Z"
        fill="white"
      />

      {/* Iris */}
      <circle cx="16" cy="22" r="4" fill="#15803d" />

      {/* Pupil highlight */}
      <circle cx="16" cy="22" r="1.8" fill="white" />
    </svg>
  )
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [dueDateOpen, setDueDateOpen] = useState(false)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* Expanded header: logo + name + toggle */}
        <div className="flex items-center justify-between px-2 py-1.5 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <SitelyLogo />
            <span className="truncate text-lg font-bold text-emerald-700">Sitely</span>
          </div>
          <SidebarTrigger />
        </div>
        {/* Collapsed header: just the toggle trigger centered */}
        <div className="hidden items-center justify-center py-1.5 group-data-[collapsible=icon]:flex">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.to}
                    tooltip={item.title}
                    className="data-active:bg-emerald-600 data-active:text-white data-active:hover:bg-emerald-600/90"
                    render={<Link to={item.to} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Manage Due Date"
                  onClick={() => setDueDateOpen(true)}
                >
                  <CalendarClock />
                  <span>Manage Due Date</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-1 group-data-[collapsible=icon]:justify-center">
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <UserMenu />
          </div>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-1 pb-1">
          <UserMenu collapsed />
        </div>
      </SidebarFooter>

      <ManageDueDateDialog open={dueDateOpen} onClose={() => setDueDateOpen(false)} />
    </Sidebar>
  )
}
