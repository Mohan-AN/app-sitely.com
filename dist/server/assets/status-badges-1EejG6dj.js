import { o as apiFetch, t as cn } from "./utils-C3dXA-e9.js";
import { t as DATA_STALE_TIME } from "./query-client-Drfu_7uX.js";
import { i as useDeleteWebsite, o as useWebsite } from "./use-websites-DxteJjR7.js";
import { t as QUERY_KEYS } from "./queryKeys-iadVgs7d.js";
import { t as ConfirmDialog } from "./confirm-dialog-1eeIX5QS.js";
import { t as Skeleton } from "./skeleton-i2ok8WNF.js";
import { t as formatCurrency } from "./format-BiRzvK38.js";
import { t as WebsiteForm } from "./website-form-RBxqyJiq.js";
import { n as useServiceOptions } from "./use-service-options-CsGN06oa.js";
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Paperclip, X } from "lucide-react";
import { Dialog } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//#region src/lib/requests-api.ts
function listRequests(websiteId, page = 1, limit = 20) {
	return apiFetch(`/websites/${websiteId}/requests?${new URLSearchParams({
		page: String(page),
		limit: String(limit)
	}).toString()}`);
}
function createRequest(input) {
	if (input.invoiceFile) {
		const fd = new FormData();
		fd.append("type", input.type);
		fd.append("title", input.title);
		if (input.description) fd.append("description", input.description);
		if (input.status) fd.append("status", input.status);
		if (input.requestedDate) fd.append("requestedDate", input.requestedDate);
		if (input.cost) fd.append("cost", input.cost);
		if (input.paymentStatus) fd.append("paymentStatus", input.paymentStatus);
		if (input.paymentDate) fd.append("paymentDate", input.paymentDate);
		fd.append("invoiceFile", input.invoiceFile);
		return apiFetch(`/websites/${input.websiteId}/requests`, {
			method: "POST",
			body: fd
		});
	}
	const { websiteId: _wid, invoiceFile: _f, ...rest } = input;
	return apiFetch(`/websites/${input.websiteId}/requests`, {
		method: "POST",
		body: JSON.stringify(rest)
	});
}
//#endregion
//#region src/hooks/use-requests.ts
function useRequests(websiteId, page = 1, limit = 20) {
	return useQuery({
		queryKey: [
			QUERY_KEYS.WEBSITE_REQUESTS,
			websiteId,
			{
				page,
				limit
			}
		],
		queryFn: () => listRequests(websiteId, page, limit),
		staleTime: DATA_STALE_TIME,
		enabled: !!websiteId
	});
}
function useCreateRequest(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => createRequest(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_REQUESTS, websiteId] });
			toast.success("Request submitted.");
		}
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
				children: website ? website.project_name : "Update website information and settings."
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
			description: `Are you sure you want to delete "${website?.project_name}"? This action cannot be undone.`,
			confirmLabel: "Delete",
			onConfirm: handleDeleteConfirm,
			isPending: deleteMutation.isPending
		})
	] });
}
//#endregion
//#region src/lib/billing-api.ts
async function toBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			resolve({
				base64: result.split(",")[1] ?? result,
				name: file.name,
				contentType: file.type
			});
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
async function recordPayment(input) {
	const body = {
		amount: input.amount,
		paymentDate: input.paymentDate,
		paymentMode: input.paymentMode
	};
	if (input.transactionRef) body.transactionReference = input.transactionRef;
	if (input.remarks) body.remarks = input.remarks;
	if (input.invoiceFile) {
		const { base64, name, contentType } = await toBase64(input.invoiceFile);
		body.invoiceFileBase64 = base64;
		body.invoiceFileName = name;
		body.invoiceContentType = contentType;
	}
	return apiFetch(`/websites/${input.websiteId}/billing/${input.billingId}/payment`, {
		method: "POST",
		body: JSON.stringify(body)
	});
}
//#endregion
//#region src/hooks/use-billing.ts
function useRecordPayment(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => recordPayment(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_BILLING, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			toast.success("Payment recorded.");
		}
	});
}
//#endregion
//#region src/components/websites/record-payment-dialog.tsx
var schema$1 = z.object({
	amount: z.string().trim().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),
	paymentDate: z.string().trim().min(1, "Date is required"),
	paymentMode: z.string().trim().min(1, "Payment mode is required"),
	transactionRef: z.string().optional(),
	remarks: z.string().optional()
});
function RecordPaymentDialog({ websiteId, billingId, projectName, maintenanceAmount, billingPeriodLabel, open, onOpenChange, onSuccess }) {
	const [phase, setPhase] = useState("form");
	const [invoiceFile, setInvoiceFile] = useState(null);
	const fileInputRef = useRef(null);
	const backdropRef = useRef(null);
	const mutation = useRecordPayment(websiteId);
	const paymentModes = (useServiceOptions("payment_mode").data ?? []).filter((o) => o.is_active);
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const form = useForm({
		resolver: zodResolver(schema$1),
		defaultValues: {
			amount: maintenanceAmount ?? "",
			paymentDate: today,
			paymentMode: "",
			transactionRef: "",
			remarks: ""
		}
	});
	useEffect(() => {
		if (open) {
			setPhase("form");
			setInvoiceFile(null);
			form.reset({
				amount: maintenanceAmount ?? "",
				paymentDate: today,
				paymentMode: "",
				transactionRef: "",
				remarks: ""
			});
		}
	}, [open]);
	if (!open) return null;
	const handleBackdropClick = (e) => {
		if (phase === "saving") return;
		if (e.target === backdropRef.current) onOpenChange(false);
	};
	const submit = form.handleSubmit((values) => {
		if (!billingId) {
			form.setError("root", { message: "No active billing period found for this website." });
			return;
		}
		setPhase("saving");
		mutation.mutate({
			websiteId,
			billingId,
			amount: values.amount,
			paymentDate: values.paymentDate,
			paymentMode: values.paymentMode,
			transactionRef: values.transactionRef || null,
			invoiceFile: invoiceFile ?? null,
			remarks: values.remarks || null
		}, {
			onSuccess: () => {
				setPhase("success");
				onSuccess?.();
			},
			onError: () => setPhase("form")
		});
	});
	const fieldCls = (hasError) => cn("h-10 w-full rounded-[9px] border px-3 text-[12.5px] outline-none transition", hasError ? "border-[#DC2626]" : "border-[#E5E7EB] focus:border-[#4F5DF5]");
	return /* @__PURE__ */ jsx("div", {
		ref: backdropRef,
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]",
		onClick: handleBackdropClick,
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-[520px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]",
			children: [
				phase !== "saving" && /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => onOpenChange(false),
					className: "absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]",
					children: /* @__PURE__ */ jsx(X, { className: "size-4" })
				}),
				phase === "saving" && /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center gap-4 px-8 py-14",
					children: [/* @__PURE__ */ jsx(Loader2, { className: "size-10 animate-spin text-[#4F5DF5]" }), /* @__PURE__ */ jsx("p", {
						className: "text-[14px] font-semibold text-[#5C6270]",
						children: "Recording payment…"
					})]
				}),
				phase === "success" && /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center gap-5 px-8 py-12",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "flex size-16 items-center justify-center rounded-full bg-[#ECFDF5]",
							children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-9 text-[#059669]" })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-center",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-[17px] font-bold text-[#11141A]",
								children: "Payment Recorded"
							}), /* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-[13px] text-[#8A8F98]",
								children: [
									formatCurrency(form.getValues("amount")),
									" recorded for ",
									projectName,
									"."
								]
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => onOpenChange(false),
							className: "mt-1 h-10 rounded-[9px] bg-[#059669] px-6 text-[13px] font-semibold text-white transition hover:bg-[#047857]",
							children: "Done"
						})
					]
				}),
				phase === "form" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "border-b border-[#E5E7EB] px-6 py-5",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[16px] font-bold text-[#11141A]",
						children: "Record Payment Received"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-[12.5px] text-[#8A8F98]",
						children: "Mark maintenance payment as paid and attach invoice."
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "flex flex-col gap-4 p-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[11.5px] font-semibold text-[#5C6270]",
									children: "Website"
								}), /* @__PURE__ */ jsx("div", {
									className: cn(fieldCls(), "flex items-center bg-[#FAFBFC] text-[#5C6270]"),
									children: projectName
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1.5",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "text-[11.5px] font-semibold text-[#5C6270]",
										children: "Billing Period"
									}),
									/* @__PURE__ */ jsx("div", {
										className: cn(fieldCls(), "flex items-center bg-[#FAFBFC] text-[#5C6270]"),
										children: billingPeriodLabel ?? "Current period"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-[10.5px] text-[#94A3B8]",
										children: "Only the current/next rolling period is shown"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1.5",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-[11.5px] font-semibold text-[#5C6270]",
										children: ["Amount Received ", /* @__PURE__ */ jsx("span", {
											className: "text-[#DC2626]",
											children: "*"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx("span", {
											className: "pointer-events-none absolute inset-y-0 left-3 flex items-center text-[12px] text-[#8A8F98]",
											children: "₹"
										}), /* @__PURE__ */ jsx("input", {
											...form.register("amount"),
											placeholder: "0",
											className: cn(fieldCls(!!form.formState.errors.amount), "pl-7")
										})]
									}),
									form.formState.errors.amount && /* @__PURE__ */ jsx("p", {
										className: "text-[11.5px] font-semibold text-[#DC2626]",
										children: form.formState.errors.amount.message
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1.5",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-[11.5px] font-semibold text-[#5C6270]",
										children: ["Payment Date ", /* @__PURE__ */ jsx("span", {
											className: "text-[#DC2626]",
											children: "*"
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "date",
										...form.register("paymentDate"),
										onClick: (e) => e.currentTarget.showPicker?.(),
										className: fieldCls(!!form.formState.errors.paymentDate)
									}),
									form.formState.errors.paymentDate && /* @__PURE__ */ jsx("p", {
										className: "text-[11.5px] font-semibold text-[#DC2626]",
										children: form.formState.errors.paymentDate.message
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1.5",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-[11.5px] font-semibold text-[#5C6270]",
										children: ["Payment Mode ", /* @__PURE__ */ jsx("span", {
											className: "text-[#DC2626]",
											children: "*"
										})]
									}),
									paymentModes.length > 0 ? /* @__PURE__ */ jsxs("select", {
										...form.register("paymentMode"),
										className: fieldCls(!!form.formState.errors.paymentMode),
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "Select mode"
										}), paymentModes.map((m) => /* @__PURE__ */ jsx("option", {
											value: m.name,
											children: m.name
										}, m.option_id))]
									}) : /* @__PURE__ */ jsx("input", {
										...form.register("paymentMode"),
										placeholder: "e.g. Bank Transfer",
										className: fieldCls(!!form.formState.errors.paymentMode)
									}),
									form.formState.errors.paymentMode && /* @__PURE__ */ jsx("p", {
										className: "text-[11.5px] font-semibold text-[#DC2626]",
										children: form.formState.errors.paymentMode.message
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1.5",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[11.5px] font-semibold text-[#5C6270]",
									children: "Transaction Reference"
								}), /* @__PURE__ */ jsx("input", {
									...form.register("transactionRef"),
									placeholder: "e.g. UPI2026061812",
									className: fieldCls()
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-[11.5px] font-semibold text-[#5C6270]",
									children: "Invoice Attachment"
								}),
								/* @__PURE__ */ jsx("input", {
									ref: fileInputRef,
									type: "file",
									accept: "application/pdf,image/*",
									className: "hidden",
									onChange: (e) => setInvoiceFile(e.target.files?.[0] ?? null)
								}),
								invoiceFile ? /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 rounded-[9px] border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3",
									children: [
										/* @__PURE__ */ jsx(Paperclip, { className: "size-4 shrink-0 text-[#059669]" }),
										/* @__PURE__ */ jsx("span", {
											className: "flex-1 truncate text-[12.5px] font-semibold text-[#059669]",
											children: invoiceFile.name
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => {
												setInvoiceFile(null);
												if (fileInputRef.current) fileInputRef.current.value = "";
											},
											className: "text-[#059669] hover:text-[#047857]",
											children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
										})
									]
								}) : /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => fileInputRef.current?.click(),
									className: "flex h-[52px] w-full items-center justify-center rounded-[9px] border border-dashed border-[#C7CAD1] bg-[#FAFBFC] text-[12.5px] font-semibold text-[#4F5DF5] transition hover:border-[#4F5DF5] hover:bg-[#F4F5FF]",
									children: "Click to upload invoice PDF/image"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-[11.5px] font-semibold text-[#5C6270]",
								children: "Remarks"
							}), /* @__PURE__ */ jsx("textarea", {
								...form.register("remarks"),
								rows: 3,
								placeholder: "Payment notes...",
								className: "w-full resize-none rounded-[9px] border border-[#E5E7EB] px-3 py-2.5 text-[12.5px] outline-none focus:border-[#4F5DF5]"
							})]
						}),
						(mutation.isError || form.formState.errors.root) && /* @__PURE__ */ jsx("p", {
							className: "text-[12px] font-semibold text-[#DC2626]",
							children: form.formState.errors.root?.message ?? mutation.error.message
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-3 pt-1",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => onOpenChange(false),
								className: "h-10 rounded-[9px] border border-[#E5E7EB] px-5 text-[12.5px] font-semibold text-[#5C6270] transition hover:bg-[#F4F5F7]",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "h-10 rounded-[9px] bg-[#059669] px-5 text-[12.5px] font-semibold text-white transition hover:bg-[#047857]",
								children: "Mark as Paid"
							})]
						})
					]
				})] })
			]
		})
	});
}
//#endregion
//#region src/components/websites/add-request-dialog.tsx
var schema = z.object({
	type: z.enum(["bug", "feature"]),
	status: z.enum([
		"open",
		"in_progress",
		"completed",
		"wont_fix"
	]),
	title: z.string().trim().min(1, "Title is required").max(200, "Too long"),
	requestedDate: z.string().trim().min(1, "Requested date is required"),
	cost: z.string().optional(),
	description: z.string().optional(),
	paymentStatus: z.enum(["not_paid", "paid"]),
	paymentDate: z.string().optional()
}).superRefine((d, ctx) => {
	if (d.type === "feature" && !d.cost?.trim()) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "Cost is required for features",
		path: ["cost"]
	});
	if (d.paymentStatus === "paid" && !d.paymentDate?.trim()) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "Payment date is required when paid",
		path: ["paymentDate"]
	});
});
var sel = (hasError) => cn("h-9 w-full rounded-[8px] border px-3 text-[12.5px] outline-none transition", hasError ? "border-[#DC2626]" : "border-[#E5E7EB] focus:border-[#4F5DF5]");
function AddRequestDialog({ websiteId, open, onOpenChange }) {
	const mutation = useCreateRequest(websiteId);
	const [backdropEl, setBackdropEl] = useState(null);
	const [invoiceFile, setInvoiceFile] = useState(null);
	const fileInputRef = useRef(null);
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			type: "bug",
			status: "open",
			title: "",
			requestedDate: "",
			cost: "",
			description: "",
			paymentStatus: "not_paid",
			paymentDate: ""
		}
	});
	if (!open) return null;
	const handleBackdropClick = (e) => {
		if (e.target === backdropEl) onOpenChange(false);
	};
	const handleClose = () => {
		form.reset();
		setInvoiceFile(null);
		onOpenChange(false);
	};
	const submit = form.handleSubmit((values) => {
		mutation.mutate({
			websiteId,
			type: values.type,
			title: values.title,
			description: values.description || null,
			status: values.status,
			requestedDate: values.requestedDate || null,
			cost: values.cost || null,
			paymentStatus: values.paymentStatus,
			paymentDate: values.paymentDate || null,
			invoiceFile: invoiceFile ?? null
		}, { onSuccess: handleClose });
	});
	const watchedType = form.watch("type");
	const watchedPaymentStatus = form.watch("paymentStatus");
	const isFeature = watchedType === "feature";
	return /* @__PURE__ */ jsx("div", {
		ref: setBackdropEl,
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]",
		onClick: handleBackdropClick,
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-[520px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]",
			children: [
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: handleClose,
					className: "absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]",
					children: /* @__PURE__ */ jsx(X, { className: "size-4" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-b border-[#E5E7EB] px-6 py-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[15px] font-bold text-[#11141A]",
						children: "Add Bug / Feature Request"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-[12px] text-[#8A8F98]",
						children: "Feature cost is counted in annual profit only after payment is received."
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "flex flex-col gap-3 p-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "text-[11px] font-semibold text-[#5C6270]",
									children: ["Request Type ", /* @__PURE__ */ jsx("span", {
										className: "text-[#DC2626]",
										children: "*"
									})]
								}), /* @__PURE__ */ jsxs("select", {
									...form.register("type"),
									className: sel(),
									children: [/* @__PURE__ */ jsx("option", {
										value: "bug",
										children: "Bug"
									}), /* @__PURE__ */ jsx("option", {
										value: "feature",
										children: "Feature"
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[11px] font-semibold text-[#5C6270]",
									children: "Status"
								}), /* @__PURE__ */ jsxs("select", {
									...form.register("status"),
									className: sel(),
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "open",
											children: "Pending"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "in_progress",
											children: "In Progress"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "completed",
											children: "Completed"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "wont_fix",
											children: "Won't Fix"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1",
							children: [
								/* @__PURE__ */ jsxs("label", {
									className: "text-[11px] font-semibold text-[#5C6270]",
									children: ["Title ", /* @__PURE__ */ jsx("span", {
										className: "text-[#DC2626]",
										children: "*"
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									...form.register("title"),
									placeholder: "Brief summary of the request…",
									className: sel(!!form.formState.errors.title)
								}),
								form.formState.errors.title && /* @__PURE__ */ jsx("p", {
									className: "text-[11px] font-semibold text-[#DC2626]",
									children: form.formState.errors.title.message
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-[11px] font-semibold text-[#5C6270]",
										children: ["Requested Date ", /* @__PURE__ */ jsx("span", {
											className: "text-[#DC2626]",
											children: "*"
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "date",
										...form.register("requestedDate"),
										onClick: (e) => e.currentTarget.showPicker?.(),
										className: sel(!!form.formState.errors.requestedDate)
									}),
									form.formState.errors.requestedDate && /* @__PURE__ */ jsx("p", {
										className: "text-[11px] font-semibold text-[#DC2626]",
										children: form.formState.errors.requestedDate.message
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-[11px] font-semibold text-[#5C6270]",
										children: ["Feature Cost ", isFeature && /* @__PURE__ */ jsx("span", {
											className: "text-[#DC2626]",
											children: "*"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx("span", {
											className: "pointer-events-none absolute inset-y-0 left-3 flex items-center text-[12px] text-[#8A8F98]",
											children: "₹"
										}), /* @__PURE__ */ jsx("input", {
											...form.register("cost"),
											placeholder: isFeature ? "0" : "—",
											disabled: !isFeature,
											className: cn(sel(isFeature && !!form.formState.errors.cost), "pl-7", !isFeature && "cursor-not-allowed bg-[#FAFBFC] text-[#C7CAD1]")
										})]
									}),
									form.formState.errors.cost ? /* @__PURE__ */ jsx("p", {
										className: "text-[11px] font-semibold text-[#DC2626]",
										children: form.formState.errors.cost.message
									}) : /* @__PURE__ */ jsx("p", {
										className: "text-[10px] text-[#94A3B8]",
										children: "Leave blank for bugs — bugs are always free"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-[11px] font-semibold text-[#5C6270]",
									children: "Details"
								}),
								/* @__PURE__ */ jsx("textarea", {
									...form.register("description"),
									rows: 3,
									placeholder: "Client requested contact form redesign…",
									className: cn("w-full resize-none rounded-[8px] border px-3 py-2 text-[12.5px] outline-none transition", form.formState.errors.description ? "border-[#DC2626]" : "border-[#E5E7EB] focus:border-[#4F5DF5]")
								}),
								form.formState.errors.description && /* @__PURE__ */ jsx("p", {
									className: "text-[11px] font-semibold text-[#DC2626]",
									children: form.formState.errors.description.message
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-[11px] font-semibold text-[#5C6270]",
									children: "Payment Status"
								}), /* @__PURE__ */ jsxs("select", {
									...form.register("paymentStatus"),
									className: sel(),
									children: [/* @__PURE__ */ jsx("option", {
										value: "not_paid",
										children: "Not Paid"
									}), /* @__PURE__ */ jsx("option", {
										value: "paid",
										children: "Paid"
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-1",
								children: [
									/* @__PURE__ */ jsxs("label", {
										className: "text-[11px] font-semibold text-[#5C6270]",
										children: ["Payment Date ", watchedPaymentStatus === "paid" && /* @__PURE__ */ jsx("span", {
											className: "text-[#DC2626]",
											children: "*"
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "date",
										...form.register("paymentDate"),
										disabled: watchedPaymentStatus !== "paid",
										onClick: (e) => e.currentTarget.showPicker?.(),
										className: cn(sel(watchedPaymentStatus === "paid" && !!form.formState.errors.paymentDate), watchedPaymentStatus !== "paid" && "cursor-not-allowed bg-[#FAFBFC] text-[#C7CAD1]")
									}),
									form.formState.errors.paymentDate && /* @__PURE__ */ jsx("p", {
										className: "text-[11px] font-semibold text-[#DC2626]",
										children: form.formState.errors.paymentDate.message
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-[11px] font-semibold text-[#5C6270]",
									children: "Feature Invoice"
								}),
								/* @__PURE__ */ jsx("input", {
									ref: fileInputRef,
									type: "file",
									accept: "application/pdf,image/*",
									className: "hidden",
									onChange: (e) => setInvoiceFile(e.target.files?.[0] ?? null)
								}),
								invoiceFile ? /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 rounded-[8px] border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2.5",
									children: [
										/* @__PURE__ */ jsx(Paperclip, { className: "size-3.5 shrink-0 text-[#059669]" }),
										/* @__PURE__ */ jsx("span", {
											className: "flex-1 truncate text-[12px] font-semibold text-[#059669]",
											children: invoiceFile.name
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => {
												setInvoiceFile(null);
												if (fileInputRef.current) fileInputRef.current.value = "";
											},
											className: "text-[#059669] hover:text-[#178a50]",
											children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
										})
									]
								}) : /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => fileInputRef.current?.click(),
									className: "flex h-[44px] w-full items-center justify-center rounded-[8px] border border-dashed border-[#C7CAD1] bg-[#FAFBFC] text-[12.5px] font-semibold text-[#4F5DF5] transition hover:border-[#4F5DF5] hover:bg-[#F4F5FF]",
									children: "Click to upload feature invoice"
								})
							]
						}),
						mutation.isError && /* @__PURE__ */ jsx("p", {
							className: "text-[12px] font-semibold text-[#DC2626]",
							children: mutation.error.message
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-3 pt-1",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleClose,
								className: "h-9 rounded-[9px] border border-[#E5E7EB] px-5 text-[12.5px] font-semibold text-[#5C6270] transition hover:bg-[#F4F5F7]",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: mutation.isPending,
								className: "h-9 rounded-[9px] bg-[#4F5DF5] px-5 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-60",
								children: mutation.isPending ? "Saving…" : "Save Request"
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/websites/status-badges.tsx
var STATUS_CFG = {
	Live: {
		bg: "bg-[#ECFDF5]",
		border: "border-[#A7F3D0]",
		text: "text-[#059669]",
		dot: "bg-[#10B981]"
	},
	Active: {
		bg: "bg-[#ECFDF5]",
		border: "border-[#A7F3D0]",
		text: "text-[#059669]",
		dot: "bg-[#10B981]"
	},
	Overdue: {
		bg: "bg-[#FEF2F2]",
		border: "border-[#FECACA]",
		text: "text-[#DC2626]",
		dot: "bg-[#EF4444]"
	},
	"Maintenance Overdue": {
		bg: "bg-[#FEF2F2]",
		border: "border-[#FECACA]",
		text: "text-[#DC2626]",
		dot: "bg-[#EF4444]"
	},
	"In Progress": {
		bg: "bg-[#FEF3C7]",
		border: "border-[#FDE68A]",
		text: "text-[#D97706]",
		dot: "bg-[#F59E0B]"
	},
	"Due Soon": {
		bg: "bg-[#FEF3C7]",
		border: "border-[#FDE68A]",
		text: "text-[#D97706]",
		dot: "bg-[#F59E0B]"
	},
	Completed: {
		bg: "bg-[#EFF6FF]",
		border: "border-[#BFDBFE]",
		text: "text-[#3B82F6]",
		dot: "bg-[#3B82F6]"
	},
	"Transfer Pending": {
		bg: "bg-[#F3E8FF]",
		border: "border-[#DDD6FE]",
		text: "text-[#8B5CF6]",
		dot: "bg-[#8B5CF6]"
	},
	"On Hold": {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		dot: "bg-[#9CA3AF]"
	},
	Paused: {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		dot: "bg-[#9CA3AF]"
	},
	Discontinued: {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		dot: "bg-[#9CA3AF]"
	},
	"Not Started": {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		dot: "bg-[#9CA3AF]"
	},
	Cancelled: {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		dot: "bg-[#9CA3AF]"
	},
	Expired: {
		bg: "bg-[#FEF2F2]",
		border: "border-[#FECACA]",
		text: "text-[#DC2626]",
		dot: "bg-[#EF4444]"
	}
};
var DEFAULT_CFG = {
	bg: "bg-[#F3F4F6]",
	border: "border-[#E5E7EB]",
	text: "text-[#6B7280]",
	dot: "bg-[#9CA3AF]"
};
function StatusPill({ label }) {
	const cfg = STATUS_CFG[label] ?? DEFAULT_CFG;
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex w-fit items-center gap-1.5 rounded-[6px] border px-[12px] py-[4px] text-[11.5px] font-medium tracking-[.01em] whitespace-nowrap", cfg.bg, cfg.border, cfg.text),
		children: [/* @__PURE__ */ jsx("span", { className: cn("size-[6px] rounded-full", cfg.dot) }), label]
	});
}
function MaintenanceBadge({ label }) {
	const cfg = STATUS_CFG[label] ?? DEFAULT_CFG;
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex w-fit items-center gap-1.5 rounded-[6px] border px-[12px] py-[4px] text-[11.5px] font-medium tracking-[.01em] whitespace-nowrap", cfg.bg, cfg.border, cfg.text),
		children: [/* @__PURE__ */ jsx("span", { className: cn("size-[6px] rounded-full", cfg.dot) }), label]
	});
}
//#endregion
export { useRecordPayment as a, RecordPaymentDialog as i, StatusPill as n, WebsiteEditDialog as o, AddRequestDialog as r, useRequests as s, MaintenanceBadge as t };
