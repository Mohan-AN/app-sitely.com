import { t as DATA_STALE_TIME } from "./query-client-DjZXlTZ-.js";
import { n as cn, o as apiFetch, t as Button } from "./button-FgxVcNwj.js";
import { t as Input } from "./input-DJQsF0Xj.js";
import { i as listClientOptions } from "./clients-api-BxQDtEPj.js";
import { t as QUERY_KEYS } from "./queryKeys-Cf7KC0QD.js";
import { useEffect, useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, CheckIcon, ChevronDownIcon, ChevronUpIcon, CirclePlus, Globe, Save, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select } from "@base-ui/react/select";
//#region src/components/ui/select.tsx
var Select$1 = Select.Root;
function SelectValue({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.Value, {
		"data-slot": "select-value",
		className: cn("flex flex-1 text-left", className),
		...props
	});
}
function SelectTrigger({ className, size = "default", children, ...props }) {
	return /* @__PURE__ */ jsxs(Select.Trigger, {
		"data-slot": "select-trigger",
		"data-size": size,
		className: cn("flex w-fit items-center justify-between gap-2 rounded-lg border border-[#dce3ef] bg-white py-2 pr-3 pl-3.5 text-sm font-semibold text-[#172554] whitespace-nowrap shadow-sm transition-colors outline-none select-none focus-visible:border-[#4f2df5] focus-visible:ring-3 focus-visible:ring-[#4f2df5]/15 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-[#7f8aa3] data-[size=default]:h-11 data-[size=sm]:h-9 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:border-[#25304a] dark:bg-[#111827] dark:text-[#edf2ff] dark:hover:bg-[#172033] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(Select.Icon, { render: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "pointer-events-none size-4 text-muted-foreground" }) })]
	});
}
function SelectContent({ className, children, side = "bottom", sideOffset = 4, align = "center", alignOffset = 0, alignItemWithTrigger = true, ...props }) {
	return /* @__PURE__ */ jsx(Select.Portal, { children: /* @__PURE__ */ jsx(Select.Positioner, {
		side,
		sideOffset,
		align,
		alignOffset,
		alignItemWithTrigger,
		className: "isolate z-50",
		children: /* @__PURE__ */ jsxs(Select.Popup, {
			"data-slot": "select-content",
			"data-align-trigger": alignItemWithTrigger,
			className: cn("relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
			...props,
			children: [
				/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
				/* @__PURE__ */ jsx(Select.List, { children }),
				/* @__PURE__ */ jsx(SelectScrollDownButton, {})
			]
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ jsxs(Select.Item, {
		"data-slot": "select-item",
		className: cn("relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
		...props,
		children: [/* @__PURE__ */ jsx(Select.ItemText, {
			className: "flex flex-1 shrink-0 gap-2 whitespace-nowrap",
			children
		}), /* @__PURE__ */ jsx(Select.ItemIndicator, {
			render: /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center" }),
			children: /* @__PURE__ */ jsx(CheckIcon, { className: "pointer-events-none" })
		})]
	});
}
function SelectScrollUpButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.ScrollUpArrow, {
		"data-slot": "select-scroll-up-button",
		className: cn("top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronUpIcon, {})
	});
}
function SelectScrollDownButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.ScrollDownArrow, {
		"data-slot": "select-scroll-down-button",
		className: cn("bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronDownIcon, {})
	});
}
//#endregion
//#region src/lib/websites-api.ts
function listWebsites(filters, page, limit = 10) {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("limit", String(limit));
	for (const [key, value] of Object.entries(filters)) if (value !== void 0 && value !== "") params.set(key, String(value));
	return apiFetch(`/websites?${params.toString()}`);
}
function getWebsiteStats() {
	return apiFetch("/websites/stats");
}
function createWebsite(input) {
	return apiFetch("/websites", {
		method: "POST",
		body: JSON.stringify(input)
	});
}
function getWebsite(websiteId) {
	return apiFetch(`/websites/${websiteId}`);
}
function getWebsiteActivity(websiteId, page, limit = 20) {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("limit", String(limit));
	return apiFetch(`/websites/${websiteId}/activity?${params.toString()}`);
}
function updateWebsite(websiteId, input) {
	return apiFetch(`/websites/${websiteId}`, {
		method: "PUT",
		body: JSON.stringify(input)
	});
}
function deleteWebsite(websiteId) {
	return apiFetch(`/websites/${websiteId}`, { method: "DELETE" });
}
//#endregion
//#region src/hooks/use-websites.ts
function useWebsites(filters, page, limit = 10) {
	return useQuery({
		queryKey: [QUERY_KEYS.WEBSITES_LIST, {
			page,
			limit,
			...filters
		}],
		queryFn: () => listWebsites(filters, page, limit),
		placeholderData: (prev) => prev,
		staleTime: DATA_STALE_TIME
	});
}
function useWebsiteStats() {
	return useQuery({
		queryKey: [QUERY_KEYS.WEBSITES_STATS],
		queryFn: getWebsiteStats,
		staleTime: DATA_STALE_TIME
	});
}
function useClientOptions(search) {
	return useQuery({
		queryKey: [QUERY_KEYS.CLIENTS_OPTIONS, { search }],
		queryFn: () => listClientOptions(search),
		staleTime: DATA_STALE_TIME
	});
}
function useCreateWebsite() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => createWebsite(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			toast.success("Website created successfully.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to create website.")
	});
}
function useWebsite(websiteId) {
	return useQuery({
		queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId],
		queryFn: () => getWebsite(websiteId),
		staleTime: DATA_STALE_TIME
	});
}
function useWebsiteActivity(websiteId, page) {
	return useQuery({
		queryKey: [
			QUERY_KEYS.WEBSITE_ACTIVITY,
			websiteId,
			{ page }
		],
		queryFn: () => getWebsiteActivity(websiteId, page),
		staleTime: DATA_STALE_TIME
	});
}
function useDeleteWebsite(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => deleteWebsite(websiteId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] });
			toast.success("Website deleted.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to delete website.")
	});
}
function useUpdateWebsite(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => updateWebsite(websiteId, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_ACTIVITY, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			toast.success("Website updated successfully.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to update website.")
	});
}
//#endregion
//#region src/components/websites/website-form.tsx
var emptyToUndefined = (value) => {
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	return trimmed === "" ? void 0 : trimmed;
};
var optionalDate = z.preprocess(emptyToUndefined, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional());
var optionalUrl = z.preprocess(emptyToUndefined, z.string().url("Invalid url").optional());
var websiteFormSchema = z.object({
	clientId: z.string().min(1, "Client is required"),
	projectName: z.string().trim().min(1, "Project name is required").max(150, "Too long"),
	url: optionalUrl,
	siteType: z.enum(["static", "wordpress"], { message: "Required" }),
	platform: z.enum(["netlify", "wpx"], { message: "Required" }),
	websiteStatus: z.string().optional(),
	maintenanceStatus: z.string().optional(),
	startDate: optionalDate,
	hostedDate: optionalDate,
	lastInvoiceSent: optionalDate,
	lastPaymentReceived: optionalDate,
	renewalDate: optionalDate,
	handoverDate: optionalDate,
	transferCompleted: z.boolean(),
	remarks: z.string().optional()
});
var SITE_TYPES = [{
	value: "static",
	label: "Static"
}, {
	value: "wordpress",
	label: "WordPress"
}];
var PLATFORMS = [{
	value: "netlify",
	label: "Netlify"
}, {
	value: "wpx",
	label: "WPX"
}];
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
	"Expired",
	"Cancelled"
];
var DOT_COLORS = {
	"In Progress": "bg-amber-500",
	Live: "bg-emerald-500",
	"On Hold": "bg-gray-400",
	Completed: "bg-blue-500",
	Discontinued: "bg-gray-400",
	"Not Started": "bg-gray-400",
	Active: "bg-emerald-500",
	Paused: "bg-gray-400",
	Expired: "bg-red-500",
	Cancelled: "bg-gray-400"
};
function toCreatePayload(values) {
	return {
		clientId: values.clientId,
		projectName: values.projectName.trim(),
		url: values.url ?? null,
		siteType: values.siteType,
		platform: values.platform,
		startDate: values.startDate ?? null,
		hostedDate: values.hostedDate ?? null,
		lastInvoiceSent: values.lastInvoiceSent ?? null,
		lastPaymentReceived: values.lastPaymentReceived ?? null,
		renewalDate: values.renewalDate ?? null,
		handoverDate: values.handoverDate ?? null,
		remarks: values.remarks?.trim() || null
	};
}
function toUpdatePayload(values) {
	return {
		clientId: values.clientId,
		projectName: values.projectName.trim(),
		url: values.url ?? null,
		siteType: values.siteType,
		platform: values.platform,
		websiteStatus: values.websiteStatus,
		maintenanceStatus: values.maintenanceStatus,
		startDate: values.startDate ?? null,
		hostedDate: values.hostedDate ?? null,
		lastInvoiceSent: values.lastInvoiceSent ?? null,
		lastPaymentReceived: values.lastPaymentReceived ?? null,
		renewalDate: values.renewalDate ?? null,
		handoverDate: values.handoverDate ?? null,
		transferCompleted: values.transferCompleted,
		remarks: values.remarks?.trim() || null
	};
}
function toDateValue(raw) {
	if (!raw) return "";
	if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
	return raw.split("T")[0] ?? "";
}
function getDefaultValues(website, initialClientId = "") {
	const siteType = website?.siteType?.toLowerCase();
	const platform = website?.platform?.toLowerCase();
	return {
		clientId: website?.clientId ?? initialClientId,
		projectName: website?.projectName ?? "",
		url: website?.url ?? "",
		siteType: siteType ?? "static",
		platform: platform ?? "netlify",
		websiteStatus: website?.websiteStatus ?? "",
		maintenanceStatus: website?.maintenanceStatus ?? "",
		startDate: toDateValue(website?.startDate),
		hostedDate: toDateValue(website?.hostedDate),
		lastInvoiceSent: toDateValue(website?.lastInvoiceSent),
		lastPaymentReceived: toDateValue(website?.lastPaymentReceived),
		renewalDate: toDateValue(website?.renewalDate),
		handoverDate: toDateValue(website?.handoverDate),
		transferCompleted: website?.transferCompleted ?? false,
		remarks: website?.remarks ?? ""
	};
}
function SectionIcon({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f1edff] text-[#4f2df5] dark:bg-[#172033] dark:text-[#a78bfa]",
		children
	});
}
function SectionHeader({ icon, title, description }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-4 pb-4",
		children: [/* @__PURE__ */ jsx(SectionIcon, { children: icon }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
			className: "text-xl font-extrabold leading-tight text-[#0b1020] dark:text-[#edf2ff]",
			children: title
		}), /* @__PURE__ */ jsx("p", {
			className: "hidden",
			children: description
		})] })]
	});
}
function Field({ label, required, info, error, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-1.5",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "flex items-center gap-1 text-sm font-semibold text-[#172554] dark:text-[#edf2ff]",
				children: [
					label,
					required ? /* @__PURE__ */ jsx("span", {
						className: "text-red-500",
						children: "*"
					}) : null,
					info ? /* @__PURE__ */ jsx("span", {
						className: "ml-0.5 flex size-4 items-center justify-center rounded-full bg-[#eef2f7] text-[10px] font-bold text-[#253858] dark:bg-[#172033] dark:text-[#a6b2cf]",
						title: info,
						children: "ⓘ"
					}) : null
				]
			}),
			children,
			error ? /* @__PURE__ */ jsx("p", {
				className: "text-xs text-destructive",
				children: error
			}) : null
		]
	});
}
function StatusSelect({ value, onChange, options, placeholder }) {
	return /* @__PURE__ */ jsxs(Select$1, {
		value: value ?? "",
		onValueChange: (v) => v && onChange(v),
		children: [/* @__PURE__ */ jsx(SelectTrigger, {
			className: "w-full",
			children: /* @__PURE__ */ jsx(SelectValue, {
				placeholder,
				children: value ? /* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", DOT_COLORS[value] ?? "bg-gray-400") }), value]
				}) : /* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground",
					children: placeholder
				})
			})
		}), /* @__PURE__ */ jsx(SelectContent, { children: options.map((status) => /* @__PURE__ */ jsx(SelectItem, {
			value: status,
			children: /* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", DOT_COLORS[status] ?? "bg-gray-400") }), status]
			})
		}, status)) })]
	});
}
function WebsiteForm(props) {
	const isEdit = (props.mode ?? "create") === "edit";
	const website = props.mode === "edit" ? props.website : void 0;
	const initialClientId = props.mode !== "edit" ? props.initialClientId : void 0;
	const clientsQuery = useClientOptions(void 0);
	const createMutation = useCreateWebsite();
	const updateMutation = useUpdateWebsite(website ? website.websiteId : "");
	const mutation = isEdit ? updateMutation : createMutation;
	const form = useForm({
		resolver: zodResolver(websiteFormSchema),
		defaultValues: getDefaultValues(website, initialClientId)
	});
	useEffect(() => {
		if (website) form.reset(getDefaultValues(website));
	}, [website]);
	const clients = clientsQuery.data?.items ?? [];
	const selectedClient = form.watch("clientId");
	const clientOptions = useMemo(() => {
		if (!website || !selectedClient || clients.some((c) => c.clientId === selectedClient)) return clients;
		return [{
			clientId: website.clientId,
			name: website.clientName
		}, ...clients];
	}, [
		clients,
		website,
		selectedClient
	]);
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: form.handleSubmit((values) => {
			if (props.mode === "edit") updateMutation.mutate(toUpdatePayload(values), { onSuccess: props.onUpdated });
			else createMutation.mutate(toCreatePayload(values), { onSuccess: props.onCreated });
		}),
		className: "flex w-full flex-1 flex-col gap-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-[#dce3ef] bg-white p-7 shadow-sm dark:border-[#25304a] dark:bg-[#111827]",
				children: [
					/* @__PURE__ */ jsx(SectionHeader, {
						icon: /* @__PURE__ */ jsx(Globe, { className: "size-5" }),
						title: "Website Details",
						description: isEdit ? "Update the basic information about the website." : "Basic information about the website project."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Client",
								required: true,
								error: form.formState.errors.clientId?.message,
								children: /* @__PURE__ */ jsxs(Select$1, {
									value: form.watch("clientId") || "",
									onValueChange: (v) => v && form.setValue("clientId", v, {
										shouldDirty: true,
										shouldValidate: true
									}),
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "w-full",
										children: /* @__PURE__ */ jsx(SelectValue, { placeholder: clientsQuery.isLoading ? "Loading..." : "Select client" })
									}), /* @__PURE__ */ jsx(SelectContent, { children: clientOptions.map((client) => /* @__PURE__ */ jsx(SelectItem, {
										value: client.clientId,
										children: client.name
									}, client.clientId)) })]
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Project Name",
								required: true,
								error: form.formState.errors.projectName?.message,
								children: /* @__PURE__ */ jsx(Input, {
									placeholder: "Enter project name",
									...form.register("projectName")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Website URL",
								error: form.formState.errors.url?.message,
								children: /* @__PURE__ */ jsx(Input, {
									placeholder: "https://example.com",
									...form.register("url")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Site Type",
								required: true,
								error: form.formState.errors.siteType?.message,
								children: /* @__PURE__ */ jsxs(Select$1, {
									value: form.watch("siteType") || "",
									onValueChange: (v) => form.setValue("siteType", v, { shouldDirty: true }),
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "w-full",
										children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select type" })
									}), /* @__PURE__ */ jsx(SelectContent, { children: SITE_TYPES.map((t) => /* @__PURE__ */ jsx(SelectItem, {
										value: t.value,
										children: t.label
									}, t.value)) })]
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Platform",
								required: true,
								error: form.formState.errors.platform?.message,
								children: /* @__PURE__ */ jsxs(Select$1, {
									value: form.watch("platform") || "",
									onValueChange: (v) => form.setValue("platform", v, { shouldDirty: true }),
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "w-full",
										children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select platform" })
									}), /* @__PURE__ */ jsx(SelectContent, { children: PLATFORMS.map((p) => /* @__PURE__ */ jsx(SelectItem, {
										value: p.value,
										children: p.label
									}, p.value)) })]
								})
							}),
							isEdit ? /* @__PURE__ */ jsx(Field, {
								label: "Website Status",
								error: form.formState.errors.websiteStatus?.message,
								children: /* @__PURE__ */ jsx(StatusSelect, {
									value: form.watch("websiteStatus") ?? "",
									onChange: (v) => form.setValue("websiteStatus", v, { shouldDirty: true }),
									options: WEBSITE_STATUSES,
									placeholder: "Select status"
								})
							}) : /* @__PURE__ */ jsx("div", {}),
							isEdit ? /* @__PURE__ */ jsx(Field, {
								label: "Maintenance Status",
								error: form.formState.errors.maintenanceStatus?.message,
								children: /* @__PURE__ */ jsx(StatusSelect, {
									value: form.watch("maintenanceStatus") ?? "",
									onChange: (v) => form.setValue("maintenanceStatus", v, { shouldDirty: true }),
									options: MAINTENANCE_STATUSES,
									placeholder: "Select status"
								})
							}) : /* @__PURE__ */ jsx("div", {})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-[#dce3ef] bg-white p-7 shadow-sm dark:border-[#25304a] dark:bg-[#111827]",
				children: [
					/* @__PURE__ */ jsx(SectionHeader, {
						icon: /* @__PURE__ */ jsx(CalendarDays, { className: "size-5" }),
						title: "Dates & Notes",
						description: isEdit ? "Update important dates and other details." : "Add key dates and notes for this website."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Start Date",
								error: form.formState.errors.startDate?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									...form.register("startDate")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Hosted Date",
								error: form.formState.errors.hostedDate?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									...form.register("hostedDate")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Handover Date",
								error: form.formState.errors.handoverDate?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									...form.register("handoverDate")
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Last Invoice Sent",
								error: form.formState.errors.lastInvoiceSent?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									...form.register("lastInvoiceSent")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Last Payment Received",
								error: form.formState.errors.lastPaymentReceived?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									...form.register("lastPaymentReceived")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Renewal Date",
								error: form.formState.errors.renewalDate?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									...form.register("renewalDate")
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: cn("mt-6 grid gap-8", isEdit ? "lg:grid-cols-3" : ""),
						children: [/* @__PURE__ */ jsx("div", {
							className: isEdit ? "lg:col-span-2" : "",
							children: /* @__PURE__ */ jsx(Field, {
								label: "Remarks",
								error: form.formState.errors.remarks?.message,
								children: /* @__PURE__ */ jsx("textarea", {
									rows: 4,
									className: "w-full resize-none rounded-lg border border-[#dce3ef] bg-white px-3.5 py-3 text-sm text-[#172554] outline-none placeholder:text-[#7f8aa3] focus-visible:border-[#4f2df5] focus-visible:ring-3 focus-visible:ring-[#4f2df5]/15 dark:border-[#25304a] dark:bg-[#111827] dark:text-[#edf2ff]",
									placeholder: "Enter any notes or remarks (optional)",
									...form.register("remarks")
								})
							})
						}), isEdit ? /* @__PURE__ */ jsx(Field, {
							label: "Transfer Completed",
							info: "Whether the domain and assets transfer has been finalized.",
							error: form.formState.errors.transferCompleted?.message,
							children: /* @__PURE__ */ jsxs(Select$1, {
								value: form.watch("transferCompleted") ? "yes" : "no",
								onValueChange: (v) => form.setValue("transferCompleted", v === "yes", { shouldDirty: true }),
								children: [/* @__PURE__ */ jsx(SelectTrigger, {
									className: "w-full",
									children: /* @__PURE__ */ jsx(SelectValue, {})
								}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
									value: "yes",
									children: "Yes"
								}), /* @__PURE__ */ jsx(SelectItem, {
									value: "no",
									children: "No"
								})] })]
							})
						}) : null]
					})
				]
			}),
			mutation.isError ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-destructive",
				children: mutation.error.message
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "mt-auto flex shrink-0 items-center justify-between gap-3 rounded-lg border border-[#dce3ef] bg-white px-7 py-4 dark:border-[#25304a] dark:bg-[#111827]",
				children: [/* @__PURE__ */ jsx("div", { children: isEdit && props.onDelete ? /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "outline",
					className: "gap-2 rounded-xl border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30",
					disabled: props.isDeleting,
					onClick: props.onDelete,
					children: [/* @__PURE__ */ jsx(Trash2, { className: "size-4" }), props.isDeleting ? "Deleting..." : "Delete Website"]
				}) : null }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [props.onCancel ? /* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "outline",
						className: "h-12 min-w-28 rounded-lg",
						onClick: props.onCancel,
						children: "Cancel"
					}) : null, /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: mutation.isPending || clientsQuery.isLoading,
						className: "h-12 min-w-40 gap-2 rounded-lg font-bold text-white",
						children: [isEdit ? /* @__PURE__ */ jsx(Save, { className: "size-4" }) : /* @__PURE__ */ jsx(CirclePlus, { className: "size-4" }), mutation.isPending ? isEdit ? "Saving..." : "Creating..." : isEdit ? "Save Changes" : "Create Website"]
					})]
				})]
			})
		]
	});
}
//#endregion
export { useWebsite as a, useWebsites as c, useUpdateWebsite as i, useClientOptions as n, useWebsiteActivity as o, useDeleteWebsite as r, useWebsiteStats as s, WebsiteForm as t };
