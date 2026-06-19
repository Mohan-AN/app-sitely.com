import type React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronsLeft, ChevronsRight, Globe2, Users } from 'lucide-react'
import { Sheet as MobileSheet, SheetContent } from '#/components/ui/sheet'
import { cn } from '#/lib/utils'

interface AppLayoutSidebarProps {
  isExpanded: boolean
  isMobile?: boolean
  mobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
  onToggle: () => void
}

function NavLink({
  to,
  search,
  label,
  icon: Icon,
  isActive,
  isExpanded,
  onNavigate,
}: {
  to: '/' | '/clients'
  search?: Record<string, unknown>
  label: string
  icon: React.ElementType
  isActive: boolean
  isExpanded: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      to={to}
      search={search as never}
      onClick={onNavigate}
      className={cn(
        'relative flex h-12 items-center gap-3 transition',
        isExpanded ? '-mr-4 rounded-l-2xl pl-5 pr-4' : 'justify-center rounded-2xl px-0',
        isActive ? 'bg-[#f3eeff]' : 'hover:bg-[#f8fafc]',
      )}
      title={!isExpanded ? label : undefined}
    >
      <Icon className={cn('size-[18px] shrink-0', isActive ? 'text-[#5b38f6]' : 'text-[#334155]')} />
      {isExpanded ? (
        <span className={cn('text-[14px] font-medium', isActive ? 'text-[#5b38f6]' : 'text-[#1f2937]')}>
          {label}
        </span>
      ) : null}
      {isActive ? <span className="absolute inset-y-1 right-0 w-[3px] rounded-full bg-[#5b38f6]" /> : null}
    </Link>
  )
}


function SidebarInner({ isExpanded = true, onToggle, onNavigate }: { isExpanded?: boolean; onToggle?: () => void; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-r border-[#e7ecf3] bg-white py-6',
        isExpanded ? 'px-4' : 'px-2',
      )}
    >
      {/* Brand */}
      <div className={cn('flex items-center', isExpanded ? 'gap-3' : 'justify-center')}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#5b38f6] text-[18px] font-bold text-white shadow-[0_12px_24px_rgba(91,56,246,0.22)]">
          S
        </div>
        {isExpanded ? (
          <span className="text-[20px] font-semibold tracking-normal text-[#111827]">Sitely</span>
        ) : null}
      </div>

      {/* Nav items */}
      <nav className="mt-8 flex flex-1 flex-col gap-2">
        <NavLink
          to="/"
          search={{ page: 1, limit: 10, showFilters: false }}
          label="Websites"
          icon={Globe2}
          isActive={pathname === '/' || pathname.startsWith('/websites')}
          isExpanded={isExpanded}
          onNavigate={onNavigate}
        />
        <NavLink
          to="/clients"
          label="Clients"
          icon={Users}
          isActive={pathname === '/clients' || pathname.startsWith('/clients/')}
          isExpanded={isExpanded}
          onNavigate={onNavigate}
        />
      </nav>

      {/* Toggle button */}
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className="absolute -right-3.5 top-[61px] z-30 flex size-7 items-center justify-center rounded-full border border-[#e7ecf3] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.1)] transition hover:border-[#c7bdfd] hover:bg-[#f3eeff] hover:text-[#5b38f6] xl:top-[69px]"
        >
          {isExpanded ? (
            <ChevronsLeft className="size-3.5 text-[#64748b]" />
          ) : (
            <ChevronsRight className="size-3.5 text-[#64748b]" />
          )}
        </button>
      ) : null}
    </div>
  )
}


export function AppLayoutSidebar({
  isExpanded = true,
  isMobile = false,
  mobileOpen = false,
  onMobileOpenChange,
  onToggle,
}: AppLayoutSidebarProps) {
  if (isMobile) {
    return (
      <MobileSheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-[260px] border-r border-[#e7ecf3] bg-white p-0" showCloseButton={false}>
          <SidebarInner isExpanded onNavigate={() => onMobileOpenChange?.(false)} />
        </SheetContent>
      </MobileSheet>
    )
  }

  return (
    <aside
      className={cn(
        'hidden shrink-0 transition-[width] duration-300 lg:block',
        isExpanded ? 'w-[210px]' : 'w-[72px]',
      )}
    >
      <SidebarInner isExpanded={isExpanded} onToggle={onToggle} />
    </aside>
  )
}
