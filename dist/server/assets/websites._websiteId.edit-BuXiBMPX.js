import { t as Button } from "./button-jrDuWETO.js";
import { t as Route } from "./websites._websiteId.edit-ZTf0kA-e.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { t as ConfirmDialog } from "./confirm-dialog-DgKpdZE4.js";
import { t as Skeleton } from "./skeleton-BcCjHA20.js";
import { a as useWebsite, r as useDeleteWebsite, t as WebsiteForm } from "./website-form-BHMfhLsp.js";
import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ChevronRight } from "lucide-react";
//#region src/routes/_protected/_websites/websites.$websiteId.edit.tsx?tsr-split=component
function EditWebsitePage() {
	const { websiteId } = Route.useParams();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(TopBarSlot, {
			routeKey: pathname,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex w-full items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("nav", {
					className: "flex items-center gap-1.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							search: {
								page: 1,
								limit: 10,
								showFilters: false
							},
							className: "transition hover:text-[#102315] dark:hover:text-[#edf7ee]",
							children: "Websites"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx(Link, {
							to: "/websites/$websiteId",
							params: { websiteId },
							className: "transition hover:text-[#102315] dark:hover:text-[#edf7ee]",
							children: website?.projectName ?? "Website"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-[#102315] dark:text-[#edf7ee]",
							children: "Edit Website"
						})
					]
				}), /* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					className: "gap-2 rounded-xl border-[#dde5d8] text-[#334155] dark:border-[#2f4a32] dark:text-[#d6e8cf]",
					render: /* @__PURE__ */ jsx(Link, {
						to: "/websites/$websiteId",
						params: { websiteId }
					}),
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }), "Back to Website"]
				})]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col overflow-auto bg-[#f8faf7] dark:bg-[#0b110d]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "px-8 pb-4 pt-5",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-[#102315] dark:text-[#edf7ee]",
					children: "Update Website"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
					children: "Update website information and settings."
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 flex-col px-8 pb-8",
				children: [
					websiteQuery.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-[520px] rounded-xl" }) : null,
					websiteQuery.isError ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-destructive",
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
			})]
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
export { EditWebsitePage as component };
