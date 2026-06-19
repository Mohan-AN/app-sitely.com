import { t as Button } from "./button-FgxVcNwj.js";
import { t as Route } from "./clients._clientId.edit-C5t4Yh1_.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { t as ConfirmDialog } from "./confirm-dialog-Bm6pbGp0.js";
import { t as Skeleton } from "./skeleton-BjBHU5LC.js";
import { i as useDeleteClient, t as useClient } from "./use-clients-Dj4Jlz99.js";
import { t as ClientForm } from "./client-form-D9TLkbIh.js";
import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ChevronRight } from "lucide-react";
//#region src/routes/_protected/_clients/clients.$clientId.edit.tsx?tsr-split=component
function EditClientPage() {
	const { clientId } = Route.useParams();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(TopBarSlot, {
			routeKey: pathname,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex w-full items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("nav", {
					className: "flex items-center gap-1.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/clients",
							search: {
								page: 1,
								limit: 20
							},
							className: "transition hover:text-[#102315] dark:hover:text-[#edf7ee]",
							children: "Clients"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx(Link, {
							to: "/clients/$clientId",
							params: { clientId },
							className: "transition hover:text-[#102315] dark:hover:text-[#edf7ee]",
							children: client?.name ?? "Client"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-[#102315] dark:text-[#edf7ee]",
							children: "Edit Client"
						})
					]
				}), /* @__PURE__ */ jsxs(Button, {
					variant: "outline",
					className: "gap-2 rounded-xl border-[#dde5d8] text-[#334155] dark:border-[#2f4a32] dark:text-[#d6e8cf]",
					render: /* @__PURE__ */ jsx(Link, {
						to: "/clients/$clientId",
						params: { clientId }
					}),
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }), "Back to Client"]
				})]
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-col overflow-auto bg-[#f8faf7] dark:bg-[#0b110d]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "px-8 pb-4 pt-5",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-[#102315] dark:text-[#edf7ee]",
					children: "Edit Client"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
					children: "Update client contact and company details."
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 flex-col px-8 pb-8",
				children: [
					clientQuery.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-80 rounded-xl" }) : null,
					clientQuery.isError ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-destructive",
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
			})]
		}),
		/* @__PURE__ */ jsx(ConfirmDialog, {
			open: showDeleteDialog,
			onOpenChange: setShowDeleteDialog,
			title: "Delete Client",
			description: `Are you sure you want to delete "${client?.name}"? All associated data will be removed. This cannot be undone.`,
			confirmLabel: "Delete",
			onConfirm: handleDeleteConfirm,
			isPending: deleteMutation.isPending
		})
	] });
}
//#endregion
export { EditClientPage as component };
