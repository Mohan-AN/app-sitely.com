import { t as cn } from "./utils-C3dXA-e9.js";
import { t as Button } from "./button-BJN112tG.js";
import { t as Input } from "./input-B9pPcpqc.js";
import { t as ConfirmDialog } from "./confirm-dialog-1eeIX5QS.js";
import { a as useUpdateClient, i as useDeleteClient } from "./use-clients-BcKNT9QA.js";
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
	company: nameLike("Company", 150),
	phone: z.preprocess(emptyToUndefined, z.string().regex(/^[6-9]\d{9}$/, "Must start with 6-9 and be exactly 10 digits").refine((v) => !/^(\d)\1{9}$/.test(v), "Cannot be a repeated digit pattern").optional()),
	email: z.preprocess(emptyToUndefined, z.string({ message: "Email is required" }).email("Invalid email")),
	city: z.preprocess(emptyToUndefined, nameLike("Address").optional()),
	isActive: z.boolean()
});
function EditClientDialog({ open, onOpenChange, client, onUpdated, onDeleted }) {
	const updateMutation = useUpdateClient(client?.id ? String(client.id) : "");
	const deleteMutation = useDeleteClient(client?.id ? String(client.id) : "");
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
	}, [open, client?.id]);
	const handleSubmit = form.handleSubmit((values) => {
		if (!client) return;
		updateMutation.mutate({
			name: values.name.trim(),
			company: values.company.trim(),
			email: values.email.trim(),
			phone: values.phone?.trim() || void 0,
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
	const isActive = form.watch("isActive");
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Dialog.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Backdrop, { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" }), /* @__PURE__ */ jsxs(Dialog.Popup, {
			className: "fixed left-1/2 top-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4",
				children: [/* @__PURE__ */ jsx(Dialog.Title, {
					className: "text-lg font-bold text-[#11141A]",
					children: "Edit Client"
				}), /* @__PURE__ */ jsx(Dialog.Close, {
					render: /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "flex size-8 items-center justify-center rounded-lg text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]"
					}),
					children: /* @__PURE__ */ jsx(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "px-6 py-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-5 flex items-center gap-3 border-b border-[#E5E7EB] pb-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEEFFE] text-[#4F5DF5]",
							children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold text-[#11141A]",
							children: "Client Details"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-[#5C6270]",
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
											className: "text-[11.5px] font-semibold text-[#374151]",
											children: ["Client Name ", /* @__PURE__ */ jsx("span", {
												className: "text-[#DC2626]",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx(Input, {
											placeholder: "Enter client name",
											...form.register("name")
										}),
										e.name ? /* @__PURE__ */ jsx("p", {
											className: "text-[11px] font-semibold text-[#DC2626]",
											children: e.name.message
										}) : null
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "text-[11.5px] font-semibold text-[#374151]",
											children: ["Company ", /* @__PURE__ */ jsx("span", {
												className: "text-[#DC2626]",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx(Input, {
											placeholder: "Enter company name",
											...form.register("company")
										}),
										e.company ? /* @__PURE__ */ jsx("p", {
											className: "text-[11px] font-semibold text-[#DC2626]",
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
											className: "text-[11.5px] font-semibold text-[#374151]",
											children: "Phone"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Phone, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" }), /* @__PURE__ */ jsx(Input, {
												className: "pl-9",
												placeholder: "Enter 10-digit mobile number",
												...form.register("phone")
											})]
										}),
										e.phone ? /* @__PURE__ */ jsx("p", {
											className: "text-[11px] font-semibold text-[#DC2626]",
											children: e.phone.message
										}) : null
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "text-[11.5px] font-semibold text-[#374151]",
											children: ["Email ", /* @__PURE__ */ jsx("span", {
												className: "text-[#DC2626]",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" }), /* @__PURE__ */ jsx(Input, {
												className: "pl-9",
												type: "email",
												placeholder: "Enter email address",
												...form.register("email")
											})]
										}),
										e.email ? /* @__PURE__ */ jsx("p", {
											className: "text-[11px] font-semibold text-[#DC2626]",
											children: e.email.message
										}) : null
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "text-[11.5px] font-semibold text-[#374151]",
										children: "Address"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" }), /* @__PURE__ */ jsx(Input, {
											className: "pl-9",
											placeholder: "Enter address (optional)",
											...form.register("city")
										})]
									}),
									e.city ? /* @__PURE__ */ jsx("p", {
										className: "text-[11px] font-semibold text-[#DC2626]",
										children: e.city.message
									}) : null
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between rounded-[10px] border border-[#E5E7EB] px-4 py-3",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-[12.5px] font-semibold text-[#11141A]",
									children: "Status"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11.5px] text-[#5C6270]",
									children: isActive ? "Client is active and visible in listings." : "Client is inactive and hidden from active views."
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: `text-[11.5px] font-bold ${isActive ? "text-[#059669]" : "text-[#8A8F98]"}`,
										children: isActive ? "Active" : "Inactive"
									}), /* @__PURE__ */ jsx(Switch$1, {
										checked: isActive,
										onCheckedChange: (checked) => form.setValue("isActive", checked, { shouldDirty: true }),
										className: "data-checked:bg-[#4F5DF5]"
									})]
								})]
							})
						]
					}),
					updateMutation.isError ? /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-[12px] font-semibold text-[#DC2626]",
						children: updateMutation.error.message
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs(Button, {
							type: "button",
							variant: "outline",
							className: "gap-2 rounded-[9px] border-[#FECACA] text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]",
							disabled: deleteMutation.isPending,
							onClick: () => setShowDeleteConfirm(true),
							children: [/* @__PURE__ */ jsx(Trash2, { className: "size-4" }), "Delete Client"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "outline",
								className: "h-10 min-w-24 rounded-[9px] border-[#E5E7EB] text-[#5C6270]",
								onClick: () => onOpenChange(false),
								children: "Cancel"
							}), /* @__PURE__ */ jsxs(Button, {
								type: "submit",
								disabled: updateMutation.isPending,
								className: "h-10 gap-2 rounded-[9px] bg-[#4F5DF5] px-5 text-[13px] font-semibold text-white hover:bg-[#3F4DE0]",
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
		isActive: client?.is_active ?? true
	};
}
//#endregion
export { EditClientDialog as t };
