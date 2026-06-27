import { t as cn } from "./utils-CR4dV3c0.js";
import { t as Route } from "./websites._websiteId-DXCb2VpQ.js";
import { d as useWebsiteTimeline, l as useWebsite } from "./use-websites-BnWcvb5r.js";
import { t as Skeleton } from "./skeleton-3GrrKxds.js";
import { n as formatDate, t as formatCurrency } from "./format-BiRzvK38.js";
import { a as WebsiteEditDialog, c as useUpdateRequest, i as RecordPaymentDialog, n as StatusPill, o as useAttachInvoice, r as AddRequestDialog, s as useRequests, t as MaintenanceBadge } from "./status-badges-BIBuRy4i.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, ChevronLeft, ChevronRight, CloudUpload, ExternalLink, Paperclip, Pencil, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//#region src/components/websites/edit-request-dialog.tsx
var schema = z.object({
	status: z.enum([
		"open",
		"in_progress",
		"completed",
		"wont_fix"
	]),
	deliveredDate: z.string().optional(),
	cost: z.string().optional(),
	description: z.string().optional(),
	paymentStatus: z.enum(["not_paid", "paid"]),
	paymentDate: z.string().optional()
}).superRefine((d, ctx) => {
	if (d.paymentStatus === "paid" && !d.paymentDate?.trim()) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "Payment date is required when paid",
		path: ["paymentDate"]
	});
});
var sel = (hasError) => cn("h-8 w-full rounded-[7px] border px-2.5 text-[12px] outline-none transition", hasError ? "border-[#DC2626]" : "border-[#E5E7EB] focus:border-[#4F5DF5]");
function Field({ label, required, error, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-0.5",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "text-[10.5px] font-semibold text-[#5C6270]",
				children: [label, required && /* @__PURE__ */ jsx("span", {
					className: "ml-0.5 text-[#DC2626]",
					children: "*"
				})]
			}),
			children,
			error && /* @__PURE__ */ jsx("p", {
				className: "text-[10.5px] font-semibold text-[#DC2626]",
				children: error
			})
		]
	});
}
function EditRequestDialog({ websiteId, request, open, onOpenChange }) {
	const mutation = useUpdateRequest(websiteId);
	const fileRef = useRef(null);
	const [invoiceFile, setInvoiceFile] = useState(null);
	const isFeature = request.type === "feature";
	const resetValues = {
		status: request.status,
		deliveredDate: request.delivered_date ?? "",
		cost: request.cost ?? "",
		description: request.description ?? "",
		paymentStatus: request.payment_status ?? "not_paid",
		paymentDate: request.payment_date ?? ""
	};
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: resetValues
	});
	useEffect(() => {
		form.reset(resetValues);
		setInvoiceFile(null);
	}, [
		request.request_id,
		request.status,
		request.cost,
		request.description,
		request.payment_status,
		request.payment_date,
		request.delivered_date
	]);
	if (!open) return null;
	const handleClose = () => {
		form.reset();
		setInvoiceFile(null);
		mutation.reset();
		onOpenChange(false);
	};
	const watchedPaymentStatus = form.watch("paymentStatus");
	const submit = form.handleSubmit((values) => {
		mutation.mutate({
			requestId: request.request_id,
			input: {
				description: values.description || null,
				status: values.status,
				deliveredDate: values.deliveredDate || null,
				cost: values.cost || null,
				paymentStatus: values.paymentStatus,
				paymentDate: values.paymentDate || null,
				invoiceFile: invoiceFile ?? void 0
			}
		}, { onSuccess: handleClose });
	});
	const typeBadge = request.type === "bug" ? {
		label: "Bug",
		cls: "bg-[#FEF2F2] text-[#DC2626]"
	} : {
		label: "Feature",
		cls: "bg-[#EEF2FF] text-[#4F5DF5]"
	};
	const existingInvoice = request.invoice_file_name ? {
		name: request.invoice_file_name,
		url: request.invoice_file_url
	} : null;
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]",
		onClick: (e) => {
			if (e.target === e.currentTarget) handleClose();
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative flex w-full max-w-[520px] max-h-[90vh] flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]",
			children: [
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: handleClose,
					className: "absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]",
					children: /* @__PURE__ */ jsx(X, { className: "size-4" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-b border-[#E5E7EB] px-5 py-2.5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-[14px] font-bold text-[#11141A]",
							children: "Edit Request"
						}), /* @__PURE__ */ jsx("span", {
							className: cn("rounded-[6px] px-2.5 py-0.5 text-[11.5px] font-bold uppercase", typeBadge.cls),
							children: typeBadge.label
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-[12px] text-[#8A8F98]",
						children: "Feature cost is counted in annual profit only after payment is received."
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "flex min-h-0 flex-1 flex-col gap-[9px] overflow-y-auto px-4 py-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Status",
								required: true,
								children: /* @__PURE__ */ jsxs("select", {
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
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Feature Cost",
								required: isFeature,
								error: isFeature ? form.formState.errors.cost?.message : void 0,
								children: /* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("span", {
										className: "pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[12px] text-[#8A8F98]",
										children: "₹"
									}), /* @__PURE__ */ jsx("input", {
										...form.register("cost"),
										placeholder: isFeature ? "0" : "—",
										disabled: !isFeature,
										className: cn(sel(isFeature && !!form.formState.errors.cost), "pl-6", !isFeature && "cursor-not-allowed bg-[#FAFBFC] text-[#C7CAD1]")
									})]
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Title",
							children: /* @__PURE__ */ jsx("input", {
								value: request.title,
								readOnly: true,
								disabled: true,
								className: cn(sel(), "cursor-not-allowed bg-[#FAFBFC] text-[#9CA3AF]")
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Requested Date",
								children: /* @__PURE__ */ jsx("input", {
									value: request.requested_date ?? "",
									readOnly: true,
									disabled: true,
									placeholder: "—",
									className: cn(sel(), "cursor-not-allowed bg-[#FAFBFC] text-[#9CA3AF]")
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Delivered Date",
								children: /* @__PURE__ */ jsx("input", {
									type: "date",
									...form.register("deliveredDate"),
									onClick: (e) => e.currentTarget.showPicker?.(),
									className: sel()
								})
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Details",
							error: form.formState.errors.description?.message,
							children: /* @__PURE__ */ jsx("textarea", {
								...form.register("description"),
								rows: 2,
								className: cn("w-full resize-none rounded-[7px] border px-2.5 py-1.5 text-[12px] outline-none transition", form.formState.errors.description ? "border-[#DC2626]" : "border-[#E5E7EB] focus:border-[#4F5DF5]")
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3 rounded-[9px] border border-[#E5E7EB] px-2.5 py-2",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Payment Status",
								children: /* @__PURE__ */ jsxs("select", {
									...form.register("paymentStatus"),
									className: sel(),
									children: [/* @__PURE__ */ jsx("option", {
										value: "not_paid",
										children: "Not Paid"
									}), /* @__PURE__ */ jsx("option", {
										value: "paid",
										children: "Paid"
									})]
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Payment Date",
								required: watchedPaymentStatus === "paid",
								error: form.formState.errors.paymentDate?.message,
								children: /* @__PURE__ */ jsx("input", {
									type: "date",
									...form.register("paymentDate"),
									disabled: watchedPaymentStatus !== "paid",
									onClick: (e) => e.currentTarget.showPicker?.(),
									className: cn(sel(watchedPaymentStatus === "paid" && !!form.formState.errors.paymentDate), watchedPaymentStatus !== "paid" && "cursor-not-allowed bg-[#FAFBFC] text-[#C7CAD1]")
								})
							})]
						}),
						/* @__PURE__ */ jsxs(Field, {
							label: "Feature Invoice",
							children: [/* @__PURE__ */ jsx("input", {
								ref: fileRef,
								type: "file",
								accept: "application/pdf,image/*",
								className: "hidden",
								onChange: (e) => setInvoiceFile(e.target.files?.[0] ?? null)
							}), invoiceFile ? /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 rounded-[7px] border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-1.5",
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
											if (fileRef.current) fileRef.current.value = "";
										},
										className: "text-[#059669] hover:text-[#178a50]",
										children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
									})
								]
							}) : existingInvoice ? /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 rounded-[7px] border border-[#DBEAFE] bg-[#EFF6FF] px-2.5 py-1.5",
								children: [
									/* @__PURE__ */ jsx(Paperclip, { className: "size-3.5 shrink-0 text-[#3B82F6]" }),
									existingInvoice.url ? /* @__PURE__ */ jsx("a", {
										href: existingInvoice.url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "flex-1 truncate text-[12px] font-semibold text-[#3B82F6] underline underline-offset-2",
										children: existingInvoice.name
									}) : /* @__PURE__ */ jsx("span", {
										className: "flex-1 truncate text-[12px] font-semibold text-[#3B82F6]",
										children: existingInvoice.name
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => fileRef.current?.click(),
										className: "text-[11px] font-semibold text-[#6B7280] underline hover:text-[#374151]",
										children: "Replace"
									})
								]
							}) : /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => fileRef.current?.click(),
								className: "flex h-8 w-full items-center justify-center rounded-[7px] border border-dashed border-[#C7CAD1] bg-[#FAFBFC] text-[12px] font-semibold text-[#4F5DF5] transition hover:border-[#4F5DF5] hover:bg-[#F4F5FF]",
								children: "Click to upload feature invoice"
							})]
						}),
						mutation.isError && /* @__PURE__ */ jsx("p", {
							className: "text-[12px] font-semibold text-[#DC2626]",
							children: mutation.error.message
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-3 pt-0.5",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleClose,
								className: "h-8 rounded-[8px] border border-[#E5E7EB] px-4 text-[12px] font-semibold text-[#5C6270] transition hover:bg-[#F4F5F7]",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: mutation.isPending,
								className: "h-8 rounded-[8px] bg-[#4F5DF5] px-4 text-[12px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-60",
								children: mutation.isPending ? "Saving…" : "Save Changes"
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/websites/attach-invoice-dialog.tsx
function AttachInvoiceDialog({ websiteId, billingId, periodLabel, open, onOpenChange }) {
	const fileRef = useRef(null);
	const [file, setFile] = useState(null);
	const [dragOver, setDragOver] = useState(false);
	const [done, setDone] = useState(false);
	const mutation = useAttachInvoice(websiteId);
	if (!open) return null;
	const handleClose = () => {
		setFile(null);
		setDone(false);
		mutation.reset();
		onOpenChange(false);
	};
	const handleAttach = async () => {
		if (!file) return;
		mutation.mutate({
			billingId,
			file
		}, { onSuccess: () => setDone(true) });
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]",
		onClick: (e) => {
			if (e.target === e.currentTarget) handleClose();
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-[420px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: handleClose,
				className: "absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]",
				children: /* @__PURE__ */ jsx(X, { className: "size-4" })
			}), done ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center gap-4 px-8 py-12",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "flex size-14 items-center justify-center rounded-full bg-[#ECFDF5]",
						children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-7 text-[#059669]" })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-center",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[16px] font-bold text-[#11141A]",
							children: "Invoice Attached"
						}), /* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-[12.5px] text-[#6B7280]",
							children: [
								file?.name,
								" attached to ",
								periodLabel,
								"."
							]
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: handleClose,
						className: "mt-1 h-9 rounded-[9px] bg-[#059669] px-6 text-[12.5px] font-semibold text-white transition hover:bg-[#047857]",
						children: "Done"
					})
				]
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
				className: "border-b border-[#E5E7EB] px-6 py-4",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-[15px] font-bold text-[#11141A]",
					children: "Attach Invoice"
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-0.5 text-[12px] text-[#8A8F98]",
					children: [
						"Attach an invoice PDF or image to ",
						/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-[#374151]",
							children: periodLabel
						}),
						"."
					]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-4 p-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: cn("flex flex-col items-center justify-center gap-3 rounded-[12px] border-[1.5px] border-dashed py-8 transition", dragOver ? "border-[#4F5DF5] bg-[#F5F6FF]" : "border-[#D1D5DB] bg-[#FAFBFC]"),
						onDragOver: (e) => {
							e.preventDefault();
							setDragOver(true);
						},
						onDragLeave: () => setDragOver(false),
						onDrop: (e) => {
							e.preventDefault();
							setDragOver(false);
							const f = e.dataTransfer.files[0];
							if (!f) return;
							if (f.size > 5 * 1024 * 1024) {
								alert("File is too large. Maximum size is 5 MB.");
								return;
							}
							setFile(f);
						},
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex size-11 items-center justify-center rounded-full bg-[#EEF2FF]",
								children: /* @__PURE__ */ jsx(CloudUpload, { className: "size-5 text-[#4F5DF5]" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-center",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-[13px] font-semibold text-[#374151]",
									children: "Drop file here or browse"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11.5px] text-[#9CA3AF]",
									children: "PDF or image"
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								ref: fileRef,
								type: "file",
								accept: "application/pdf,image/*",
								className: "hidden",
								onChange: (e) => {
									const f = e.target.files?.[0];
									e.target.value = "";
									if (!f) return;
									if (f.size > 5 * 1024 * 1024) {
										alert("File is too large. Maximum size is 5 MB.");
										return;
									}
									setFile(f);
								}
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => fileRef.current?.click(),
								className: "h-8 rounded-[8px] border border-[#4F5DF5] px-4 text-[12px] font-semibold text-[#4F5DF5] transition hover:bg-[#EEEFFE]",
								children: "Choose File"
							})
						]
					}),
					file && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 rounded-[9px] border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2.5",
						children: [
							/* @__PURE__ */ jsx(Paperclip, { className: "size-3.5 shrink-0 text-[#059669]" }),
							/* @__PURE__ */ jsx("span", {
								className: "flex-1 truncate text-[12px] font-semibold text-[#059669]",
								children: file.name
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setFile(null),
								className: "text-[#059669] hover:text-[#047857]",
								children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
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
							type: "button",
							disabled: !file || mutation.isPending,
							onClick: handleAttach,
							className: cn("h-9 rounded-[9px] px-5 text-[12.5px] font-semibold text-white transition", file && !mutation.isPending ? "bg-[#4F5DF5] hover:bg-[#3F4DE0]" : "cursor-not-allowed bg-[#E5E7EB] text-[#9CA3AF]"),
							children: mutation.isPending ? "Attaching…" : "Attach Invoice"
						})]
					})
				]
			})] })]
		})
	});
}
//#endregion
//#region src/components/websites/website-detail.tsx
function WebsiteDetail({ website }) {
	const websiteId = String(website.id);
	const hostedDate = website.hosted_date ? new Date(website.hosted_date) : /* @__PURE__ */ new Date();
	const billingStartMonth = hostedDate.getMonth();
	const defaultYear = hostedDate.getFullYear();
	const [year, setYear] = useState(defaultYear);
	const minYear = website.start_date ? new Date(website.start_date).getFullYear() : defaultYear;
	const timelineQuery = useWebsiteTimeline(websiteId, year);
	const timeline = timelineQuery.data;
	const periodsWithDomain = useDomainEvent(timeline?.periods, website);
	const requestsQuery = useRequests(websiteId);
	const requests = requestsQuery.data?.items ?? [];
	const [editingRequest, setEditingRequest] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "grid items-stretch gap-[14px] lg:grid-cols-[370px_1fr]",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "relative",
				children: /* @__PURE__ */ jsx(TimelineCard, {
					websiteId,
					periods: periodsWithDomain,
					isLoading: timelineQuery.isLoading,
					isError: timelineQuery.isError,
					isFetching: timelineQuery.isFetching,
					year,
					minYear,
					billingStartMonth,
					onYearChange: setYear,
					onEditRequest: setEditingRequest
				})
			}),
			editingRequest && /* @__PURE__ */ jsx(EditRequestDialog, {
				websiteId,
				request: editingRequest,
				open: !!editingRequest,
				onOpenChange: (o) => {
					if (!o) setEditingRequest(null);
				}
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]",
				children: [
					/* @__PURE__ */ jsx(ProfitSection, {
						profitSummary: timeline?.profit_summary,
						isLoading: timelineQuery.isLoading
					}),
					/* @__PURE__ */ jsx(InfoSection, {
						title: "Website Details",
						children: /* @__PURE__ */ jsx(InfoGrid, { items: [
							{
								label: "Client",
								value: /* @__PURE__ */ jsx(Link, {
									to: "/clients/$clientId",
									params: { clientId: String(website.client_row_id) },
									className: "font-bold text-[#4F5DF5] underline-offset-2 hover:underline",
									children: website.client_name
								})
							},
							{
								label: "URL",
								value: website.url ? /* @__PURE__ */ jsxs("a", {
									href: website.url,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex items-center gap-1 text-[#4F5DF5] underline-offset-2 hover:underline",
									children: [website.url.replace(/^https?:\/\//, ""), /* @__PURE__ */ jsx(ExternalLink, { className: "size-3" })]
								}) : "—"
							},
							{
								label: "Type",
								value: website.build_type || website.site_type || "—"
							},
							{
								label: "Build Cost",
								value: website.build_cost ? formatCurrency(website.build_cost) : "—"
							},
							{
								label: "Start Date",
								value: formatDate(website.start_date)
							},
							{
								label: "Completed Date",
								value: formatDate(website.completed_date)
							},
							{
								label: "Hosted Date",
								value: formatDate(website.hosted_date)
							},
							{
								label: "Billing",
								value: website.maintenance_amount ? `${formatCurrency(website.maintenance_amount)} / ${website.billing_cycle ?? "month"}` : "—"
							}
						] })
					}),
					website.domain_name ? /* @__PURE__ */ jsx(InfoSection, {
						title: "Domain Details",
						children: /* @__PURE__ */ jsx(InfoGrid, { items: [
							{
								label: "Domain Name",
								value: website.domain_name
							},
							{
								label: "Handled By",
								value: website.domain_handled_by === "our_side" ? "Our side" : website.domain_handled_by === "client_side" ? "Client side" : "—"
							},
							{
								label: "Provider",
								value: website.domain_provider ?? "—"
							},
							{
								label: "Renewal Date",
								value: formatDate(website.domain_renewal_date)
							},
							{
								label: "Domain Cost",
								value: website.domain_cost ? formatCurrency(website.domain_cost) + " / year" : "—"
							},
							{
								label: "Profit Rule",
								value: website.domain_handled_by === "our_side" ? "Deduct from profit" : "Client managed"
							}
						] })
					}) : null,
					website.hosting_provider ? /* @__PURE__ */ jsx(InfoSection, {
						title: "Hosting Details",
						children: /* @__PURE__ */ jsx(InfoGrid, { items: [
							{
								label: "Provider",
								value: website.hosting_provider
							},
							{
								label: "Hosting Cost",
								value: website.hosting_cost ? formatCurrency(website.hosting_cost) + " / year" : "—"
							},
							{
								label: "Renewal Date",
								value: formatDate(website.hosting_renewal_date)
							}
						] })
					}) : null,
					/* @__PURE__ */ jsx(RequestsSection, {
						websiteId,
						requests,
						isLoading: requestsQuery.isLoading
					}),
					/* @__PURE__ */ jsx(RateHistorySection, { website })
				]
			})
		]
	});
}
function WebsiteDetailSkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-[20px] lg:grid-cols-[370px_1fr]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-[#E5E7EB] px-[18px] py-[14px]",
					children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-32 rounded" }), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ jsx(Skeleton, { className: "size-[27px] rounded-[7px]" }), /* @__PURE__ */ jsx(Skeleton, { className: "size-[27px] rounded-[7px]" })]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex gap-[10px] border-b border-[#E5E7EB] bg-[#F9FAFB] px-[18px] py-[10px]",
					children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-14 rounded" }, i))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-col gap-0",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 border-b border-[#EEF0F2] px-[18px] py-[13px]",
						children: [
							/* @__PURE__ */ jsx(Skeleton, { className: "size-[14px] rounded" }),
							/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-28 rounded" }),
							/* @__PURE__ */ jsxs("div", {
								className: "ml-auto flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-3.5 w-14 rounded" }), /* @__PURE__ */ jsx(Skeleton, { className: "size-[19px] rounded-full" })]
							})
						]
					}, i))
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "border-b border-[#EEF0F2] p-[16px_18px]",
				children: [/* @__PURE__ */ jsx(Skeleton, { className: "mb-3 h-3 w-36 rounded" }), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-4 gap-[10px]",
					children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-[11px] border border-[#E5E7EB] bg-[#F9FAFB] p-3",
						children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-2.5 w-16 rounded" }), /* @__PURE__ */ jsx(Skeleton, { className: "mt-2 h-5 w-20 rounded" })]
					}, i))
				})]
			}), Array.from({ length: 3 }).map((_, s) => /* @__PURE__ */ jsxs("div", {
				className: "border-b border-[#EEF0F2] p-[16px_18px]",
				children: [/* @__PURE__ */ jsx(Skeleton, { className: "mb-3 h-3 w-28 rounded" }), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-x-4 gap-y-[11px]",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-2.5 w-16 rounded" }), /* @__PURE__ */ jsx(Skeleton, { className: "mt-1.5 h-3.5 w-24 rounded" })] }, i))
				})]
			}, s))]
		})]
	});
}
var PERIOD_PRIORITY = {
	overdue: 0,
	pending: 1
};
function periodSortKey(p) {
	return PERIOD_PRIORITY[p.billing?.status ?? ""] ?? 2;
}
var MONTH_ABBRS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function parsePeriodDate(label) {
	const parts = label.trim().split(" ");
	if (parts.length !== 2) return null;
	const m = MONTH_ABBRS.indexOf(parts[0]);
	const y = parseInt(parts[1]);
	return m !== -1 && !isNaN(y) ? {
		month: m,
		year: y
	} : null;
}
function TimelineCard({ websiteId, periods, isLoading, isError, isFetching, year, minYear, billingStartMonth, onYearChange, onEditRequest }) {
	const yearPeriods = periods?.filter((p) => {
		const d = parsePeriodDate(p.period_label);
		if (!d) return false;
		if (d.year === year && d.month >= billingStartMonth) return true;
		if (d.year === year + 1 && d.month < billingStartMonth) return true;
		return false;
	}) ?? [];
	const endMonth = billingStartMonth === 0 ? 11 : billingStartMonth - 1;
	const endYear = billingStartMonth === 0 ? year : year + 1;
	const headerLabel = `${MONTH_ABBRS[billingStartMonth]} ${year} — ${MONTH_ABBRS[endMonth]} ${endYear}`;
	const sortedPeriods = [...yearPeriods].sort((a, b) => periodSortKey(a) - periodSortKey(b));
	return /* @__PURE__ */ jsxs("div", {
		className: "absolute inset-0 flex flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-[18px] py-[14px]",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-[14px] font-bold text-[#11141A]",
					children: headerLabel
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => onYearChange(year - 1),
						disabled: isFetching || year <= minYear,
						className: "flex size-[27px] items-center justify-center rounded-[7px] border border-[#E5E7EB] bg-white text-[12px] text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] disabled:opacity-40",
						children: "‹"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => onYearChange(year + 1),
						disabled: isFetching,
						className: "flex size-[27px] items-center justify-center rounded-[7px] border border-[#E5E7EB] bg-white text-[12px] text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] disabled:opacity-40",
						children: "›"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex shrink-0 flex-wrap gap-[10px] border-b border-[#E5E7EB] bg-[#F9FAFB] px-[18px] py-[10px]",
				children: [
					{
						dot: "bg-[#10B981]",
						label: "Payment"
					},
					{
						dot: "bg-[#EF4444]",
						label: "Bug"
					},
					{
						dot: "bg-[#3B82F6]",
						label: "Feature"
					},
					{
						dot: "bg-[#F59E0B]",
						label: "Rate Change"
					},
					{
						dot: "bg-[#8B5CF6]",
						label: "Domain"
					},
					{
						dot: "bg-[#06B6D4]",
						label: "Hosting"
					}
				].map((leg) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-[5px]",
					children: [/* @__PURE__ */ jsx("span", { className: cn("size-[9px] rounded-full", leg.dot) }), /* @__PURE__ */ jsx("span", {
						className: "text-[12px] font-medium text-[#6B7280]",
						children: leg.label
					})]
				}, leg.label))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: isLoading ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-2 p-4",
					children: [
						/* @__PURE__ */ jsx(Skeleton, { className: "h-10 rounded-[8px]" }),
						/* @__PURE__ */ jsx(Skeleton, { className: "h-10 rounded-[8px]" }),
						/* @__PURE__ */ jsx(Skeleton, { className: "h-10 rounded-[8px]" })
					]
				}) : isError ? /* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-center py-8 text-[12.5px] text-[#DC2626]",
					children: "Failed to load timeline."
				}) : !sortedPeriods.length ? /* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-center py-10 text-[13px] text-[#8A8F98]",
					children: "No activity yet."
				}) : sortedPeriods.map((period) => /* @__PURE__ */ jsx(PeriodRow, {
					period,
					websiteId,
					onEditRequest
				}, period.period_key))
			})
		]
	});
}
function PeriodRow({ period, websiteId, onEditRequest }) {
	const hasData = (period.events?.length ?? 0) > 0;
	const [open, setOpen] = useState(hasData);
	const [attachOpen, setAttachOpen] = useState(false);
	const billing = period.billing;
	const { iconBg, iconContent, amtClr } = getBillingDisplay(billing?.status ?? "");
	const isFeatureUnpaid = (ev) => ev.event_type === "feature" && !!ev.amount && !!ev.subtitle?.toLowerCase().includes("unpaid");
	const unpaidFeatureTotal = period.events.filter(isFeatureUnpaid).reduce((sum, ev) => sum + Number(ev.amount ?? 0), 0);
	const paidFeatureTotal = period.events.filter((ev) => ev.event_type === "feature" && !!ev.amount && !isFeatureUnpaid(ev)).reduce((sum, ev) => sum + Number(ev.amount ?? 0), 0);
	const maintenanceAmount = Number(billing?.amount ?? 0);
	const periodTotal = maintenanceAmount + paidFeatureTotal + unpaidFeatureTotal;
	const hasMixedSettlement = billing?.status === "paid" && unpaidFeatureTotal > 0;
	const paidTotal = maintenanceAmount + paidFeatureTotal;
	const periodTotalDisplay = periodTotal > 0 ? `₹${periodTotal.toLocaleString("en-IN")}` : billing?.display_amount ?? "—";
	const paidTotalDisplay = `₹${paidTotal.toLocaleString("en-IN")}`;
	const unpaidTotalDisplay = `₹${unpaidFeatureTotal.toLocaleString("en-IN")}`;
	const canAttachInvoice = billing?.status === "paid" && !billing.invoice_file_url;
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-[#EEF0F2] last:border-b-0",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex w-full items-center gap-[10px] px-[18px] py-[13px]",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setOpen((o) => !o),
					className: "flex flex-1 items-center gap-[10px] transition hover:opacity-80",
					children: [/* @__PURE__ */ jsx(ChevronRight, { className: cn("size-[14px] shrink-0 text-[#8A8F98] transition-transform", open && "rotate-90") }), /* @__PURE__ */ jsx("span", {
						className: cn("flex-1 text-left text-[13px] font-semibold", hasData ? "text-[#11141A]" : "text-[#94A3B8]"),
						children: period.period_label
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-[6px]",
					children: hasMixedSettlement ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-[12.5px] font-bold text-[#059669]",
							children: paidTotalDisplay
						}),
						/* @__PURE__ */ jsx("span", {
							className: "flex size-[19px] items-center justify-center rounded-full bg-[#059669] text-[10px] font-bold text-white",
							children: "✓"
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-[3px] rounded-full bg-[#FEF3C7] px-[7px] py-[2px] text-[10.5px] font-bold text-[#D97706]",
							children: [
								"+",
								unpaidTotalDisplay,
								" feature unpaid"
							]
						})
					] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						className: cn("text-[12.5px]", amtClr),
						children: periodTotalDisplay
					}), iconBg && /* @__PURE__ */ jsx("span", {
						className: cn("flex size-[19px] items-center justify-center rounded-full text-[10px] font-bold text-white", iconBg),
						children: iconContent
					})] })
				})]
			}),
			attachOpen && billing && /* @__PURE__ */ jsx(AttachInvoiceDialog, {
				websiteId,
				billingId: billing.billing_id,
				periodLabel: period.period_label,
				open: attachOpen,
				onOpenChange: setAttachOpen
			}),
			open && hasData && /* @__PURE__ */ jsx("div", {
				className: "pb-4 pl-[43px] pr-[18px] pt-0",
				children: period.events.map((ev, i) => /* @__PURE__ */ jsx(EventRow, {
					ev,
					invoiceUrl: ev.event_type === "payment" ? billing?.invoice_file_url : null,
					onAttachInvoice: ev.event_type === "payment" && canAttachInvoice ? () => setAttachOpen(true) : void 0,
					onEditRequest
				}, i))
			})
		]
	});
}
function useDomainEvent(periods, website) {
	if (!periods || !website.domain_renewal_date || website.domain_handled_by !== "our_side") return periods;
	const renewalDate = new Date(website.domain_renewal_date);
	const renewalMonth = renewalDate.getMonth();
	const renewalYear = renewalDate.getFullYear();
	const renewalLabel = `${MONTH_ABBRS[renewalMonth]} ${renewalYear}`;
	const existing = periods.find((p) => p.period_label === renewalLabel);
	if (existing?.events.some((e) => e.event_type === "domain_event")) return periods;
	const todayStr = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
	const renewalStr = renewalDate.toLocaleDateString("en-CA");
	const diffDays = Math.round((new Date(renewalStr).getTime() - new Date(todayStr).getTime()) / 864e5);
	const isOverdue = diffDays < 0;
	const isDueSoon = !isOverdue && diffDays <= 30;
	const syntheticEvent = {
		event_type: "domain_event",
		event_date: website.domain_renewal_date,
		icon_code: "D",
		icon_text: "D",
		icon_color: isOverdue ? "red" : isDueSoon ? "amber" : "purple",
		title: isOverdue ? `Domain overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""}` : isDueSoon ? `Domain due in ${diffDays} day${diffDays !== 1 ? "s" : ""}` : `Domain renewal`,
		subtitle: [website.domain_name, website.domain_provider].filter(Boolean).join(" · ") || null,
		display_amount: website.domain_cost ? `₹${Number(website.domain_cost).toLocaleString("en-IN")} / year` : null
	};
	if (existing) return periods.map((p) => p.period_label === renewalLabel ? {
		...p,
		events: [syntheticEvent, ...p.events]
	} : p);
	const newPeriod = {
		period_key: `domain-${renewalLabel}`,
		period_label: renewalLabel,
		period_start: website.domain_renewal_date,
		period_end: website.domain_renewal_date,
		billing: null,
		events: [syntheticEvent]
	};
	return [...periods, newPeriod];
}
function getBillingDisplay(status) {
	switch (status) {
		case "paid": return {
			iconBg: "bg-[#059669]",
			iconContent: "✓",
			amtClr: "text-[#059669] font-bold"
		};
		case "overdue": return {
			iconBg: "bg-[#DC2626]",
			iconContent: "!",
			amtClr: "text-[#DC2626] font-bold"
		};
		case "pending": return {
			iconBg: "bg-[#D97706]",
			iconContent: "⏳",
			amtClr: "text-[#D97706] font-bold"
		};
		default: return {
			iconBg: "",
			iconContent: "",
			amtClr: "text-[#9CA3AF] font-normal"
		};
	}
}
var ICON_COLOR_MAP = {
	green: "bg-[#10B981]",
	red: "bg-[#EF4444]",
	indigo: "bg-[#3B82F6]",
	amber: "bg-[#F59E0B]",
	teal: "bg-[#06B6D4]",
	purple: "bg-[#8B5CF6]",
	gray: "bg-[#9CA3AF]"
};
function EventRow({ ev, invoiceUrl, onAttachInvoice, onEditRequest }) {
	const iconBg = ICON_COLOR_MAP[ev.icon_color] ?? "bg-[#9CA3AF]";
	if (ev.event_type === "payment") {
		const subtitleClean = ev.subtitle?.replace(/\s*[·-]?\s*invoice (attached|not attached)/i, "").trim() ?? null;
		return /* @__PURE__ */ jsxs("div", {
			className: "group flex items-start gap-[9px] py-[6px]",
			children: [/* @__PURE__ */ jsx("div", {
				className: "mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px] bg-[#10B981] text-[11px] font-bold text-white",
				children: ev.icon_text
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-[13.5px] font-semibold text-[#111827]",
					children: ev.title
				}), subtitleClean && /* @__PURE__ */ jsxs("div", {
					className: "mt-[1px] flex items-center gap-2 text-[12px] text-[#9CA3AF]",
					children: [/* @__PURE__ */ jsx("span", { children: subtitleClean }), invoiceUrl ? /* @__PURE__ */ jsx("a", {
						href: invoiceUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "font-medium text-[#4F5DF5] underline underline-offset-2 hover:text-[#3F4DE0]",
						children: "· invoice attached"
					}) : onAttachInvoice ? /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onAttachInvoice,
						className: "font-medium text-[#9CA3AF] underline underline-offset-2 hover:text-[#4F5DF5]",
						children: "· invoice not attached"
					}) : null]
				})]
			})]
		});
	}
	const subtitleNode = ev.subtitle ? /* @__PURE__ */ jsx("div", {
		className: "mt-[1px] text-[12px] text-[#9CA3AF]",
		children: ev.subtitle
	}) : null;
	const editableRequest = (ev.event_type === "bug" || ev.event_type === "feature") && ev.meta?.request_id ? {
		request_id: String(ev.meta.request_id),
		website_id: String(ev.meta.website_id ?? ""),
		type: ev.event_type,
		title: String(ev.meta.title ?? ev.title),
		description: ev.meta.description != null ? String(ev.meta.description) : null,
		status: String(ev.meta.status ?? "open"),
		requested_date: ev.meta.requested_date != null ? String(ev.meta.requested_date) : null,
		delivered_date: ev.meta.delivered_date != null ? String(ev.meta.delivered_date) : null,
		cost: ev.meta.cost != null ? String(ev.meta.cost) : null,
		payment_status: ev.meta.payment_status != null ? String(ev.meta.payment_status) : null,
		payment_date: ev.meta.payment_date != null ? String(ev.meta.payment_date) : null,
		invoice_file_url: ev.meta.invoice_file_url != null ? String(ev.meta.invoice_file_url) : null,
		invoice_file_name: ev.meta.invoice_file_name != null ? String(ev.meta.invoice_file_name) : null,
		created_at: String(ev.meta.created_at ?? ev.event_date),
		updated_at: String(ev.meta.updated_at ?? ev.event_date),
		reported_by: String(ev.meta.reported_by ?? "")
	} : null;
	return /* @__PURE__ */ jsxs("div", {
		className: "group flex items-start gap-[9px] py-[6px]",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: cn("mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-white", iconBg),
				children: ev.icon_text
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-[13.5px] font-semibold text-[#111827]",
						children: ev.title
					}),
					subtitleNode,
					ev.display_amount && /* @__PURE__ */ jsx("div", {
						className: "mt-[2px] text-[11.5px] font-bold text-[#4F5DF5]",
						children: ev.display_amount
					})
				]
			}),
			editableRequest && (() => {
				return /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => onEditRequest(editableRequest),
					title: "Edit request",
					className: cn("mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px] transition hover:bg-[#F0F1FF] hover:text-[#4F5DF5]", ev.event_type === "feature" && ev.subtitle?.toLowerCase().includes("unpaid") ? "text-[#D97706] opacity-100" : "text-[#C4C9D4] opacity-0 group-hover:opacity-100"),
					children: /* @__PURE__ */ jsx(Pencil, { className: "size-[12px]" })
				});
			})()
		]
	});
}
function ProfitSection({ profitSummary, isLoading }) {
	const rangeLabel = profitSummary?.window_label ? `${profitSummary.window_label} (view only)` : "(view only)";
	const tiles = isLoading ? [
		{
			label: "Maintenance",
			value: "…"
		},
		{
			label: "Paid Features",
			value: "…"
		},
		{
			label: "Costs",
			value: "…"
		},
		{
			label: "Profit so far",
			value: "…",
			highlight: true
		}
	] : [
		{
			label: "Maintenance",
			value: profitSummary?.maintenance_received_display ?? "—"
		},
		{
			label: "Paid Features",
			value: profitSummary?.paid_features_received_display ?? "—"
		},
		{
			label: "Costs",
			value: profitSummary?.costs_total_display ? `−${profitSummary.costs_total_display}` : "—"
		},
		{
			label: "Profit so far",
			value: profitSummary?.profit_total_display ?? "—",
			highlight: true
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-[#EEF0F2] p-[16px_18px]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]",
			children: ["Annual Profit — ", rangeLabel]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-4 gap-[10px]",
			children: tiles.map((tile) => /* @__PURE__ */ jsx(ProfitTile, {
				label: tile.label,
				value: tile.value,
				highlight: tile.highlight
			}, tile.label))
		})]
	});
}
function ProfitTile({ label, value, highlight }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("rounded-[11px] border p-3", highlight ? "border-[#A7F3D0] bg-[#ECFDF5]" : "border-[#E5E7EB] bg-[#F9FAFB]"),
		children: [/* @__PURE__ */ jsx("div", {
			className: cn("text-[10px] font-bold uppercase tracking-[.05em]", highlight ? "text-[#059669]" : "text-[#9CA3AF]"),
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: cn("mt-[5px] font-bold", highlight ? "text-[18px] text-[#059669]" : "text-[16px] text-[#111827]"),
			children: value
		})]
	});
}
function InfoSection({ title, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-[#EEF0F2] p-[16px_18px]",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]",
			children: title
		}), children]
	});
}
function InfoGrid({ items }) {
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-2 gap-x-4 gap-y-[11px]",
		children: items.map(({ label, value }) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
			className: "text-[11px] text-[#8A8F98]",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-[3px] text-[13px] font-semibold text-[#11141A]",
			children: value ?? "—"
		})] }, label))
	});
}
function RequestsSection({ websiteId, requests, isLoading }) {
	const [editingRequest, setEditingRequest] = useState(null);
	const statusConfig = {
		open: {
			label: "Pending",
			cls: "bg-[#F3F4F6] text-[#6B7280]"
		},
		in_progress: {
			label: "In Progress",
			cls: "bg-[#FEF3C7] text-[#D97706]"
		},
		completed: {
			label: "Done",
			cls: "bg-[#ECFDF5] text-[#059669]"
		},
		wont_fix: {
			label: "Rejected",
			cls: "bg-[#FEF2F2] text-[#DC2626]"
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "border-b border-[#EEF0F2] p-[16px_18px]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]",
			children: ["Requests ", isLoading ? "" : `(${requests.length})`]
		}), isLoading ? /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-8 rounded" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-8 rounded" })]
		}) : requests.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "text-[12.5px] text-[#8A8F98]",
			children: "No requests yet."
		}) : /* @__PURE__ */ jsx("div", { children: requests.map((req, i) => {
			const status = statusConfig[req.status] ?? statusConfig.open;
			return /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setEditingRequest(req),
				className: cn("flex w-full items-center gap-[9px] rounded-[8px] px-1 py-[9px] text-left transition hover:bg-[#F7F8FA]", i < requests.length - 1 && "border-b border-[#EEF0F2]"),
				children: [
					/* @__PURE__ */ jsx("div", {
						className: cn("flex size-[22px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-white", req.type === "bug" ? "bg-[#EF4444]" : "bg-[#3B82F6]"),
						children: req.type === "bug" ? "B" : "F"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex-1 text-[12.5px] text-[#5C6270]",
						children: req.title
					}),
					/* @__PURE__ */ jsx("span", {
						className: cn("rounded-[6px] px-[9px] py-[3px] text-[10.5px] font-bold uppercase", status.cls),
						children: status.label
					})
				]
			}, req.request_id);
		}) })]
	}), editingRequest && /* @__PURE__ */ jsx(EditRequestDialog, {
		websiteId,
		request: editingRequest,
		open: !!editingRequest,
		onOpenChange: (o) => {
			if (!o) setEditingRequest(null);
		}
	})] });
}
function RateHistorySection({ website }) {
	const currentRate = website.maintenance_amount;
	if (!currentRate) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-[#EEF0F2] p-[16px_18px]",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]",
			children: "Rate History"
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 py-[7px] text-[12.5px]",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "text-[#8A8F98]",
					children: "Initial"
				}),
				/* @__PURE__ */ jsx("span", {
					className: "text-[#8A8F98]",
					children: "→"
				}),
				/* @__PURE__ */ jsx("span", {
					className: "font-bold text-[#11141A]",
					children: formatCurrency(currentRate)
				}),
				website.hosted_date ? /* @__PURE__ */ jsx("span", {
					className: "ml-auto text-[11px] text-[#8A8F98]",
					children: formatDate(website.hosted_date)
				}) : null
			]
		})]
	});
}
//#endregion
//#region src/routes/_protected/_websites/websites.$websiteId.tsx?tsr-split=component
function WebsiteDetailPage() {
	const { websiteId } = Route.useParams();
	const websiteQuery = useWebsite(websiteId);
	const website = websiteQuery.data;
	const [editOpen, setEditOpen] = useState(false);
	const [paymentOpen, setPaymentOpen] = useState(false);
	const [requestOpen, setRequestOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-1 flex-col overflow-auto bg-[#F4F5F7]",
		children: [/* @__PURE__ */ jsxs("main", {
			className: "flex flex-1 flex-col gap-[10px] px-[24px] py-[14px]",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					search: {
						page: 1,
						limit: 10,
						showFilters: false
					},
					className: "flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#5C6270] transition hover:text-[#4F5DF5]",
					children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }), "Back to Websites"]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-4 flex-wrap",
					children: [/* @__PURE__ */ jsxs("div", { children: [websiteQuery.isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-7 w-52 rounded-[8px]" }), /* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-20 rounded-[7px]" }),
							/* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-16 rounded-[7px]" }),
							/* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-24 rounded-[7px]" })
						]
					})] }) : /* @__PURE__ */ jsx("div", {
						className: "text-[20px] font-bold tracking-tight text-[#11141A]",
						children: website?.project_name ?? "Website Details"
					}), website ? /* @__PURE__ */ jsxs("div", {
						className: "mt-1.5 flex items-center gap-2 flex-wrap",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "rounded-[7px] bg-[#F7F8FA] px-[11px] py-1 text-[11.5px] font-semibold text-[#5C6270]",
								children: ["WEB-", String(website.id).padStart(3, "0")]
							}),
							/* @__PURE__ */ jsx(StatusPill, { label: website.website_status }),
							/* @__PURE__ */ jsx(MaintenanceBadge, { label: website.maintenance_status }),
							website.build_type ? /* @__PURE__ */ jsxs("span", {
								className: "rounded-[7px] bg-[#F7F8FA] px-[11px] py-1 text-[11.5px] font-semibold text-[#5C6270]",
								children: [
									website.build_type,
									" / ",
									website.platform
								]
							}) : null,
							website.domain_handled_by ? /* @__PURE__ */ jsxs("span", {
								className: "rounded-[7px] bg-[#F7F8FA] px-[11px] py-1 text-[11.5px] font-semibold text-[#5C6270]",
								children: ["Domain: ", website.domain_handled_by === "our_side" ? "Our side" : "Client side"]
							}) : null
						]
					}) : null] }), /* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: websiteQuery.isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-28 rounded-[9px]" }),
							/* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-28 rounded-[9px]" }),
							/* @__PURE__ */ jsx(Skeleton, { className: "h-9 w-32 rounded-[9px]" })
						] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: !website,
								onClick: () => setRequestOpen(true),
								className: cn("inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]", !website && "opacity-50 cursor-not-allowed"),
								children: "Add Request"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: !website,
								onClick: () => setEditOpen(true),
								className: cn("inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]", !website && "opacity-50 cursor-not-allowed"),
								children: "Edit Website"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: !website,
								onClick: () => setPaymentOpen(true),
								className: cn("inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]", !website && "opacity-50 cursor-not-allowed"),
								children: "Record Payment"
							})
						] })
					})]
				}),
				websiteQuery.isLoading ? /* @__PURE__ */ jsx(WebsiteDetailSkeleton, {}) : null,
				websiteQuery.isError ? /* @__PURE__ */ jsx("p", {
					className: "text-[13px] text-[#DC2626]",
					children: websiteQuery.error.message
				}) : null,
				website ? /* @__PURE__ */ jsx(WebsiteDetail, { website }) : null
			]
		}), website ? /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(WebsiteEditDialog, {
				websiteId,
				open: editOpen,
				onOpenChange: setEditOpen
			}),
			/* @__PURE__ */ jsx(RecordPaymentDialog, {
				websiteId,
				projectName: website.project_name,
				hostedDate: website.hosted_date ?? null,
				maintenanceAmount: website.maintenance_amount,
				open: paymentOpen,
				onOpenChange: setPaymentOpen
			}),
			/* @__PURE__ */ jsx(AddRequestDialog, {
				websiteId,
				projectName: website.project_name,
				open: requestOpen,
				onOpenChange: setRequestOpen
			})
		] }) : null]
	});
}
//#endregion
export { WebsiteDetailPage as component };
