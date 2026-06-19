import { n as cn, t as Button } from "./button-FgxVcNwj.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, SearchX } from "lucide-react";
//#region src/components/ui/page-size-selector.tsx
function PageSizeSelector({ value, onChange, options = [
	10,
	20,
	50,
	100
], total, page, limit, className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex flex-wrap items-center gap-2 text-[13px] text-[#475467]", className),
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ jsx("span", { children: "Show" }), /* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx("select", {
					value,
					onChange: (event) => onChange(Number(event.target.value)),
					className: "h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-white py-2 pl-3 pr-8 font-medium text-[#0f172a] outline-none transition hover:border-[#d8ddff] focus:border-[#5b38f6] focus:ring-2 focus:ring-[#5b38f6]/10",
					children: options.map((option) => /* @__PURE__ */ jsx("option", {
						value: option,
						children: option
					}, option))
				}), /* @__PURE__ */ jsx(ChevronDown, { className: "pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" })]
			})]
		}), total !== void 0 ? /* @__PURE__ */ jsxs("span", { children: [
			"of ",
			total,
			" results"
		] }) : null]
	});
}
//#endregion
//#region src/hooks/use-debounce.ts
function useDebounce(value, delay = 300) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const timer = window.setTimeout(() => setDebounced(value), delay);
		return () => window.clearTimeout(timer);
	}, [value, delay]);
	return debounced;
}
//#endregion
//#region src/components/ui/no-results.tsx
function NoResults({ message = "No results found.", onClear }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-[180px] flex-col items-center justify-center gap-3 text-center text-[#64745F]",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex size-12 items-center justify-center rounded-xl border border-[#c7ddb5] bg-[#ddead1]/45 text-[#658354]",
				children: /* @__PURE__ */ jsx(SearchX, { className: "size-5" })
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm font-semibold",
				children: message
			}),
			onClear ? /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				className: "border-[#c7ddb5]",
				onClick: onClear,
				children: "Clear filters"
			}) : null
		]
	});
}
//#endregion
export { useDebounce as n, PageSizeSelector as r, NoResults as t };
