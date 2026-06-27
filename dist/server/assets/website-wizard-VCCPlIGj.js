import { t as cn } from "./utils-CR4dV3c0.js";
import { t as Input } from "./input-CyBl28YE.js";
import { c as useUpdateWebsite, n as useCreateWebsite, t as useClientOptions } from "./use-websites-BnWcvb5r.js";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as ServiceOptionSelect } from "./service-option-select-DfxCZ9yy.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronRight, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//#region src/components/websites/website-wizard.tsx
var emptyToNull = (v) => typeof v === "string" && v.trim() === "" ? null : v;
var emptyToUndefined = (v) => typeof v === "string" && v.trim() === "" ? void 0 : v;
var optionalDate = z.preprocess(emptyToUndefined, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional());
var optionalUrl = z.preprocess(emptyToUndefined, z.string().url("Invalid url").optional());
var optionalStr = z.preprocess(emptyToNull, z.string().nullable().optional());
var optionalAmt = z.preprocess(emptyToUndefined, z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be a valid amount").optional());
var requiredDate = (msg) => z.string().trim().min(1, msg).refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Must be YYYY-MM-DD");
var wizardSchema = z.object({
	clientId: z.string().min(1, "Client is required"),
	projectName: z.string().trim().min(1, "Project name is required").max(150, "Too long"),
	url: optionalUrl,
	siteType: z.string().optional(),
	platform: z.string().optional(),
	buildType: z.string().trim().min(1, "Build type is required"),
	hostingProvider: optionalStr,
	buildCost: optionalAmt,
	websiteStatus: z.string().optional(),
	maintenanceStatus: z.string().optional(),
	domainName: optionalStr,
	domainHandledBy: z.enum(["our_side", "client_side"]).nullable().optional(),
	domainProvider: optionalStr,
	domainRenewalDate: optionalDate,
	domainCost: optionalAmt,
	hostingCost: optionalAmt,
	hostingRenewalDate: optionalDate,
	startDate: requiredDate("Start date is required"),
	completedDate: optionalDate,
	hostedDate: optionalDate,
	billingCycle: z.enum(["monthly", "yearly"]).nullable().optional(),
	maintenanceAmount: optionalAmt,
	lastInvoiceSent: optionalDate,
	lastPaymentReceived: optionalDate,
	lastPaymentAmount: optionalAmt,
	renewalDate: optionalDate,
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
var STEP_META = [
	{
		label: "Basics",
		sub: "Client & project"
	},
	{
		label: "Domain & Hosting",
		sub: "Ownership & costs"
	},
	{
		label: "Dates & Billing",
		sub: "Timeline & cycle"
	},
	{
		label: "Review",
		sub: "Confirm & save"
	}
];
var STEP_REQUIRED_FIELDS = {
	1: [
		"clientId",
		"projectName",
		"buildType"
	],
	2: [],
	3: ["startDate"],
	4: []
};
var FIELD_ERROR_MAP = {
	project_name: {
		key: "projectName",
		step: 1
	},
	client_id: {
		key: "clientId",
		step: 1
	},
	build_type: {
		key: "buildType",
		step: 1
	},
	url: {
		key: "url",
		step: 1
	},
	domain_name: {
		key: "domainName",
		step: 2
	},
	domain_provider: {
		key: "domainProvider",
		step: 2
	},
	domain_cost: {
		key: "domainCost",
		step: 2
	},
	hosting_provider: {
		key: "hostingProvider",
		step: 1
	},
	hosting_cost: {
		key: "hostingCost",
		step: 2
	},
	start_date: {
		key: "startDate",
		step: 3
	},
	hosted_date: {
		key: "hostedDate",
		step: 3
	},
	billing_cycle: {
		key: "billingCycle",
		step: 3
	},
	maintenance_amount: {
		key: "maintenanceAmount",
		step: 3
	},
	remarks: {
		key: "remarks",
		step: 3
	}
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
		buildCost: v.buildCost || void 0,
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
		lastPaymentAmount: v.lastPaymentAmount ?? null,
		lastInvoiceSent: v.lastInvoiceSent ?? null
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
		domainName: website?.domain_name ?? "",
		domainHandledBy: website?.domain_handled_by ?? null,
		domainProvider: website?.domain_provider ?? "",
		domainRenewalDate: toDateValue(website?.domain_renewal_date),
		domainCost: website?.domain_cost ?? "",
		hostingCost: website?.hosting_cost ?? "",
		hostingRenewalDate: toDateValue(website?.hosting_renewal_date),
		startDate: toDateValue(website?.start_date) || "",
		completedDate: toDateValue(website?.completed_date),
		hostedDate: toDateValue(website?.hosted_date),
		billingCycle: website?.billing_cycle ?? null,
		maintenanceAmount: website?.maintenance_amount ?? "",
		lastInvoiceSent: toDateValue(website?.last_invoice_sent),
		lastPaymentReceived: toDateValue(website?.last_payment_received),
		renewalDate: toDateValue(website?.current_billing_due_date),
		lastPaymentAmount: website?.last_payment_amount ?? "",
		remarks: website?.remarks ?? ""
	};
}
function fmt(value) {
	if (!value) return "—";
	const n = Number(value);
	if (isNaN(n)) return value;
	return "₹" + n.toLocaleString("en-IN");
}
function computeDueDates(hostedDate, cycle) {
	const base = new Date(hostedDate);
	if (isNaN(base.getTime())) return [];
	return Array.from({ length: 4 }, (_, i) => {
		const d = new Date(base);
		if (cycle === "monthly") d.setMonth(d.getMonth() + i);
		else d.setFullYear(d.getFullYear() + i);
		return d.toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		});
	});
}
function Field({ label, required, hint, hintGreen, error, children, className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("flex flex-col gap-1", className),
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "flex items-center gap-1 text-[12px] font-bold text-[#374151]",
				children: [label, required && /* @__PURE__ */ jsx("span", {
					className: "text-[#DC2626]",
					children: "*"
				})]
			}),
			children,
			hint && /* @__PURE__ */ jsx("p", {
				className: cn("text-[11.5px] leading-snug", hintGreen ? "font-bold text-[#16a34a]" : "text-[#8a94a6]"),
				children: hint
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "text-[11px] font-semibold text-[#DC2626]",
				children: error
			})
		]
	});
}
function MoneyInput({ className, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "relative",
		children: [/* @__PURE__ */ jsx("span", {
			className: "pointer-events-none absolute inset-y-0 left-3 flex items-center text-[12px] text-[#6B7280]",
			children: "₹"
		}), /* @__PURE__ */ jsx("input", {
			type: "text",
			inputMode: "decimal",
			className: cn("h-9 w-full rounded-[9px] border border-[#d9dee8] bg-white pl-7 pr-3 text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#4f5df7] focus:shadow-[0_0_0_3px_rgba(79,93,247,.10)]", className),
			...props
		})]
	});
}
function StatusSelect({ value, onChange, options, placeholder }) {
	return /* @__PURE__ */ jsxs(Select, {
		value: value ?? "",
		onValueChange: (v) => v && onChange(v),
		children: [/* @__PURE__ */ jsx(SelectTrigger, {
			className: "h-9 w-full rounded-[9px] border-[#d9dee8] text-[13px]",
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
function StdInput({ className, ...props }) {
	return /* @__PURE__ */ jsx("input", {
		className: cn("h-9 w-full rounded-[9px] border border-[#d9dee8] bg-white px-3 text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#4f5df7] focus:shadow-[0_0_0_3px_rgba(79,93,247,.10)]", className),
		...props
	});
}
function OwnerCard({ active, title, desc, onClick }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick,
		className: cn("rounded-[12px] border-[1.5px] p-3 text-left transition", active ? "border-[#4f5df7] bg-[#eef0ff]" : "border-[#d9dee8] hover:border-[#b0b8f0]"),
		children: [/* @__PURE__ */ jsx("strong", {
			className: "block text-[13.5px] font-bold text-[#111827]",
			children: title
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-[12px] leading-snug text-[#64748b]",
			children: desc
		})]
	});
}
function CycleCard({ active, label, sub, onClick }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick,
		className: cn("rounded-[12px] border-[1.5px] p-3 text-center transition", active ? "border-[#4f5df7] bg-[#eef0ff]" : "border-[#d9dee8] hover:border-[#b0b8f0]"),
		children: [/* @__PURE__ */ jsx("strong", {
			className: "block text-[13px] font-bold text-[#111827]",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "text-[11.5px] text-[#8a94a6]",
			children: sub
		})]
	});
}
function Stepper({ step, maxReached, onStepClick }) {
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-4 gap-2.5 rounded-[14px] border border-[#e5e7eb] bg-white p-3",
		children: STEP_META.map((meta, i) => {
			const n = i + 1;
			const isActive = n === step;
			const isDone = n < step;
			const isLocked = n > maxReached;
			return /* @__PURE__ */ jsxs("button", {
				type: "button",
				disabled: isLocked,
				onClick: () => !isLocked && onStepClick(n),
				className: cn("flex items-center gap-2.5 rounded-[11px] border px-3 py-2.5 text-left transition", isActive ? "border-[#d9ddff] bg-[#eef0ff]" : isLocked ? "cursor-default border-transparent opacity-40" : "border-transparent hover:bg-[#f9fafb]"),
				children: [/* @__PURE__ */ jsx("span", {
					className: cn("flex size-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px] font-bold", isDone ? "border-[#16a34a] bg-[#16a34a] text-white" : isActive ? "border-[#4f5df7] bg-[#4f5df7] text-white" : "border-[#cfd6e6] bg-white text-[#64748b]"),
					children: isDone ? /* @__PURE__ */ jsx(Check, { className: "size-3.5 stroke-[3]" }) : n
				}), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", {
					className: "block text-[13px] font-bold text-[#111827]",
					children: meta.label
				}), /* @__PURE__ */ jsx("span", {
					className: "mt-0.5 block text-[11.5px] text-[#8a94a6]",
					children: meta.sub
				})] })]
			}, n);
		})
	});
}
function SummaryPanel({ v, clientOptions }) {
	const clientName = clientOptions.find((c) => String(c.id) === v.clientId)?.name ?? (v.clientId ? `ID:${v.clientId}` : "—");
	const owner = v.domainHandledBy === "our_side" ? "Our side" : v.domainHandledBy === "client_side" ? "Client side" : "—";
	const cycle = v.billingCycle === "monthly" ? "Monthly" : v.billingCycle === "yearly" ? "Yearly" : "—";
	const maintenance = v.maintenanceAmount ? fmt(v.maintenanceAmount) + (v.billingCycle === "yearly" ? " / yr" : " / mo") : "—";
	const profitRule = v.domainHandledBy === "our_side" ? "Domain + hosting costs deducted." : v.domainHandledBy === "client_side" ? "Only hosting cost deducted. Domain is client side." : "Set domain ownership to see rule.";
	const rows = [
		["Client", v.clientId ? clientName : "—"],
		["Project", v.projectName || "—"],
		["Build", v.buildType || "—"],
		["Hosting", v.hostingProvider || "—"],
		["Domain", v.domainName || "Not added"],
		["Owner", owner],
		["Billing", cycle],
		["Maintenance", maintenance]
	];
	return /* @__PURE__ */ jsxs("aside", {
		className: "flex w-[260px] shrink-0 flex-col overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white",
		children: [/* @__PURE__ */ jsx("div", {
			className: "border-b border-[#e5e7eb] px-4 py-2.5",
			children: /* @__PURE__ */ jsx("h3", {
				className: "text-[13px] font-bold text-[#111827]",
				children: "Website Summary"
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1 overflow-y-auto px-4 py-0.5",
			children: [rows.map(([label, val]) => /* @__PURE__ */ jsxs("div", {
				className: "flex justify-between gap-3 border-b border-[#eef0f4] py-[7px] last:border-0",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[11.5px] text-[#8a94a6]",
					children: label
				}), /* @__PURE__ */ jsx("strong", {
					className: "text-right text-[12px] text-[#111827]",
					children: val
				})]
			}, label)), /* @__PURE__ */ jsxs("div", {
				className: "mb-2 mt-1.5 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2",
				children: [/* @__PURE__ */ jsx("p", {
					className: "mb-0.5 block text-[11px] font-bold uppercase text-[#14532d]",
					children: "Profit rule"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[11.5px] leading-snug text-[#14532d]",
					children: profitRule
				})]
			})]
		})]
	});
}
function ReviewBox({ title, rows }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "overflow-hidden rounded-[12px] border border-[#e5e7eb]",
		children: [/* @__PURE__ */ jsx("h4", {
			className: "border-b border-[#e5e7eb] bg-[#fafbff] px-3 py-2.5 text-[13px] font-bold text-[#111827]",
			children: title
		}), rows.map(([label, val]) => /* @__PURE__ */ jsxs("div", {
			className: "flex justify-between gap-3 border-b border-[#eef0f4] px-3 py-2 last:border-0",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[11.5px] text-[#8a94a6]",
				children: label
			}), /* @__PURE__ */ jsx("strong", {
				className: "text-right text-[12px] text-[#111827]",
				children: val
			})]
		}, label))]
	});
}
function WebsiteWizard(props) {
	const isEdit = props.mode === "edit";
	const website = props.mode === "edit" ? props.website : void 0;
	const initialClientId = props.mode !== "edit" ? props.initialClientId ?? "" : "";
	const [step, setStep] = useState(1);
	const [maxReached, setMaxReached] = useState(1);
	const clientsQuery = useClientOptions(void 0);
	const createMutation = useCreateWebsite();
	const updateMutation = useUpdateWebsite(website ? String(website.id) : "");
	const mutation = isEdit ? updateMutation : createMutation;
	const form = useForm({
		resolver: zodResolver(wizardSchema),
		defaultValues: getDefaultValues(website, initialClientId),
		mode: "onChange"
	});
	useEffect(() => {
		if (website) form.reset(getDefaultValues(website));
	}, [website]);
	const clients = clientsQuery.data?.items ?? [];
	const buildType = form.watch("buildType");
	const hostingProvider = form.watch("hostingProvider");
	const domainHandledBy = form.watch("domainHandledBy");
	const hostedDate = form.watch("hostedDate");
	const billingCycle = form.watch("billingCycle");
	const vals = form.watch();
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
	const dueDates = useMemo(() => {
		if (!hostedDate || !billingCycle) return [];
		return computeDueDates(hostedDate, billingCycle);
	}, [hostedDate, billingCycle]);
	async function advance() {
		const fields = STEP_REQUIRED_FIELDS[step];
		const stepFieldKeys = Object.values(FIELD_ERROR_MAP).filter((m) => m.step === step).map((m) => m.key);
		const currentErrors = form.formState.errors;
		if (stepFieldKeys.some((f) => !!currentErrors[f])) return;
		if (fields.length) {
			if (!await form.trigger(fields)) return;
		}
		if (step < 4) {
			const next = step + 1;
			setStep(next);
			setMaxReached((m) => Math.max(m, next));
		}
	}
	function handleMutationError(err) {
		const fieldErrors = err?.fieldErrors ?? {};
		if (Object.keys(fieldErrors).length > 0) {
			let earliestStep = 4;
			for (const [backendKey, msg] of Object.entries(fieldErrors)) {
				const mapping = FIELD_ERROR_MAP[backendKey];
				if (mapping) {
					form.setError(mapping.key, { message: msg });
					if (mapping.step < earliestStep) earliestStep = mapping.step;
				}
			}
			setStep(earliestStep);
			setMaxReached((m) => Math.max(m, earliestStep));
		}
	}
	const submit = form.handleSubmit((values) => {
		if (step !== 4) return;
		if (isEdit) updateMutation.mutate(toUpdatePayload(values), {
			onSuccess: (w) => props.onUpdated(w),
			onError: handleMutationError
		});
		else createMutation.mutate(toCreatePayload(values), {
			onSuccess: (w) => props.onCreated(w),
			onError: handleMutationError
		});
	});
	const e = form.formState.errors;
	const titles = STEP_META[step - 1];
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: (e) => e.preventDefault(),
		className: "flex h-full flex-col overflow-hidden bg-[#f4f5f8]",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-6",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-[20px] font-bold leading-tight text-[#111827]",
				children: isEdit ? "Edit Website" : "Add Website"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-[12.5px] text-[#8a94a6]",
				children: isEdit ? "Update website information and settings." : "Step-by-step form to add a new website."
			})] }), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2.5",
				children: [
					props.cancelHref ? /* @__PURE__ */ jsx("a", {
						href: props.cancelHref,
						className: "inline-flex h-[34px] items-center rounded-[9px] border border-[#e5e7eb] bg-white px-4 text-[12.5px] font-bold text-[#374151] transition hover:bg-[#f9fafb]",
						children: "Cancel"
					}) : null,
					isEdit && props.onDelete && /* @__PURE__ */ jsxs("button", {
						type: "button",
						disabled: props.isDeleting,
						onClick: props.onDelete,
						className: "inline-flex h-[34px] items-center gap-1.5 rounded-[9px] border border-[#FECACA] px-4 text-[12.5px] font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2] disabled:opacity-50",
						children: [/* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }), props.isDeleting ? "Deleting…" : "Delete"]
					}),
					step < 4 && /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: advance,
						className: "inline-flex h-[34px] items-center rounded-[9px] bg-[#4f5df7] px-4 text-[12.5px] font-bold text-white transition hover:bg-[#3f4de0]",
						children: "Continue"
					})
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden px-6 py-4",
			children: [
				/* @__PURE__ */ jsx(Stepper, {
					step,
					maxReached,
					onStepClick: (n) => {
						if (n <= maxReached) setStep(n);
					}
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex min-h-0 flex-1 gap-3.5 overflow-hidden",
					children: [/* @__PURE__ */ jsxs("section", {
						className: "flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "shrink-0 border-b border-[#e5e7eb] px-[18px] py-3",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-[16px] font-bold text-[#111827]",
								children: titles.label
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-[12px] leading-snug text-[#8a94a6]",
								children: [
									step === 1 && "Add the core website information, type, and build details.",
									step === 2 && "Set domain ownership and all cost information.",
									step === 3 && "Set the hosted date and billing cycle so Sitely can generate due dates.",
									step === 4 && "Confirm the details before saving the website."
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 overflow-y-auto p-[14px]",
							children: [
								step === 1 && /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-2.5",
									children: [
										/* @__PURE__ */ jsx(Field, {
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
													className: "h-9 w-full rounded-[9px] border-[#d9dee8] text-[13px]",
													children: /* @__PURE__ */ jsx(SelectValue, {
														placeholder: clientsQuery.isLoading ? "Loading…" : "Select client",
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
											children: /* @__PURE__ */ jsx(StdInput, {
												placeholder: "e.g. Quill Books",
												...form.register("projectName")
											})
										}),
										/* @__PURE__ */ jsx(Field, {
											label: "Website URL",
											error: e.url?.message,
											className: "col-span-2",
											hint: "Optional now. Required before marking the website as Live.",
											children: /* @__PURE__ */ jsx(StdInput, {
												placeholder: "https://example.com",
												...form.register("url")
											})
										}),
										/* @__PURE__ */ jsx(Field, {
											label: "Build Type",
											required: true,
											error: e.buildType?.message,
											children: /* @__PURE__ */ jsx(ServiceOptionSelect, {
												category: "build_type",
												value: form.watch("buildType") ?? "",
												onChange: (v) => form.setValue("buildType", v, {
													shouldDirty: true,
													shouldValidate: true
												}),
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
											label: "Build Cost",
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
								}),
								step === 2 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
									className: "mb-3.5 grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ jsx(OwnerCard, {
										active: domainHandledBy === "our_side",
										title: "We manage it",
										desc: "Domain cost is deducted from annual profit.",
										onClick: () => form.setValue("domainHandledBy", "our_side", { shouldDirty: true })
									}), /* @__PURE__ */ jsx(OwnerCard, {
										active: domainHandledBy === "client_side",
										title: "Client manages it",
										desc: "Domain cost is not deducted from annual profit.",
										onClick: () => form.setValue("domainHandledBy", "client_side", { shouldDirty: true })
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-3.5",
									children: [
										/* @__PURE__ */ jsx(Field, {
											label: "Domain Name",
											error: e.domainName?.message,
											children: /* @__PURE__ */ jsx(StdInput, {
												placeholder: "example.com",
												...form.register("domainName")
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
												className: "h-9 rounded-[9px] border-[#d9dee8] text-[13px]",
												...form.register("domainRenewalDate")
											})
										}),
										/* @__PURE__ */ jsx(Field, {
											label: "Domain Cost / Year",
											error: e.domainCost?.message,
											hint: "Deducted only when domain is handled by our side.",
											hintGreen: true,
											children: /* @__PURE__ */ jsx(MoneyInput, {
												placeholder: "1200",
												...form.register("domainCost")
											})
										}),
										/* @__PURE__ */ jsx(Field, {
											label: "Hosting Cost / Year",
											error: e.hostingCost?.message,
											hint: "Always deducted from annual profit.",
											hintGreen: true,
											children: /* @__PURE__ */ jsx(MoneyInput, {
												placeholder: "3000",
												...form.register("hostingCost")
											})
										}),
										/* @__PURE__ */ jsx(Field, {
											label: "Hosting Renewal Date",
											error: e.hostingRenewalDate?.message,
											children: /* @__PURE__ */ jsx(Input, {
												type: "date",
												className: "h-9 rounded-[9px] border-[#d9dee8] text-[13px]",
												...form.register("hostingRenewalDate")
											})
										})
									]
								})] }),
								step === 3 && /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "mb-3.5 grid grid-cols-3 gap-3.5",
										children: [
											/* @__PURE__ */ jsx(Field, {
												label: "Start Date",
												required: true,
												error: e.startDate?.message,
												hint: "When work on the build began",
												children: /* @__PURE__ */ jsx(Input, {
													type: "date",
													className: "h-9 rounded-[9px] border-[#d9dee8] text-[13px]",
													...form.register("startDate")
												})
											}),
											/* @__PURE__ */ jsx(Field, {
												label: "Completed Date",
												error: e.completedDate?.message,
												hint: "When the build was finished",
												children: /* @__PURE__ */ jsx(Input, {
													type: "date",
													className: "h-9 rounded-[9px] border-[#d9dee8] text-[13px]",
													...form.register("completedDate")
												})
											}),
											/* @__PURE__ */ jsx(Field, {
												label: "Hosted Date",
												error: e.hostedDate?.message,
												hint: "Billing anchor date",
												children: /* @__PURE__ */ jsx(Input, {
													type: "date",
													className: "h-9 rounded-[9px] border-[#d9dee8] text-[13px]",
													...form.register("hostedDate")
												})
											})
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mb-3.5 rounded-[10px] border border-[#dbe4ff] bg-[#f5f7ff] px-3 py-2.5 text-[12px] leading-snug text-[#41506b]",
										children: "Hosted Date decides every future due date. Monthly billing repeats on this date each month."
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mb-3.5 grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ jsx(CycleCard, {
											active: billingCycle === "monthly",
											label: "Monthly",
											sub: "Same day every month",
											onClick: () => form.setValue("billingCycle", "monthly", { shouldDirty: true })
										}), /* @__PURE__ */ jsx(CycleCard, {
											active: billingCycle === "yearly",
											label: "Yearly",
											sub: "Same date every year",
											onClick: () => form.setValue("billingCycle", "yearly", { shouldDirty: true })
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-2 gap-3.5",
										children: [
											/* @__PURE__ */ jsx(Field, {
												label: "Maintenance Amount",
												error: e.maintenanceAmount?.message,
												children: /* @__PURE__ */ jsx(MoneyInput, {
													placeholder: "5000",
													...form.register("maintenanceAmount")
												})
											}),
											/* @__PURE__ */ jsx(Field, {
												label: "Remarks",
												error: e.remarks?.message,
												children: /* @__PURE__ */ jsx("textarea", {
													rows: 2,
													className: "w-full resize-none rounded-[9px] border border-[#d9dee8] bg-white px-3 py-2 text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#4f5df7] focus:shadow-[0_0_0_3px_rgba(79,93,247,.10)]",
													placeholder: "Internal notes...",
													...form.register("remarks")
												})
											}),
											isEdit && /* @__PURE__ */ jsxs(Fragment, { children: [
												/* @__PURE__ */ jsx(Field, {
													label: "Renewal Date",
													error: e.renewalDate?.message,
													children: /* @__PURE__ */ jsx(Input, {
														type: "date",
														className: "h-9 rounded-[9px] border-[#d9dee8] text-[13px]",
														...form.register("renewalDate")
													})
												}),
												/* @__PURE__ */ jsx(Field, {
													label: "Last Invoice Sent",
													error: e.lastInvoiceSent?.message,
													children: /* @__PURE__ */ jsx(Input, {
														type: "date",
														className: "h-9 rounded-[9px] border-[#d9dee8] text-[13px]",
														...form.register("lastInvoiceSent")
													})
												}),
												/* @__PURE__ */ jsx(Field, {
													label: "Last Payment Date",
													error: e.lastPaymentReceived?.message,
													children: /* @__PURE__ */ jsx(Input, {
														type: "date",
														className: "h-9 rounded-[9px] border-[#d9dee8] text-[13px]",
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
												})
											] })
										]
									}),
									dueDates.length > 0 && /* @__PURE__ */ jsxs("div", {
										className: "mt-3.5 rounded-[9px] border border-[#d9ddff] bg-[#eef0ff] px-3 py-2.5",
										children: [/* @__PURE__ */ jsx("p", {
											className: "mb-2 text-[11px] font-bold uppercase text-[#4f5df7]",
											children: "Auto due dates"
										}), /* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-1.5",
											children: dueDates.map((d) => /* @__PURE__ */ jsx("span", {
												className: "rounded-[6px] border border-[#d9ddff] bg-white px-2 py-0.5 text-[11.5px] font-bold text-[#4f5df7]",
												children: d
											}, d))
										})]
									})
								] }),
								step === 4 && /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-2 gap-3",
										children: [
											/* @__PURE__ */ jsx(ReviewBox, {
												title: "Basics",
												rows: [
													["Client", clientOptions.find((c) => String(c.id) === vals.clientId)?.name || vals.clientId || "—"],
													["Project", vals.projectName || "—"],
													["Build Type", vals.buildType || "—"],
													["Hosting Provider", vals.hostingProvider || "—"]
												]
											}),
											/* @__PURE__ */ jsx(ReviewBox, {
												title: "Domain & Cost",
												rows: [
													["Domain Handling", vals.domainHandledBy === "our_side" ? "Our side" : vals.domainHandledBy === "client_side" ? "Client side" : "—"],
													["Domain", vals.domainName || "Not added"],
													["Domain Cost", vals.domainHandledBy === "our_side" ? vals.domainCost ? fmt(vals.domainCost) + " / yr" : "—" : "Not deducted"],
													["Hosting Cost", vals.hostingCost ? fmt(vals.hostingCost) + " / yr" : "—"]
												]
											}),
											/* @__PURE__ */ jsx(ReviewBox, {
												title: "Dates & Billing",
												rows: [
													["Start Date", vals.startDate || "—"],
													["Hosted Date", vals.hostedDate || "Not set"],
													["Billing Cycle", vals.billingCycle === "monthly" ? "Monthly" : vals.billingCycle === "yearly" ? "Yearly" : "—"],
													["Maintenance", vals.maintenanceAmount ? fmt(vals.maintenanceAmount) + (vals.billingCycle === "yearly" ? " / yr" : " / mo") : "—"]
												]
											}),
											/* @__PURE__ */ jsx(ReviewBox, {
												title: "System Result",
												rows: [
													["Billing Records", vals.hostedDate ? "Auto generated" : "Requires hosted date"],
													["Domain Tracking", vals.domainName ? "Enabled" : "Not set"],
													["Hosting Tracking", vals.hostingCost ? "Enabled" : "Not set"],
													["Profit Rule", vals.domainHandledBy === "our_side" ? "Costs deducted" : vals.domainHandledBy === "client_side" ? "Hosting only" : "—"]
												]
											})
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-3 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2.5 text-[12.5px] leading-snug text-[#14532d]",
										children: "After saving, Sitely creates the website and generates billing records from the hosted date."
									}),
									mutation.isError && !Object.keys(mutation.error?.fieldErrors ?? {}).length && /* @__PURE__ */ jsx("p", {
										className: "mt-2 text-[12.5px] font-semibold text-[#DC2626]",
										children: mutation.error.message
									})
								] })
							]
						})]
					}), /* @__PURE__ */ jsx(SummaryPanel, {
						v: vals,
						clientOptions
					})]
				}),
				/* @__PURE__ */ jsxs("footer", {
					className: "flex shrink-0 items-center justify-between rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-3",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-[13px] font-bold text-[#64748b]",
						children: [
							"Step ",
							step,
							" of 4"
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2.5",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							disabled: step === 1,
							onClick: () => setStep(step - 1),
							className: "inline-flex h-[34px] items-center rounded-[9px] border border-[#e5e7eb] bg-white px-4 text-[12.5px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-40",
							children: "Back"
						}), step < 4 ? /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: advance,
							className: "inline-flex h-[34px] items-center gap-1.5 rounded-[9px] bg-[#4f5df7] px-4 text-[12.5px] font-bold text-white transition hover:bg-[#3f4de0]",
							children: ["Continue ", /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" })]
						}) : /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: submit,
							disabled: mutation.isPending,
							className: "inline-flex h-[34px] items-center rounded-[9px] bg-[#16a34a] px-4 text-[12.5px] font-bold text-white transition hover:bg-[#15803d] disabled:opacity-50",
							children: mutation.isPending ? isEdit ? "Updating…" : "Creating…" : isEdit ? "Update Website" : "Create Website"
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
export { WebsiteWizard as t };
