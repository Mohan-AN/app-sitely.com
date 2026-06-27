import { t as Button } from "./button-N4VO-qD6.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle } from "lucide-react";
import { Dialog } from "@base-ui/react";
//#region src/components/ui/confirm-dialog.tsx
function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Delete", onConfirm, isPending }) {
	return /* @__PURE__ */ jsx(Dialog.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Backdrop, { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" }), /* @__PURE__ */ jsxs(Dialog.Popup, {
			className: "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#1e2244] dark:bg-[#181b2d]",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-4 flex size-11 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30",
					children: /* @__PURE__ */ jsx(AlertTriangle, { className: "size-5 text-red-600" })
				}),
				/* @__PURE__ */ jsx(Dialog.Title, {
					className: "text-base font-bold text-[#101828] dark:text-[#edf7ee]",
					children: title
				}),
				/* @__PURE__ */ jsx(Dialog.Description, {
					className: "mt-1.5 text-sm text-[#475467] dark:text-[#9fb49b]",
					children: description
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex justify-end gap-3",
					children: [/* @__PURE__ */ jsx(Dialog.Close, {
						render: /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							className: "h-9 min-w-20 rounded-lg border-[#E5E7EB] dark:border-[#1e2244]"
						}),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						type: "button",
						disabled: isPending,
						className: "h-9 min-w-24 rounded-lg bg-red-600 font-semibold text-white hover:bg-red-700",
						onClick: onConfirm,
						children: isPending ? "Deleting..." : confirmLabel
					})]
				})
			]
		})] })
	});
}
//#endregion
export { ConfirmDialog as t };
