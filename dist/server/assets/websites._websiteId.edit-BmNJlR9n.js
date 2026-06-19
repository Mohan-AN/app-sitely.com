import { t as Button } from "./button-FgxVcNwj.js";
import { t as Route } from "./websites._websiteId.edit-B_Iu9gYb.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { t as ConfirmDialog } from "./confirm-dialog-Bm6pbGp0.js";
import { t as Skeleton } from "./skeleton-BjBHU5LC.js";
import { a as useWebsite, r as useDeleteWebsite, t as WebsiteForm } from "./website-form-DTxAujeE.js";
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
					className: "flex items-center gap-1.5 text-sm text-[#253858] dark:text-[#a6b2cf]",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							search: {
								page: 1,
								limit: 10,
								showFilters: false
							},
							className: "font-semibold text-[#4f2df5] transition hover:text-[#3f22d8]",
							children: "Websites"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx(Link, {
							to: "/websites/$websiteId",
							params: { websiteId },
							className: "transition hover:text-[#0f172a] dark:hover:text-[#edf2ff]",
							children: website?.projectName ?? "Website"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-[#0f172a] dark:text-[#edf2ff]",
							children: "Edit Website"
						})
					]
				}), /* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					className: "gap-2 rounded-lg border-[#dce3ef] text-[#172554] dark:border-[#25304a] dark:text-[#a6b2cf]",
					render: /* @__PURE__ */ jsx(Link, {
						to: "/websites/$websiteId",
						params: { websiteId }
					}),
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }), "Back to Website"]
				})]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col overflow-auto bg-white dark:bg-[#0b1020]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "px-10 pb-7 pt-5",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-[34px] font-extrabold text-[#0b1020] dark:text-[#edf2ff]",
					children: "Edit Website"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-xl font-bold text-[#0f172a] dark:text-[#edf2ff]",
					children: website?.projectName ?? "Website"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 flex-col px-10 pb-8",
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
