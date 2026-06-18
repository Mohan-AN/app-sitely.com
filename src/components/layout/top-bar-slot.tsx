import { createContext, type ReactNode, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'

interface TopBarSlotContextValue {
  slot: TopBarSlotState
  setSlot: (slot: TopBarSlotState) => void
  clearSlot: (routeKey: string) => void
}

interface TopBarSlotState {
  routeKey: string | null
  content: ReactNode | null
}

const TopBarSlotContext = createContext<TopBarSlotContextValue | null>(null)

export function TopBarSlotProvider({ children }: { children: ReactNode }) {
  const [slot, setSlotState] = useState<TopBarSlotState>({ routeKey: null, content: null })
  const setSlot = useCallback((nextSlot: TopBarSlotState) => {
    setSlotState(nextSlot)
  }, [])
  const clearSlot = useCallback((routeKey: string) => {
    setSlotState((current) => (current.routeKey === routeKey ? { routeKey: null, content: null } : current))
  }, [])

  const value = useMemo(
    () => ({
      slot,
      setSlot,
      clearSlot,
    }),
    [slot, setSlot, clearSlot],
  )

  return <TopBarSlotContext.Provider value={value}>{children}</TopBarSlotContext.Provider>
}

export function useTopBarSlot() {
  const context = useContext(TopBarSlotContext)
  if (!context) throw new Error('useTopBarSlot must be used inside TopBarSlotProvider')
  return context.slot
}

export function TopBarSlot({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  const slot = useContext(TopBarSlotContext)
  const setSlot = slot?.setSlot
  const clearSlot = slot?.clearSlot

  useLayoutEffect(() => {
    setSlot?.({ routeKey, content: children })
    return () => clearSlot?.(routeKey)
  }, [children, routeKey, setSlot, clearSlot])

  return null
}
