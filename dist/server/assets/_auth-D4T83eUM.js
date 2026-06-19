import { Outlet } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_auth.tsx?tsr-split=component
function AuthLayout() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen w-full bg-white text-[#0f172a]",
		children: /* @__PURE__ */ jsx("div", {
			className: "relative flex flex-1 flex-col bg-white",
			children: /* @__PURE__ */ jsx("div", {
				className: "relative z-10 flex flex-1 items-center justify-center p-6 sm:p-12",
				children: /* @__PURE__ */ jsx(Outlet, {})
			})
		})
	});
}
//#endregion
export { AuthLayout as component };
