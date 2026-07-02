import { t as cn } from "./utils-CR4dV3c0.js";
import { t as Route } from "./_protected-eZQcPwy3.js";
import { t as Button } from "./button-N4VO-qD6.js";
import { a as DropdownMenuSeparator, i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuGroup, t as DropdownMenu } from "./dropdown-menu-DpCy7uv2.js";
import { f as useWebsites, r as useDeleteWebsite, t as useClientOptions, u as useWebsiteStats } from "./use-websites-BnWcvb5r.js";
import { t as ConfirmDialog } from "./confirm-dialog-Q5QxauQW.js";
import { t as Skeleton } from "./skeleton-3GrrKxds.js";
import { n as formatDate, t as formatCurrency } from "./format-BiRzvK38.js";
import { n as useDebounce, r as PageSizeSelector, t as NoResults } from "./no-results-DYby2b_E.js";
import { a as SelectTrigger, i as SelectItem, n as Select, r as SelectContent } from "./service-option-select-DfxCZ9yy.js";
import { a as RecordPaymentDialog, i as AddRequestDialog, n as StatusPill, o as WebsiteEditDialog, r as RenewDomainDialog } from "./status-badges-CofIg0vY.js";
import { t as useSettings } from "./use-settings-Cz9UnZFq.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, Eye, MoreVertical, Pencil, RefreshCw, Trash2 } from "lucide-react";
//#region src/components/websites/websites-filters.tsx
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
var PLATFORMS = ["netlify", "wpx"];
var SITE_TYPES = ["static", "wordpress"];
function capitalize(value) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
function FilterSelect({ placeholder, value, onChange, options }) {
	return /* @__PURE__ */ jsxs(Select, {
		value: value ?? "",
		onValueChange: (nextValue) => onChange(nextValue === "__clear" ? void 0 : nextValue || void 0),
		children: [/* @__PURE__ */ jsx(SelectTrigger, {
			className: "h-10 rounded-xl border-[#c7ddb5] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#132018]",
			children: /* @__PURE__ */ jsx("span", {
				className: value ? "text-[#102315] dark:text-[#edf7ee]" : "text-[#64745F] dark:text-[#9fb49b]",
				children: value ? options.find((option) => option.value === value)?.label ?? value : placeholder
			})
		}), /* @__PURE__ */ jsxs(SelectContent, { children: [value ? /* @__PURE__ */ jsx(SelectItem, {
			value: "__clear",
			children: placeholder
		}) : null, options.map((option) => /* @__PURE__ */ jsx(SelectItem, {
			value: option.value,
			children: option.label
		}, option.value))] })]
	});
}
function WebsitesFiltersBar({ filters, onChange, clients }) {
	const set = (key, value) => {
		onChange({
			...filters,
			[key]: value
		});
	};
	const hasActiveFilters = Boolean(filters.clientId || filters.siteType || filters.platform || filters.websiteStatus || filters.maintenanceStatus || filters.overdueOnly || filters.maintenanceOverdueOnly || filters.domainOverdueOnly || filters.domainNotSetUp || filters.transferPending);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-w-0 flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ jsx(FilterSelect, {
				placeholder: "All clients",
				value: filters.clientId,
				onChange: (value) => set("clientId", value),
				options: clients.map((client) => ({
					value: String(client.id),
					label: client.name
				}))
			}),
			/* @__PURE__ */ jsx(FilterSelect, {
				placeholder: "Type",
				value: filters.siteType,
				onChange: (value) => set("siteType", value),
				options: SITE_TYPES.map((type) => ({
					value: type,
					label: capitalize(type)
				}))
			}),
			/* @__PURE__ */ jsx(FilterSelect, {
				placeholder: "Platform",
				value: filters.platform,
				onChange: (value) => set("platform", value),
				options: PLATFORMS.map((platform) => ({
					value: platform,
					label: capitalize(platform)
				}))
			}),
			/* @__PURE__ */ jsx(FilterSelect, {
				placeholder: "Website status",
				value: filters.websiteStatus,
				onChange: (value) => set("websiteStatus", value),
				options: WEBSITE_STATUSES.map((status) => ({
					value: status,
					label: status
				}))
			}),
			/* @__PURE__ */ jsx(FilterSelect, {
				placeholder: "Maintenance",
				value: filters.maintenanceStatus,
				onChange: (value) => set("maintenanceStatus", value),
				options: MAINTENANCE_STATUSES.map((status) => ({
					value: status,
					label: status
				}))
			}),
			hasActiveFilters ? /* @__PURE__ */ jsx(Button, {
				variant: "link",
				size: "sm",
				className: "h-10 px-1 text-emerald-700",
				onClick: () => onChange({ search: filters.search }),
				children: "Clear all"
			}) : null
		]
	});
}
//#endregion
//#region src/components/websites/websites-table.tsx
var gridClass = "grid grid-cols-[2.2fr_0.85fr_1.5fr_1.25fr_0.8fr_1.1fr_110px_42px]";
function rowPriority(site) {
	const domainDiff = site.domain_renewal_date ? dayDiff(site.domain_renewal_date) : null;
	const isDomainOverdue = domainDiff !== null && domainDiff < 0;
	const isDueSoon = site.maintenance_status === "Due Soon" || domainDiff !== null && domainDiff >= 0 && domainDiff <= 30;
	if (site.is_maintenance_overdue) return 0;
	if (isDomainOverdue) return 1;
	if (isDueSoon) return 2;
	if (site.website_status === "Live") return 3;
	if (site.website_status === "In Progress") return 4;
	return 5;
}
function WebsitesTable({ websites, isLoading, isFetching, isError, error, sortBy, sortOrder, onSortChange, pagination, pageSize, onPageSizeChange, onPageChange, onDelete, dueSoonDays = 30 }) {
	const showSkeleton = isLoading || isFetching;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: cn(gridClass, "shrink-0 border-b border-[#E5E7EB] bg-[#FAFBFC]"),
				children: [
					/* @__PURE__ */ jsx(Th, { children: "Project Name" }),
					/* @__PURE__ */ jsx(Th, { children: "Client" }),
					/* @__PURE__ */ jsx(SortTh, {
						field: "siteType",
						label: "Build/Host Type",
						sortBy,
						sortOrder,
						onSort: onSortChange
					}),
					/* @__PURE__ */ jsx(Th, { children: "Domain" }),
					/* @__PURE__ */ jsx(Th, { children: "Maintenance" }),
					/* @__PURE__ */ jsx(SortTh, {
						field: "renewalDate",
						label: "Next Due",
						sortBy,
						sortOrder,
						onSort: onSortChange
					}),
					/* @__PURE__ */ jsx(Th, {
						center: true,
						children: "Status"
					}),
					/* @__PURE__ */ jsx(Th, {})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: showSkeleton ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsxs("div", {
					className: cn(gridClass, "min-h-[56px] items-center border-b border-[#EEF0F2] px-0"),
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "px-3 py-3",
							children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-[70%] rounded-[6px]" }), /* @__PURE__ */ jsx(Skeleton, { className: "mt-1.5 h-3 w-[45%] rounded-[6px]" })]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3",
							children: /* @__PURE__ */ jsx(Skeleton, { className: "h-3.5 w-[60%] rounded-[6px]" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3",
							children: /* @__PURE__ */ jsx(Skeleton, { className: "h-3.5 w-[50%] rounded-[6px]" })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "px-3",
							children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-3.5 w-[65%] rounded-[6px]" }), /* @__PURE__ */ jsx(Skeleton, { className: "mt-1.5 h-3 w-[40%] rounded-[6px]" })]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3",
							children: /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-[70%] rounded-[7px]" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3",
							children: /* @__PURE__ */ jsx(Skeleton, { className: "h-3.5 w-[55%] rounded-[6px]" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex justify-center px-3",
							children: /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-14 rounded-[7px]" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3",
							children: /* @__PURE__ */ jsx(Skeleton, { className: "h-6 w-6 rounded-[6px]" })
						})
					]
				}, i)) : isError ? /* @__PURE__ */ jsx(StateRow, {
					className: "text-[#DC2626]",
					children: error?.message ?? "Something went wrong."
				}) : !websites || websites.length === 0 ? /* @__PURE__ */ jsx(NoResults, { message: "No websites found." }) : [...websites].sort((a, b) => rowPriority(a) - rowPriority(b)).map((site) => /* @__PURE__ */ jsx(WebsiteRow, {
					site,
					onDelete,
					dueSoonDays
				}, site.id))
			}),
			pagination ? /* @__PURE__ */ jsxs("footer", {
				className: "flex shrink-0 items-center justify-between border-t border-[#E5E7EB] bg-white px-5 py-3 text-sm text-[#8A8F98]",
				children: [/* @__PURE__ */ jsx(PageSizeSelector, {
					value: pageSize,
					onChange: onPageSizeChange,
					total: pagination.total
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-[12px] text-[#8A8F98]",
						children: [
							"Page ",
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-[#5C6270]",
								children: pagination.page
							}),
							" of ",
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-[#5C6270]",
								children: pagination.totalPages
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: pagination.page <= 1,
								onClick: () => onPageChange(pagination.page - 1),
								className: "flex size-[29px] items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed",
								"aria-label": "Previous page",
								children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" })
							}),
							Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => onPageChange(n),
								className: cn("flex size-[29px] items-center justify-center rounded-[7px] text-[12px] font-semibold transition", n === pagination.page ? "bg-[#4F5DF5] text-white" : "text-[#5C6270] hover:bg-[#F4F5F7]"),
								children: n
							}, n)),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								disabled: pagination.page >= pagination.totalPages,
								onClick: () => onPageChange(pagination.page + 1),
								className: "flex size-[29px] items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed",
								"aria-label": "Next page",
								children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
							})
						]
					})]
				})]
			}) : null
		]
	});
}
function WebsiteRow({ site, onDelete, dueSoonDays }) {
	const navigate = useNavigate();
	const [editOpen, setEditOpen] = useState(false);
	const [renewOpen, setRenewOpen] = useState(false);
	const isOverdue = site.is_maintenance_overdue;
	const isDueSoon = !isOverdue && site.maintenance_status === "Due Soon";
	return /* @__PURE__ */ jsxs("div", {
		className: cn(gridClass, "min-h-[60px] cursor-pointer items-center border-b border-[#EEF0F2] text-[13px] transition-colors", isOverdue ? "bg-[#FFF8F7] hover:bg-[#FEF0EE]" : isDueSoon ? "bg-[#FFFCF4] hover:bg-[#FEF7E6]" : "hover:bg-[#F7F8FA]"),
		onClick: () => navigate({
			to: "/websites/$websiteId",
			params: { websiteId: String(site.id) }
		}),
		children: [
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-[11px]",
				children: [/* @__PURE__ */ jsx("div", {
					className: cn("flex size-[34px] shrink-0 items-center justify-center rounded-[10px]", isOverdue ? "bg-[#FEF2F2]" : isDueSoon ? "bg-[#FEF3C7]" : "bg-[#EFF6FF]"),
					children: /* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "1.5",
						className: cn("size-[17px]", isOverdue ? "text-[#DC2626]" : isDueSoon ? "text-[#D97706]" : "text-[#3B82F6]"),
						children: [
							/* @__PURE__ */ jsx("circle", {
								cx: "12",
								cy: "12",
								r: "10"
							}),
							/* @__PURE__ */ jsx("line", {
								x1: "2",
								y1: "12",
								x2: "22",
								y2: "12"
							}),
							/* @__PURE__ */ jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
						]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "truncate font-semibold text-[#11141A]",
						children: site.project_name
					}), site.url ? /* @__PURE__ */ jsx("div", {
						className: "truncate text-[11.5px] text-[#8A8F98]",
						children: site.url.replace(/^https?:\/\//, "")
					}) : null]
				})]
			}) }),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx("span", {
				className: "truncate text-[#5C6270]",
				children: site.client_name
			}) }),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx("div", {
				className: "min-w-0 w-full",
				children: /* @__PURE__ */ jsx("div", {
					className: "truncate font-semibold text-[#3D4250]",
					children: [site.build_type || site.site_type, site.platform].filter(Boolean).join(" / ")
				})
			}) }),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx(DomainCell, {
				site,
				dueSoonDays,
				onRenew: () => setRenewOpen(true)
			}) }),
			/* @__PURE__ */ jsx(Cell, { children: site.maintenance_amount ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "font-bold text-[#3D4250]",
				children: [formatCurrency(site.maintenance_amount), /* @__PURE__ */ jsxs("span", {
					className: "font-normal text-[#8A8F98]",
					children: [" / ", site.billing_cycle === "yearly" ? "y" : "mo"]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "text-[11px] text-[#8A8F98] capitalize",
				children: site.billing_cycle ?? "Monthly"
			})] }) : /* @__PURE__ */ jsx("span", {
				className: "text-[#C7CAD1]",
				children: "—"
			}) }),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx(NextDueCell, {
				site,
				dueSoonDays
			}) }),
			/* @__PURE__ */ jsx(Cell, {
				className: "justify-center",
				children: /* @__PURE__ */ jsx(StatusPill, { label: site.website_status })
			}),
			/* @__PURE__ */ jsxs(Cell, {
				className: "justify-center pr-2",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
						render: /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "flex size-7 shrink-0 items-center justify-center rounded-[7px] text-[#A8ACB4] transition hover:bg-[#F4F5F7] hover:text-[#3D4250]",
							"aria-label": `Actions for ${site.project_name}`
						}),
						children: /* @__PURE__ */ jsx(MoreVertical, { className: "size-4" })
					}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
						side: "bottom",
						align: "end",
						sideOffset: 6,
						className: "w-[165px] rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0_10px_30px_rgba(17,20,26,.12)]",
						children: [
							/* @__PURE__ */ jsxs(DropdownMenuGroup, { children: [
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									className: "cursor-pointer gap-2 rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7]",
									onClick: () => navigate({
										to: "/websites/$websiteId",
										params: { websiteId: String(site.id) }
									}),
									children: [/* @__PURE__ */ jsx(Eye, { className: "size-3.5 text-[#8A8F98]" }), " View"]
								}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									className: "cursor-pointer gap-2 rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7]",
									onClick: () => setEditOpen(true),
									children: [/* @__PURE__ */ jsx(Pencil, { className: "size-3.5 text-[#8A8F98]" }), " Edit"]
								}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									className: "cursor-pointer gap-2 rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7]",
									onClick: () => setRenewOpen(true),
									children: [/* @__PURE__ */ jsx(RefreshCw, { className: "size-3.5 text-[#8A8F98]" }), " Renew Domain"]
								})
							] }),
							/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
							/* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
								className: "cursor-pointer gap-2 rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#DC2626] focus:bg-[#FEF2F2] focus:text-[#DC2626]",
								onClick: () => onDelete?.(site),
								children: [/* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }), " Delete"]
							}) })
						]
					})] }),
					/* @__PURE__ */ jsx(WebsiteEditDialog, {
						websiteId: String(site.id),
						open: editOpen,
						onOpenChange: setEditOpen
					}),
					/* @__PURE__ */ jsx(RenewDomainDialog, {
						website: site,
						open: renewOpen,
						onOpenChange: setRenewOpen
					})
				]
			})
		]
	});
}
function DomainCell({ site, dueSoonDays, onRenew }) {
	const handledBy = site.domain_handled_by;
	if (!handledBy && !site.domain_name) return /* @__PURE__ */ jsx("span", {
		className: "text-[#C7CAD1]",
		children: "—"
	});
	const handledByLabel = handledBy === "our_side" ? "Our side" : handledBy === "client_side" ? "Client side" : "—";
	const diff = site.domain_renewal_date ? dayDiff(site.domain_renewal_date) : null;
	const isDomainOverdue = diff !== null && diff < 0;
	const isDomainDueSoon = diff !== null && diff >= 0 && diff <= dueSoonDays;
	return /* @__PURE__ */ jsxs("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: cn("truncate font-semibold text-[#3D4250]", isDomainOverdue && "text-[#DC2626]", isDomainDueSoon && !isDomainOverdue && "text-[#D97706]"),
				children: [handledByLabel, site.domain_provider ? ` · ${site.domain_provider}` : ""]
			}),
			site.domain_renewal_date ? /* @__PURE__ */ jsx("div", {
				className: "text-[11px] text-[#8A8F98]",
				children: formatDate(site.domain_renewal_date)
			}) : /* @__PURE__ */ jsx("div", {
				className: "text-[11px] text-[#8A8F98]",
				children: "Renewal unknown"
			}),
			isDomainOverdue && diff !== null ? /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					onRenew?.();
				},
				className: "text-[11px] font-semibold text-[#DC2626] underline decoration-dotted hover:text-[#B91C1C]",
				children: [
					"overdue by ",
					Math.abs(diff),
					" days"
				]
			}) : isDomainDueSoon && diff !== null ? /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					onRenew?.();
				},
				className: "text-[11px] font-semibold text-[#D97706] underline decoration-dotted hover:text-[#B45309]",
				children: [
					"due in ",
					diff,
					" days"
				]
			}) : null
		]
	});
}
function NextDueCell({ site, dueSoonDays }) {
	const renewalDate = site.current_billing_due_date;
	if (!renewalDate) return /* @__PURE__ */ jsx("span", {
		className: "text-[#C7CAD1]",
		children: "—"
	});
	const diff = dayDiff(renewalDate);
	const isOverdue = site.is_maintenance_overdue;
	const isDueSoon = !isOverdue && diff >= 0 && diff <= dueSoonDays;
	let iconBg = "bg-[#059669]";
	let iconContent = "✓";
	let dateClr = "text-[#059669]";
	if (isOverdue) {
		iconBg = "bg-[#DC2626]";
		iconContent = "!";
		dateClr = "text-[#DC2626]";
	} else if (isDueSoon) {
		iconBg = "bg-[#D97706]";
		iconContent = "⏳";
		dateClr = "text-[#D97706]";
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-start gap-2",
		children: [/* @__PURE__ */ jsx("div", {
			className: cn("mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white", iconBg),
			children: iconContent
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsx("div", {
				className: cn("font-bold", dateClr),
				children: formatDate(renewalDate)
			}), isOverdue ? /* @__PURE__ */ jsxs("div", {
				className: "text-[10.5px] font-semibold text-[#DC2626]",
				children: [
					"overdue by ",
					Math.abs(diff),
					" ",
					Math.abs(diff) === 1 ? "day" : "days"
				]
			}) : isDueSoon ? /* @__PURE__ */ jsxs("div", {
				className: "text-[10.5px] font-semibold text-[#D97706]",
				children: [
					"due in ",
					diff,
					" ",
					diff === 1 ? "day" : "days"
				]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "text-[10.5px] text-[#8A8F98]",
				children: [
					"in ",
					diff,
					" days"
				]
			})]
		})]
	});
}
var MS_PER_DAY = 1440 * 60 * 1e3;
function dayDiff(dateStr) {
	if (!dateStr) return 0;
	const now = /* @__PURE__ */ new Date();
	now.setHours(0, 0, 0, 0);
	const due = new Date(dateStr);
	due.setHours(0, 0, 0, 0);
	return Math.round((due.getTime() - now.getTime()) / MS_PER_DAY);
}
function Th({ children, center }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-12 min-w-0 items-center overflow-hidden px-3 text-[11px] font-semibold uppercase tracking-[.03em] text-[#8A8F98]", center && "justify-center"),
		children
	});
}
function SortTh({ field, label, sortBy, sortOrder, onSort }) {
	const active = sortBy === field;
	return /* @__PURE__ */ jsx("div", {
		className: "flex h-12 min-w-0 items-center overflow-hidden px-3",
		children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => onSort(field),
			className: cn("inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[.03em] transition", active ? "text-[#4F5DF5]" : "text-[#8A8F98] hover:text-[#3D4250]"),
			children: [label, /* @__PURE__ */ jsx("span", {
				className: "text-[10px]",
				children: active ? sortOrder === "asc" ? "↑" : "↓" : "↕"
			})]
		})
	});
}
function Cell({ children, className, onClick }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex min-w-0 items-center overflow-hidden px-3 py-2", className),
		onClick,
		children
	});
}
function StateRow({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-40 items-center justify-center text-[#8A8F98] text-[13px]", className),
		children
	});
}
//#endregion
//#region src/components/websites/websites-tabs.tsx
var TAB_FILTERS = {
	all: {},
	inProgress: { websiteStatus: "In Progress" },
	overdue: { overdueOnly: true },
	dueSoon: { maintenanceStatus: "Due Soon" }
};
function WebsitesTabs({ active, stats, onChange }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex items-center gap-0.5",
		children: [
			{
				key: "all",
				label: "All",
				count: stats?.websites
			},
			{
				key: "inProgress",
				label: "In Progress",
				count: stats?.in_progress,
				color: "amber"
			},
			{
				key: "overdue",
				label: "Overdue",
				count: stats ? stats.maintenance_overdue_count + stats.domain_overdue_count : void 0,
				color: "red"
			},
			{
				key: "dueSoon",
				label: "Due Soon",
				count: stats?.due_soon,
				color: "amber"
			}
		].map((tab) => {
			const isActive = active === tab.key;
			const isRed = tab.color === "red";
			const isAmber = tab.color === "amber";
			return /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => onChange(tab.key, TAB_FILTERS[tab.key]),
				className: cn("flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-[12.5px] font-medium transition-all border border-transparent", "text-[#8A8F98] hover:bg-[#F4F5F7] hover:text-[#1F2430]", "dark:text-[#6B7280] dark:hover:bg-[#1c2045] dark:hover:text-[#E5E7EB]", isActive && !isRed && !isAmber && "bg-[#EEEFFE] text-[#4F5DF5] font-bold hover:bg-[#EEEFFE] hover:text-[#4F5DF5] dark:bg-[#1c2045] dark:text-[#818CF8]", isActive && isRed && "bg-[#FEF2F2] text-[#DC2626] font-bold hover:bg-[#FEF2F2] hover:text-[#DC2626] dark:bg-[#450A0A] dark:text-[#F87171]", isActive && isAmber && "bg-[#FEF3C7] text-[#D97706] font-bold hover:bg-[#FEF3C7] hover:text-[#D97706] dark:bg-[#451A03] dark:text-[#FCD34D]"),
				children: [tab.label, /* @__PURE__ */ jsx("span", {
					className: cn("rounded-full px-1.5 py-0.5 text-[10.5px] font-bold", !isActive && "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#1F2937] dark:text-[#6B7280]", isActive && !isRed && !isAmber && "bg-[#BFDBFE] text-[#3B82F6] dark:bg-[#2e3370] dark:text-[#818CF8]", isActive && isRed && "bg-[#FECACA] text-[#DC2626] dark:bg-[#7F1D1D] dark:text-[#F87171]", isActive && isAmber && "bg-[#FDE68A] text-[#D97706] dark:bg-[#78350F] dark:text-[#FCD34D]"),
					children: tab.count ?? "—"
				})]
			}, tab.key);
		})
	});
}
//#endregion
//#region src/routes/_protected/index.tsx?tsr-split=component
var FILTER_KEYS = [
	"clientId",
	"websiteStatus",
	"maintenanceStatus",
	"platform",
	"siteType",
	"overdueOnly",
	"maintenanceOverdueOnly",
	"domainOverdueOnly",
	"domainNotSetUp",
	"sortBy",
	"sortOrder"
];
function pickFilters(search) {
	const tabFilters = TAB_FILTERS[search.tab ?? "all"];
	return {
		search: search.search,
		clientId: search.clientId,
		websiteStatus: tabFilters.websiteStatus ?? search.websiteStatus,
		maintenanceStatus: tabFilters.maintenanceStatus ?? search.maintenanceStatus,
		platform: search.platform,
		siteType: search.siteType,
		overdueOnly: search.overdueOnly,
		maintenanceOverdueOnly: tabFilters.maintenanceOverdueOnly ?? search.maintenanceOverdueOnly,
		domainOverdueOnly: tabFilters.domainOverdueOnly ?? search.domainOverdueOnly,
		sortBy: search.sortBy,
		sortOrder: search.sortOrder
	};
}
function clearFilterFields() {
	return Object.fromEntries(FILTER_KEYS.map((key) => [key, void 0]));
}
function WebsitesPage() {
	const routeSearch = Route.useSearch();
	const navigate = Route.useNavigate();
	const filters = pickFilters(routeSearch);
	const [searchQuery, setSearchQuery] = useState(routeSearch.search ?? "");
	const debouncedSearch = useDebounce(searchQuery, 300);
	const [paymentSite, setPaymentSite] = useState(null);
	const [requestSite, setRequestSite] = useState(null);
	const [sitePickerMode, setSitePickerMode] = useState(null);
	useEffect(() => {
		setSearchQuery(routeSearch.search ?? "");
	}, [routeSearch.search]);
	useEffect(() => {
		if (debouncedSearch === (routeSearch.search ?? "")) return;
		navigate({
			search: (old) => ({
				...old,
				search: debouncedSearch || void 0,
				page: 1
			}),
			replace: true
		});
	}, [
		debouncedSearch,
		navigate,
		routeSearch.search
	]);
	const statsQuery = useWebsiteStats();
	const clientsQuery = useClientOptions();
	const settingsQuery = useSettings();
	const dueSoonDays = settingsQuery.data ? parseInt(settingsQuery.data.renewal_window_days, 10) : 30;
	const websitesQuery = useWebsites(filters, routeSearch.page, routeSearch.limit);
	const allSitesQuery = useWebsites({}, 1, 100);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const deleteMutation = useDeleteWebsite(deleteTarget ? String(deleteTarget.id) : "");
	const handleDeleteConfirm = () => {
		if (!deleteTarget) return;
		deleteMutation.mutate(void 0, { onSuccess: () => setDeleteTarget(null) });
	};
	const pagination = websitesQuery.data?.pagination;
	const updateSearch = (next) => {
		navigate({ search: (old) => ({
			...old,
			...next
		}) });
	};
	const updateFilters = (nextFilters) => {
		navigate({ search: (old) => ({
			...old,
			...clearFilterFields(),
			...nextFilters,
			page: 1
		}) });
	};
	const handleTabChange = (nextTab, tabFilters) => {
		navigate({ search: (old) => ({
			...old,
			...clearFilterFields(),
			search: old.search,
			tab: nextTab,
			...tabFilters,
			page: 1
		}) });
	};
	const handleSortChange = (sortBy) => {
		updateSearch({
			sortBy,
			sortOrder: filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc",
			page: 1
		});
	};
	const allSites = allSitesQuery.data?.items ?? [];
	return /* @__PURE__ */ jsxs("main", {
		className: "flex min-h-0 flex-1 flex-col gap-[14px] overflow-hidden bg-[#F4F5F7] px-[30px] py-[18px]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[19px] font-bold tracking-tight text-[#11141A]",
					children: "Websites"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-[2px] text-[12px] text-[#9CA3AF]",
					children: "Every site you manage — sorted by what needs attention first"
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-[10px] flex-wrap",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setSitePickerMode("payment"),
							className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]",
							children: "Record Payment"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setSitePickerMode("request"),
							className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]",
							children: "Add Request"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/websites/import",
							className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]",
							children: "Import"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/websites/new",
							search: { clientId: void 0 },
							className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]",
							children: "+ Add Website"
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(MetricCards, { stats: statsQuery.data }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between flex-wrap gap-3 border-b border-[#E5E7EB] px-[18px] py-[14px]",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-1.5 flex-wrap",
							children: /* @__PURE__ */ jsx(WebsitesTabs, {
								active: routeSearch.tab ?? "all",
								stats: statsQuery.data,
								onChange: handleTabChange
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2 rounded-[9px] border border-[#E5E7EB] bg-[#F7F8FA] px-3 py-2 min-w-[230px]",
								children: /* @__PURE__ */ jsx("input", {
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									placeholder: "Search website, client, domain...",
									className: "w-full border-none bg-transparent text-[12.5px] text-[#1F2430] outline-none placeholder:text-[#A8ACB4]"
								})
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => updateSearch({ showFilters: !routeSearch.showFilters }),
								className: cn("inline-flex h-9 items-center gap-1.5 rounded-[9px] border px-3 text-[12.5px] font-semibold transition", routeSearch.showFilters ? "border-[#D6D9FC] bg-[#EEEFFE] text-[#4F5DF5]" : "border-[#E5E7EB] bg-white text-[#5C6270] hover:border-[#D6D9FC] hover:text-[#4F5DF5]"),
								children: "Filter"
							})]
						})]
					}),
					routeSearch.showFilters ? /* @__PURE__ */ jsx("div", {
						className: "border-b border-[#E5E7EB] px-[18px] py-2",
						children: /* @__PURE__ */ jsx(WebsitesFiltersBar, {
							filters,
							onChange: updateFilters,
							clients: clientsQuery.data?.items ?? []
						})
					}) : null,
					/* @__PURE__ */ jsx(WebsitesTable, {
						websites: websitesQuery.data?.items,
						isLoading: websitesQuery.isLoading,
						isFetching: websitesQuery.isFetching,
						isError: websitesQuery.isError,
						error: websitesQuery.error,
						sortBy: filters.sortBy,
						sortOrder: filters.sortOrder,
						onSortChange: handleSortChange,
						pagination,
						pageSize: routeSearch.limit,
						onPageSizeChange: (limit) => updateSearch({
							limit,
							page: 1
						}),
						onPageChange: (page) => updateSearch({ page }),
						onDelete: (site) => setDeleteTarget(site),
						dueSoonDays
					})
				]
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: deleteTarget !== null,
				onOpenChange: (open) => {
					if (!open) setDeleteTarget(null);
				},
				title: "Delete Website",
				description: `Are you sure you want to delete "${deleteTarget?.project_name}"? This action cannot be undone.`,
				confirmLabel: "Delete",
				onConfirm: handleDeleteConfirm,
				isPending: deleteMutation.isPending
			}),
			sitePickerMode && !paymentSite && !requestSite ? /* @__PURE__ */ jsx(WebsitePickerDialog, {
				mode: sitePickerMode,
				sites: allSites,
				onPick: (site) => {
					setSitePickerMode(null);
					if (sitePickerMode === "payment") setPaymentSite(site);
					else setRequestSite(site);
				},
				onClose: () => setSitePickerMode(null)
			}) : null,
			paymentSite ? /* @__PURE__ */ jsx(RecordPaymentDialog, {
				websiteId: String(paymentSite.id),
				projectName: paymentSite.project_name,
				hostedDate: paymentSite.hosted_date ?? null,
				maintenanceAmount: paymentSite.maintenance_amount,
				open: true,
				onOpenChange: (open) => {
					if (!open) setPaymentSite(null);
				}
			}) : null,
			requestSite ? /* @__PURE__ */ jsx(AddRequestDialog, {
				websiteId: String(requestSite.id),
				projectName: requestSite.project_name,
				open: true,
				onOpenChange: (open) => {
					if (!open) setRequestSite(null);
				}
			}) : null
		]
	});
}
function WebsitePickerDialog({ mode, sites, onPick, onClose }) {
	const [q, setQ] = useState("");
	const filtered = sites.filter((s) => s.project_name.toLowerCase().includes(q.toLowerCase()) || (s.client_name ?? "").toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-[400px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "border-b border-[#E5E7EB] px-6 py-4",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-[16px] font-bold text-[#11141A]",
						children: "Select Website"
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-0.5 text-[12px] text-[#8A8F98]",
						children: [
							"Choose a website to ",
							mode === "payment" ? "record payment for" : "add a request to",
							"."
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-4",
					children: [/* @__PURE__ */ jsx("input", {
						autoFocus: true,
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search websites...",
						className: "mb-3 w-full rounded-[9px] border border-[#E5E7EB] bg-[#F7F8FA] px-3 py-2 text-[12.5px] outline-none focus:border-[#4F5DF5]"
					}), /* @__PURE__ */ jsx("div", {
						className: "max-h-[280px] overflow-y-auto",
						children: filtered.length === 0 ? /* @__PURE__ */ jsx("p", {
							className: "py-4 text-center text-[12.5px] text-[#8A8F98]",
							children: "No websites found."
						}) : filtered.map((site) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => onPick(site),
							className: "flex w-full items-center gap-3 rounded-[9px] px-3 py-2.5 text-left transition hover:bg-[#EEEFFE]",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#EEEFFE]",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-bold text-[#4F5DF5]",
									children: site.project_name[0]
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-[13px] font-semibold text-[#11141A]",
									children: site.project_name
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-[#8A8F98]",
									children: site.client_name
								})]
							})]
						}, site.id))
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex justify-end border-t border-[#E5E7EB] px-6 py-3",
					children: /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-[9px] border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-semibold text-[#5C6270] transition hover:bg-[#F4F5F7]",
						children: "Cancel"
					})
				})
			]
		})
	});
}
function MetricCards({ stats }) {
	return /* @__PURE__ */ jsx("div", {
		className: "grid shrink-0 grid-cols-5 gap-2.5",
		children: [
			{
				label: "Maintenance Overdue",
				value: stats ? String(stats.maintenance_overdue_count) : "—",
				foot: "Unpaid past due date",
				valueClr: stats && stats.maintenance_overdue_count > 0 ? "text-[#DC2626]" : "text-[#11141A]"
			},
			{
				label: "Domain Overdue",
				value: stats ? String(stats.domain_overdue_count) : "—",
				foot: "Renewal date passed",
				valueClr: stats && stats.domain_overdue_count > 0 ? "text-[#DC2626]" : "text-[#11141A]"
			},
			{
				label: "Due Soon",
				value: stats ? String(stats.due_soon) : "—",
				foot: "Within renewal window",
				valueClr: stats && stats.due_soon > 0 ? "text-[#D97706]" : "text-[#11141A]"
			},
			{
				label: "Pending Collection",
				value: stats ? stats.pending_collection_display ?? (stats.pending_collection != null ? formatCurrency(stats.pending_collection) : null) ?? (stats.pending_collection_amount != null ? formatCurrency(String(stats.pending_collection_amount)) : null) ?? "—" : "—",
				foot: "Maintenance only",
				valueClr: "text-[#11141A]"
			},
			{
				label: "Live Websites",
				value: stats ? String(stats.live_websites ?? stats.live) : "—",
				foot: "Active maintenance",
				valueClr: stats && (stats.live_websites ?? stats.live) > 0 ? "text-[#047857]" : "text-[#11141A]"
			}
		].map((card) => /* @__PURE__ */ jsxs("div", {
			className: "rounded-[12px] border border-[#E5E7EB] bg-white px-[14px] py-[10px] shadow-[0_1px_2px_rgba(17,20,26,.04)]",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "text-[10px] font-semibold uppercase tracking-[.05em] text-[#9CA3AF]",
					children: card.label
				}),
				/* @__PURE__ */ jsx("div", {
					className: cn("mt-[4px] text-[18px] font-bold leading-none tracking-tight", card.valueClr),
					children: card.value
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-[3px] text-[10.5px] text-[#9CA3AF]",
					children: card.foot
				})
			]
		}, card.label))
	});
}
//#endregion
export { WebsitesPage as component };
