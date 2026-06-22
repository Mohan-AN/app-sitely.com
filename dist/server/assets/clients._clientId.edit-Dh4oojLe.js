import { t as Route } from "./clients._clientId.edit-BH6gFrrj.js";
import { t as ConfirmDialog } from "./confirm-dialog-1eeIX5QS.js";
import { t as Skeleton } from "./skeleton-i2ok8WNF.js";
import { i as useDeleteClient, t as useClient } from "./use-clients-BcKNT9QA.js";
import { t as ClientForm } from "./client-form-BEV_FBNh.js";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
//#region src/routes/_protected/_clients/clients.$clientId.edit.tsx?tsr-split=component
function EditClientPage() {
	const { clientId } = Route.useParams();
	const navigate = useNavigate();
	const clientQuery = useClient(clientId);
	const client = clientQuery.data;
	const deleteMutation = useDeleteClient(clientId);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const handleDeleteConfirm = () => {
		deleteMutation.mutate(void 0, { onSuccess: () => {
			setShowDeleteDialog(false);
			navigate({
				to: "/clients",
				search: {
					page: 1,
					limit: 20
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
							to: "/clients",
							search: {
								page: 1,
								limit: 20
							},
							className: "flex items-center gap-1 transition hover:text-[#4F5DF5]",
							children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "size-3.5" }), "Clients"]
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx(Link, {
							to: "/clients/$clientId",
							params: { clientId },
							className: "transition hover:text-[#4F5DF5]",
							children: client?.name ?? "Client"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-[#11141A]",
							children: "Edit Client"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[21px] font-bold tracking-tight text-[#11141A]",
					children: "Edit Client"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-[3px] text-[12.5px] text-[#8A8F98]",
					children: "Update client contact and company details."
				})] }),
				clientQuery.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-80 rounded-[14px]" }) : null,
				clientQuery.isError ? /* @__PURE__ */ jsx("p", {
					className: "text-[13px] text-[#DC2626]",
					children: clientQuery.error.message
				}) : null,
				client ? /* @__PURE__ */ jsx(ClientForm, {
					mode: "edit",
					client,
					onUpdated: () => navigate({
						to: "/clients/$clientId",
						params: { clientId }
					}),
					onCancel: () => navigate({
						to: "/clients/$clientId",
						params: { clientId }
					}),
					onDelete: () => setShowDeleteDialog(true),
					isDeleting: deleteMutation.isPending
				}) : null
			]
		}), /* @__PURE__ */ jsx(ConfirmDialog, {
			open: showDeleteDialog,
			onOpenChange: setShowDeleteDialog,
			title: "Delete Client",
			description: `Are you sure you want to delete "${client?.name}"? All associated data will be removed. This cannot be undone.`,
			confirmLabel: "Delete",
			onConfirm: handleDeleteConfirm,
			isPending: deleteMutation.isPending
		})]
	});
}
//#endregion
export { EditClientPage as component };
