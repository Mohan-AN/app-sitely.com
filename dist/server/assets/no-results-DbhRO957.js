import { n as cn, t as Button } from "./button-jrDuWETO.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Search, SearchX } from "lucide-react";
//#region src/components/ui/search-bar.tsx
function SearchBar({ value, onChange, placeholder = "Search...", className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("group flex h-10 items-center gap-2 rounded-xl border border-[#c7ddb5] bg-white px-4 text-[#102315] shadow-sm transition hover:bg-[#f8faf7] dark:border-[#2f4a32] dark:bg-[#132018] dark:text-[#edf7ee] dark:hover:bg-[#203423]", className),
		children: [/* @__PURE__ */ jsx(Search, { className: "size-4 shrink-0 text-[#64745F] transition group-focus-within:text-[#658354] dark:text-[#9fb49b] dark:group-focus-within:text-[#b6d7a8]" }), /* @__PURE__ */ jsx("input", {
			type: "text",
			value,
			onChange: (event) => onChange(event.target.value),
			placeholder,
			className: "min-w-0 flex-1 border-0 bg-transparent text-[13px] font-medium outline-none placeholder:text-[#94A3B8] focus:ring-0 dark:placeholder:text-[#7f947b]"
		})]
	});
}
//#endregion
//#region src/components/ui/page-size-selector.tsx
function PageSizeSelector({ value, onChange, options = [
	10,
	20,
	30
], total, className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex items-center gap-2 text-[13px] font-medium text-[#64745F]", className),
		children: [
			/* @__PURE__ */ jsx("span", { children: "Show" }),
			/* @__PURE__ */ jsx("select", {
				value,
				onChange: (event) => onChange(Number(event.target.value)),
				className: "h-9 cursor-pointer rounded-lg border border-[#c7ddb5] bg-white px-2.5 font-bold text-[#102315] shadow-sm outline-none transition hover:bg-[#ddead1]/20 focus:ring-3 focus:ring-[#658354]/20",
				children: options.map((option) => /* @__PURE__ */ jsx("option", {
					value: option,
					children: option
				}, option))
			}),
			/* @__PURE__ */ jsx("span", { children: total === void 0 ? "results per page" : `of ${total} results` })
		]
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
export { SearchBar as i, useDebounce as n, PageSizeSelector as r, NoResults as t };
