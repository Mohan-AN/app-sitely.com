import { t as cn } from "./utils-CR4dV3c0.js";
import { t as Button } from "./button-N4VO-qD6.js";
import { a as useImportPreview, i as useImportConfirm } from "./use-websites-BnWcvb5r.js";
import { useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Check, CheckCircle2, ChevronRight, CloudUpload, Download, Info, Loader2, MoreHorizontal, Upload } from "lucide-react";
//#region src/components/websites/import-config.ts
var IMPORT_TYPE_META = {
	websites: {
		label: "Websites",
		description: "Import website records with client info, domain, hosting and billing details."
	},
	paymentHistory: {
		label: "Payment History",
		description: "Import historical billing payment records linked to existing websites."
	},
	rateHistory: {
		label: "Rate History",
		description: "Import maintenance rate change history linked to existing websites."
	}
};
var IMPORT_COLUMNS = {
	websites: [
		{
			key: "client_name",
			label: "Client Name",
			required: true,
			type: "text",
			width: 140
		},
		{
			key: "project_name",
			label: "Project Name",
			required: true,
			type: "text",
			width: 140
		},
		{
			key: "site_type",
			label: "Site Type",
			required: true,
			type: "enum",
			enumValues: ["static", "wordpress"],
			width: 100
		},
		{
			key: "platform",
			label: "Platform",
			required: true,
			type: "enum",
			enumValues: ["netlify", "wpx"],
			width: 90
		},
		{
			key: "company",
			label: "Company",
			required: false,
			type: "text",
			width: 130
		},
		{
			key: "phone",
			label: "Phone",
			required: false,
			type: "text",
			width: 110
		},
		{
			key: "email",
			label: "Email",
			required: false,
			type: "email",
			width: 160
		},
		{
			key: "city",
			label: "City",
			required: false,
			type: "text",
			width: 90
		},
		{
			key: "url",
			label: "URL",
			required: false,
			type: "url",
			width: 180
		},
		{
			key: "website_status",
			label: "Website Status",
			required: false,
			type: "enum",
			enumValues: [
				"In Progress",
				"Live",
				"On Hold",
				"Completed",
				"Discontinued"
			],
			width: 130
		},
		{
			key: "maintenance_status",
			label: "Maint. Status",
			required: false,
			type: "enum",
			enumValues: [
				"Not Started",
				"Active",
				"Paused",
				"Overdue",
				"Cancelled"
			],
			width: 120
		},
		{
			key: "start_date",
			label: "Start Date",
			required: false,
			type: "date",
			width: 110
		},
		{
			key: "completed_date",
			label: "Completed Date",
			required: false,
			type: "date",
			width: 125
		},
		{
			key: "hosted_date",
			label: "Hosted Date",
			required: false,
			type: "date",
			width: 110
		},
		{
			key: "build_type",
			label: "Build Type",
			required: false,
			type: "text",
			width: 115
		},
		{
			key: "build_cost",
			label: "Build Cost",
			required: false,
			type: "number",
			width: 100
		},
		{
			key: "hosting_provider",
			label: "Hosting Provider",
			required: false,
			type: "text",
			width: 130
		},
		{
			key: "hosting_cost",
			label: "Hosting Cost",
			required: false,
			type: "number",
			width: 100
		},
		{
			key: "hosting_renewal_date",
			label: "Hosting Renewal",
			required: false,
			type: "date",
			width: 130
		},
		{
			key: "domain_name",
			label: "Domain Name",
			required: false,
			type: "text",
			width: 140
		},
		{
			key: "domain_handled_by",
			label: "Domain By",
			required: false,
			type: "enum",
			enumValues: ["our_side", "client_side"],
			width: 115
		},
		{
			key: "domain_provider",
			label: "Domain Provider",
			required: false,
			type: "text",
			width: 130
		},
		{
			key: "domain_renewal_date",
			label: "Domain Renewal",
			required: false,
			type: "date",
			width: 125
		},
		{
			key: "domain_cost",
			label: "Domain Cost",
			required: false,
			type: "number",
			width: 100
		},
		{
			key: "maintenance_amount",
			label: "Maint. Amount",
			required: false,
			type: "number",
			width: 115
		},
		{
			key: "billing_cycle",
			label: "Billing Cycle",
			required: false,
			type: "enum",
			enumValues: ["monthly", "yearly"],
			width: 110
		},
		{
			key: "remarks",
			label: "Remarks",
			required: false,
			type: "text",
			width: 160
		}
	],
	paymentHistory: [
		{
			key: "project_name",
			label: "Project Name",
			required: true,
			type: "text",
			width: 150
		},
		{
			key: "period_label",
			label: "Period Label",
			required: true,
			type: "text",
			width: 130
		},
		{
			key: "period_start",
			label: "Period Start",
			required: true,
			type: "date",
			width: 110
		},
		{
			key: "period_end",
			label: "Period End",
			required: true,
			type: "date",
			width: 110
		},
		{
			key: "amount",
			label: "Amount",
			required: true,
			type: "number",
			width: 90
		},
		{
			key: "due_date",
			label: "Due Date",
			required: true,
			type: "date",
			width: 110
		},
		{
			key: "status",
			label: "Status",
			required: true,
			type: "enum",
			enumValues: [
				"pending",
				"invoiced",
				"paid",
				"overdue"
			],
			width: 100
		},
		{
			key: "invoice_sent_date",
			label: "Invoice Sent",
			required: false,
			type: "date",
			width: 115
		},
		{
			key: "payment_received_date",
			label: "Payment Date",
			required: false,
			type: "date",
			width: 115
		},
		{
			key: "days_delayed",
			label: "Days Delayed",
			required: false,
			type: "number",
			width: 110
		},
		{
			key: "payment_mode",
			label: "Payment Mode",
			required: false,
			type: "text",
			width: 115
		},
		{
			key: "transaction_reference",
			label: "Txn Ref",
			required: false,
			type: "text",
			width: 130
		},
		{
			key: "invoice_file_url",
			label: "Invoice URL",
			required: false,
			type: "url",
			width: 160
		},
		{
			key: "invoice_file_name",
			label: "Invoice File",
			required: false,
			type: "text",
			width: 130
		},
		{
			key: "remarks",
			label: "Remarks",
			required: false,
			type: "text",
			width: 160
		}
	],
	rateHistory: [
		{
			key: "project_name",
			label: "Project Name",
			required: true,
			type: "text",
			width: 170
		},
		{
			key: "old_rate",
			label: "Old Rate",
			required: true,
			type: "number",
			width: 110
		},
		{
			key: "new_rate",
			label: "New Rate",
			required: true,
			type: "number",
			width: 110
		},
		{
			key: "effective_date",
			label: "Effective Date",
			required: true,
			type: "date",
			width: 130
		},
		{
			key: "remarks",
			label: "Remarks",
			required: false,
			type: "text",
			width: 220
		}
	]
};
var SAMPLE_ROWS = {
	websites: {
		client_name: "John Doe",
		company: "Acme Corp",
		phone: "9876543210",
		email: "john@example.com",
		city: "Mumbai",
		project_name: "My Website",
		url: "https://mywebsite.com",
		site_type: "static",
		platform: "netlify",
		website_status: "In Progress",
		maintenance_status: "Not Started",
		start_date: "2024-01-01",
		completed_date: "2024-03-01",
		hosted_date: "2024-03-15",
		build_type: "React Static",
		build_cost: "25000",
		hosting_provider: "Netlify",
		hosting_cost: "3000",
		hosting_renewal_date: "2025-03-15",
		domain_name: "mywebsite.com",
		domain_handled_by: "our_side",
		domain_provider: "GoDaddy",
		domain_renewal_date: "2025-12-31",
		domain_cost: "1200",
		maintenance_amount: "5000",
		billing_cycle: "monthly",
		remarks: "Migrated from old server"
	},
	paymentHistory: {
		project_name: "My Website",
		period_label: "January 2024",
		period_start: "2024-01-01",
		period_end: "2024-01-31",
		amount: "5000",
		due_date: "2024-01-15",
		status: "paid",
		invoice_sent_date: "2024-01-10",
		payment_received_date: "2024-01-14",
		days_delayed: "0",
		payment_mode: "UPI",
		transaction_reference: "TXN123456",
		invoice_file_url: "",
		invoice_file_name: "Invoice-Jan.pdf",
		remarks: ""
	},
	rateHistory: {
		project_name: "My Website",
		old_rate: "5000",
		new_rate: "6000",
		effective_date: "2024-06-01",
		remarks: "Annual rate increase"
	}
};
function downloadTemplate(type) {
	const cols = IMPORT_COLUMNS[type];
	const sample = SAMPLE_ROWS[type];
	const csv = `${cols.map((c) => c.key).join(",")}\n${cols.map((c) => {
		const v = sample[c.key] ?? "";
		return v.includes(",") ? `"${v}"` : v;
	}).join(",")}`;
	const blob = new Blob([csv], { type: "text/csv" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${type}_import_template.csv`;
	a.click();
	URL.revokeObjectURL(url);
}
//#endregion
//#region src/components/websites/import-page.tsx
function toCamel(s) {
	return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function convertRow(row) {
	return Object.fromEntries(Object.entries(row).map(([k, v]) => [toCamel(k), v]));
}
function splitCsvLine(line) {
	const result = [];
	let cur = "";
	let inQ = false;
	for (const ch of line) if (ch === "\"") inQ = !inQ;
	else if (ch === "," && !inQ) {
		result.push(cur);
		cur = "";
	} else cur += ch;
	result.push(cur);
	return result;
}
function parseCsvText(text) {
	const lines = text.trim().split(/\r?\n/);
	if (lines.length < 2) return [];
	const headers = splitCsvLine(lines[0]).map((h) => h.trim());
	return lines.slice(1).filter((l) => l.trim()).map((line) => {
		const vals = splitCsvLine(line);
		const row = {};
		headers.forEach((h, i) => {
			row[h] = vals[i]?.trim() ?? "";
		});
		return row;
	});
}
function isValidationFailure(data) {
	return typeof data === "object" && data !== null && "errors" in data && Array.isArray(data.errors);
}
function Dash() {
	return /* @__PURE__ */ jsx("span", {
		className: "text-[#D1D5DB]",
		children: "—"
	});
}
function RawPill({ val }) {
	if (!val) return /* @__PURE__ */ jsx(Dash, {});
	return /* @__PURE__ */ jsx("span", {
		className: "rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-medium text-[#374151]",
		children: val
	});
}
function TypeTab({ label, active, onClick }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick,
		className: cn("border-b-2 px-5 py-3 text-[13px] font-semibold transition", active ? "border-[#4F5DF5] text-[#4F5DF5]" : "border-transparent text-[#6B7280] hover:text-[#374151]"),
		children: label
	});
}
function ImportPage() {
	const navigate = useNavigate();
	const fileRef = useRef(null);
	const [dragOver, setDragOver] = useState(false);
	const [step, setStep] = useState("upload");
	const [importType, setImportType] = useState("websites");
	const [pendingFile, setPendingFile] = useState(null);
	const [backendRows, setBackendRows] = useState([]);
	const [backendErrors, setBackendErrors] = useState({});
	const [totalCount, setTotalCount] = useState(0);
	const [failedCount, setFailedCount] = useState(0);
	const [previewItems, setPreviewItems] = useState([]);
	const [, setDoneResult] = useState(null);
	const [skipDuplicates, setSkipDuplicates] = useState(false);
	const [editingCell, setEditingCell] = useState(null);
	const [fixedRows, setFixedRows] = useState(null);
	const [parsedRows, setParsedRows] = useState([]);
	const previewMutation = useImportPreview();
	const confirmMutation = useImportConfirm();
	const columns = IMPORT_COLUMNS[importType];
	function switchType(t) {
		setImportType(t);
		setStep("upload");
		setPendingFile(null);
		setBackendRows([]);
		setBackendErrors({});
		setPreviewItems([]);
		setTotalCount(0);
		setFailedCount(0);
		setFixedRows(null);
		setParsedRows([]);
		previewMutation.reset();
		confirmMutation.reset();
	}
	function handleFile(f) {
		setPendingFile(f);
		previewMutation.reset();
	}
	async function handlePreviewData() {
		if (!pendingFile) return;
		const fd = new FormData();
		const fieldName = importType === "paymentHistory" ? "paymentHistory" : importType === "rateHistory" ? "rateHistory" : "websites";
		fd.append(fieldName, pendingFile);
		try {
			setParsedRows(parseCsvText(await pendingFile.text()));
		} catch {}
		try {
			applyPreviewResponse(await previewMutation.mutateAsync(fd));
		} catch {}
	}
	function applyPreviewResponse(data) {
		if (isValidationFailure(data)) {
			setBackendRows(data.errors.map((e) => e.row));
			const errMap = {};
			data.errors.forEach((e, idx) => {
				errMap[idx] = e.errors;
			});
			setBackendErrors(errMap);
			setTotalCount(data.total);
			setFailedCount(data.failed);
			setPreviewItems([]);
			setStep("preview");
		} else if (Array.isArray(data)) {
			setPreviewItems(data);
			setBackendRows([]);
			setBackendErrors({});
			setTotalCount(data.length);
			setFailedCount(0);
			setStep("preview");
		} else toast.error("Unexpected response from server.");
	}
	function handleCellChange(rowIdx, key, value) {
		setBackendRows((prev) => {
			const next = [...prev];
			next[rowIdx] = {
				...next[rowIdx],
				[key]: value
			};
			return next;
		});
		setBackendErrors((prev) => {
			const rowErrs = { ...prev[rowIdx] ?? {} };
			delete rowErrs[key];
			return {
				...prev,
				[rowIdx]: rowErrs
			};
		});
	}
	async function handleRevalidate() {
		const camelRows = backendRows.map(convertRow);
		const payload = importType === "paymentHistory" ? { paymentHistory: camelRows } : importType === "rateHistory" ? { rateHistory: camelRows } : { websites: camelRows };
		try {
			const data = await previewMutation.mutateAsync(payload);
			if (!isValidationFailure(data)) setFixedRows(camelRows);
			else setFixedRows(null);
			applyPreviewResponse(data);
		} catch {}
	}
	async function handleConfirm() {
		const fieldName = importType === "paymentHistory" ? "paymentHistory" : importType === "rateHistory" ? "rateHistory" : "websites";
		let payload;
		if (fixedRows && fixedRows.length > 0) payload = {
			[fieldName]: fixedRows,
			skipDuplicates
		};
		else if (backendRows.length > 0) payload = {
			[fieldName]: backendRows.map(convertRow),
			skipDuplicates
		};
		else if (pendingFile) {
			const fd = new FormData();
			fd.append(fieldName, pendingFile);
			if (skipDuplicates) fd.append("skipDuplicates", "true");
			payload = fd;
		} else {
			toast.error("No data to import.");
			return;
		}
		try {
			const result = await confirmMutation.mutateAsync(payload);
			setDoneResult(result);
			const parts = [
				result.clients_created && `${result.clients_created} client${result.clients_created !== 1 ? "s" : ""}`,
				result.websites_created && `${result.websites_created} website${result.websites_created !== 1 ? "s" : ""}`,
				result.billing_imported && `${result.billing_imported} billing record${result.billing_imported !== 1 ? "s" : ""}`,
				result.rate_history_imported && `${result.rate_history_imported} rate entr${result.rate_history_imported !== 1 ? "ies" : "y"}`
			].filter(Boolean).join(", ");
			toast.success(`Import complete — ${parts || "no new records"} imported.`);
			navigate({
				to: "/",
				search: {
					page: 1,
					limit: 15,
					showFilters: false
				}
			});
		} catch {}
	}
	const hasErrors = Object.values(backendErrors).some((e) => Object.keys(e).length > 0);
	const validCount = totalCount - failedCount;
	if (step === "upload") return /* @__PURE__ */ jsxs("main", {
		className: "flex h-full flex-col overflow-hidden bg-[#F4F5F8]",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex h-16 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-[13px]",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							search: {
								page: 1,
								limit: 15,
								showFilters: false
							},
							className: "text-[#6B7280] transition hover:text-[#374151]",
							children: "Websites"
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5 text-[#D1D5DB]" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-bold text-[#111827]",
							children: "Import Data"
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => downloadTemplate(importType),
						className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#4F5DF5] px-4 text-[12.5px] font-semibold text-[#4F5DF5] transition hover:bg-[#EEEFFE]",
						children: [/* @__PURE__ */ jsx(Download, { className: "size-3.5" }), " Download Template"]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "inline-flex size-9 items-center justify-center rounded-[9px] border border-[#E5E7EB] text-[#6B7280] transition hover:bg-[#F9FAFB]",
						children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex shrink-0 border-b border-[#E5E7EB] bg-white px-6",
				children: Object.keys(IMPORT_TYPE_META).map((t) => /* @__PURE__ */ jsx(TypeTab, {
					label: IMPORT_TYPE_META[t].label,
					active: importType === t,
					onClick: () => switchType(t)
				}, t))
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "shrink-0 px-6 pt-4 pb-3",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "text-[20px] font-bold text-[#111827]",
					children: importType === "websites" ? "Import Websites" : importType === "paymentHistory" ? "Import Payment History" : "Import Rate History"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 text-[12.5px] text-[#6B7280]",
					children: IMPORT_TYPE_META[importType].description
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-h-0 flex-1 gap-5 overflow-hidden px-6 pb-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex w-[360px] shrink-0 flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "px-5 py-4",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "flex size-7 shrink-0 items-center justify-center rounded-full bg-[#4F5DF5] text-[12px] font-bold text-white",
									children: "1"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ jsx("p", {
											className: "text-[13.5px] font-bold text-[#111827]",
											children: "Download Template"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-0.5 text-[12px] leading-relaxed text-[#6B7280]",
											children: "Download our CSV template and fill in your data."
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => downloadTemplate(importType),
											className: "mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-[#4F5DF5] px-3.5 text-[12px] font-semibold text-[#4F5DF5] transition hover:bg-[#EEEFFE]",
											children: [/* @__PURE__ */ jsx(Download, { className: "size-3.5" }), " Download CSV Template"]
										})
									]
								})]
							})
						}),
						/* @__PURE__ */ jsx("div", { className: "mx-5 border-t border-[#F0F1F3]" }),
						/* @__PURE__ */ jsx("div", {
							className: "px-5 py-4",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "flex size-7 shrink-0 items-center justify-center rounded-full bg-[#4F5DF5] text-[12px] font-bold text-white",
									children: "2"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ jsx("p", {
											className: "text-[13.5px] font-bold text-[#111827]",
											children: "Required Fields"
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-0.5 mb-2.5 text-[12px] leading-relaxed text-[#6B7280]",
											children: "These fields are mandatory in your CSV file."
										}),
										/* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-1.5",
											children: columns.filter((c) => c.required).map((c) => /* @__PURE__ */ jsx("span", {
												className: "rounded-[6px] bg-[#FEF2F2] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#DC2626]",
												children: c.label
											}, c.key))
										})
									]
								})]
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mx-5 mb-4 mt-1 rounded-[10px] bg-[#EFF6FF] p-3.5",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ jsx(Info, { className: "mt-0.5 size-4 shrink-0 text-[#3B82F6]" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-[13px] font-bold text-[#3B82F6]",
									children: "How it works"
								}), /* @__PURE__ */ jsx("p", {
									className: "mt-0.5 text-[12px] leading-relaxed text-[#374151]",
									children: "Upload your CSV file. We'll validate the data and show you a preview before importing."
								})] })]
							})
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex min-h-0 flex-1 flex-col",
					children: /* @__PURE__ */ jsx("div", {
						className: cn("flex flex-1 flex-col items-center justify-center rounded-[14px] border-[1.5px] border-dashed bg-white transition", dragOver ? "border-[#4F5DF5] bg-[#F5F6FF]" : "border-[#D1D5DB]"),
						onDragOver: (e) => {
							e.preventDefault();
							setDragOver(true);
						},
						onDragLeave: () => setDragOver(false),
						onDrop: (e) => {
							e.preventDefault();
							setDragOver(false);
							const f = e.dataTransfer.files[0];
							if (f) handleFile(f);
						},
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center gap-4 p-10 text-center",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "flex size-[60px] items-center justify-center rounded-full bg-[#F3F4F6]",
									children: /* @__PURE__ */ jsx(CloudUpload, { className: "size-7 text-[#9CA3AF]" })
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
									className: "text-[17px] font-bold text-[#111827]",
									children: "Upload CSV File"
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1.5 text-[13px] text-[#6B7280]",
									children: [
										"Drag and drop your CSV file here",
										/* @__PURE__ */ jsx("br", {}),
										"or click the button below to browse"
									]
								})] }),
								/* @__PURE__ */ jsx("input", {
									ref: fileRef,
									type: "file",
									accept: ".csv,text/csv",
									className: "hidden",
									onChange: (e) => {
										const f = e.target.files?.[0];
										if (f) handleFile(f);
										e.target.value = "";
									}
								}),
								pendingFile ? /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-2.5",
									children: [
										/* @__PURE__ */ jsx(CheckCircle2, { className: "size-4 shrink-0 text-[#16A34A]" }),
										/* @__PURE__ */ jsxs("div", {
											className: "min-w-0 text-left",
											children: [/* @__PURE__ */ jsx("p", {
												className: "truncate text-[13px] font-semibold text-[#14532D]",
												children: pendingFile.name
											}), /* @__PURE__ */ jsx("p", {
												className: "text-[11.5px] text-[#16A34A]",
												children: "Ready to preview"
											})]
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => {
												setPendingFile(null);
												setTimeout(() => fileRef.current?.click(), 0);
											},
											className: "ml-2 text-[11px] font-semibold text-[#6B7280] underline hover:text-[#374151]",
											children: "Change"
										})
									]
								}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => fileRef.current?.click(),
									className: "inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#4F5DF5] px-8 text-[13.5px] font-semibold text-white transition hover:bg-[#3F4DE0]",
									children: [/* @__PURE__ */ jsx(Upload, { className: "size-4" }), " Choose CSV File"]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[12px] text-[#C4C9D4]",
									children: ".csv files only"
								})] }),
								previewMutation.isError && /* @__PURE__ */ jsx("p", {
									className: "text-[12px] font-semibold text-[#DC2626]",
									children: previewMutation.error.message
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex shrink-0 items-center justify-between border-t border-[#E5E7EB] bg-white px-6 py-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ jsx(Info, { className: "size-4 shrink-0 text-[#4F5DF5]" }), /* @__PURE__ */ jsx("p", {
						className: "text-[13px] text-[#6B7280]",
						children: "You will be able to review and confirm the data before it's imported."
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					disabled: !pendingFile || previewMutation.isPending,
					onClick: handlePreviewData,
					className: cn("inline-flex h-9 items-center gap-1.5 rounded-[9px] px-4 text-[12.5px] font-semibold transition", pendingFile && !previewMutation.isPending ? "bg-[#4F5DF5] text-white hover:bg-[#3F4DE0]" : "cursor-not-allowed bg-[#E5E7EB] text-[#9CA3AF]"),
					children: previewMutation.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }), " Validating…"] }) : /* @__PURE__ */ jsxs(Fragment, { children: ["Preview Data ", /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" })] })
				})]
			})
		]
	});
	if (step === "preview" && previewItems.length > 0) return /* @__PURE__ */ jsxs("div", {
		className: "flex h-full flex-col bg-[#F4F5F8]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setStep("upload"),
						className: "flex size-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]",
						children: /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
						className: "text-[15px] font-semibold text-[#11141A]",
						children: ["Preview — ", IMPORT_TYPE_META[importType].label]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[12px] text-[#6B7280]",
						children: pendingFile?.name
					})] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsxs("label", {
						className: "flex cursor-pointer items-center gap-2 text-[12.5px] text-[#6B7280]",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: skipDuplicates,
							onChange: (e) => setSkipDuplicates(e.target.checked),
							className: "accent-[#4F5DF5]"
						}), "Skip duplicates"]
					}), /* @__PURE__ */ jsxs(Button, {
						onClick: handleConfirm,
						disabled: confirmMutation.isPending,
						className: "gap-1.5",
						children: [/* @__PURE__ */ jsx(Check, { className: "size-3.5" }), confirmMutation.isPending ? "Importing…" : "Confirm Import"]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "m-6 rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-3 text-[13px] text-[#166534]",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "font-semibold",
					children: [
						previewItems.length,
						" row",
						previewItems.length !== 1 ? "s" : ""
					]
				}), " validated successfully. Review below before confirming."]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-auto px-6 pb-6",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-auto rounded-xl border border-[#E5E7EB] bg-white",
					children: /* @__PURE__ */ jsxs("table", {
						className: "min-w-max text-[12px]",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-[#F7F8FA]",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "sticky left-0 z-10 bg-[#F7F8FA] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
									children: "#"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
									children: "Import Status"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
									children: "Project"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
									children: "Client"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
									children: "Client Type"
								}),
								importType === "websites" && /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "URL"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Site Type"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Platform"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Website Status"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Maint. Status"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Maint. Amount"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Billing Cycle"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Domain"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Domain By"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Domain Provider"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Domain Renewal"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Domain Cost"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Hosting Provider"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Hosting Cost"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Hosting Renewal"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Build Type"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Build Cost"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Start Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Hosted Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Remarks"
									})
								] }),
								importType === "paymentHistory" && /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Period"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Amount"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Due Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Pay Status"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Payment Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Mode"
									})
								] }),
								importType === "rateHistory" && /* @__PURE__ */ jsxs(Fragment, { children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Old Rate"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "New Rate"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Effective Date"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
										children: "Remarks"
									})
								] })
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-[#F0F0F0]",
							children: previewItems.map((item, i) => {
								const raw = parsedRows[i] ?? {};
								const isDupe = !!item.duplicate_website;
								return /* @__PURE__ */ jsxs("tr", {
									className: cn("hover:bg-[#F7F8FA]", isDupe && "bg-[#FFFCF4]"),
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "sticky left-0 bg-inherit px-3 py-2 text-[#A0A5AF]",
											children: i + 1
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2",
											children: isDupe ? /* @__PURE__ */ jsx("span", {
												className: "rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-medium text-[#92400E]",
												children: "Duplicate"
											}) : /* @__PURE__ */ jsx("span", {
												className: "rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-medium text-[#166534]",
												children: "New"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2 font-medium text-[#11141A] whitespace-nowrap",
											children: item.project_name
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2 whitespace-nowrap text-[#374151]",
											children: item.client.name
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-3 py-2",
											children: item.client.mode === "create" ? /* @__PURE__ */ jsx("span", {
												className: "rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-medium text-[#3B82F6]",
												children: "New Client"
											}) : /* @__PURE__ */ jsx("span", {
												className: "rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-medium text-[#6B7280]",
												children: "Existing"
											})
										}),
										importType === "websites" && /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] max-w-[160px] truncate",
												children: raw.url || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.site_type || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.platform || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 whitespace-nowrap",
												children: /* @__PURE__ */ jsx(RawPill, { val: raw.website_status })
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 whitespace-nowrap",
												children: /* @__PURE__ */ jsx(RawPill, { val: raw.maintenance_status })
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.maintenance_amount ? `₹${raw.maintenance_amount}` : /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] capitalize whitespace-nowrap",
												children: raw.billing_cycle || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.domain_name || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.domain_handled_by ? raw.domain_handled_by.replace("_", " ") : /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.domain_provider || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.domain_renewal_date || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.domain_cost ? `₹${raw.domain_cost}` : /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.hosting_provider || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.hosting_cost ? `₹${raw.hosting_cost}` : /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.hosting_renewal_date || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.build_type || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.build_cost ? `₹${raw.build_cost}` : /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.start_date || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.hosted_date || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] max-w-[160px] truncate",
												children: raw.remarks || /* @__PURE__ */ jsx(Dash, {})
											})
										] }),
										importType === "paymentHistory" && /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.period_label || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.amount ? `₹${raw.amount}` : /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.due_date || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 whitespace-nowrap",
												children: /* @__PURE__ */ jsx(RawPill, { val: raw.status })
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.payment_received_date || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.payment_mode || /* @__PURE__ */ jsx(Dash, {})
											})
										] }),
										importType === "rateHistory" && /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.old_rate ? `₹${raw.old_rate}` : /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.new_rate ? `₹${raw.new_rate}` : /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] whitespace-nowrap",
												children: raw.effective_date || /* @__PURE__ */ jsx(Dash, {})
											}),
											/* @__PURE__ */ jsx("td", {
												className: "px-3 py-2 text-[#374151] max-w-[160px] truncate",
												children: raw.remarks || /* @__PURE__ */ jsx(Dash, {})
											})
										] })
									]
								}, i);
							})
						})]
					})
				})
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-full flex-col bg-[#F4F5F8]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setStep("upload"),
						className: "flex size-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]",
						children: /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
						className: "text-[15px] font-semibold text-[#11141A]",
						children: ["Fix Errors — ", IMPORT_TYPE_META[importType].label]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[12px] text-[#6B7280]",
						children: pendingFile?.name
					})] })]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-3",
					children: hasErrors ? /* @__PURE__ */ jsx(Button, {
						variant: "outline",
						size: "sm",
						onClick: handleRevalidate,
						disabled: previewMutation.isPending,
						children: previewMutation.isPending ? "Validating…" : "Re-validate"
					}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("label", {
						className: "flex cursor-pointer items-center gap-2 text-[12.5px] text-[#6B7280]",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: skipDuplicates,
							onChange: (e) => setSkipDuplicates(e.target.checked),
							className: "accent-[#4F5DF5]"
						}), "Skip duplicates"]
					}), /* @__PURE__ */ jsxs(Button, {
						onClick: handleConfirm,
						disabled: confirmMutation.isPending,
						className: "gap-1.5",
						children: [/* @__PURE__ */ jsx(Check, { className: "size-3.5" }), confirmMutation.isPending ? "Importing…" : "Confirm Import"]
					})] })
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-6 mt-4 flex items-start gap-3 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] px-4 py-3",
				children: [/* @__PURE__ */ jsx(AlertCircle, { className: "mt-0.5 size-4 shrink-0 text-[#DC2626]" }), /* @__PURE__ */ jsxs("p", {
					className: "text-[12.5px] text-[#7F1D1D]",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "font-semibold",
							children: [
								failedCount,
								" row",
								failedCount !== 1 ? "s" : "",
								" failed validation"
							]
						}),
						validCount > 0 && /* @__PURE__ */ jsxs("span", {
							className: "ml-2 font-medium text-[#166534]",
							children: [
								"· ",
								validCount,
								" valid"
							]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "ml-2 text-[#6B7280]",
							children: [
								"· ",
								totalCount,
								" total"
							]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "ml-2",
							children: "Fix the highlighted cells then click Re-validate."
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-auto p-6 pt-4",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-auto rounded-xl border border-[#E5E7EB] bg-white",
					children: /* @__PURE__ */ jsxs("table", {
						className: "min-w-max text-[12px]",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-[#F7F8FA]",
							children: /* @__PURE__ */ jsxs("tr", { children: [/* @__PURE__ */ jsx("th", {
								className: "sticky left-0 z-10 bg-[#F7F8FA] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
								children: "#"
							}), columns.map((col) => /* @__PURE__ */ jsxs("th", {
								style: { minWidth: col.width },
								className: "whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]",
								children: [col.label, col.required && /* @__PURE__ */ jsx("span", {
									className: "ml-0.5 text-[#DC2626]",
									children: "*"
								})]
							}, col.key))] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-[#F0F0F0]",
							children: backendRows.map((row, rowIdx) => {
								const rowErrors = backendErrors[rowIdx] ?? {};
								return /* @__PURE__ */ jsxs("tr", {
									className: cn(Object.keys(rowErrors).length > 0 ? "bg-[#FFF8F8]" : "hover:bg-[#F7F8FA]"),
									children: [/* @__PURE__ */ jsx("td", {
										className: "sticky left-0 z-10 bg-inherit px-3 py-2 text-[#A0A5AF]",
										children: rowIdx + 1
									}), columns.map((col) => {
										const val = row[col.key] ?? "";
										const err = rowErrors[col.key];
										const isEdit = editingCell?.row === rowIdx && editingCell.key === col.key;
										return /* @__PURE__ */ jsx("td", {
											className: cn("px-2 py-1", err ? "bg-[#FEE2E2]" : ""),
											children: isEdit ? /* @__PURE__ */ jsx("input", {
												autoFocus: true,
												type: "text",
												defaultValue: val,
												onBlur: (e) => {
													handleCellChange(rowIdx, col.key, e.target.value);
													setEditingCell(null);
												},
												onKeyDown: (e) => {
													if (e.key === "Enter") {
														handleCellChange(rowIdx, col.key, e.currentTarget.value);
														setEditingCell(null);
													} else if (e.key === "Escape") setEditingCell(null);
												},
												className: "w-full min-w-[80px] rounded border border-[#4F5DF5] bg-white px-1.5 py-0.5 text-[12px] outline-none"
											}) : /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setEditingCell({
													row: rowIdx,
													key: col.key
												}),
												className: cn("block w-full rounded px-1.5 py-0.5 text-left hover:bg-[#F0F1FF]", err ? "text-[#DC2626]" : val ? "text-[#374151]" : "text-[#C5C8CF]"),
												children: err ? /* @__PURE__ */ jsxs("span", {
													className: "flex items-center gap-1",
													children: [/* @__PURE__ */ jsx(AlertCircle, { className: "size-3 shrink-0" }), /* @__PURE__ */ jsx("span", { children: val || "empty" })]
												}) : val || "—"
											}), err && /* @__PURE__ */ jsx("p", {
												className: "mt-0.5 px-1.5 text-[10.5px] text-[#DC2626]",
												children: err
											})] })
										}, col.key);
									})]
								}, rowIdx);
							})
						})]
					})
				})
			})
		]
	});
}
//#endregion
//#region src/routes/_protected/_websites/websites.import.tsx?tsr-split=component
var SplitComponent = ImportPage;
//#endregion
export { SplitComponent as component };
