import { createContext, type ReactNode, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'

interface SlotState {
  routeKey: string | null
  content: ReactNode | null
}

interface SlotContextValue {
  slot: SlotState
  setSlot: (slot: SlotState) => void
  clearSlot: (routeKey: string) => void
}

function makeSlotContext() {
  const Context = createContext<SlotContextValue | null>(null)

  function Provider({ children }: { children: ReactNode }) {
    const [slot, setSlotState] = useState<SlotState>({ routeKey: null, content: null })
    const setSlot = useCallback((next: SlotState) => setSlotState(next), [])
    const clearSlot = useCallback((key: string) => {
      setSlotState((cur) => (cur.routeKey === key ? { routeKey: null, content: null } : cur))
    }, [])
    const value = useMemo(() => ({ slot, setSlot, clearSlot }), [slot, setSlot, clearSlot])
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useSlot() {
    const ctx = useContext(Context)
    if (!ctx) throw new Error('Must be used inside Provider')
    return ctx.slot
  }

  function Slot({ routeKey, children }: { routeKey: string; children: ReactNode }) {
    const ctx = useContext(Context)
    const setSlot = ctx?.setSlot
    const clearSlot = ctx?.clearSlot
    useLayoutEffect(() => {
      setSlot?.({ routeKey, content: children })
      return () => clearSlot?.(routeKey)
    }, [children, routeKey, setSlot, clearSlot])
    return null
  }

  return { Provider, useSlot, Slot }
}

const TitleSlot = makeSlotContext()
const TabsSlot = makeSlotContext()
const ActionsSlot = makeSlotContext()

export function TopBarSlotProvider({ children }: { children: ReactNode }) {
  return (
    <TitleSlot.Provider>
      <TabsSlot.Provider>
        <ActionsSlot.Provider>{children}</ActionsSlot.Provider>
      </TabsSlot.Provider>
    </TitleSlot.Provider>
  )
}

export function useTopBarSlot() {
  return TitleSlot.useSlot()
}

export function useTopBarTabsSlot() {
  return TabsSlot.useSlot()
}

export function useTopBarActionsSlot() {
  return ActionsSlot.useSlot()
}

export function TopBarSlot({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return <TitleSlot.Slot routeKey={routeKey}>{children}</TitleSlot.Slot>
}

export function TopBarTabsSlot({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return <TabsSlot.Slot routeKey={routeKey}>{children}</TabsSlot.Slot>
}

export function TopBarActionsSlot({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return <ActionsSlot.Slot routeKey={routeKey}>{children}</ActionsSlot.Slot>
}
