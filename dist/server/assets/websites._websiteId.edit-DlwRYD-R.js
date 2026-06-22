import { t as Route } from "./websites._websiteId.edit-CC6Am7nl.js";
import { i as useDeleteWebsite, o as useWebsite } from "./use-websites-DxteJjR7.js";
import { t as ConfirmDialog } from "./confirm-dialog-1eeIX5QS.js";
import { t as Skeleton } from "./skeleton-i2ok8WNF.js";
import { t as WebsiteForm } from "./website-form-RBxqyJiq.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
//#region src/routes/_protected/_websites/websites.$websiteId.edit.tsx?tsr-split=component
function EditWebsitePage() {
	const { websiteId } = Route.useParams();
	const navigate = useNavigate();
	const websiteQuery = useWebsite(websiteId);
	const website = websiteQuery.data;
	const deleteMutation = useDeleteWebsite(websiteId);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const handleDeleteConfirm = () => {
		deleteMutation.mutate(void 0, { onSuccess: () => {
			setShowDeleteDialog(false);
			navigate({
				to: "/",
				search: {
					page: 1,
					limit: 10,
					showFilters: false
				}
			});
		} });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-1 flex-col overflow-auto bg-[#F4F5F7]",
		children: [/* @__PURE__ */ jsxs("main", {
			className: "flex flex-1 flex-col gap-[22px] px-[30px] py-[26px]",
			children: [
				/* @__PURE__ */ jsxs("nav", {
					className: "flex items-center gap-1.5 text-[13px] text-[#8A8F98]",
					children: [
						/* @__PURE__ */ jsxs(Link, {
							to: "/",
							search: {
								page: 1,
								limit: 10,
								showFilters: false
							},
							className: "flex items-center gap-1 transition hover:text-[#4F5DF5]",
							children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "size-3.5" }), "Websites"]
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx(Link, {
							to: "/websites/$websiteId",
							params: { websiteId },
							className: "transition hover:text-[#4F5DF5]",
							children: website?.project_name ?? "Website"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-[#11141A]",
							children: "Edit Website"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[21px] font-bold tracking-tight text-[#11141A]",
					children: "Edit Website"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-[3px] text-[12.5px] text-[#8A8F98]",
					children: "Update website information and settings."
				})] }),
				websiteQuery.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-[520px] rounded-[14px]" }) : null,
				websiteQuery.isError ? /* @__PURE__ */ jsx("p", {
					className: "text-[13px] text-[#DC2626]",
					children: websiteQuery.error.message
				}) : null,
				website ? /* @__PURE__ */ jsx(WebsiteForm, {
					mode: "edit",
					website,
					onUpdated: () => navigate({
						to: "/websites/$websiteId",
						params: { websiteId }
					}),
					onCancel: () => navigate({
						to: "/websites/$websiteId",
						params: { websiteId }
					}),
					onDelete: () => setShowDeleteDialog(true),
					isDeleting: deleteMutation.isPending
				}) : null
			]
		}), /* @__PURE__ */ jsx(ConfirmDialog, {
			open: showDeleteDialog,
			onOpenChange: setShowDeleteDialog,
			title: "Delete Website",
			description: `Are you sure you want to delete "${website?.project_name}"? This action cannot be undone.`,
			confirmLabel: "Delete",
			onConfirm: handleDeleteConfirm,
			isPending: deleteMutation.isPending
		})]
	});
}
//#endregion
export { EditWebsitePage as component };
