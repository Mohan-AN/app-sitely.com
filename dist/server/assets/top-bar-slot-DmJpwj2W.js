import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/components/layout/top-bar-slot.tsx
var TopBarSlotContext = createContext(null);
function TopBarSlotProvider({ children }) {
	const [slot, setSlotState] = useState({
		routeKey: null,
		content: null
	});
	const setSlot = useCallback((nextSlot) => {
		setSlotState(nextSlot);
	}, []);
	const clearSlot = useCallback((routeKey) => {
		setSlotState((current) => current.routeKey === routeKey ? {
			routeKey: null,
			content: null
		} : current);
	}, []);
	const value = useMemo(() => ({
		slot,
		setSlot,
		clearSlot
	}), [
		slot,
		setSlot,
		clearSlot
	]);
	return /* @__PURE__ */ jsx(TopBarSlotContext.Provider, {
		value,
		children
	});
}
function useTopBarSlot() {
	const context = useContext(TopBarSlotContext);
	if (!context) throw new Error("useTopBarSlot must be used inside TopBarSlotProvider");
	return context.slot;
}
function TopBarSlot({ routeKey, children }) {
	const slot = useContext(TopBarSlotContext);
	const setSlot = slot?.setSlot;
	const clearSlot = slot?.clearSlot;
	useLayoutEffect(() => {
		setSlot?.({
			routeKey,
			content: children
		});
		return () => clearSlot?.(routeKey);
	}, [
		children,
		routeKey,
		setSlot,
		clearSlot
	]);
	return null;
}
//#endregion
export { TopBarSlotProvider as n, useTopBarSlot as r, TopBarSlot as t };
