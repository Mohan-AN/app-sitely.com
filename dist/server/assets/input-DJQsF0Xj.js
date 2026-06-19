import { n as cn } from "./button-FgxVcNwj.js";
import "react";
import { jsx } from "react/jsx-runtime";
import { Input } from "@base-ui/react/input";
//#region src/components/ui/input.tsx
function Input$1({ className, type, ...props }) {
	return /* @__PURE__ */ jsx(Input, {
		type,
		"data-slot": "input",
		className: cn("h-11 w-full min-w-0 rounded-lg border border-[#dce3ef] bg-white px-3.5 py-2 text-base text-[#172554] transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#7f8aa3] focus-visible:border-[#4f2df5] focus-visible:ring-3 focus-visible:ring-[#4f2df5]/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:border-[#25304a] dark:bg-[#111827] dark:text-[#edf2ff] dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", className),
		...props
	});
}
//#endregion
export { Input$1 as t };
