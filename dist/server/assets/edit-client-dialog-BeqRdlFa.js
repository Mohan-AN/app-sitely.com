import { n as cn, t as Button } from "./button-jrDuWETO.js";
import { t as Input } from "./input-BUXT0p6g.js";
import { t as ConfirmDialog } from "./confirm-dialog-DgKpdZE4.js";
import { a as useUpdateClient, i as useDeleteClient } from "./use-clients-CB207rwB.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Mail, MapPin, Pencil, Phone, Trash2, X } from "lucide-react";
import { Dialog } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "@base-ui/react/switch";
//#region src/components/ui/switch.tsx
function Switch$1({ className, size = "default", ...props }) {
	return /* @__PURE__ */ jsx(Switch.Root, {
		"data-slot": "switch",
		"data-size": size,
		className: cn("peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ jsx(Switch.Thumb, {
			"data-slot": "switch-thumb",
			className: "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground"
		})
	});
}
//#endregion
//#region src/components/clients/edit-client-dialog.tsx
var emptyToUndefined = (value) => {
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	return trimmed === "" ? void 0 : trimmed;
};
var nameLike = (field, max = 100) => z.preprocess(emptyToUndefined, z.string({ message: `${field} is required` }).min(3, `${field} must be at least 3 characters`).max(max, `${field} must be at most ${max} characters`).regex(/^[A-Za-z][A-Za-z0-9 ]*$/, `${field} must start with a letter and contain only letters, numbers and spaces`));
var schema = z.object({
	name: nameLike("Name"),
	company: z.preprocess(emptyToUndefined, nameLike("Company", 150).optional()),
	phone: z.preprocess(emptyToUndefined, z.string().regex(/^[6-9]\d{9}$/, "Must start with 6-9 and be exactly 10 digits").refine((v) => !/^(\d)\1{9}$/.test(v), "Cannot be a repeated digit pattern").optional()),
	email: z.preprocess(emptyToUndefined, z.string().email("Invalid email").optional()),
	city: z.preprocess(emptyToUndefined, nameLike("City").optional()),
	isActive: z.boolean()
});
function EditClientDialog({ open, onOpenChange, client, onUpdated, onDeleted }) {
	const updateMutation = useUpdateClient(client?.clientId ?? "");
	const deleteMutation = useDeleteClient(client?.clientId ?? "");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: toDefaults(client)
	});
	useEffect(() => {
		if (open && client) {
			form.reset(toDefaults(client));
			updateMutation.reset();
		}
	}, [open, client?.clientId]);
	const handleSubmit = form.handleSubmit((values) => {
		if (!client) return;
		updateMutation.mutate({
			name: values.name.trim(),
			company: values.company?.trim() || void 0,
			phone: values.phone?.trim() || void 0,
			email: values.email?.trim() || void 0,
			city: values.city?.trim() || void 0,
			isActive: values.isActive
		}, { onSuccess: (updated) => {
			onOpenChange(false);
			onUpdated?.(updated);
		} });
	});
	const handleDeleteConfirm = () => {
		deleteMutation.mutate(void 0, { onSuccess: () => {
			setShowDeleteConfirm(false);
			onOpenChange(false);
			onDeleted?.();
		} });
	};
	const e = form.formState.errors;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Dialog.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Backdrop, { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" }), /* @__PURE__ */ jsxs(Dialog.Popup, {
			className: "fixed left-1/2 top-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#2f4a32] dark:bg-[#101912]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-[#f0f4ee] px-6 py-4 dark:border-[#2f4a32]/60",
				children: [/* @__PURE__ */ jsx(Dialog.Title, {
					className: "text-lg font-bold text-[#101828] dark:text-[#edf7ee]",
					children: "Edit Client"
				}), /* @__PURE__ */ jsx(Dialog.Close, {
					render: /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "flex size-8 items-center justify-center rounded-lg text-[#64745F] transition hover:bg-[#f0f4ee] hover:text-[#101828] dark:hover:bg-[#203423] dark:hover:text-[#edf7ee]"
					}),
					children: /* @__PURE__ */ jsx(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "px-6 py-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-5 flex items-center gap-3 border-b border-[#f0f4ee] pb-4 dark:border-[#2f4a32]/60",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]",
							children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold text-[#101828] dark:text-[#edf7ee]",
							children: "Client Details"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-[#64745F] dark:text-[#9fb49b]",
							children: "Update contact and company information."
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
											children: ["Client Name ", /* @__PURE__ */ jsx("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx(Input, {
											placeholder: "Enter client name",
											...form.register("name")
										}),
										e.name ? /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: e.name.message
										}) : null
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
											children: "Company"
										}),
										/* @__PURE__ */ jsx(Input, {
											placeholder: "Enter company name (optional)",
											...form.register("company")
										}),
										e.company ? /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: e.company.message
										}) : null
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
											children: "Phone"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Phone, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9fb49b]" }), /* @__PURE__ */ jsx(Input, {
												className: "pl-9",
												placeholder: "Enter 10-digit mobile number",
												...form.register("phone")
											})]
										}),
										e.phone ? /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: e.phone.message
										}) : null
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
											children: "Email"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9fb49b]" }), /* @__PURE__ */ jsx(Input, {
												className: "pl-9",
												type: "email",
												placeholder: "Enter email address (optional)",
												...form.register("email")
											})]
										}),
										e.email ? /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: e.email.message
										}) : null
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
										children: "City"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9fb49b]" }), /* @__PURE__ */ jsx(Input, {
											className: "pl-9",
											placeholder: "Enter city (optional)",
											...form.register("city")
										})]
									}),
									e.city ? /* @__PURE__ */ jsx("p", {
										className: "text-xs text-destructive",
										children: e.city.message
									}) : null
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between rounded-xl border border-[#e5ebe2] px-4 py-3 dark:border-[#2f4a32]",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
									children: "Status"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-[#64745F] dark:text-[#9fb49b]",
									children: form.watch("isActive") ? "Client is active and visible in listings." : "Client is inactive and hidden from active views."
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: `text-xs font-bold ${form.watch("isActive") ? "text-emerald-600 dark:text-emerald-400" : "text-[#64745F] dark:text-[#9fb49b]"}`,
										children: form.watch("isActive") ? "Active" : "Inactive"
									}), /* @__PURE__ */ jsx(Switch$1, {
										checked: form.watch("isActive"),
										onCheckedChange: (checked) => form.setValue("isActive", checked, { shouldDirty: true }),
										className: "data-checked:bg-emerald-500"
									})]
								})]
							})
						]
					}),
					updateMutation.isError ? /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-sm text-destructive",
						children: updateMutation.error.message
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs(Button, {
							type: "button",
							variant: "outline",
							className: "gap-2 rounded-xl border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30",
							disabled: deleteMutation.isPending,
							onClick: () => setShowDeleteConfirm(true),
							children: [/* @__PURE__ */ jsx(Trash2, { className: "size-4" }), "Delete Client"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								className: "h-10 min-w-24 rounded-xl border-[#dde5d8] dark:border-[#2f4a32]",
								onClick: () => onOpenChange(false),
								children: "Cancel"
							}), /* @__PURE__ */ jsxs(Button, {
								type: "submit",
								disabled: updateMutation.isPending,
								className: "h-10 gap-2 rounded-xl bg-[#658354] px-5 font-bold text-white hover:bg-[#4b6043]",
								children: [/* @__PURE__ */ jsx(Pencil, { className: "size-4" }), updateMutation.isPending ? "Saving..." : "Save Changes"]
							})]
						})]
					})
				]
			})]
		})] })
	}), /* @__PURE__ */ jsx(ConfirmDialog, {
		open: showDeleteConfirm,
		onOpenChange: setShowDeleteConfirm,
		title: "Delete Client",
		description: `Are you sure you want to delete "${client?.name}"? All associated data will be removed. This cannot be undone.`,
		confirmLabel: "Delete",
		onConfirm: handleDeleteConfirm,
		isPending: deleteMutation.isPending
	})] });
}
function toDefaults(client) {
	return {
		name: client?.name ?? "",
		company: client?.company ?? "",
		phone: client?.phone ?? "",
		email: client?.email ?? "",
		city: client?.city ?? "",
		isActive: client?.isActive ?? true
	};
}
//#endregion
export { EditClientDialog as t };
