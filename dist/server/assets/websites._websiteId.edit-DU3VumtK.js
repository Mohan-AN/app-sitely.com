import { t as Route } from "./websites._websiteId.edit-0vX7X314.js";
import { l as useWebsite, r as useDeleteWebsite } from "./use-websites-BnWcvb5r.js";
import { t as ConfirmDialog } from "./confirm-dialog-Q5QxauQW.js";
import { t as Skeleton } from "./skeleton-3GrrKxds.js";
import { t as WebsiteWizard } from "./website-wizard-VCCPlIGj.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/_protected/_websites/websites.$websiteId.edit.tsx?tsr-split=component
function EditWebsitePage() {
	const { websiteId } = Route.useParams();
	const navigate = useNavigate();
	const websiteQuery = useWebsite(websiteId);
	const website = websiteQuery.data;
	const deleteMutation = useDeleteWebsite(websiteId);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	if (websiteQuery.isLoading) return /* @__PURE__ */ jsxs("div", {
		className: "flex h-full flex-col gap-4 bg-[#f4f5f8] p-6",
		children: [
			/* @__PURE__ */ jsx(Skeleton, { className: "h-16 rounded-[14px]" }),
			/* @__PURE__ */ jsx(Skeleton, { className: "h-[72px] rounded-[14px]" }),
			/* @__PURE__ */ jsx(Skeleton, { className: "flex-1 rounded-[14px]" })
		]
	});
	if (websiteQuery.isError) return /* @__PURE__ */ jsx("div", {
		className: "flex h-full items-center justify-center",
		children: /* @__PURE__ */ jsx("p", {
			className: "text-[13px] text-[#DC2626]",
			children: websiteQuery.error.message
		})
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [website && /* @__PURE__ */ jsx("div", {
		className: "flex h-full flex-col overflow-hidden",
		children: /* @__PURE__ */ jsx(WebsiteWizard, {
			mode: "edit",
			website,
			cancelHref: `/websites/${websiteId}`,
			onUpdated: () => navigate({
				to: "/websites/$websiteId",
				params: { websiteId }
			}),
			onDelete: () => setShowDeleteDialog(true),
			isDeleting: deleteMutation.isPending
		})
	}), /* @__PURE__ */ jsx(ConfirmDialog, {
		open: showDeleteDialog,
		onOpenChange: setShowDeleteDialog,
		title: "Delete Website",
		description: `Are you sure you want to delete "${website?.project_name}"? This action cannot be undone.`,
		confirmLabel: "Delete",
		onConfirm: () => deleteMutation.mutate(void 0, { onSuccess: () => {
			setShowDeleteDialog(false);
			navigate({
				to: "/",
				search: {
					page: 1,
					limit: 10,
					showFilters: false
				}
			});
		} }),
		isPending: deleteMutation.isPending
	})] });
}
//#endregion
export { EditWebsitePage as component };
