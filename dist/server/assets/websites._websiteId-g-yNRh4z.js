import { t as cn } from "./utils-C3dXA-e9.js";
import { t as Route } from "./websites._websiteId-Bqvj-YCT.js";
import { t as Button } from "./button-BJN112tG.js";
import { t as Input } from "./input-B9pPcpqc.js";
import { a as useUpdateWebsite, c as useWebsiteTimeline, o as useWebsite, r as useCurrentBillingId } from "./use-websites-DxteJjR7.js";
import { t as ConfirmDialog } from "./confirm-dialog-1eeIX5QS.js";
import { t as Skeleton } from "./skeleton-i2ok8WNF.js";
import { n as formatDate, t as formatCurrency } from "./format-BiRzvK38.js";
import { i as RecordPaymentDialog, n as StatusPill, o as WebsiteEditDialog, r as AddRequestDialog, s as useRequests, t as MaintenanceBadge } from "./status-badges-1EejG6dj.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CalendarCheck2, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, XCircle } from "lucide-react";
//#region src/components/websites/website-detail.tsx
function WebsiteDetail({ website }) {
	const websiteId = String(website.id);
	const [year, setYear] = useState(website.hosted_date ? new Date(website.hosted_date).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear());
	const timelineQuery = useWebsiteTimeline(websiteId, year);
	const timeline = timelineQuery.data;
	const requestsQuery = useRequests(websiteId);
	const requests = requestsQuery.data?.items ?? [];
	return /* @__PURE__ */ jsxs("div", {
		className: "grid items-stretch gap-[20px] xl:grid-cols-[370px_1fr]",
		children: [/* @__PURE__ */ jsx("div", {
			className: "relative",
			children: /* @__PURE__ */ jsx(TimelineCard, {
				periods: timeline?.periods,
				isLoading: timelineQuery.isLoading,
				isError: timelineQuery.isError,
				isFetching: timelineQuery.isFetching,
				year,
				onYearChange: setYear
			})
		}), /* @__PURE__ */ jsxs("div", {
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
							label: "Hosting Type",
							value: website.hosting_type ?? "—"
						},
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
					requests,
					isLoading: requestsQuery.isLoading
				}),
				/* @__PURE__ */ jsx(RateHistorySection, { website }),
				/* @__PURE__ */ jsx(WorkflowActionsSection, { website })
			]
		})]
	});
}
function WebsiteDetailSkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-[20px] xl:grid-cols-[370px_1fr]",
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
function TimelineCard({ periods, isLoading, isError, isFetching, year, onYearChange }) {
	const headerLabel = periods?.length ? `${periods[0].period_label} — ${periods[periods.length - 1].period_label}` : String(year);
	const sortedPeriods = periods ? [...periods].sort((a, b) => periodSortKey(a) - periodSortKey(b)) : [];
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
						disabled: isFetching,
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
				}) : sortedPeriods.map((period) => /* @__PURE__ */ jsx(PeriodRow, { period }, period.period_key))
			})
		]
	});
}
function PeriodRow({ period }) {
	const hasData = (period.events?.length ?? 0) > 0;
	const [open, setOpen] = useState(hasData);
	const billing = period.billing;
	const { iconBg, iconContent, amtClr } = getBillingDisplay(billing?.status ?? "");
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-[#EEF0F2] last:border-b-0",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			className: "flex w-full items-center gap-[10px] px-[18px] py-[13px] transition hover:bg-[#FAFBFC]",
			children: [
				/* @__PURE__ */ jsx(ChevronRight, { className: cn("size-[14px] shrink-0 text-[#8A8F98] transition-transform", open && "rotate-90") }),
				/* @__PURE__ */ jsx("span", {
					className: cn("flex-1 text-left text-[13px] font-semibold", hasData ? "text-[#11141A]" : "text-[#94A3B8]"),
					children: period.period_label
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-[6px]",
					children: [/* @__PURE__ */ jsx("span", {
						className: cn("text-[12.5px]", amtClr),
						children: billing?.display_amount ?? "—"
					}), iconBg ? /* @__PURE__ */ jsx("span", {
						className: cn("flex size-[19px] items-center justify-center rounded-full text-[10px] font-bold text-white", iconBg),
						children: iconContent
					}) : null]
				})
			]
		}), open && hasData ? /* @__PURE__ */ jsx("div", {
			className: "pb-4 pl-[43px] pr-[18px] pt-0",
			children: period.events.map((ev, i) => /* @__PURE__ */ jsx(EventRow, { ev }, i))
		}) : null]
	});
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
function EventRow({ ev }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-start gap-[9px] py-[6px]",
		children: [/* @__PURE__ */ jsx("div", {
			className: cn("mt-[1px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-white", ICON_COLOR_MAP[ev.icon_color] ?? "bg-[#9CA3AF]"),
			children: ev.icon_text
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "text-[13.5px] font-semibold text-[#111827]",
					children: ev.title
				}),
				ev.subtitle ? /* @__PURE__ */ jsx("div", {
					className: "mt-[1px] text-[12px] text-[#9CA3AF]",
					children: ev.subtitle
				}) : null,
				ev.display_amount ? /* @__PURE__ */ jsx("div", {
					className: "mt-[2px] text-[11.5px] font-bold text-[#4F5DF5]",
					children: ev.display_amount
				}) : null
			]
		})]
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
function RequestsSection({ requests, isLoading }) {
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
	return /* @__PURE__ */ jsxs("div", {
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
			return /* @__PURE__ */ jsxs("div", {
				className: cn("flex items-center gap-[9px] py-[9px]", i < requests.length - 1 && "border-b border-[#EEF0F2]"),
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
	});
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
function WorkflowActionsSection({ website }) {
	const [markLiveOpen, setMarkLiveOpen] = useState(false);
	const [discontinueOpen, setDiscontinueOpen] = useState(false);
	const [liveUrl, setLiveUrl] = useState(website.url ?? "");
	const [liveHostedDate, setLiveHostedDate] = useState(website.hosted_date ?? "");
	const [liveRenewalDate, setLiveRenewalDate] = useState(website.current_billing_due_date ?? "");
	const updateMutation = useUpdateWebsite(String(website.id));
	const isInProgress = website.website_status === "In Progress";
	const isOnHold = website.website_status === "On Hold";
	const showMarkLive = isInProgress || isOnHold;
	const showDiscontinue = website.allowed_actions.includes("discontinue");
	const showTransfer = website.allowed_actions.includes("mark-transfer-completed");
	if (!showMarkLive && !showDiscontinue && !showTransfer) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-[#EEF0F2] p-[16px_18px]",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mb-3 text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]",
				children: "Actions"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-2",
				children: [
					showMarkLive ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(ActionBtn, {
						icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-4" }),
						label: "Mark as Live",
						disabled: updateMutation.isPending,
						onClick: () => setMarkLiveOpen((o) => !o)
					}), markLiveOpen ? /* @__PURE__ */ jsxs("div", {
						className: "mt-2 grid gap-3 rounded-[10px] border border-[#E5E7EB] bg-[#FAFBFC] p-4",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "grid gap-1 text-[12px] font-semibold text-[#5C6270]",
								children: [
									"URL ",
									/* @__PURE__ */ jsx("span", {
										className: "text-[#DC2626]",
										children: "*"
									}),
									/* @__PURE__ */ jsx(Input, {
										placeholder: "https://example.com",
										value: liveUrl,
										onChange: (e) => setLiveUrl(e.target.value),
										className: "h-9 rounded-[8px] border-[#E5E7EB] text-[12px]"
									})
								]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "grid gap-1 text-[12px] font-semibold text-[#5C6270]",
								children: [
									"Hosted Date ",
									/* @__PURE__ */ jsx("span", {
										className: "text-[#DC2626]",
										children: "*"
									}),
									/* @__PURE__ */ jsx(Input, {
										type: "date",
										value: liveHostedDate,
										onChange: (e) => setLiveHostedDate(e.target.value),
										className: "h-9 rounded-[8px] border-[#E5E7EB] text-[12px]"
									})
								]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "grid gap-1 text-[12px] font-semibold text-[#5C6270]",
								children: [
									"Renewal Date ",
									/* @__PURE__ */ jsx("span", {
										className: "text-[#DC2626]",
										children: "*"
									}),
									/* @__PURE__ */ jsx(Input, {
										type: "date",
										value: liveRenewalDate,
										onChange: (e) => setLiveRenewalDate(e.target.value),
										className: "h-9 rounded-[8px] border-[#E5E7EB] text-[12px]"
									})
								]
							}),
							/* @__PURE__ */ jsx(Button, {
								disabled: updateMutation.isPending || !liveUrl || !liveHostedDate || !liveRenewalDate,
								className: "h-9 rounded-[8px] bg-[#4F5DF5] text-[12.5px] text-white hover:bg-[#3F4DE0]",
								onClick: () => updateMutation.mutate({
									websiteStatus: "Live",
									maintenanceStatus: "Active",
									url: liveUrl,
									hostedDate: liveHostedDate,
									renewalDate: liveRenewalDate
								}),
								children: updateMutation.isPending ? "Saving…" : "Mark as Live"
							})
						]
					}) : null] }) : null,
					showTransfer ? /* @__PURE__ */ jsx(ActionBtn, {
						icon: /* @__PURE__ */ jsx(CalendarCheck2, { className: "size-4" }),
						label: "Mark Transfer Completed",
						disabled: updateMutation.isPending,
						onClick: () => updateMutation.mutate({ transferCompleted: true })
					}) : null,
					showDiscontinue ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(ActionBtn, {
						icon: /* @__PURE__ */ jsx(XCircle, { className: "size-4" }),
						label: "Discontinue",
						destructive: true,
						onClick: () => setDiscontinueOpen(true)
					}), /* @__PURE__ */ jsx(ConfirmDialog, {
						open: discontinueOpen,
						onOpenChange: setDiscontinueOpen,
						title: "Discontinue Website",
						description: "This will mark the website as Discontinued and cancel maintenance. This action is final.",
						confirmLabel: "Discontinue",
						onConfirm: () => {
							updateMutation.mutate({
								websiteStatus: "Discontinued",
								maintenanceStatus: "Cancelled"
							});
							setDiscontinueOpen(false);
						},
						isPending: updateMutation.isPending
					})] }) : null
				]
			}),
			updateMutation.isError ? /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-[12px] text-[#DC2626]",
				children: updateMutation.error.message
			}) : null
		]
	});
}
function ActionBtn({ icon, label, destructive, disabled, onClick }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		disabled,
		onClick,
		className: cn("flex w-full items-center justify-center gap-2 rounded-[9px] border px-4 py-2.5 text-[12.5px] font-semibold transition", destructive ? "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FECACA]" : "border-[#E5E7EB] bg-white text-[#3D4250] hover:bg-[#F4F5F7]", disabled && "cursor-not-allowed opacity-50"),
		children: [icon, label]
	});
}
//#endregion
//#region src/routes/_protected/_websites/websites.$websiteId.tsx?tsr-split=component
function WebsiteDetailPage() {
	const { websiteId } = Route.useParams();
	const websiteQuery = useWebsite(websiteId);
	const website = websiteQuery.data;
	const { data: currentBillingId } = useCurrentBillingId(websiteId);
	const [editOpen, setEditOpen] = useState(false);
	const [paymentOpen, setPaymentOpen] = useState(false);
	const [requestOpen, setRequestOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-1 flex-col overflow-auto bg-[#F4F5F7]",
		children: [/* @__PURE__ */ jsxs("main", {
			className: "flex flex-1 flex-col gap-[20px] px-[30px] py-[26px]",
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
						className: "text-[22px] font-bold tracking-tight text-[#11141A]",
						children: website?.project_name ?? "Website Details"
					}), website ? /* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex items-center gap-2 flex-wrap",
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
				billingId: currentBillingId,
				projectName: website.project_name,
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
