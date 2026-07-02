import { o as apiFetch, t as cn } from "./utils-CR4dV3c0.js";
import { t as DATA_STALE_TIME } from "./query-client-CsiSIc9f.js";
import { t as Button } from "./button-N4VO-qD6.js";
import { t as Input } from "./input-CyBl28YE.js";
import { c as useUpdateWebsite, l as useWebsite, n as useCreateWebsite, o as useRenewDomain, r as useDeleteWebsite, s as useUnpaidBillingPeriods, t as useClientOptions } from "./use-websites-BnWcvb5r.js";
import { t as QUERY_KEYS } from "./queryKeys-iadVgs7d.js";
import { t as ConfirmDialog } from "./confirm-dialog-Q5QxauQW.js";
import { t as Skeleton } from "./skeleton-3GrrKxds.js";
import { n as formatDate, t as formatCurrency } from "./format-BiRzvK38.js";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as ServiceOptionSelect } from "./service-option-select-DfxCZ9yy.js";
import { n as useServiceOptions } from "./use-service-options-1VyXK7Is.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Eye, Loader2, Paperclip, RefreshCw, Save, Trash2, X } from "lucide-react";
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
function buildCreatePayload(input) {
	const payload = {
		type: input.type,
		title: input.title
	};
	if (input.description) payload.description = input.description;
	if (input.status) payload.status = input.status;
	if (input.requestedDate) payload.requestedDate = input.requestedDate;
	if (input.deliveredDate) payload.deliveredDate = input.deliveredDate;
	if (input.cost) payload.cost = input.cost;
	if (input.paymentStatus !== void 0) payload.isPaid = input.paymentStatus === "paid";
	if (input.paymentDate) payload.paymentReceivedDate = input.paymentDate;
	return payload;
}
function createRequest(input) {
	if (input.invoiceFile) {
		const fd = new FormData();
		const payload = buildCreatePayload(input);
		for (const [key, value] of Object.entries(payload)) if (value !== null && value !== void 0) fd.append(key, String(value));
		fd.append("invoiceFile", input.invoiceFile);
		return apiFetch(`/websites/${input.websiteId}/requests`, {
			method: "POST",
			body: fd
		});
	}
	return apiFetch(`/websites/${input.websiteId}/requests`, {
		method: "POST",
		body: JSON.stringify(buildCreatePayload(input))
	});
}
function buildUpdatePayload(input) {
	const payload = {};
	if (input.status !== void 0) payload.status = input.status;
	if (input.cost !== void 0) payload.cost = input.cost;
	if (input.description !== void 0) payload.remarks = input.description;
	if (input.paymentStatus !== void 0) payload.isPaid = input.paymentStatus === "paid";
	if (input.paymentDate !== void 0) payload.paymentReceivedDate = input.paymentDate || null;
	return payload;
}
function updateRequest(_websiteId, requestId, input) {
	if (input.invoiceFile) {
		const fd = new FormData();
		const payload = buildUpdatePayload(input);
		for (const [key, value] of Object.entries(payload)) if (value !== null && value !== void 0) fd.append(key, String(value));
		fd.append("invoiceFile", input.invoiceFile);
		return apiFetch(`/requests/${requestId}`, {
			method: "PUT",
			body: fd
		});
	}
	return apiFetch(`/requests/${requestId}`, {
		method: "PUT",
		body: JSON.stringify(buildUpdatePayload(input))
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
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_TIMELINE, websiteId] });
			toast.success("Request submitted.");
		}
	});
}
function useUpdateRequest(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ requestId, input }) => updateRequest(websiteId, requestId, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_REQUESTS, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_TIMELINE, websiteId] });
			toast.success("Request updated.");
		}
	});
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
async function attachBillingInvoice(websiteId, billingId, file) {
	const { base64, name, contentType } = await toBase64(file);
	return apiFetch(`/websites/${websiteId}/billing/${billingId}/invoice`, {
		method: "PATCH",
		body: JSON.stringify({
			invoiceFileBase64: base64,
			invoiceFileName: name,
			invoiceContentType: contentType
		})
	});
}
//#endregion
//#region src/hooks/use-billing.ts
function useAttachInvoice(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ billingId, file }) => attachBillingInvoice(websiteId, billingId, file),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_TIMELINE, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_BILLING, websiteId] });
			toast.success("Invoice attached.");
		}
	});
}
function useRecordPayment(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => recordPayment(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_BILLING, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_TIMELINE, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			toast.success("Payment recorded.");
		}
	});
}
//#endregion
//#region src/components/websites/website-form.tsx
var emptyToNull = (v) => typeof v === "string" && v.trim() === "" ? null : v;
var emptyToUndefined = (v) => typeof v === "string" && v.trim() === "" ? void 0 : v;
var optionalDate = z.preprocess(emptyToUndefined, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional());
var optionalUrl = z.preprocess(emptyToUndefined, z.string().url("Invalid url").optional());
var optionalStr = z.preprocess(emptyToNull, z.string().nullable().optional());
var optionalAmt = z.preprocess(emptyToUndefined, z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be a valid amount").optional());
var requiredAmt = z.preprocess((v) => typeof v === "string" ? v.trim() : v, z.string().min(1, "Required").regex(/^\d+(\.\d{1,2})?$/, "Must be a valid amount"));
var requiredDate = (msg) => z.string().trim().min(1, msg).refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Must be YYYY-MM-DD");
var websiteFormSchema = z.object({
	clientId: z.string().min(1, "Client is required"),
	projectName: z.string().trim().min(1, "Project name is required").max(150, "Too long"),
	url: optionalUrl,
	siteType: z.string().optional(),
	platform: z.string().optional(),
	buildType: optionalStr,
	hostingProvider: optionalStr,
	buildCost: requiredAmt,
	websiteStatus: z.string().optional(),
	maintenanceStatus: z.string().optional(),
	startDate: requiredDate("Start date is required"),
	completedDate: optionalDate,
	hostedDate: optionalDate,
	lastInvoiceSent: optionalDate,
	lastPaymentReceived: optionalDate,
	renewalDate: optionalDate,
	domainName: optionalStr,
	domainHandledBy: z.enum(["our_side", "client_side"]).nullable().optional(),
	domainProvider: optionalStr,
	domainRenewalDate: optionalDate,
	domainCost: optionalAmt,
	billingCycle: z.enum(["monthly", "yearly"]).nullable().optional(),
	maintenanceAmount: optionalAmt,
	hostingCost: optionalAmt,
	hostingRenewalDate: optionalDate,
	lastPaymentAmount: optionalAmt,
	remarks: z.string().optional()
}).refine((d) => {
	return !!d.lastPaymentAmount === !!d.lastPaymentReceived;
}, {
	message: "Payment amount and date must be recorded together",
	path: ["lastPaymentAmount"]
});
var WEBSITE_STATUSES = [
	"In Progress",
	"Live",
	"On Hold",
	"Completed",
	"Discontinued"
];
var MAINTENANCE_STATUSES = [
	"Not Started",
	"Active",
	"Paused",
	"Overdue",
	"Cancelled",
	"Due Soon"
];
var DOT_COLORS = {
	"In Progress": "bg-[#F59E0B]",
	Live: "bg-[#10B981]",
	"On Hold": "bg-[#9CA3AF]",
	Completed: "bg-[#3B82F6]",
	Discontinued: "bg-[#9CA3AF]",
	"Not Started": "bg-[#9CA3AF]",
	Active: "bg-[#10B981]",
	Paused: "bg-[#9CA3AF]",
	Expired: "bg-[#EF4444]",
	Cancelled: "bg-[#9CA3AF]"
};
function deriveSiteType(buildType) {
	return (buildType ?? "").toLowerCase().includes("wordpress") ? "wordpress" : "static";
}
function derivePlatform(hostingProvider) {
	return (hostingProvider ?? "").toLowerCase().includes("wpx") ? "wpx" : "netlify";
}
function toCreatePayload(v) {
	return {
		clientId: v.clientId,
		projectName: v.projectName.trim(),
		url: v.url ?? null,
		siteType: v.siteType || deriveSiteType(v.buildType),
		platform: v.platform || derivePlatform(v.hostingProvider),
		startDate: v.startDate ?? null,
		completedDate: v.completedDate ?? null,
		hostedDate: v.hostedDate ?? null,
		buildCost: v.buildCost,
		buildType: v.buildType ?? null,
		hostingProvider: v.hostingProvider ?? null,
		hostingCost: v.hostingCost || void 0,
		hostingRenewalDate: v.hostingRenewalDate ?? null,
		domainName: v.domainName ?? null,
		domainHandledBy: v.domainHandledBy ?? null,
		domainProvider: v.domainProvider ?? null,
		domainRenewalDate: v.domainRenewalDate ?? null,
		domainCost: v.domainCost || void 0,
		billingCycle: v.billingCycle ?? null,
		maintenanceAmount: v.maintenanceAmount || void 0,
		remarks: v.remarks?.trim() || null
	};
}
function toUpdatePayload(v) {
	return {
		...toCreatePayload(v),
		websiteStatus: v.websiteStatus,
		maintenanceStatus: v.maintenanceStatus,
		renewalDate: v.renewalDate ?? null,
		lastPaymentReceived: v.lastPaymentReceived ?? null,
		lastPaymentAmount: v.lastPaymentAmount ?? null
	};
}
function toDateValue(raw) {
	if (!raw) return "";
	if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
	return raw.split("T")[0] ?? "";
}
function getDefaultValues(website, initialClientId = "") {
	return {
		clientId: website?.client_row_id ? String(website.client_row_id) : initialClientId,
		projectName: website?.project_name ?? "",
		url: website?.url ?? "",
		siteType: website?.site_type?.toLowerCase() ?? "",
		platform: website?.platform?.toLowerCase() ?? "",
		buildType: website?.build_type ?? "",
		hostingProvider: website?.hosting_provider ?? "",
		buildCost: website?.build_cost ?? "",
		websiteStatus: website?.website_status ?? "",
		maintenanceStatus: website?.maintenance_status ?? "",
		startDate: toDateValue(website?.start_date) || "",
		completedDate: toDateValue(website?.completed_date),
		hostedDate: toDateValue(website?.hosted_date),
		lastInvoiceSent: toDateValue(website?.last_invoice_sent),
		lastPaymentReceived: toDateValue(website?.last_payment_received),
		renewalDate: toDateValue(website?.current_billing_due_date),
		domainName: website?.domain_name ?? "",
		domainHandledBy: website?.domain_handled_by ?? null,
		domainProvider: website?.domain_provider ?? "",
		domainRenewalDate: toDateValue(website?.domain_renewal_date),
		domainCost: website?.domain_cost ?? "",
		billingCycle: website?.billing_cycle ?? null,
		maintenanceAmount: website?.maintenance_amount ?? "",
		hostingCost: website?.hosting_cost ?? "",
		hostingRenewalDate: toDateValue(website?.hosting_renewal_date),
		lastPaymentAmount: website?.last_payment_amount ?? "",
		remarks: website?.remarks ?? ""
	};
}
function Field$1({ label, required, hint, error, children, className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("grid gap-[3px]", className),
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "flex items-center gap-1 text-[11.5px] font-semibold text-[#374151]",
				children: [label, required && /* @__PURE__ */ jsx("span", {
					className: "text-[#DC2626]",
					children: "*"
				})]
			}),
			children,
			hint && /* @__PURE__ */ jsx("p", {
				className: "text-[10.5px] text-[#6B7280]",
				children: hint
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "text-[11px] font-semibold text-[#DC2626]",
				children: error
			})
		]
	});
}
function FormCard({ title, description, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "overflow-hidden rounded-[14px] border border-[#D1D5DB] bg-white shadow-[0_1px_4px_rgba(17,20,26,.07)]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "border-b border-[#E5E7EB] px-[14px] py-[9px]",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-[13px] font-bold text-[#11141A]",
				children: title
			}), description && /* @__PURE__ */ jsx("p", {
				className: "mt-[1px] text-[11px] text-[#6B7280]",
				children: description
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-[9px] p-[12px]",
			children
		})]
	});
}
function MoneyInput({ placeholder, className, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		children: [/* @__PURE__ */ jsx("span", {
			className: "pointer-events-none absolute inset-y-0 left-3 flex items-center text-[12px] text-[#6B7280]",
			children: "₹"
		}), /* @__PURE__ */ jsx("input", {
			type: "text",
			inputMode: "decimal",
			placeholder: placeholder ?? "0",
			className: cn("h-10 w-full rounded-[9px] border border-[#C9CDD6] bg-white pl-7 pr-3 text-[12.5px] text-[#11141A] outline-none placeholder:text-[#9CA3AF] focus:border-[#4F5DF5]", className),
			...props
		})]
	});
}
function StatusSelect({ value, onChange, options, placeholder }) {
	return /* @__PURE__ */ jsxs(Select, {
		value: value ?? "",
		onValueChange: (v) => v && onChange(v),
		children: [/* @__PURE__ */ jsx(SelectTrigger, {
			className: "h-8 w-full rounded-[8px] border-[#C9CDD6] text-[12px]",
			children: /* @__PURE__ */ jsx(SelectValue, {
				placeholder,
				children: value ? /* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", DOT_COLORS[value] ?? "bg-[#8A8F98]") }), value]
				}) : /* @__PURE__ */ jsx("span", {
					className: "text-[#9CA3AF]",
					children: placeholder
				})
			})
		}), /* @__PURE__ */ jsx(SelectContent, { children: options.map((s) => /* @__PURE__ */ jsx(SelectItem, {
			value: s,
			children: /* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", DOT_COLORS[s] ?? "bg-[#8A8F98]") }), s]
			})
		}, s)) })]
	});
}
function WebsiteForm(props) {
	const isEdit = (props.mode ?? "create") === "edit";
	const website = props.mode === "edit" ? props.website : void 0;
	const initialClientId = props.mode !== "edit" ? props.initialClientId : void 0;
	const formId = props.formId ?? (isEdit ? "edit-website-form" : "new-website-form");
	const clientsQuery = useClientOptions(void 0);
	const createMutation = useCreateWebsite();
	const updateMutation = useUpdateWebsite(website ? String(website.id) : "");
	const mutation = isEdit ? updateMutation : createMutation;
	const form = useForm({
		resolver: zodResolver(websiteFormSchema),
		defaultValues: getDefaultValues(website, initialClientId)
	});
	useEffect(() => {
		if (website) form.reset(getDefaultValues(website));
	}, [website]);
	const clients = clientsQuery.data?.items ?? [];
	const buildType = form.watch("buildType");
	const hostingProvider = form.watch("hostingProvider");
	const domainHandledBy = form.watch("domainHandledBy");
	useEffect(() => {
		form.setValue("siteType", deriveSiteType(buildType));
	}, [buildType]);
	useEffect(() => {
		form.setValue("platform", derivePlatform(hostingProvider));
	}, [hostingProvider]);
	const clientOptions = useMemo(() => {
		if (!website || !form.watch("clientId") || clients.some((c) => String(c.id) === form.watch("clientId"))) return clients;
		return [{
			id: website.client_row_id ?? 0,
			client_id: website.client_id,
			name: website.client_name ?? ""
		}, ...clients];
	}, [
		clients,
		website,
		form.watch("clientId")
	]);
	const submit = form.handleSubmit((values) => {
		if (isEdit) updateMutation.mutate(toUpdatePayload(values), { onSuccess: (w) => props.onUpdated(w) });
		else createMutation.mutate(toCreatePayload(values), { onSuccess: (w) => props.onCreated(w) });
	});
	const e = form.formState.errors;
	return /* @__PURE__ */ jsxs("form", {
		id: formId,
		onSubmit: submit,
		className: "flex w-full flex-1 flex-col gap-[12px]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 gap-[12px] xl:grid-cols-2",
				children: [/* @__PURE__ */ jsxs(FormCard, {
					title: "Website Details",
					description: "Main website and type information",
					children: [
						/* @__PURE__ */ jsx(Field$1, {
							label: "Client",
							required: true,
							error: e.clientId?.message,
							children: /* @__PURE__ */ jsxs(Select, {
								value: form.watch("clientId") || "",
								onValueChange: (v) => v && form.setValue("clientId", v, {
									shouldDirty: true,
									shouldValidate: true
								}),
								children: [/* @__PURE__ */ jsx(SelectTrigger, {
									className: "h-8 w-full rounded-[8px] border-[#C9CDD6] text-[12px]",
									children: /* @__PURE__ */ jsx(SelectValue, {
										placeholder: clientsQuery.isLoading ? "Loading..." : "Select client",
										children: clientOptions.find((c) => String(c.id) === form.watch("clientId"))?.name ?? null
									})
								}), /* @__PURE__ */ jsx(SelectContent, { children: clientOptions.map((c) => /* @__PURE__ */ jsx(SelectItem, {
									value: String(c.id),
									children: c.name
								}, String(c.id))) })]
							})
						}),
						/* @__PURE__ */ jsx(Field$1, {
							label: "Project Name",
							required: true,
							error: e.projectName?.message,
							children: /* @__PURE__ */ jsx(Input, {
								placeholder: "e.g. Quill Books",
								className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
								...form.register("projectName")
							})
						}),
						/* @__PURE__ */ jsx(Field$1, {
							label: "Website URL",
							error: e.url?.message,
							className: "col-span-2",
							hint: "Can be added later — required before marking the site Live",
							children: /* @__PURE__ */ jsx(Input, {
								placeholder: "https://example.com",
								className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
								...form.register("url")
							})
						}),
						/* @__PURE__ */ jsx(Field$1, {
							label: "Build Type",
							error: e.buildType?.message,
							children: /* @__PURE__ */ jsx(ServiceOptionSelect, {
								category: "build_type",
								value: form.watch("buildType") ?? "",
								onChange: (v) => form.setValue("buildType", v, { shouldDirty: true }),
								placeholder: "Select build type"
							})
						}),
						/* @__PURE__ */ jsx(Field$1, {
							label: "Hosting Provider",
							error: e.hostingProvider?.message,
							children: /* @__PURE__ */ jsx(ServiceOptionSelect, {
								category: "hosting_provider",
								value: form.watch("hostingProvider") ?? "",
								onChange: (v) => form.setValue("hostingProvider", v, { shouldDirty: true }),
								placeholder: "Select provider"
							})
						}),
						/* @__PURE__ */ jsx(Field$1, {
							label: "Build Cost",
							required: true,
							error: e.buildCost?.message,
							children: /* @__PURE__ */ jsx(MoneyInput, {
								placeholder: "25000",
								...form.register("buildCost")
							})
						}),
						isEdit && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Field$1, {
							label: "Website Status",
							error: e.websiteStatus?.message,
							children: /* @__PURE__ */ jsx(StatusSelect, {
								value: form.watch("websiteStatus"),
								onChange: (v) => form.setValue("websiteStatus", v, { shouldDirty: true }),
								options: WEBSITE_STATUSES,
								placeholder: "Select status"
							})
						}), /* @__PURE__ */ jsx(Field$1, {
							label: "Maintenance Status",
							error: e.maintenanceStatus?.message,
							children: /* @__PURE__ */ jsx(StatusSelect, {
								value: form.watch("maintenanceStatus"),
								onChange: (v) => form.setValue("maintenanceStatus", v, { shouldDirty: true }),
								options: MAINTENANCE_STATUSES,
								placeholder: "Select status"
							})
						})] })
					]
				}), /* @__PURE__ */ jsxs(FormCard, {
					title: "Dates",
					description: "Hosted Date anchors all future billing due dates",
					children: [
						/* @__PURE__ */ jsx(Field$1, {
							label: "Start Date",
							error: e.startDate?.message,
							hint: "When work on the build began",
							children: /* @__PURE__ */ jsx(Input, {
								type: "date",
								className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
								...form.register("startDate")
							})
						}),
						/* @__PURE__ */ jsx(Field$1, {
							label: "Completed Date",
							error: e.completedDate?.message,
							hint: "When the build was finished",
							children: /* @__PURE__ */ jsx(Input, {
								type: "date",
								className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
								...form.register("completedDate")
							})
						}),
						/* @__PURE__ */ jsx(Field$1, {
							label: "Hosted Date",
							required: false,
							error: e.hostedDate?.message,
							className: "col-span-2",
							hint: "Anchors every future invoice due date — monthly bills fall on this day each month, yearly on this date each year",
							children: /* @__PURE__ */ jsx(Input, {
								type: "date",
								className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
								...form.register("hostedDate")
							})
						}),
						isEdit && /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx(Field$1, {
								label: "Renewal Date",
								error: e.renewalDate?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("renewalDate")
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Last Invoice Sent",
								error: e.lastInvoiceSent?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("lastInvoiceSent")
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Last Payment Date",
								error: e.lastPaymentReceived?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("lastPaymentReceived")
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Last Payment Amount",
								error: e.lastPaymentAmount?.message,
								children: /* @__PURE__ */ jsx(MoneyInput, {
									placeholder: "0",
									...form.register("lastPaymentAmount")
								})
							})
						] })
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 gap-[12px] xl:grid-cols-2",
				children: [
					/* @__PURE__ */ jsxs(FormCard, {
						title: "Domain Details",
						description: "Domain is optional at first, but ownership must be clear",
						children: [
							/* @__PURE__ */ jsx(Field$1, {
								label: "Domain Name",
								error: e.domainName?.message,
								children: /* @__PURE__ */ jsx(Input, {
									placeholder: "example.com",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("domainName")
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Domain Handled By",
								required: true,
								error: e.domainHandledBy?.message,
								children: /* @__PURE__ */ jsxs(Select, {
									value: form.watch("domainHandledBy") ?? "",
									onValueChange: (v) => form.setValue("domainHandledBy", v, { shouldDirty: true }),
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "h-8 w-full rounded-[8px] border-[#C9CDD6] text-[12px]",
										children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select..." })
									}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
										value: "our_side",
										children: "Our Side"
									}), /* @__PURE__ */ jsx(SelectItem, {
										value: "client_side",
										children: "Client Side"
									})] })]
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Domain Provider",
								error: e.domainProvider?.message,
								children: /* @__PURE__ */ jsx(ServiceOptionSelect, {
									category: "domain_provider",
									value: form.watch("domainProvider") ?? "",
									onChange: (v) => form.setValue("domainProvider", v, { shouldDirty: true }),
									placeholder: "Select provider",
									disabled: domainHandledBy === "client_side"
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Domain Cost / Year",
								error: e.domainCost?.message,
								className: "col-span-2",
								hint: "Deducted from annual profit only if handled by our side",
								children: /* @__PURE__ */ jsx(MoneyInput, {
									placeholder: "1200",
									...form.register("domainCost")
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Domain Renewal Date",
								error: e.domainRenewalDate?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("domainRenewalDate")
								})
							})
						]
					}),
					!isEdit && /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col overflow-hidden rounded-[14px] border border-[#D1D5DB] bg-white shadow-[0_1px_4px_rgba(17,20,26,.07)]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "border-b border-[#E5E7EB] px-[14px] py-[9px]",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "text-[13px] font-bold text-[#11141A]",
								children: "Remarks"
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-[1px] text-[11px] text-[#6B7280]",
								children: "Internal notes about this website"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-1 flex-col p-[12px]",
							children: /* @__PURE__ */ jsx("textarea", {
								rows: 5,
								className: "w-full flex-1 resize-none rounded-[8px] border border-[#C9CDD6] bg-transparent px-3 py-2 text-[12px] text-[#11141A] outline-none placeholder:text-[#9CA3AF] focus:border-[#4F5DF5]",
								placeholder: "Internal notes...",
								...form.register("remarks")
							})
						})]
					}),
					isEdit && /* @__PURE__ */ jsxs(FormCard, {
						title: "Maintenance Billing",
						description: "Drives the rolling billing records and renewal reminders",
						children: [
							/* @__PURE__ */ jsx(Field$1, {
								label: "Billing Cycle",
								required: true,
								error: e.billingCycle?.message,
								children: /* @__PURE__ */ jsxs(Select, {
									value: form.watch("billingCycle") ?? "",
									onValueChange: (v) => form.setValue("billingCycle", v, { shouldDirty: true }),
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "h-8 w-full rounded-[8px] border-[#C9CDD6] text-[12px]",
										children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select cycle" })
									}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
										value: "monthly",
										children: "Monthly"
									}), /* @__PURE__ */ jsx(SelectItem, {
										value: "yearly",
										children: "Yearly"
									})] })]
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Maintenance Amount",
								required: true,
								error: e.maintenanceAmount?.message,
								children: /* @__PURE__ */ jsx(MoneyInput, {
									placeholder: "5000",
									...form.register("maintenanceAmount")
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Hosting Cost / Year",
								required: true,
								error: e.hostingCost?.message,
								className: "col-span-2",
								hint: "Always our side — always deducted from annual profit",
								children: /* @__PURE__ */ jsx(MoneyInput, {
									placeholder: "3000",
									...form.register("hostingCost")
								})
							}),
							/* @__PURE__ */ jsx(Field$1, {
								label: "Hosting Renewal Date",
								error: e.hostingRenewalDate?.message,
								className: "col-span-2",
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("hostingRenewalDate")
								})
							})
						]
					})
				]
			}),
			isEdit && /* @__PURE__ */ jsxs("div", {
				className: "overflow-hidden rounded-[14px] border border-[#D1D5DB] bg-white shadow-[0_1px_4px_rgba(17,20,26,.07)]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "border-b border-[#E5E7EB] px-[14px] py-[9px]",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-[13px] font-bold text-[#11141A]",
						children: "Remarks"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-[1px] text-[11px] text-[#6B7280]",
						children: "Internal notes about this website"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "p-[12px]",
					children: /* @__PURE__ */ jsx("textarea", {
						rows: 3,
						className: "w-full resize-y rounded-[8px] border border-[#C9CDD6] bg-transparent px-3 py-2 text-[12px] text-[#11141A] outline-none placeholder:text-[#9CA3AF] focus:border-[#4F5DF5]",
						placeholder: "Internal notes...",
						...form.register("remarks")
					})
				})]
			}),
			mutation.isError && /* @__PURE__ */ jsx("p", {
				className: "text-[12.5px] font-semibold text-[#DC2626]",
				children: mutation.error.message
			}),
			isEdit && /* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex shrink-0 items-center justify-between gap-3 pb-4",
				children: [props.onDelete ? /* @__PURE__ */ jsxs("button", {
					type: "button",
					disabled: props.isDeleting,
					onClick: props.onDelete,
					className: "inline-flex items-center gap-2 rounded-[9px] border border-[#FECACA] px-4 py-2 text-[12.5px] font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2] disabled:opacity-50",
					children: [/* @__PURE__ */ jsx(Trash2, { className: "size-4" }), props.isDeleting ? "Deleting..." : "Delete Website"]
				}) : /* @__PURE__ */ jsx("div", {}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [props.onCancel && /* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "outline",
						className: "h-9 min-w-24 rounded-[9px] border-[#E5E7EB] text-[12.5px]",
						onClick: props.onCancel,
						children: "Cancel"
					}), /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: mutation.isPending || clientsQuery.isLoading,
						className: "h-9 min-w-36 gap-2 rounded-[9px] bg-[#4F5DF5] text-[12.5px] font-semibold text-white hover:bg-[#3F4DE0]",
						children: [/* @__PURE__ */ jsx(Save, { className: "size-4" }), mutation.isPending ? "Saving..." : "Save Changes"]
					})]
				})]
			})
		]
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
	const navigate = useNavigate();
	const handleDeleteConfirm = () => {
		deleteMutation.mutate(void 0, { onSuccess: () => {
			setShowDeleteDialog(false);
			onClose();
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
//#region src/components/websites/record-payment-dialog.tsx
var schema$2 = z.object({
	amount: z.string().trim().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),
	paymentDate: z.string().trim().min(1, "Date is required"),
	paymentMode: z.string().trim().min(1, "Payment mode is required"),
	transactionRef: z.string().optional(),
	remarks: z.string().optional()
});
function RecordPaymentDialog({ websiteId, projectName, hostedDate, maintenanceAmount, open, onOpenChange, onSuccess }) {
	const [phase, setPhase] = useState("form");
	const [invoiceFile, setInvoiceFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [selectedPeriodKey, setSelectedPeriodKey] = useState("");
	const fileInputRef = useRef(null);
	const backdropRef = useRef(null);
	const { periods, isLoading: periodsLoading } = useUnpaidBillingPeriods(websiteId, hostedDate);
	const selectedPeriod = periods.find((p) => p.period_key === selectedPeriodKey);
	const selectedBillingId = selectedPeriod?.billing?.billing_id ?? null;
	const existingInvoiceUrl = selectedPeriod?.billing?.invoice_file_url ?? null;
	const existingInvoiceName = selectedPeriod?.billing?.invoice_file_name ?? null;
	const openPreview = (file) => {
		const url = URL.createObjectURL(file);
		if (file.type.startsWith("image/")) setPreviewUrl(url);
		else {
			window.open(url, "_blank");
			setTimeout(() => URL.revokeObjectURL(url), 1e4);
		}
	};
	const closePreview = () => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}
	};
	const mutation = useRecordPayment(websiteId);
	const paymentModesQuery = useServiceOptions("payment_mode");
	const paymentModes = (paymentModesQuery.data ?? []).filter((o) => o.is_active);
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
	const form = useForm({
		resolver: zodResolver(schema$2),
		defaultValues: {
			amount: maintenanceAmount ?? "",
			paymentDate: today,
			paymentMode: "",
			transactionRef: "",
			remarks: ""
		}
	});
	useEffect(() => {
		if (periods.length > 0 && !selectedPeriodKey) setSelectedPeriodKey(periods[0].period_key);
	}, [periods, selectedPeriodKey]);
	useEffect(() => {
		if (open) {
			setPhase("form");
			setInvoiceFile(null);
			setSelectedPeriodKey("");
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
		if (!selectedBillingId) {
			form.setError("root", { message: "Please select a billing period." });
			return;
		}
		setPhase("saving");
		mutation.mutate({
			websiteId,
			billingId: selectedBillingId,
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
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
									/* @__PURE__ */ jsxs("label", {
										className: "text-[11.5px] font-semibold text-[#5C6270]",
										children: ["Billing Period ", /* @__PURE__ */ jsx("span", {
											className: "text-[#DC2626]",
											children: "*"
										})]
									}),
									periodsLoading ? /* @__PURE__ */ jsx("div", {
										className: cn(fieldCls(), "flex items-center bg-[#FAFBFC] text-[#9CA3AF]"),
										children: "Loading periods…"
									}) : periods.length === 0 ? /* @__PURE__ */ jsx("div", {
										className: cn(fieldCls(), "flex items-center bg-[#FAFBFC] text-[#059669]"),
										children: "All periods paid"
									}) : /* @__PURE__ */ jsxs("select", {
										value: selectedPeriodKey,
										onChange: (e) => setSelectedPeriodKey(e.target.value),
										className: cn(fieldCls(!selectedPeriodKey && periods.length > 0)),
										children: [/* @__PURE__ */ jsx("option", {
											value: "",
											children: "Select period"
										}), periods.map((p) => /* @__PURE__ */ jsxs("option", {
											value: p.period_key,
											children: [p.period_label, p.billing?.status === "overdue" ? " (Overdue)" : ""]
										}, p.period_key))]
									}),
									periods.length === 0 && !periodsLoading && /* @__PURE__ */ jsx("p", {
										className: "text-[10.5px] font-semibold text-[#059669]",
										children: "All periods are already paid"
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
									paymentModesQuery.isLoading ? /* @__PURE__ */ jsx("div", {
										className: cn(fieldCls(), "flex items-center bg-[#FAFBFC] text-[#9CA3AF]"),
										children: "Loading modes…"
									}) : paymentModes.length > 0 ? /* @__PURE__ */ jsxs("select", {
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
									onChange: (e) => {
										const f = e.target.files?.[0] ?? null;
										if (f && f.size > 5 * 1024 * 1024) {
											alert("File is too large. Maximum size is 5 MB.");
											e.target.value = "";
											return;
										}
										setInvoiceFile(f);
										if (e.target) e.target.value = "";
									}
								}),
								invoiceFile ? /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 rounded-[9px] border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3",
									children: [
										/* @__PURE__ */ jsx(Paperclip, { className: "size-4 shrink-0 text-[#059669]" }),
										/* @__PURE__ */ jsx("span", {
											className: "flex-1 truncate text-[12.5px] font-semibold text-[#059669]",
											children: invoiceFile.name
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => openPreview(invoiceFile),
											className: "flex items-center gap-1 text-[11px] font-semibold text-[#059669] hover:text-[#047857]",
											children: [/* @__PURE__ */ jsx(Eye, { className: "size-3.5" }), /* @__PURE__ */ jsx("span", { children: "Preview" })]
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
								}) : existingInvoiceName ? /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 rounded-[9px] border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-3",
									children: [
										/* @__PURE__ */ jsx(Paperclip, { className: "size-4 shrink-0 text-[#3B82F6]" }),
										existingInvoiceUrl ? /* @__PURE__ */ jsx("a", {
											href: existingInvoiceUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex-1 truncate text-[12.5px] font-semibold text-[#3B82F6] underline underline-offset-2",
											children: existingInvoiceName
										}) : /* @__PURE__ */ jsx("span", {
											className: "flex-1 truncate text-[12.5px] font-semibold text-[#3B82F6]",
											children: existingInvoiceName
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => fileInputRef.current?.click(),
											className: "shrink-0 text-[11px] font-semibold text-[#6B7280] underline hover:text-[#374151]",
											children: "Replace"
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
								rows: 2,
								placeholder: "Payment notes...",
								className: "w-full resize-none rounded-[9px] border border-[#E5E7EB] px-3 py-2.5 text-[12.5px] outline-none focus:border-[#4F5DF5]"
							})]
						}),
						(mutation.isError || form.formState.errors.root) && /* @__PURE__ */ jsx("p", {
							className: "text-[12px] font-semibold text-[#DC2626]",
							children: form.formState.errors.root?.message ?? (mutation.error instanceof Error ? mutation.error.message : "Something went wrong.")
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
								disabled: periods.length === 0 && !periodsLoading,
								className: "h-10 rounded-[9px] bg-[#059669] px-5 text-[12.5px] font-semibold text-white transition hover:bg-[#047857] disabled:opacity-50",
								children: "Mark as Paid"
							})]
						})
					]
				})] })
			]
		})
	}), previewUrl && /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[3px]",
		onClick: closePreview,
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative max-h-[90vh] max-w-[90vw]",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: closePreview,
				className: "absolute -right-3 -top-3 flex size-7 items-center justify-center rounded-full bg-white text-[#374151] shadow-md hover:bg-[#F4F5F7]",
				children: /* @__PURE__ */ jsx(X, { className: "size-4" })
			}), /* @__PURE__ */ jsx("img", {
				src: previewUrl,
				alt: "Invoice preview",
				className: "max-h-[85vh] max-w-[85vw] rounded-[10px] object-contain shadow-2xl"
			})]
		})
	})] });
}
//#endregion
//#region src/components/websites/add-request-dialog.tsx
var schema$1 = z.object({
	type: z.enum(["bug", "feature"]),
	status: z.enum([
		"open",
		"in_progress",
		"completed",
		"wont_fix"
	]),
	title: z.string().trim().min(1, "Title is required").max(200, "Too long"),
	requestedDate: z.string().trim().min(1, "Requested date is required"),
	deliveredDate: z.string().optional(),
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
function AddRequestDialog({ websiteId, open, onOpenChange }) {
	const mutation = useCreateRequest(websiteId);
	const [backdropEl, setBackdropEl] = useState(null);
	const [invoiceFile, setInvoiceFile] = useState(null);
	const fileInputRef = useRef(null);
	const form = useForm({
		resolver: zodResolver(schema$1),
		defaultValues: {
			type: "bug",
			status: "open",
			title: "",
			requestedDate: "",
			deliveredDate: "",
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
			deliveredDate: values.deliveredDate || null,
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
			className: "relative flex w-full max-w-[520px] max-h-[90vh] flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]",
			children: [
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: handleClose,
					className: "absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]",
					children: /* @__PURE__ */ jsx(X, { className: "size-4" })
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-b border-[#E5E7EB] px-5 py-3",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[14.5px] font-bold text-[#11141A]",
						children: "Add Bug / Feature Request"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-[11.5px] text-[#8A8F98]",
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
								label: "Request Type",
								required: true,
								children: /* @__PURE__ */ jsxs("select", {
									...form.register("type"),
									className: sel(),
									children: [/* @__PURE__ */ jsx("option", {
										value: "bug",
										children: "Bug"
									}), /* @__PURE__ */ jsx("option", {
										value: "feature",
										children: "Feature"
									})]
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Status",
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
							})]
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Title",
							required: true,
							error: form.formState.errors.title?.message,
							children: /* @__PURE__ */ jsx("input", {
								...form.register("title"),
								placeholder: "Brief summary of the request…",
								className: sel(!!form.formState.errors.title)
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Requested Date",
								required: true,
								error: form.formState.errors.requestedDate?.message,
								children: /* @__PURE__ */ jsx("input", {
									type: "date",
									...form.register("requestedDate"),
									onClick: (e) => e.currentTarget.showPicker?.(),
									className: sel(!!form.formState.errors.requestedDate)
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
							label: "Feature Cost",
							required: isFeature,
							error: form.formState.errors.cost?.message,
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
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Details",
							error: form.formState.errors.description?.message,
							children: /* @__PURE__ */ jsx("textarea", {
								...form.register("description"),
								rows: 2,
								placeholder: "Client requested contact form redesign…",
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
								ref: fileInputRef,
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
											if (fileInputRef.current) fileInputRef.current.value = "";
										},
										className: "text-[#059669] hover:text-[#178a50]",
										children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
									})
								]
							}) : /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => fileInputRef.current?.click(),
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
//#region src/components/websites/renew-domain-dialog.tsx
var schema = z.object({
	newRenewalDate: z.string().min(1, "Renewal date is required"),
	domainCost: z.string().optional(),
	verifiedOn: z.string().min(1, "Verified date is required"),
	notes: z.string().optional()
});
function addOneYear(dateStr) {
	const d = new Date(dateStr);
	d.setFullYear(d.getFullYear() + 1);
	return d.toISOString().split("T")[0];
}
function todayStr() {
	return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function dayDiff(dateStr) {
	const now = /* @__PURE__ */ new Date();
	now.setHours(0, 0, 0, 0);
	const due = new Date(dateStr);
	due.setHours(0, 0, 0, 0);
	return Math.round((due.getTime() - now.getTime()) / (1440 * 60 * 1e3));
}
function RenewDomainDialog({ website, open, onOpenChange, onSuccess }) {
	const [phase, setPhase] = useState("form");
	const [renewedBy, setRenewedBy] = useState("we");
	const backdropRef = useRef(null);
	const renewMutation = useRenewDomain(String(website.id));
	const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
	useEffect(() => {
		if (!open) return;
		setPhase("form");
		setRenewedBy(website.domain_handled_by === "client_side" ? "client" : "we");
		reset({
			newRenewalDate: website.domain_renewal_date ? addOneYear(website.domain_renewal_date) : todayStr(),
			domainCost: website.domain_cost ?? "",
			verifiedOn: todayStr(),
			notes: ""
		});
	}, [
		open,
		website,
		reset
	]);
	function onSubmit(values) {
		setPhase("saving");
		renewMutation.mutate({
			domainRenewalDate: values.newRenewalDate,
			domainCost: values.domainCost || null,
			domainLastVerified: values.verifiedOn,
			domainHandledBy: renewedBy === "we" ? "our_side" : "client_side",
			domainRemarks: values.notes || void 0
		}, {
			onSuccess: () => {
				setPhase("form");
				onSuccess?.();
				onOpenChange(false);
			},
			onError: () => setPhase("form")
		});
	}
	if (!open) return null;
	const diff = website.domain_renewal_date ? dayDiff(website.domain_renewal_date) : null;
	const overdueLine = diff !== null && diff < 0 ? ` · overdue ${Math.abs(diff)} days` : diff !== null && diff >= 0 && diff <= 30 ? ` · due in ${diff} days` : "";
	const fieldCls = (hasErr) => cn("w-full rounded-[8px] border px-3 py-2 text-[13px] text-[#11141A] outline-none transition", "focus:border-[#4F5DF5] focus:ring-2 focus:ring-[#4F5DF5]/10 placeholder:text-[#C7CAD1]", hasErr ? "border-[#EF4444]" : "border-[#E5E7EB]");
	return /* @__PURE__ */ jsx("div", {
		ref: backdropRef,
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
		onClick: (e) => {
			if (e.target === backdropRef.current) onOpenChange(false);
		},
		children: /* @__PURE__ */ jsx("div", {
			className: "w-full max-w-[460px] rounded-[14px] bg-white shadow-[0_20px_60px_rgba(17,20,26,.2)]",
			onClick: (e) => e.stopPropagation(),
			children: /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit(onSubmit),
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "border-b border-[#EEF0F2] px-5 py-4",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-semibold text-[#11141A]",
								children: "Renew Domain"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-0.5 text-[12.5px] text-[#8A8F98]",
								children: [website.project_name, website.domain_name ? ` · ${website.domain_name}` : ""]
							}),
							website.domain_renewal_date && /* @__PURE__ */ jsxs("div", {
								className: "mt-1 text-[12px] text-[#8A8F98]",
								children: [
									"Current renewal date:",
									" ",
									/* @__PURE__ */ jsxs("span", {
										className: cn("font-medium", diff !== null && diff < 0 ? "text-[#DC2626]" : "text-[#3D4250]"),
										children: [formatDate(website.domain_renewal_date), overdueLine]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "px-5 pt-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "inline-flex rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-0.5",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								className: cn("rounded-[6px] px-4 py-1.5 text-[12.5px] font-medium transition", renewedBy === "we" ? "bg-white text-[#11141A] shadow-sm" : "text-[#8A8F98] hover:text-[#3D4250]"),
								onClick: () => setRenewedBy("we"),
								children: "We renewed it"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								className: cn("rounded-[6px] px-4 py-1.5 text-[12.5px] font-medium transition", renewedBy === "client" ? "bg-white text-[#11141A] shadow-sm" : "text-[#8A8F98] hover:text-[#3D4250]"),
								onClick: () => setRenewedBy("client"),
								children: "Client renewed it"
							})]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-x-4 gap-y-4 px-5 pt-4 pb-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "mb-1 block text-[12px] font-medium text-[#5C6270]",
									children: ["New Renewal Date ", /* @__PURE__ */ jsx("span", {
										className: "text-[#DC2626]",
										children: "*"
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "date",
									...register("newRenewalDate"),
									className: fieldCls(!!errors.newRenewalDate)
								}),
								errors.newRenewalDate ? /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[11px] text-[#DC2626]",
									children: errors.newRenewalDate.message
								}) : /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[10.5px] text-[#8A8F98]",
									children: "Auto-filled: current date + 1 year"
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "mb-1 block text-[12px] font-medium text-[#5C6270]",
									children: ["Verified On ", /* @__PURE__ */ jsx("span", {
										className: "text-[#DC2626]",
										children: "*"
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "date",
									...register("verifiedOn"),
									className: fieldCls(!!errors.verifiedOn)
								}),
								errors.verifiedOn ? /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[11px] text-[#DC2626]",
									children: errors.verifiedOn.message
								}) : /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[10.5px] text-[#8A8F98]",
									children: "Date you confirmed renewal"
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "col-span-2",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-[12px] font-medium text-[#5C6270]",
										children: "Domain Cost / Year (Rs)"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										...register("domainCost"),
										placeholder: "e.g. 1200",
										className: fieldCls()
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[10.5px] text-[#8A8F98]",
										children: "Pre-filled from current value - edit if changed"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "mb-1 block text-[12px] font-medium text-[#5C6270]",
									children: ["Notes ", /* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-normal text-[#8A8F98]",
										children: "(optional)"
									})]
								}), /* @__PURE__ */ jsx("input", {
									type: "text",
									...register("notes"),
									placeholder: "e.g. \"auto-renewed via GoDaddy\"",
									className: fieldCls()
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-2 border-t border-[#EEF0F2] px-5 py-3.5",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => onOpenChange(false),
							className: "rounded-[8px] border border-[#E5E7EB] px-4 py-2 text-[13px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7]",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							type: "submit",
							disabled: phase === "saving",
							className: "flex items-center gap-1.5 rounded-[8px] bg-[#4F5DF5] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#3D4DE3] disabled:opacity-60",
							children: [phase === "saving" ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCw, { className: "size-3.5" }), "Save Renewal"]
						})]
					})
				]
			})
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
		color: "#10B981"
	},
	Active: {
		bg: "bg-[#ECFDF5]",
		border: "border-[#A7F3D0]",
		text: "text-[#059669]",
		color: "#10B981"
	},
	Overdue: {
		bg: "bg-[#FEF2F2]",
		border: "border-[#FECACA]",
		text: "text-[#DC2626]",
		color: "#EF4444"
	},
	"Maintenance Overdue": {
		bg: "bg-[#FEF2F2]",
		border: "border-[#FECACA]",
		text: "text-[#DC2626]",
		color: "#EF4444"
	},
	"In Progress": {
		bg: "bg-[#FEF3C7]",
		border: "border-[#FDE68A]",
		text: "text-[#D97706]",
		color: "#F59E0B"
	},
	"Due Soon": {
		bg: "bg-[#FEF3C7]",
		border: "border-[#FDE68A]",
		text: "text-[#D97706]",
		color: "#F59E0B"
	},
	Completed: {
		bg: "bg-[#EFF6FF]",
		border: "border-[#BFDBFE]",
		text: "text-[#3B82F6]",
		color: "#3B82F6"
	},
	"Transfer Pending": {
		bg: "bg-[#F3E8FF]",
		border: "border-[#DDD6FE]",
		text: "text-[#8B5CF6]",
		color: "#8B5CF6"
	},
	"On Hold": {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		color: "#9CA3AF"
	},
	Paused: {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		color: "#9CA3AF"
	},
	Discontinued: {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		color: "#9CA3AF"
	},
	"Not Started": {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		color: "#9CA3AF"
	},
	Cancelled: {
		bg: "bg-[#F3F4F6]",
		border: "border-[#E5E7EB]",
		text: "text-[#6B7280]",
		color: "#9CA3AF"
	},
	Expired: {
		bg: "bg-[#FEF2F2]",
		border: "border-[#FECACA]",
		text: "text-[#DC2626]",
		color: "#EF4444"
	}
};
var DEFAULT_CFG = {
	bg: "bg-[#F3F4F6]",
	border: "border-[#E5E7EB]",
	text: "text-[#6B7280]",
	color: "#9CA3AF"
};
function CurveIcon({ color }) {
	return /* @__PURE__ */ jsx("svg", {
		width: "9",
		height: "7",
		viewBox: "0 0 9 7",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className: "shrink-0",
		children: /* @__PURE__ */ jsx("path", {
			d: "M1 6 Q4.5 0.5 8 6",
			stroke: color,
			strokeWidth: "1.7",
			strokeLinecap: "round",
			fill: "none"
		})
	});
}
function StatusPill({ label }) {
	const cfg = STATUS_CFG[label] ?? DEFAULT_CFG;
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex w-fit items-center gap-1.5 rounded-full border px-[10px] py-[3px] text-[11.5px] font-medium tracking-[.01em] whitespace-nowrap", cfg.bg, cfg.border, cfg.text),
		children: [/* @__PURE__ */ jsx(CurveIcon, { color: cfg.color }), label]
	});
}
function MaintenanceBadge({ label }) {
	const cfg = STATUS_CFG[label] ?? DEFAULT_CFG;
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex w-fit items-center gap-1.5 rounded-full border px-[10px] py-[3px] text-[11.5px] font-medium tracking-[.01em] whitespace-nowrap", cfg.bg, cfg.border, cfg.text),
		children: [/* @__PURE__ */ jsx(CurveIcon, { color: cfg.color }), label]
	});
}
//#endregion
export { RecordPaymentDialog as a, useRequests as c, AddRequestDialog as i, useUpdateRequest as l, StatusPill as n, WebsiteEditDialog as o, RenewDomainDialog as r, useAttachInvoice as s, MaintenanceBadge as t };
