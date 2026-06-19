import { n as cn, t as Button } from "./button-FgxVcNwj.js";
import { t as Route } from "./_protected-BeLN7Ta_.js";
import { t as Input } from "./input-DJQsF0Xj.js";
import { a as DropdownMenuSeparator, i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuGroup, t as DropdownMenu } from "./dropdown-menu-B8E-ZA17.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { t as ConfirmDialog } from "./confirm-dialog-Bm6pbGp0.js";
import { t as Skeleton } from "./skeleton-BjBHU5LC.js";
import { t as formatDate } from "./format-BWQocT_r.js";
import { n as useDebounce, r as PageSizeSelector, t as NoResults } from "./no-results-Dvtqy8IC.js";
import { a as useWebsite, c as useWebsites, i as useUpdateWebsite, n as useClientOptions, r as useDeleteWebsite, s as useWebsiteStats } from "./website-form-DTxAujeE.js";
import { n as MaintenanceBadge, r as StatusPill, t as WebsiteEditDialog } from "./website-edit-dialog-9wKQ9uJy.js";
import { t as useSettings } from "./use-settings-BSp_RzH-.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, CreditCard, Eye, Globe2, Loader2, MoreVertical, Pencil, RefreshCw, Trash2, X, XCircle } from "lucide-react";
import { Dialog } from "@base-ui/react";
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
var gridClass = "grid min-w-[900px] grid-cols-[40px_minmax(170px,1.55fr)_minmax(112px,0.94fr)_minmax(80px,0.68fr)_minmax(92px,0.82fr)_minmax(92px,0.78fr)_minmax(108px,0.86fr)_minmax(124px,0.9fr)_40px]";
function WebsitesTable({ websites, isLoading, isError, error, sortBy, sortOrder, onSortChange, pagination, pageSize, onPageSizeChange, onPageChange, onDelete, dueSoonDays = 30 }) {
	const pageNumbers = useMemo(() => {
		if (!pagination) return [];
		return Array.from({ length: pagination.totalPages }, (_, index) => index + 1);
	}, [pagination]);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-[#e7ebf3] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "hidden min-h-0 flex-1 flex-col overflow-hidden lg:flex",
				children: [/* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("div", {
						className: cn(gridClass, "border-b border-[#edf1f7] bg-white px-3"),
						children: [
							/* @__PURE__ */ jsx(HeaderCell, {
								center: true,
								children: /* @__PURE__ */ jsx("div", {
									className: "flex size-7 items-center justify-center rounded-full border border-[#dbe3ef] text-[#64748b]",
									children: /* @__PURE__ */ jsx(Globe2, { className: "size-3.5" })
								})
							}),
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
								label: "Status",
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
								children: "Actions"
							})
						]
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "min-h-0 flex-1 overflow-auto",
					children: /* @__PURE__ */ jsx(TableState, {
						websites,
						isLoading,
						isError,
						error,
						dueSoonDays,
						onDelete
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex min-h-[340px] flex-1 flex-col gap-3 p-4 lg:hidden",
				children: isLoading ? /* @__PURE__ */ jsx(StateRow, { children: "Loading..." }) : isError ? /* @__PURE__ */ jsx(StateRow, {
					className: "text-destructive",
					children: error?.message ?? "Something went wrong."
				}) : !websites || websites.length === 0 ? /* @__PURE__ */ jsx(NoResults, { message: "No websites found." }) : websites.map((site) => /* @__PURE__ */ jsx(WebsiteCard, {
					site,
					onDelete,
					dueSoonDays
				}, site.websiteId))
			}),
			pagination ? /* @__PURE__ */ jsx("footer", {
				className: "sticky bottom-0 z-10 flex shrink-0 flex-col gap-2 border-t border-[#edf1f7] bg-white px-4 py-2.5 shadow-[0_-8px_24px_rgba(15,23,42,0.03)]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ jsx(PageSizeSelector, {
						value: pageSize,
						onChange: onPageSizeChange,
						total: pagination.total,
						page: pagination.page,
						limit: pagination.limit,
						className: "justify-start"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2 md:justify-center",
						children: [
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								size: "lg",
								className: "h-9 rounded-xl px-3 text-[13px]",
								disabled: pagination.page <= 1,
								onClick: () => onPageChange(pagination.page - 1),
								children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }), "Previous"]
							}),
							pageNumbers.map((pageNumber) => /* @__PURE__ */ jsx(Button, {
								variant: pageNumber === pagination.page ? "default" : "outline",
								size: "icon-lg",
								className: cn("size-9 rounded-xl border-[#e5e7ef] shadow-none text-[13px]", pageNumber === pagination.page ? "bg-[#ede9fe] text-[#5b38f6] hover:bg-[#e4ddff]" : "bg-white text-[#334155] hover:text-[#5b38f6]"),
								onClick: () => onPageChange(pageNumber),
								children: pageNumber
							}, pageNumber)),
							/* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								size: "lg",
								className: "h-9 rounded-xl px-3 text-[13px]",
								disabled: pagination.page >= pagination.totalPages,
								onClick: () => onPageChange(pagination.page + 1),
								children: ["Next", /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })]
							})
						]
					})]
				})
			}) : null
		]
	});
}
function TableState({ websites, isLoading, isError, error, onDelete, dueSoonDays }) {
	if (isLoading) return /* @__PURE__ */ jsx(StateRow, { children: "Loading..." });
	if (isError) return /* @__PURE__ */ jsx(StateRow, {
		className: "text-destructive",
		children: error?.message ?? "Something went wrong."
	});
	if (!websites || websites.length === 0) return /* @__PURE__ */ jsx(NoResults, { message: "No websites found." });
	return websites.map((site) => /* @__PURE__ */ jsx(WebsiteRow, {
		site,
		onDelete,
		dueSoonDays
	}, site.websiteId));
}
function WebsiteRow({ site, onDelete, dueSoonDays }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn(gridClass, "items-center border-b border-[#edf1f7] px-3 text-[13px] text-[#0f172a] last:border-b-0 hover:bg-[#fcfcfe]"),
		children: [
			/* @__PURE__ */ jsx(Cell, {
				className: "flex items-center justify-center",
				children: /* @__PURE__ */ jsx(ProjectAvatar, { site })
			}),
			/* @__PURE__ */ jsxs(Cell, { children: [/* @__PURE__ */ jsx("div", {
				className: "truncate text-[13px] font-semibold text-[#111827]",
				children: site.projectName
			}), site.url ? /* @__PURE__ */ jsx("div", {
				className: "truncate text-[11px] text-[#667085]",
				children: site.url.replace(/^https?:\/\//, "")
			}) : null] }),
			/* @__PURE__ */ jsx(Cell, {
				className: "truncate text-[13px] text-[#334155]",
				children: site.clientName
			}),
			/* @__PURE__ */ jsx(Cell, {
				className: "truncate text-[13px] capitalize text-[#334155]",
				children: site.siteType
			}),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsxs("span", {
				className: "inline-flex items-center gap-1.5 text-[13px] text-[#334155]",
				children: [/* @__PURE__ */ jsx(PlatformMark, { platform: site.platform }), /* @__PURE__ */ jsx("span", { children: site.platform === "WPX" ? "Wpx" : site.platform })]
			}) }),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx(StatusPill, { label: site.websiteStatus }) }),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx(MaintenanceBadge, { label: site.maintenanceStatus }) }),
			/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx(RenewalDateCell, {
				renewalDate: site.renewalDate,
				isOverdue: site.isOverdue,
				dueSoonDays
			}) }),
			/* @__PURE__ */ jsx(Cell, {
				className: "flex justify-center",
				children: /* @__PURE__ */ jsx(WebsiteActions, {
					site,
					onDelete
				})
			})
		]
	});
}
function WebsiteCard({ site, onDelete, dueSoonDays }) {
	return /* @__PURE__ */ jsx("div", {
		className: "rounded-2xl border border-[#e7ebf3] bg-white p-4 shadow-sm",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ jsx(ProjectAvatar, { site }), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("div", {
							className: "truncate text-[15px] font-semibold text-[#111827]",
							children: site.projectName
						}), site.url ? /* @__PURE__ */ jsx("div", {
							className: "mt-0.5 truncate text-[13px] text-[#667085]",
							children: site.url.replace(/^https?:\/\//, "")
						}) : null]
					}), /* @__PURE__ */ jsx(WebsiteActions, {
						site,
						onDelete
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsx(MetaItem, {
							label: "Client",
							value: site.clientName ?? "-"
						}),
						/* @__PURE__ */ jsx(MetaItem, {
							label: "Type",
							value: site.siteType,
							capitalize: true
						}),
						/* @__PURE__ */ jsx(MetaItem, {
							label: "Platform",
							valueNode: /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(PlatformMark, { platform: site.platform }), site.platform]
							})
						}),
						/* @__PURE__ */ jsx(MetaItem, {
							label: "Status",
							valueNode: /* @__PURE__ */ jsx(StatusPill, { label: site.websiteStatus })
						}),
						/* @__PURE__ */ jsx(MetaItem, {
							label: "Maintenance",
							valueNode: /* @__PURE__ */ jsx(MaintenanceBadge, { label: site.maintenanceStatus })
						}),
						/* @__PURE__ */ jsx(MetaItem, {
							label: "Renewal",
							valueNode: /* @__PURE__ */ jsx(RenewalDateCell, {
								renewalDate: site.renewalDate,
								isOverdue: site.isOverdue,
								dueSoonDays
							})
						})
					]
				})]
			})]
		})
	});
}
function MetaItem({ label, value, valueNode, capitalize = false }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl bg-[#f8fafc] px-3 py-2",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[11px] font-semibold uppercase tracking-normal text-[#94a3b8]",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: cn("mt-1 text-[14px] text-[#334155]", capitalize && "capitalize"),
			children: valueNode ?? value
		})]
	});
}
function ProjectAvatar({ site }) {
	return /* @__PURE__ */ jsx("span", {
		className: "flex size-6.5 shrink-0 items-center justify-center rounded-full bg-[#e8faf0] text-[#12b76a]",
		children: /* @__PURE__ */ jsx(Globe2, { className: "size-3.5" })
	});
}
function WebsiteActions({ site, onDelete }) {
	const navigate = useNavigate();
	const [updateOpen, setUpdateOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			render: /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "flex size-7 items-center justify-center rounded-xl text-[#111827] transition hover:bg-[#f5f7fb] hover:text-[#5b38f6]",
				"aria-label": `Actions for ${site.projectName}`
			}),
			children: /* @__PURE__ */ jsx(MoreVertical, { className: "size-4" })
		}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
			align: "end",
			sideOffset: 8,
			className: "w-40 rounded-2xl border border-[#e4e8f0] bg-white p-1.5 shadow-xl",
			children: [
				/* @__PURE__ */ jsxs(DropdownMenuGroup, { children: [
					/* @__PURE__ */ jsxs(DropdownMenuItem, {
						className: "cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-[#0f172a] focus:bg-[#f4f1ff]",
						onClick: () => navigate({
							to: "/websites/$websiteId",
							params: { websiteId: site.websiteId }
						}),
						children: [/* @__PURE__ */ jsx(Eye, { className: "size-4 text-[#64748b]" }), "View"]
					}),
					/* @__PURE__ */ jsxs(DropdownMenuItem, {
						className: "cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-[#0f172a] focus:bg-[#f4f1ff]",
						onClick: () => setUpdateOpen(true),
						children: [/* @__PURE__ */ jsx(RefreshCw, { className: "size-4 text-[#64748b]" }), "Update"]
					}),
					/* @__PURE__ */ jsxs(DropdownMenuItem, {
						className: "cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-[#0f172a] focus:bg-[#f4f1ff]",
						onClick: () => setEditOpen(true),
						children: [/* @__PURE__ */ jsx(Pencil, { className: "size-4 text-[#64748b]" }), "Edit"]
					})
				] }),
				/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
				/* @__PURE__ */ jsxs(DropdownMenuItem, {
					className: "cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-red-600 focus:bg-red-50",
					onClick: () => onDelete?.(site),
					children: [/* @__PURE__ */ jsx(Trash2, { className: "size-4" }), "Delete"]
				})
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
	] });
}
function PlatformMark({ platform }) {
	if (platform.toLowerCase() === "wpx") return /* @__PURE__ */ jsx("span", {
		className: "text-[16px] font-black leading-none text-[#2457ff]",
		children: "W"
	});
	return /* @__PURE__ */ jsx("span", {
		className: "relative block size-3.5 rotate-45 rounded-[3px] border-2 border-[#111827]",
		children: /* @__PURE__ */ jsx("span", { className: "absolute inset-[2px] rounded-[2px] bg-white" })
	});
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
		className: "text-[#94a3b8]",
		children: "-"
	});
	const diff = dayDiff(renewalDate);
	const dueSoon = !isOverdue && diff >= 0 && diff <= dueSoonDays;
	if (isOverdue) {
		const overdueDays = Math.abs(diff);
		return /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-1.5",
			children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "mt-0.5 size-3 shrink-0 text-[#ef4444]" }), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx("div", {
					className: "font-medium text-[#ef4444]",
					children: formatDate(renewalDate)
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-[10px] text-[#ef4444]",
					children: [
						"by ",
						overdueDays,
						" days"
					]
				})]
			})]
		});
	}
	if (dueSoon) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-start gap-1.5",
		children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "mt-0.5 size-3 shrink-0 text-[#94a3b8]" }), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsx("div", {
				className: "font-medium text-[#334155]",
				children: formatDate(renewalDate)
			}), /* @__PURE__ */ jsxs("div", {
				className: "text-[10px] text-[#64748b]",
				children: [
					"in ",
					diff,
					" days"
				]
			})]
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ jsx(CalendarDays, { className: "size-3 shrink-0 text-[#94a3b8]" }), /* @__PURE__ */ jsx("span", {
			className: "font-medium text-[#334155]",
			children: formatDate(renewalDate)
		})]
	});
}
function SortableHeaderCell({ field, label, sortBy, sortOrder, onSort }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex h-12 min-w-0 items-center px-2 py-2",
		children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => onSort(field),
			className: "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-normal text-[#475467] transition hover:text-[#5b38f6] xl:text-[11px]",
			children: [label, sortBy === field ? sortOrder === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ArrowUpDown, { className: "size-3.5 opacity-50" })]
		})
	});
}
function HeaderCell({ children, center }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-10 min-w-0 items-center px-2 py-1.5 text-[10px] font-semibold uppercase tracking-normal text-[#475467] xl:h-11 xl:text-[11px]", center && "justify-center"),
		children
	});
}
function Cell({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("min-w-0 px-2 py-1.5", className),
		children
	});
}
function StateRow({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-40 items-center justify-center text-[#64748b]", className),
		children
	});
}
//#endregion
//#region src/components/websites/websites-tabs.tsx
var TAB_FILTERS = {
	all: {},
	live: { websiteStatus: "Live" },
	inProgress: { websiteStatus: "In Progress" },
	overdue: { maintenanceStatus: "Expired" },
	dueSoon: { maintenanceStatus: "Due Soon" }
};
function LiveDot({ className }) {
	return /* @__PURE__ */ jsx("span", { className: cn("inline-block size-3 rounded-full bg-[#22c55e]", className) });
}
function WebsitesTabs({ active, stats, onChange, onRefresh }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between gap-4 border-b border-[#ebeff6]",
		children: [/* @__PURE__ */ jsx("div", {
			className: "-mb-px flex min-w-0 gap-6 overflow-x-auto",
			children: [
				{
					key: "all",
					label: "All",
					count: stats?.websites,
					icon: Globe2,
					tone: "text-[#5b38f6]"
				},
				{
					key: "live",
					label: "Live",
					count: stats?.live,
					icon: LiveDot,
					tone: ""
				},
				{
					key: "inProgress",
					label: "In Progress",
					count: stats?.inProgress,
					icon: Clock3,
					tone: "text-[#f97316]"
				},
				{
					key: "overdue",
					label: "Overdue",
					count: stats?.expired,
					icon: AlertTriangle,
					tone: "text-[#ef4444]"
				},
				{
					key: "dueSoon",
					label: "Due Soon",
					count: stats?.dueSoon,
					icon: RefreshCw,
					tone: "text-[#2563eb]"
				}
			].map((tab) => {
				const Icon = tab.icon;
				const isActive = active === tab.key;
				return /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => onChange(tab.key, TAB_FILTERS[tab.key]),
					className: cn("flex h-12 shrink-0 items-center gap-2.5 border-b-2 border-transparent px-1 text-[14px] font-medium text-[#1f2937] transition", isActive && "border-[#5b38f6] text-[#5b38f6]"),
					children: [
						/* @__PURE__ */ jsx(Icon, { className: cn("size-4", tab.tone, isActive && tab.key === "all" && "text-[#5b38f6]") }),
						/* @__PURE__ */ jsx("span", { children: tab.label }),
						/* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-[#eef2f7] px-2 py-0.5 text-[12px] font-semibold text-[#334155]",
							children: tab.count ?? "-"
						})
					]
				}, tab.key);
			})
		}), onRefresh ? /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: onRefresh,
			className: "mb-2 flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e7ebf3] bg-white text-[#64748b] transition hover:border-[#d9dfec] hover:text-[#5b38f6]",
			"aria-label": "Refresh websites",
			title: "Refresh websites",
			children: /* @__PURE__ */ jsx(RefreshCw, { className: "size-4" })
		}) : null]
	});
}
//#endregion
//#region src/routes/_protected/index.tsx?tsr-split=component
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
function WebsitesPage() {
	const routeSearch = Route.useSearch();
	const navigate = Route.useNavigate();
	const filters = pickFilters(routeSearch);
	const [searchQuery, setSearchQuery] = useState(routeSearch.search ?? "");
	const debouncedSearch = useDebounce(searchQuery, 300);
	const statsQuery = useWebsiteStats();
	const settingsQuery = useSettings();
	const clientsQuery = useClientOptions();
	const websitesQuery = useWebsites(filters, routeSearch.page, routeSearch.limit);
	const dueSoonDays = settingsQuery.data ? parseInt(settingsQuery.data.renewal_window_days, 10) : 30;
	const [deleteTarget, setDeleteTarget] = useState(null);
	const deleteMutation = useDeleteWebsite(deleteTarget?.websiteId ?? "");
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
	const pagination = websitesQuery.data?.pagination;
	useMemo(() => (clientsQuery.data?.items ?? []).map((client) => ({
		clientId: client.clientId,
		name: client.name
	})), [clientsQuery.data]);
	const updateSearch = (next) => {
		navigate({ search: (old) => ({
			...old,
			...next
		}) });
	};
	const handleDeleteConfirm = () => {
		if (!deleteTarget) return;
		deleteMutation.mutate(void 0, { onSuccess: () => setDeleteTarget(null) });
	};
	const handleTabChange = (nextTab, tabFilters) => {
		navigate({ search: (old) => ({
			...old,
			tab: nextTab,
			websiteStatus: tabFilters.websiteStatus,
			maintenanceStatus: tabFilters.maintenanceStatus,
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(TopBarSlot, {
		routeKey: "/",
		children: /* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-[24px] font-semibold leading-none text-[#111827]",
				children: "Websites"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1.5 text-[14px] text-[#475467]",
				children: "Manage and monitor all your websites in one place."
			})]
		})
	}), /* @__PURE__ */ jsxs("main", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fafbfd] px-3 pb-3 pt-4 lg:px-5 xl:px-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex min-h-0 w-full max-w-[1280px] flex-1 flex-col gap-3",
			children: [/* @__PURE__ */ jsx(WebsitesTabs, {
				active: routeSearch.tab ?? "all",
				stats: statsQuery.data,
				onChange: handleTabChange,
				onRefresh: () => {
					websitesQuery.refetch();
					statsQuery.refetch();
				}
			}), /* @__PURE__ */ jsx("div", {
				className: "min-h-0 flex-1",
				children: /* @__PURE__ */ jsx(WebsitesTable, {
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
				})
			})]
		}), /* @__PURE__ */ jsx(ConfirmDialog, {
			open: deleteTarget !== null,
			onOpenChange: (open) => {
				if (!open) setDeleteTarget(null);
			},
			title: "Delete Website",
			description: `Are you sure you want to delete "${deleteTarget?.projectName}"? This action cannot be undone.`,
			confirmLabel: "Delete",
			onConfirm: handleDeleteConfirm,
			isPending: deleteMutation.isPending
		})]
	})] });
}
//#endregion
export { WebsitesPage as component };
