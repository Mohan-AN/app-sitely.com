import { t as cn } from "./utils-C3dXA-e9.js";
import { t as Button } from "./button-BJN112tG.js";
import { t as Input } from "./input-B9pPcpqc.js";
import { a as useUpdateWebsite, n as useCreateWebsite, t as useClientOptions } from "./use-websites-DxteJjR7.js";
import { n as useServiceOptions, t as useCreateServiceOption } from "./use-service-options-CsGN06oa.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, CheckIcon, ChevronDown, ChevronDownIcon, ChevronUpIcon, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select } from "@base-ui/react/select";
import { createPortal } from "react-dom";
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
		className: cn("flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(Select.Icon, { render: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "pointer-events-none size-4 text-muted-foreground" }) })]
	});
}
function SelectContent({ className, children, side = "bottom", sideOffset = 4, align = "center", alignOffset = 0, alignItemWithTrigger = false, ...props }) {
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
//#region src/components/ui/service-option-select.tsx
function ServiceOptionSelect({ category, value, onChange, placeholder = "Select...", disabled, error }) {
	const { data, isLoading, isError, refetch } = useServiceOptions(category);
	const createMutation = useCreateServiceOption();
	const [open, setOpen] = useState(false);
	const [addingNew, setAddingNew] = useState(false);
	const [newName, setNewName] = useState("");
	const [addError, setAddError] = useState();
	const triggerRef = useRef(null);
	const [dropRect, setDropRect] = useState(null);
	const options = (data ?? []).filter((o) => o.is_active);
	function measureTrigger() {
		return triggerRef.current?.getBoundingClientRect() ?? null;
	}
	function openDropdown() {
		const rect = measureTrigger();
		if (!rect) return;
		setDropRect(rect);
		setOpen(true);
	}
	useEffect(() => {
		if (!open) return;
		const update = () => {
			const rect = measureTrigger();
			if (rect) setDropRect(rect);
		};
		window.addEventListener("scroll", update, true);
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update, true);
			window.removeEventListener("resize", update);
		};
	}, [open]);
	function handleSelect(name) {
		onChange(name);
		setOpen(false);
	}
	function handleAddNew(e) {
		e?.preventDefault();
		const trimmed = newName.trim();
		if (!trimmed) {
			setAddError("Name is required.");
			return;
		}
		setAddError(void 0);
		createMutation.mutate({
			category,
			name: trimmed
		}, {
			onSuccess: async (created) => {
				await refetch();
				onChange(created.name);
				setAddingNew(false);
				setNewName("");
			},
			onError: async (err) => {
				const apiErr = err;
				if (apiErr.code === "CONFLICT" || apiErr.status === 409) {
					await refetch();
					onChange(trimmed);
					setAddingNew(false);
					setNewName("");
				} else setAddError(apiErr.message ?? "Failed to add.");
			}
		});
	}
	if (isError) return /* @__PURE__ */ jsx("div", {
		className: "flex h-8 items-center rounded-[8px] border border-[#DC2626] bg-[#FEF2F2] px-3 text-[12px] text-[#DC2626]",
		children: "Could not load options"
	});
	const portalStyle = dropRect ? {
		position: "absolute",
		top: dropRect.bottom + window.scrollY + 4,
		left: dropRect.left + window.scrollX,
		width: dropRect.width,
		zIndex: 9999
	} : { display: "none" };
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ jsxs("button", {
				ref: triggerRef,
				type: "button",
				disabled: disabled || isLoading,
				onClick: openDropdown,
				className: cn("flex h-8 w-full items-center justify-between rounded-[8px] border px-3 text-[12px] transition bg-white", error ? "border-[#DC2626]" : "border-[#C9CDD6] hover:border-[#4F5DF5]", !value ? "text-[#9CA3AF]" : "text-[#11141A]"),
				children: [/* @__PURE__ */ jsx("span", {
					className: "truncate",
					children: value || placeholder
				}), isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 shrink-0 animate-spin text-[#8A8F98]" }) : /* @__PURE__ */ jsx(ChevronDown, { className: cn("size-3.5 shrink-0 text-[#8A8F98] transition", open && "rotate-180") })]
			}),
			open && createPortal(/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 9998
				},
				onClick: () => setOpen(false)
			}), /* @__PURE__ */ jsx("div", {
				style: portalStyle,
				className: "overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(17,20,26,.16)]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "overflow-y-auto",
					style: { maxHeight: 260 },
					children: [
						options.length === 0 && /* @__PURE__ */ jsx("p", {
							className: "px-3 py-2 text-[12px] text-[#8A8F98]",
							children: "No options yet — add one below."
						}),
						options.map((opt) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => handleSelect(opt.name),
							className: "flex w-full items-center gap-2 px-3 py-[9px] text-left text-[12.5px] text-[#3D4250] transition hover:bg-[#F4F5F7]",
							children: [opt.name === value && /* @__PURE__ */ jsx(Check, { className: "size-3.5 shrink-0 text-[#4F5DF5]" }), /* @__PURE__ */ jsx("span", {
								className: opt.name === value ? "font-semibold text-[#4F5DF5]" : "",
								children: opt.name
							})]
						}, opt.option_id)),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => {
								setOpen(false);
								setAddingNew(true);
							},
							className: "flex w-full items-center gap-2 border-t border-[#EEF0F2] px-3 py-[9px] text-left text-[12.5px] font-semibold text-[#4F5DF5] transition hover:bg-[#EEEFFE]",
							children: [/* @__PURE__ */ jsx(Plus, { className: "size-3.5" }), "Add new option…"]
						})
					]
				})
			})] }), document.body),
			addingNew && /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1.5",
				children: [
					/* @__PURE__ */ jsx("input", {
						type: "text",
						value: newName,
						onChange: (e) => {
							setNewName(e.target.value);
							setAddError(void 0);
						},
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleAddNew();
							}
							if (e.key === "Escape") {
								setAddingNew(false);
								setNewName("");
								setAddError(void 0);
							}
						},
						placeholder: "New option name",
						autoFocus: true,
						className: cn("h-8 flex-1 rounded-[8px] border px-3 text-[12px] outline-none transition", addError ? "border-[#DC2626]" : "border-[#C9CDD6] focus:border-[#4F5DF5]")
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => handleAddNew(),
						disabled: createMutation.isPending,
						className: "flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#4F5DF5] text-white transition hover:bg-[#3F4DE0] disabled:opacity-50",
						children: createMutation.isPending ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Check, { className: "size-3.5" })
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							setAddingNew(false);
							setNewName("");
							setAddError(void 0);
						},
						className: "flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E7EB] text-[#8A8F98] transition hover:border-[#FECACA] hover:text-[#DC2626]",
						children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
					})
				]
			}),
			addError && /* @__PURE__ */ jsx("p", {
				className: "text-[11px] font-semibold text-[#DC2626]",
				children: addError
			})
		]
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
	hostingType: optionalStr,
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
	transferCompleted: z.boolean(),
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
		hostingType: v.hostingType ?? null,
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
		lastPaymentAmount: v.lastPaymentAmount ?? null,
		transferCompleted: v.transferCompleted
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
		hostingType: website?.hosting_type ?? "",
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
		transferCompleted: website?.transfer_completed ?? false,
		remarks: website?.remarks ?? ""
	};
}
function Field({ label, required, hint, error, children, className }) {
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
	return /* @__PURE__ */ jsxs(Select$1, {
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
						/* @__PURE__ */ jsx(Field, {
							label: "Client",
							required: true,
							error: e.clientId?.message,
							children: /* @__PURE__ */ jsxs(Select$1, {
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
						/* @__PURE__ */ jsx(Field, {
							label: "Project Name",
							required: true,
							error: e.projectName?.message,
							children: /* @__PURE__ */ jsx(Input, {
								placeholder: "e.g. Quill Books",
								className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
								...form.register("projectName")
							})
						}),
						/* @__PURE__ */ jsx(Field, {
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
						/* @__PURE__ */ jsx(Field, {
							label: "Build Type",
							error: e.buildType?.message,
							children: /* @__PURE__ */ jsx(ServiceOptionSelect, {
								category: "build_type",
								value: form.watch("buildType") ?? "",
								onChange: (v) => form.setValue("buildType", v, { shouldDirty: true }),
								placeholder: "Select build type"
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Hosting Provider",
							error: e.hostingProvider?.message,
							children: /* @__PURE__ */ jsx(ServiceOptionSelect, {
								category: "hosting_provider",
								value: form.watch("hostingProvider") ?? "",
								onChange: (v) => form.setValue("hostingProvider", v, { shouldDirty: true }),
								placeholder: "Select provider"
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Hosting Type",
							error: e.hostingType?.message,
							children: /* @__PURE__ */ jsx(ServiceOptionSelect, {
								category: "hosting_type",
								value: form.watch("hostingType") ?? "",
								onChange: (v) => form.setValue("hostingType", v, { shouldDirty: true }),
								placeholder: "Select type"
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Build Cost",
							required: true,
							error: e.buildCost?.message,
							children: /* @__PURE__ */ jsx(MoneyInput, {
								placeholder: "25000",
								...form.register("buildCost")
							})
						}),
						isEdit && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Field, {
							label: "Website Status",
							error: e.websiteStatus?.message,
							children: /* @__PURE__ */ jsx(StatusSelect, {
								value: form.watch("websiteStatus"),
								onChange: (v) => form.setValue("websiteStatus", v, { shouldDirty: true }),
								options: WEBSITE_STATUSES,
								placeholder: "Select status"
							})
						}), /* @__PURE__ */ jsx(Field, {
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
						/* @__PURE__ */ jsx(Field, {
							label: "Start Date",
							error: e.startDate?.message,
							hint: "When work on the build began",
							children: /* @__PURE__ */ jsx(Input, {
								type: "date",
								className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
								...form.register("startDate")
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Completed Date",
							error: e.completedDate?.message,
							hint: "When the build was finished",
							children: /* @__PURE__ */ jsx(Input, {
								type: "date",
								className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
								...form.register("completedDate")
							})
						}),
						/* @__PURE__ */ jsx(Field, {
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
							/* @__PURE__ */ jsx(Field, {
								label: "Renewal Date",
								error: e.renewalDate?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("renewalDate")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Last Invoice Sent",
								error: e.lastInvoiceSent?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("lastInvoiceSent")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Last Payment Date",
								error: e.lastPaymentReceived?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("lastPaymentReceived")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Last Payment Amount",
								error: e.lastPaymentAmount?.message,
								children: /* @__PURE__ */ jsx(MoneyInput, {
									placeholder: "0",
									...form.register("lastPaymentAmount")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Transfer Completed",
								children: /* @__PURE__ */ jsxs(Select$1, {
									value: form.watch("transferCompleted") ? "yes" : "no",
									onValueChange: (v) => form.setValue("transferCompleted", v === "yes", { shouldDirty: true }),
									children: [/* @__PURE__ */ jsx(SelectTrigger, {
										className: "h-8 w-full rounded-[8px] border-[#C9CDD6] text-[12px]",
										children: /* @__PURE__ */ jsx(SelectValue, {})
									}), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
										value: "yes",
										children: "Yes"
									}), /* @__PURE__ */ jsx(SelectItem, {
										value: "no",
										children: "No"
									})] })]
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
							/* @__PURE__ */ jsx(Field, {
								label: "Domain Name",
								error: e.domainName?.message,
								children: /* @__PURE__ */ jsx(Input, {
									placeholder: "example.com",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("domainName")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Domain Handled By",
								required: true,
								error: e.domainHandledBy?.message,
								children: /* @__PURE__ */ jsxs(Select$1, {
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
							/* @__PURE__ */ jsx(Field, {
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
							/* @__PURE__ */ jsx(Field, {
								label: "Domain Renewal Date",
								error: e.domainRenewalDate?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "date",
									className: "h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]",
									...form.register("domainRenewalDate")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Domain Cost / Year",
								error: e.domainCost?.message,
								className: "col-span-2",
								hint: "Deducted from annual profit only if handled by our side",
								children: /* @__PURE__ */ jsx(MoneyInput, {
									placeholder: "1200",
									...form.register("domainCost")
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
							/* @__PURE__ */ jsx(Field, {
								label: "Billing Cycle",
								required: true,
								error: e.billingCycle?.message,
								children: /* @__PURE__ */ jsxs(Select$1, {
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
							/* @__PURE__ */ jsx(Field, {
								label: "Maintenance Amount",
								required: true,
								error: e.maintenanceAmount?.message,
								children: /* @__PURE__ */ jsx(MoneyInput, {
									placeholder: "5000",
									...form.register("maintenanceAmount")
								})
							}),
							/* @__PURE__ */ jsx(Field, {
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
							/* @__PURE__ */ jsx(Field, {
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
export { SelectTrigger as a, SelectItem as i, Select$1 as n, SelectContent as r, WebsiteForm as t };
