import { n as cn, t as Button } from "./button-jrDuWETO.js";
import { t as Route } from "./_protected-BnETqvUm.js";
import { t as Input } from "./input-BUXT0p6g.js";
import { a as DropdownMenuSeparator, i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuGroup, t as DropdownMenu } from "./dropdown-menu-BueuBkLZ.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { t as ConfirmDialog } from "./confirm-dialog-DgKpdZE4.js";
import { t as Skeleton } from "./skeleton-BcCjHA20.js";
import { t as formatDate } from "./format-BWQocT_r.js";
import { i as SearchBar, n as useDebounce, r as PageSizeSelector, t as NoResults } from "./no-results-DbhRO957.js";
import { a as useWebsite, c as useWebsites, d as SelectItem, f as SelectTrigger, i as useUpdateWebsite, l as Select, n as useClientOptions, r as useDeleteWebsite, s as useWebsiteStats, u as SelectContent } from "./website-form-BHMfhLsp.js";
import { n as MaintenanceBadge, r as StatusPill, t as WebsiteEditDialog } from "./website-edit-dialog-B-ucg7tY.js";
import { t as useSettings } from "./use-settings-Bg9DPHxD.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, ChevronLeft, ChevronRight, Clock, CreditCard, Eye, Globe, ListFilter, Loader2, MoreVertical, Pencil, Plus, RefreshCw, Trash2, X, XCircle } from "lucide-react";
import { Dialog } from "@base-ui/react";
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
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-w-0 flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ jsx(FilterSelect, {
				placeholder: "All clients",
				value: filters.clientId,
				onChange: (value) => set("clientId", value),
				options: clients.map((client) => ({
					value: client.clientId,
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
			/* @__PURE__ */ jsx(Button, {
				variant: "link",
				size: "sm",
				className: "h-10 px-1 text-emerald-700",
				onClick: () => onChange({ search: filters.search }),
				children: "Clear all"
			})
		]
	});
}
//#endregion
//#region src/components/websites/website-update-dialog.tsx
function WebsiteUpdateDialog({ websiteId, open, onOpenChange }) {
	return /* @__PURE__ */ jsx(Dialog.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Backdrop, { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" }), /* @__PURE__ */ jsx(Dialog.Popup, {
			className: "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#2f4a32] dark:bg-[#132018]",
			children: /* @__PURE__ */ jsx(UpdateDialogContent, {
				websiteId,
				onClose: () => onOpenChange(false)
			})
		})] })
	});
}
function UpdateDialogContent({ websiteId, onClose }) {
	const { data: website, isLoading, isError, error } = useWebsite(websiteId);
	const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
	const [discontinueOpen, setDiscontinueOpen] = useState(false);
	const [paymentDate, setPaymentDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [renewalDate, setRenewalDate] = useState("");
	const updateMutation = useUpdateWebsite(websiteId);
	const runAction = (payload) => {
		updateMutation.mutate(payload, { onSuccess: onClose });
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex items-start justify-between border-b border-[#f0f4ee] px-5 py-4 dark:border-[#2f4a32]/60",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Dialog.Title, {
			className: "font-extrabold text-[#102315] dark:text-[#edf7ee]",
			children: "Quick Update"
		}), website ? /* @__PURE__ */ jsx(Dialog.Description, {
			className: "mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
			children: website.projectName
		}) : /* @__PURE__ */ jsx(Skeleton, { className: "mt-1 h-4 w-40" })] }), /* @__PURE__ */ jsx(Dialog.Close, {
			render: /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "flex size-7 shrink-0 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#e8f0e4] hover:text-[#102315] dark:hover:bg-[#203423] dark:hover:text-[#edf7ee]"
			}),
			children: /* @__PURE__ */ jsx(X, { className: "size-4" })
		})]
	}), /* @__PURE__ */ jsxs("div", {
		className: "grid gap-2.5 p-5",
		children: [
			isLoading ? /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx(Skeleton, { className: "h-11 rounded-xl" }),
				/* @__PURE__ */ jsx(Skeleton, { className: "h-11 rounded-xl" }),
				/* @__PURE__ */ jsx(Skeleton, { className: "h-11 rounded-xl" })
			] }) : isError ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-destructive",
				children: error.message
			}) : !website ? null : website.allowedActions.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-[#64745F] dark:text-[#9fb49b]",
				children: "No actions available."
			}) : website.allowedActions.map((action) => {
				if (action === "mark-live") return /* @__PURE__ */ jsx(ActionButton, {
					icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-4" }),
					label: "Mark Live",
					disabled: updateMutation.isPending,
					onClick: () => runAction({ websiteStatus: "Live" })
				}, action);
				if (action === "record-payment") return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(ActionButton, {
					icon: /* @__PURE__ */ jsx(CreditCard, { className: "size-4" }),
					label: "Record Payment & Renew",
					onClick: () => setRecordPaymentOpen((o) => !o)
				}), recordPaymentOpen ? /* @__PURE__ */ jsxs("div", {
					className: "mt-2 grid gap-3 rounded-xl border border-[#e8f0e4] bg-[#f8faf7] p-4 dark:border-[#2f4a32] dark:bg-[#101912]",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]",
							children: ["Payment date", /* @__PURE__ */ jsx(Input, {
								type: "date",
								value: paymentDate,
								onChange: (e) => setPaymentDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]",
							children: ["New renewal date", /* @__PURE__ */ jsx(Input, {
								type: "date",
								value: renewalDate,
								onChange: (e) => setRenewalDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ jsx(Button, {
							disabled: updateMutation.isPending || !paymentDate || !renewalDate,
							className: "rounded-lg bg-[#658354] text-white hover:bg-[#4b6043]",
							onClick: () => updateMutation.mutate({
								lastPaymentReceived: paymentDate,
								renewalDate,
								maintenanceStatus: "Active"
							}, { onSuccess: onClose }),
							children: updateMutation.isPending ? "Saving..." : "Save payment"
						})
					]
				}) : null] }, action);
				if (action === "discontinue") return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(ActionButton, {
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
						runAction({
							websiteStatus: "Discontinued",
							maintenanceStatus: "Cancelled"
						});
						setDiscontinueOpen(false);
					},
					isPending: updateMutation.isPending
				})] }, action);
				return null;
			}),
			updateMutation.isPending ? /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-xs text-[#64745F] dark:text-[#9fb49b]",
				children: [/* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }), "Saving..."]
			}) : null,
			updateMutation.isError ? /* @__PURE__ */ jsx("p", {
				className: "text-xs text-destructive",
				children: updateMutation.error.message
			}) : null
		]
	})] });
}
function ActionButton({ icon, label, destructive, disabled, onClick }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		disabled,
		onClick,
		className: cn("flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition", destructive ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40" : "border-[#dde5d8] bg-white text-[#102315] hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:bg-[#132018] dark:text-[#edf7ee] dark:hover:bg-[#203423]", disabled && "cursor-not-allowed opacity-50"),
		children: [icon, label]
	});
}
//#endregion
//#region src/components/websites/websites-table.tsx
var gridClass = "grid grid-cols-[44px_2fr_1fr_0.65fr_0.9fr_1fr_0.9fr_1.1fr_64px]";
function WebsitesTable({ websites, isLoading, isError, error, sortBy, sortOrder, onSortChange, pagination, pageSize, onPageSizeChange, onPageChange, onDelete, dueSoonDays = 30 }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#c7ddb5] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: cn(gridClass, "shrink-0 border-b border-[#c7ddb5] bg-[#ddead1] pr-[var(--scrollbar-w,0px)] dark:border-[#2f4a32] dark:bg-[#203423]"),
				children: [
					/* @__PURE__ */ jsx(HeaderCell, { center: true }),
					/* @__PURE__ */ jsx(HeaderCell, { children: "Project Name" }),
					/* @__PURE__ */ jsx(HeaderCell, { children: "Client" }),
					/* @__PURE__ */ jsx(SortableHeaderCell, {
						field: "siteType",
						label: "Type",
						sortBy,
						sortOrder,
						onSort: onSortChange
					}),
					/* @__PURE__ */ jsx(SortableHeaderCell, {
						field: "platform",
						label: "Platform",
						sortBy,
						sortOrder,
						onSort: onSortChange
					}),
					/* @__PURE__ */ jsx(SortableHeaderCell, {
						field: "websiteStatus",
						label: "Website Status",
						sortBy,
						sortOrder,
						onSort: onSortChange
					}),
					/* @__PURE__ */ jsx(SortableHeaderCell, {
						field: "maintenanceStatus",
						label: "Maintenance",
						sortBy,
						sortOrder,
						onSort: onSortChange
					}),
					/* @__PURE__ */ jsx(SortableHeaderCell, {
						field: "renewalDate",
						label: "Renewal Date",
						sortBy,
						sortOrder,
						onSort: onSortChange
					}),
					/* @__PURE__ */ jsx(HeaderCell, {
						center: true,
						children: "Action"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: isLoading ? /* @__PURE__ */ jsx(StateRow, { children: "Loading..." }) : isError ? /* @__PURE__ */ jsx(StateRow, {
					className: "text-destructive",
					children: error?.message ?? "Something went wrong."
				}) : !websites || websites.length === 0 ? /* @__PURE__ */ jsx(NoResults, { message: "No websites found." }) : websites.map((site) => /* @__PURE__ */ jsx(WebsiteRow, {
					site,
					onDelete,
					dueSoonDays
				}, site.websiteId))
			}),
			pagination ? /* @__PURE__ */ jsxs("footer", {
				className: "flex shrink-0 items-center justify-between border-t border-[#c7ddb5] bg-white px-5 py-3 text-sm text-[#64745F] dark:border-[#2f4a32] dark:bg-[#101912] dark:text-[#b7c8b3]",
				children: [/* @__PURE__ */ jsx(PageSizeSelector, {
					value: pageSize,
					onChange: onPageSizeChange,
					total: pagination.total
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "icon-lg",
							disabled: pagination.page <= 1,
							onClick: () => onPageChange(pagination.page - 1),
							"aria-label": "Previous page",
							children: /* @__PURE__ */ jsx(ChevronLeft, {})
						}),
						Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNumber) => /* @__PURE__ */ jsx(Button, {
							variant: pageNumber === pagination.page ? "default" : "ghost",
							size: "icon-lg",
							className: cn("rounded-lg border border-transparent", pageNumber === pagination.page && "border-[#08712f] bg-white text-[#08712f] hover:bg-[#eef7ed] dark:bg-[#101912]"),
							onClick: () => onPageChange(pageNumber),
							children: pageNumber
						}, pageNumber)),
						/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "icon-lg",
							disabled: pagination.page >= pagination.totalPages,
							onClick: () => onPageChange(pagination.page + 1),
							"aria-label": "Next page",
							children: /* @__PURE__ */ jsx(ChevronRight, {})
						})
					]
				})]
			}) : null
		]
	});
}
function WebsiteRow({ site, onDelete, dueSoonDays }) {
	const navigate = useNavigate();
	const [updateOpen, setUpdateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: cn(gridClass, "min-h-[68px] items-center border-b border-[#c7ddb5]/40 text-[13px] hover:bg-[#ddead1]/30 dark:border-[#2f4a32]/70 dark:hover:bg-[#203423]/70"),
		children: [
			/* @__PURE__ */ jsx(Cell, {
				className: "flex items-center justify-center",
				children: /* @__PURE__ */ jsx("span", {
					className: "flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#08712f] dark:bg-[#163c25] dark:text-[#85e0a3]",
					children: /* @__PURE__ */ jsx(Globe, { className: "size-4" })
				})
			}),
			/* @__PURE__ */ jsxs(Cell, { children: [/* @__PURE__ */ jsx("div", {
				className: "truncate font-bold text-[#102315] dark:text-[#edf7ee]",
				children: site.projectName
			}), site.url ? /* @__PURE__ */ jsx("div", {
				className: "truncate text-xs font-medium text-[#64745F] dark:text-[#9fb49b]",
				children: site.url.replace(/^https?:\/\//, "")
			}) : null] }),
			/* @__PURE__ */ jsx(Cell, {
				className: "truncate font-medium text-[#334155] dark:text-[#b7c8b3]",
				children: site.clientName
			}),
			/* @__PURE__ */ jsx(Cell, {
				className: "truncate font-medium capitalize text-[#334155] dark:text-[#b7c8b3]",
				children: site.siteType
			}),
			/* @__PURE__ */ jsx(Cell, {
				className: "font-medium capitalize text-[#334155] dark:text-[#b7c8b3]",
				children: /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(PlatformMark, { platform: site.platform }), site.platform]
				})
			}),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx(StatusPill, { label: site.websiteStatus }) }),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx(MaintenanceBadge, { label: site.maintenanceStatus }) }),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx(RenewalDateCell, {
				renewalDate: site.renewalDate,
				isOverdue: site.isOverdue,
				dueSoonDays
			}) }),
			/* @__PURE__ */ jsxs(Cell, {
				className: "flex items-center justify-end pr-4",
				children: [
					/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
						render: /* @__PURE__ */ jsx("button", {
							type: "button",
							className: "flex size-7 shrink-0 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#e8f0e4] hover:text-[#102315] dark:hover:bg-[#203423] dark:hover:text-[#edf7ee]",
							"aria-label": `Actions for ${site.projectName}`
						}),
						children: /* @__PURE__ */ jsx(MoreVertical, { className: "size-4" })
					}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
						side: "bottom",
						align: "end",
						sideOffset: 6,
						className: "w-40 rounded-xl border border-[#dde5d8] bg-white p-1 shadow-lg dark:border-[#2f4a32] dark:bg-[#132018]",
						children: [
							/* @__PURE__ */ jsxs(DropdownMenuGroup, { children: [
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									className: "cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#102315] focus:bg-[#f2f6ee] dark:text-[#edf7ee] dark:focus:bg-[#203423]",
									onClick: () => navigate({
										to: "/websites/$websiteId",
										params: { websiteId: site.websiteId }
									}),
									children: [/* @__PURE__ */ jsx(Eye, { className: "size-3.5 text-[#64745F]" }), "View"]
								}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									className: "cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#102315] focus:bg-[#f2f6ee] dark:text-[#edf7ee] dark:focus:bg-[#203423]",
									onClick: () => setUpdateOpen(true),
									children: [/* @__PURE__ */ jsx(RefreshCw, { className: "size-3.5 text-[#64745F]" }), "Update"]
								}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									className: "cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-[#102315] focus:bg-[#f2f6ee] dark:text-[#edf7ee] dark:focus:bg-[#203423]",
									onClick: () => setEditOpen(true),
									children: [/* @__PURE__ */ jsx(Pencil, { className: "size-3.5 text-[#64745F]" }), "Edit"]
								})
							] }),
							/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
							/* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
								className: "cursor-pointer gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30",
								onClick: () => onDelete?.(site),
								children: [/* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }), "Delete"]
							}) })
						]
					})] }),
					/* @__PURE__ */ jsx(WebsiteUpdateDialog, {
						websiteId: site.websiteId,
						open: updateOpen,
						onOpenChange: setUpdateOpen
					}),
					/* @__PURE__ */ jsx(WebsiteEditDialog, {
						websiteId: site.websiteId,
						open: editOpen,
						onOpenChange: setEditOpen
					})
				]
			})
		]
	});
}
function PlatformMark({ platform }) {
	if (platform.toLowerCase() === "wpx") return /* @__PURE__ */ jsx("span", {
		className: "text-base font-black text-blue-600",
		children: "W"
	});
	return /* @__PURE__ */ jsx("span", { className: "size-4 rotate-45 border-2 border-black dark:border-[#edf7ee]" });
}
var MS_PER_DAY = 1440 * 60 * 1e3;
function dayDiff(renewalDate) {
	if (!renewalDate) return 0;
	const now = /* @__PURE__ */ new Date();
	now.setHours(0, 0, 0, 0);
	const due = new Date(renewalDate);
	due.setHours(0, 0, 0, 0);
	return Math.round((due.getTime() - now.getTime()) / MS_PER_DAY);
}
function RenewalDateCell({ renewalDate, isOverdue, dueSoonDays }) {
	if (!renewalDate) return /* @__PURE__ */ jsx("span", {
		className: "text-[#9fb49b]",
		children: "—"
	});
	const diff = dayDiff(renewalDate);
	const dueSoon = !isOverdue && diff >= 0 && diff <= dueSoonDays;
	if (isOverdue) {
		const overdueDays = Math.abs(diff);
		return /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "size-4 shrink-0 text-red-500" }), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col",
				children: [/* @__PURE__ */ jsx("span", {
					className: "font-bold text-red-600 dark:text-red-400",
					children: formatDate(renewalDate)
				}), /* @__PURE__ */ jsxs("span", {
					className: "text-[10px] font-bold text-red-500 dark:text-red-400",
					children: [
						"by ",
						overdueDays,
						" ",
						overdueDays === 1 ? "day" : "days"
					]
				})]
			})]
		});
	}
	if (dueSoon) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(Clock, { className: "size-4 shrink-0 text-yellow-500" }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ jsx("span", {
				className: "font-bold text-yellow-600 dark:text-yellow-400",
				children: formatDate(renewalDate)
			}), /* @__PURE__ */ jsxs("span", {
				className: "text-[10px] font-bold text-yellow-500 dark:text-yellow-400",
				children: [
					"in ",
					diff,
					" ",
					diff === 1 ? "day" : "days"
				]
			})]
		})]
	});
	return /* @__PURE__ */ jsx("span", {
		className: "font-bold text-[#102315] dark:text-[#edf7ee]",
		children: formatDate(renewalDate)
	});
}
function SortableHeaderCell({ field, label, sortBy, sortOrder, onSort }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex h-14 min-w-0 items-center overflow-hidden px-2 py-2",
		children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => onSort(field),
			className: "inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3F6F39] transition hover:text-[#102315] dark:text-[#b6d7a8] dark:hover:text-[#edf7ee]",
			children: [label, sortBy === field ? sortOrder === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ArrowUpDown, { className: "size-3.5 opacity-50" })]
		})
	});
}
function HeaderCell({ children, center }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-14 min-w-0 items-center overflow-hidden px-2 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#3F6F39] dark:text-[#b6d7a8]", center && "justify-center"),
		children
	});
}
function Cell({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("min-w-0 overflow-hidden px-2 py-2", className),
		children
	});
}
function StateRow({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-40 items-center justify-center text-[#64745F]", className),
		children
	});
}
//#endregion
//#region src/components/websites/websites-tabs.tsx
var TAB_FILTERS = {
	all: {},
	inProgress: { websiteStatus: "In Progress" },
	overdue: { maintenanceStatus: "Expired" },
	dueSoon: { maintenanceStatus: "Due Soon" }
};
function WebsitesTabs({ active, stats, onChange }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex items-center gap-1",
		children: [
			{
				key: "all",
				label: "All",
				count: stats?.websites
			},
			{
				key: "inProgress",
				label: "In Progress",
				count: stats?.inProgress,
				dot: "bg-amber-400"
			},
			{
				key: "overdue",
				label: "Overdue",
				count: stats?.expired,
				dot: "bg-red-500"
			},
			{
				key: "dueSoon",
				label: "Due Soon",
				count: stats?.dueSoon,
				dot: "bg-yellow-400"
			}
		].map((tab) => {
			const isActive = active === tab.key;
			return /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => onChange(tab.key, TAB_FILTERS[tab.key]),
				className: cn("flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-sm font-semibold text-[#334155] transition hover:bg-[#eef7ed] hover:text-[#08712f] dark:text-[#d6e8cf] dark:hover:bg-[#203423]", isActive && "bg-[#e8f6eb] text-[#08712f] dark:bg-[#203423] dark:text-[#b6d7a8]"),
				children: [
					tab.dot ? /* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", tab.dot) }) : null,
					tab.label,
					/* @__PURE__ */ jsx("span", {
						className: cn("rounded-full px-2 py-0.5 text-xs font-bold", isActive ? "bg-[#ccefd8] text-[#08712f]" : "bg-slate-100 text-slate-600 dark:bg-[#26342a] dark:text-[#d6e8cf]"),
						children: tab.count ?? "-"
					})
				]
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
	const [deleteTarget, setDeleteTarget] = useState(null);
	const deleteMutation = useDeleteWebsite(deleteTarget?.websiteId ?? "");
	const handleDeleteConfirm = () => {
		if (!deleteTarget) return;
		deleteMutation.mutate(void 0, { onSuccess: () => setDeleteTarget(null) });
	};
	const pagination = websitesQuery.data?.pagination;
	const activeFilterCount = Object.entries(filters).filter(([key, value]) => key !== "sortBy" && key !== "sortOrder" && key !== "search" && value !== void 0 && value !== "" && value !== false).length;
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
	return /* @__PURE__ */ jsxs("main", {
		className: "flex min-h-0 flex-1 flex-col gap-4 overflow-hidden bg-[#f2f6ee] p-4 dark:bg-[#0b110d]",
		children: [
			/* @__PURE__ */ jsx(TopBarSlot, {
				routeKey: "/",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex w-full flex-col gap-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex w-full items-center gap-4",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "shrink-0 whitespace-nowrap text-[22px] font-extrabold leading-none tracking-normal text-[#102315] dark:text-[#edf7ee]",
							children: "Websites"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-1 items-center justify-end gap-2 flex-nowrap",
							children: [
								/* @__PURE__ */ jsx(SearchBar, {
									value: searchQuery,
									onChange: setSearchQuery,
									placeholder: "Search websites...",
									className: "w-[200px]"
								}),
								/* @__PURE__ */ jsx(WebsitesTabs, {
									active: routeSearch.tab ?? "all",
									stats: statsQuery.data,
									onChange: handleTabChange
								}),
								/* @__PURE__ */ jsxs(Button, {
									variant: "outline",
									size: "lg",
									className: cn("relative h-10 shrink-0 rounded-xl border-[#dde5d8] bg-white px-4 text-[#334155] shadow-sm hover:bg-[#f8faf7] hover:text-[#08712f] dark:border-[#2f4a32] dark:bg-[#132018] dark:text-[#d6e8cf] dark:hover:bg-[#203423]", routeSearch.showFilters && "bg-[#ddead1]/60 text-[#658354]"),
									onClick: () => updateSearch({ showFilters: !routeSearch.showFilters }),
									"aria-label": "Toggle filters",
									children: [
										/* @__PURE__ */ jsx(ListFilter, { className: "size-4" }),
										"Filter",
										activeFilterCount > 0 ? /* @__PURE__ */ jsx("span", {
											className: "absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#658354] text-[10px] text-white",
											children: activeFilterCount
										}) : null
									]
								}),
								/* @__PURE__ */ jsxs(Button, {
									className: "h-10 shrink-0 rounded-xl bg-[#658354] px-4 font-bold text-white hover:bg-[#4b6043]",
									render: /* @__PURE__ */ jsx(Link, {
										to: "/websites/new",
										search: { clientId: void 0 }
									}),
									children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), "Add Website"]
								})
							]
						})]
					}), routeSearch.showFilters ? /* @__PURE__ */ jsx("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ jsx(WebsitesFiltersBar, {
							filters,
							onChange: updateFilters,
							clients: clientsQuery.data?.items ?? []
						})
					}) : null]
				})
			}),
			/* @__PURE__ */ jsx(WebsitesTable, {
				websites: websitesQuery.data?.items,
				isLoading: websitesQuery.isLoading,
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
			}),
			/* @__PURE__ */ jsx(ConfirmDialog, {
				open: deleteTarget !== null,
				onOpenChange: (open) => {
					if (!open) setDeleteTarget(null);
				},
				title: "Delete Website",
				description: `Are you sure you want to delete "${deleteTarget?.projectName}"? This action cannot be undone.`,
				confirmLabel: "Delete",
				onConfirm: handleDeleteConfirm,
				isPending: deleteMutation.isPending
			})
		]
	});
}
//#endregion
export { WebsitesPage as component };
