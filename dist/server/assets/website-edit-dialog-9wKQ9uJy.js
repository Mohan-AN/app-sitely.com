import { n as cn } from "./button-FgxVcNwj.js";
import { t as ConfirmDialog } from "./confirm-dialog-Bm6pbGp0.js";
import { t as Skeleton } from "./skeleton-BjBHU5LC.js";
import { a as useWebsite, r as useDeleteWebsite, t as WebsiteForm } from "./website-form-DTxAujeE.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
import { Dialog } from "@base-ui/react";
//#region src/components/websites/status-badges.tsx
var STATUS_PILL_COLORS = {
	"In Progress": "text-orange-600 bg-orange-50",
	Live: "text-emerald-600 bg-emerald-50",
	"On Hold": "text-gray-700 bg-gray-100",
	Completed: "text-blue-700 bg-blue-50",
	Discontinued: "text-gray-700 bg-gray-100",
	Expired: "text-red-700 bg-red-50",
	"Transfer Pending": "text-orange-700 bg-orange-50",
	"Not Started": "text-gray-700 bg-gray-100",
	Active: "text-emerald-700 bg-emerald-50",
	Paused: "text-gray-700 bg-gray-100",
	"Due Soon": "text-orange-600 bg-orange-50",
	Cancelled: "text-gray-700 bg-gray-100",
	Overdue: "text-red-700 bg-red-50"
};
var MAINTENANCE_BADGE_COLORS = {
	Standard: "border-emerald-500 text-emerald-700",
	"Updates Only": "border-blue-400 text-blue-700",
	None: "border-gray-300 text-gray-500",
	"Not Started": "border-gray-300 text-gray-500",
	Active: "border-emerald-500 text-emerald-700",
	Paused: "border-gray-300 text-gray-500",
	Expired: "border-red-400 bg-red-50 text-red-600",
	Cancelled: "border-gray-300 text-gray-500",
	"Over Due": "border-transparent bg-red-50 text-red-600",
	Overdue: "border-transparent bg-red-50 text-red-600",
	"Due Soon": "border-transparent bg-orange-50 text-orange-600",
	"Up to Date": "border-transparent bg-emerald-50 text-emerald-600"
};
function StatusPill({ label }) {
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex h-6 w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap", STATUS_PILL_COLORS[label] ?? "bg-gray-100 text-gray-700"),
		children: [/* @__PURE__ */ jsx("span", { className: cn("size-1.5 rounded-full", label === "Live" ? "bg-emerald-500" : label === "In Progress" ? "bg-orange-500" : "bg-slate-400") }), label]
	});
}
var MAINTENANCE_DOT = {
	"Over Due": "bg-red-500",
	Overdue: "bg-red-500",
	Expired: "bg-red-500",
	"Due Soon": "bg-amber-400",
	"Up to Date": "bg-emerald-500"
};
function MaintenanceBadge({ label }) {
	const dot = MAINTENANCE_DOT[label];
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex h-6 w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap", MAINTENANCE_BADGE_COLORS[label] ?? "border-gray-300 text-gray-500"),
		children: [dot ? /* @__PURE__ */ jsx("span", { className: cn("size-1.5 shrink-0 rounded-full", dot) }) : null, label]
	});
}
//#endregion
//#region src/components/websites/website-edit-dialog.tsx
function WebsiteEditDialog({ websiteId, open, onOpenChange }) {
	return /* @__PURE__ */ jsx(Dialog.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Backdrop, { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" }), /* @__PURE__ */ jsx(Dialog.Popup, {
			className: "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-[#e5ebe2] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#2f4a32] dark:bg-[#132018]",
			children: /* @__PURE__ */ jsx(EditDialogContent, {
				websiteId,
				onClose: () => onOpenChange(false)
			})
		})] })
	});
}
function EditDialogContent({ websiteId, onClose }) {
	const { data: website, isLoading, isError, error } = useWebsite(websiteId);
	const deleteMutation = useDeleteWebsite(websiteId);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const handleDeleteConfirm = () => {
		deleteMutation.mutate(void 0, { onSuccess: () => {
			setShowDeleteDialog(false);
			onClose();
		} });
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "flex shrink-0 items-start justify-between border-b border-[#f0f4ee] px-6 py-4 dark:border-[#2f4a32]/60",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Dialog.Title, {
				className: "text-base font-extrabold text-[#102315] dark:text-[#edf7ee]",
				children: "Edit Website"
			}), /* @__PURE__ */ jsx(Dialog.Description, {
				className: "mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
				children: website ? website.projectName : "Update website information and settings."
			})] }), /* @__PURE__ */ jsx(Dialog.Close, {
				render: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "flex size-7 shrink-0 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#e8f0e4] hover:text-[#102315] dark:hover:bg-[#203423] dark:hover:text-[#edf7ee]"
				}),
				children: /* @__PURE__ */ jsx(X, { className: "size-4" })
			})]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-6 py-5",
			children: isLoading ? /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4",
				children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-48 rounded-xl" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-64 rounded-xl" })]
			}) : isError ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-destructive",
				children: error.message
			}) : website ? /* @__PURE__ */ jsx(WebsiteForm, {
				mode: "edit",
				website,
				onUpdated: onClose,
				onCancel: onClose,
				onDelete: () => setShowDeleteDialog(true),
				isDeleting: deleteMutation.isPending
			}) : null
		}),
		/* @__PURE__ */ jsx(ConfirmDialog, {
			open: showDeleteDialog,
			onOpenChange: setShowDeleteDialog,
			title: "Delete Website",
			description: `Are you sure you want to delete "${website?.projectName}"? This action cannot be undone.`,
			confirmLabel: "Delete",
			onConfirm: handleDeleteConfirm,
			isPending: deleteMutation.isPending
		})
	] });
}
//#endregion
export { MaintenanceBadge as n, StatusPill as r, WebsiteEditDialog as t };
