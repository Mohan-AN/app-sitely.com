import { useRouterState } from '@tanstack/react-router'
import { useTopBarSlot } from './top-bar-slot'

function getPageTitle(pathname: string) {
  if (pathname === '/') return 'Websites'
  if (pathname === '/websites/new') return 'Add Website'
  if (pathname.startsWith('/websites/') && pathname.endsWith('/edit')) return 'Edit Website'
  if (pathname.startsWith('/websites/')) return 'Website Details'
  if (pathname === '/clients' || pathname === '/clients/') return 'Clients'
  if (pathname === '/clients/new') return 'Add Client'
  if (pathname.startsWith('/clients/') && pathname.endsWith('/edit')) return 'Edit Client'
  if (pathname.startsWith('/clients/')) return 'Client Details'
  return 'Sitely'
}

export function TopBar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const slot = useTopBarSlot()
  const slotContent = slot.routeKey === pathname ? slot.content : null
  // Routes where the slot provides the full top-bar content (replaces title + right side)
  const isSlotFullWidth =
    Boolean(slotContent) &&
    (pathname === '/' ||
      pathname === '/websites/new' ||
      pathname === '/clients/new' ||
      (pathname.startsWith('/websites/') && pathname !== '/websites/new') ||
      (pathname.startsWith('/clients/') && pathname !== '/clients/new'))

  return (
    <header className="flex shrink-0 select-none border-b border-[#c7ddb5] bg-white px-8 py-4 text-[#102315] dark:border-[#2f4a32] dark:bg-[#0f1712] dark:text-[#edf7ee]">
      <div className="flex min-h-10 w-full items-center justify-between gap-4">
        {isSlotFullWidth ? (
          slotContent
        ) : (
          <>
            <h1 className="shrink-0 whitespace-nowrap text-[22px] font-extrabold leading-none tracking-normal text-[#102315] dark:text-[#edf7ee]">
              {getPageTitle(pathname)}
            </h1>
            {slotContent ? <div className="ml-6 flex min-w-0 flex-1 items-center justify-end">{slotContent}</div> : null}
          </>
        )}
      </div>
    </header>
  )
}
