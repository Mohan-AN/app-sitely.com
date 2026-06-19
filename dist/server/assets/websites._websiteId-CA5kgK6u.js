import { n as cn, t as Button } from "./button-FgxVcNwj.js";
import { t as Route } from "./websites._websiteId-E7e23uaP.js";
import { t as Input } from "./input-DJQsF0Xj.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { t as ConfirmDialog } from "./confirm-dialog-Bm6pbGp0.js";
import { t as Skeleton } from "./skeleton-BjBHU5LC.js";
import { t as formatDate } from "./format-BWQocT_r.js";
import { a as useWebsite, i as useUpdateWebsite, o as useWebsiteActivity } from "./website-form-DTxAujeE.js";
import { r as StatusPill, t as WebsiteEditDialog } from "./website-edit-dialog-9wKQ9uJy.js";
import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, CalendarCheck2, CalendarClock, CalendarDays, CheckCircle2, ChevronRight, CreditCard, ExternalLink, FileText, Globe, Layers, Link2, PauseCircle, Pencil, RefreshCw, Server, XCircle } from "lucide-react";
//#region src/components/websites/website-detail.tsx
var ACTION_CONFIG = {
	"mark-live": {
		label: "Mark Live",
		icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-4" }),
		variant: "outline"
	},
	"record-payment": {
		label: "Record Payment & Renew",
		icon: /* @__PURE__ */ jsx(CreditCard, { className: "size-4" }),
		variant: "outline"
	},
	"mark-transfer-completed": {
		label: "Mark Transfer Completed",
		icon: /* @__PURE__ */ jsx(CalendarCheck2, { className: "size-4" }),
		variant: "outline"
	},
	"put-on-hold": {
		label: "Put On Hold",
		icon: /* @__PURE__ */ jsx(PauseCircle, { className: "size-4" }),
		variant: "outline"
	},
	discontinue: {
		label: "Discontinue",
		icon: /* @__PURE__ */ jsx(XCircle, { className: "size-4" }),
		variant: "destructive"
	}
};
function WebsiteDetail({ website }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid auto-rows-min gap-4",
			children: [
				/* @__PURE__ */ jsx(OverviewCard, { website }),
				/* @__PURE__ */ jsx(KeyDatesCard, { website }),
				/* @__PURE__ */ jsx(NotesCard, { website }),
				/* @__PURE__ */ jsx(ActivityCard, { websiteId: website.websiteId })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid auto-rows-min gap-4",
			children: [/* @__PURE__ */ jsx(ActionsCard, { website }), /* @__PURE__ */ jsx(RenewalSummaryCard, { website })]
		})]
	});
}
function WebsiteDetailSkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-4",
			children: [
				/* @__PURE__ */ jsx(Skeleton, { className: "h-52 rounded-xl" }),
				/* @__PURE__ */ jsx(Skeleton, { className: "h-52 rounded-xl" }),
				/* @__PURE__ */ jsx(Skeleton, { className: "h-28 rounded-xl" })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4",
			children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-48 rounded-xl" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-52 rounded-xl" })]
		})]
	});
}
function OverviewCard({ website }) {
	return /* @__PURE__ */ jsxs(Card, { children: [
		/* @__PURE__ */ jsx(CardHeader, { title: "Overview" }),
		/* @__PURE__ */ jsxs("div", {
			className: "grid divide-y divide-[#f0f4ee] dark:divide-[#2f4a32]/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0",
			children: [
				/* @__PURE__ */ jsx(OverviewItem, {
					icon: /* @__PURE__ */ jsx(Globe, { className: "size-4" }),
					label: "Client",
					children: /* @__PURE__ */ jsx("a", {
						href: `/clients/${website.clientId}`,
						className: "font-bold text-[#102315] underline-offset-2 hover:underline dark:text-[#edf7ee]",
						children: website.clientName
					})
				}),
				/* @__PURE__ */ jsx(OverviewItem, {
					icon: /* @__PURE__ */ jsx(Layers, { className: "size-4" }),
					label: "Type",
					children: /* @__PURE__ */ jsx("span", {
						className: "font-bold text-[#102315] dark:text-[#edf7ee] capitalize",
						children: website.siteType
					})
				}),
				/* @__PURE__ */ jsx(OverviewItem, {
					icon: /* @__PURE__ */ jsx(Server, { className: "size-4" }),
					label: "Platform",
					children: /* @__PURE__ */ jsx("span", {
						className: "font-bold text-[#102315] dark:text-[#edf7ee] uppercase",
						children: website.platform
					})
				})
			]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "grid divide-y divide-[#f0f4ee] dark:divide-[#2f4a32]/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0 border-t border-[#f0f4ee] dark:border-[#2f4a32]/60",
			children: [
				/* @__PURE__ */ jsx(OverviewItem, {
					icon: /* @__PURE__ */ jsx(Link2, { className: "size-4" }),
					label: "URL",
					children: website.url ? /* @__PURE__ */ jsxs("a", {
						href: website.url,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-1 font-medium text-[#658354] underline-offset-2 hover:underline dark:text-[#85e0a3]",
						children: [website.url.replace(/^https?:\/\//, ""), /* @__PURE__ */ jsx(ExternalLink, { className: "size-3" })]
					}) : /* @__PURE__ */ jsx("span", {
						className: "text-sm text-[#64745F] dark:text-[#9fb49b]",
						children: "Not set"
					})
				}),
				/* @__PURE__ */ jsx(OverviewItem, {
					icon: /* @__PURE__ */ jsx(RefreshCw, { className: "size-4" }),
					label: "Website Status",
					children: /* @__PURE__ */ jsx(StatusPill, { label: website.websiteStatus })
				}),
				/* @__PURE__ */ jsx(OverviewItem, {
					icon: /* @__PURE__ */ jsx(CalendarClock, { className: "size-4" }),
					label: "Maintenance",
					children: /* @__PURE__ */ jsx(StatusPill, { label: website.maintenanceStatus })
				})
			]
		}),
		website.isOverdue ? /* @__PURE__ */ jsx("div", {
			className: "border-t border-[#f0f4ee] dark:border-[#2f4a32]/60",
			children: /* @__PURE__ */ jsx(OverviewItem, {
				icon: /* @__PURE__ */ jsx(RefreshCw, { className: "size-4" }),
				label: "Renewal State",
				children: /* @__PURE__ */ jsx(StatusPill, { label: "Overdue" })
			})
		}) : null
	] });
}
function OverviewItem({ icon, label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-2 px-5 py-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-1.5 text-xs font-semibold text-[#64745F] dark:text-[#9fb49b]",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[#a0b89a] dark:text-[#6a9b70]",
				children: icon
			}), label]
		}), /* @__PURE__ */ jsx("div", {
			className: "text-sm",
			children
		})]
	});
}
function KeyDatesCard({ website }) {
	const dates = [
		{
			label: "Start Date",
			value: website.startDate
		},
		{
			label: "Hosted Date",
			value: website.hostedDate
		},
		{
			label: "Handover Date",
			value: website.handoverDate
		},
		{
			label: "Last Invoice Sent",
			value: website.lastInvoiceSent
		},
		{
			label: "Last Payment Received",
			value: website.lastPaymentReceived
		},
		{
			label: "Renewal Date",
			value: website.renewalDate,
			overdue: website.isOverdue
		}
	];
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { title: "Key Dates" }), /* @__PURE__ */ jsx("div", {
		className: "grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3",
		children: dates.map((date) => /* @__PURE__ */ jsxs("div", {
			className: cn("flex items-center gap-3 rounded-xl border p-3", date.overdue ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20" : "border-[#e8f0e4] bg-[#f8faf7] dark:border-[#2f4a32] dark:bg-[#132018]"),
			children: [/* @__PURE__ */ jsx("span", {
				className: cn("flex size-8 shrink-0 items-center justify-center rounded-full", date.overdue ? "bg-red-100 text-red-500 dark:bg-red-950/40 dark:text-red-400" : "bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]"),
				children: /* @__PURE__ */ jsx(CalendarDays, { className: "size-4" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "text-[11px] font-semibold uppercase tracking-wide text-[#64745F] dark:text-[#9fb49b]",
				children: date.label
			}), /* @__PURE__ */ jsx("div", {
				className: cn("mt-0.5 text-sm font-bold", date.overdue ? "text-red-600 dark:text-red-400" : "text-[#102315] dark:text-[#edf7ee]"),
				children: formatDate(date.value)
			})] })]
		}, date.label))
	})] });
}
function NotesCard({ website }) {
	return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
		className: "flex items-start gap-4 p-5",
		children: [/* @__PURE__ */ jsx("span", {
			className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]",
			children: /* @__PURE__ */ jsx(FileText, { className: "size-5" })
		}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
			className: "font-bold text-[#102315] dark:text-[#edf7ee]",
			children: "Notes / Remarks"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1.5 whitespace-pre-wrap text-sm text-[#475467] dark:text-[#9fb49b]",
			children: website.remarks || "No remarks added."
		})] })]
	}) });
}
function ActionsCard({ website }) {
	const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
	const [discontinueOpen, setDiscontinueOpen] = useState(false);
	const [paymentDate, setPaymentDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [renewalDate, setRenewalDate] = useState("");
	const updateMutation = useUpdateWebsite(website.websiteId);
	const runAction = (action) => {
		const payload = actionPayload(action, website);
		if (!payload) return;
		updateMutation.mutate(payload);
	};
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, {
		title: "Actions",
		subtitle: "Quick actions you can take for this website."
	}), /* @__PURE__ */ jsxs("div", {
		className: "grid gap-2.5 p-5 pt-0",
		children: [
			website.allowedActions.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-[#64745F] dark:text-[#9fb49b]",
				children: "No actions available."
			}) : null,
			website.allowedActions.map((action) => {
				const cfg = ACTION_CONFIG[action];
				const isDestructive = cfg.variant === "destructive";
				if (action === "record-payment") return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(ActionButton, {
					icon: cfg.icon,
					label: cfg.label,
					destructive: false,
					onClick: () => setRecordPaymentOpen((o) => !o)
				}), recordPaymentOpen ? /* @__PURE__ */ jsxs("div", {
					className: "mt-2 grid gap-3 rounded-xl border border-[#e8f0e4] bg-[#f8faf7] p-4 dark:border-[#2f4a32] dark:bg-[#132018]",
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
							}),
							children: updateMutation.isPending ? "Saving..." : "Save payment"
						})
					]
				}) : null] }, action);
				if (action === "discontinue") return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(ActionButton, {
					icon: cfg.icon,
					label: cfg.label,
					destructive: true,
					onClick: () => setDiscontinueOpen(true)
				}), /* @__PURE__ */ jsx(ConfirmDialog, {
					open: discontinueOpen,
					onOpenChange: setDiscontinueOpen,
					title: "Discontinue Website",
					description: "This will mark the website as Discontinued and cancel maintenance. This action is final.",
					confirmLabel: "Discontinue",
					onConfirm: () => {
						runAction("discontinue");
						setDiscontinueOpen(false);
					},
					isPending: updateMutation.isPending
				})] }, action);
				return /* @__PURE__ */ jsx(ActionButton, {
					icon: cfg.icon,
					label: cfg.label,
					destructive: isDestructive,
					disabled: updateMutation.isPending,
					onClick: () => runAction(action)
				}, action);
			}),
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
function RenewalSummaryCard({ website }) {
	const nextAction = website.isOverdue ? "Payment Required" : website.maintenanceStatus === "Active" ? "On Track" : "Review Needed";
	const nextActionColor = website.isOverdue ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400";
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { title: "Renewal Summary" }), /* @__PURE__ */ jsxs("div", {
		className: "grid gap-0 divide-y divide-[#f0f4ee] p-5 pt-0 dark:divide-[#2f4a32]/60",
		children: [
			/* @__PURE__ */ jsx(SummaryRow, {
				icon: /* @__PURE__ */ jsx(CalendarDays, { className: "size-4" }),
				label: "Website ID",
				value: website.websiteId
			}),
			/* @__PURE__ */ jsx(SummaryRow, {
				icon: /* @__PURE__ */ jsx(Server, { className: "size-4" }),
				label: "Current Plan / Platform",
				value: website.platform.toUpperCase()
			}),
			/* @__PURE__ */ jsx(SummaryRow, {
				icon: /* @__PURE__ */ jsx(CalendarClock, { className: "size-4" }),
				label: "Renewal Status",
				value: /* @__PURE__ */ jsxs("span", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", website.isOverdue ? "bg-red-500" : "bg-emerald-500") }), /* @__PURE__ */ jsx("span", {
						className: cn("font-bold", website.isOverdue ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"),
						children: website.isOverdue ? "Overdue" : "Active"
					})]
				})
			}),
			/* @__PURE__ */ jsx(SummaryRow, {
				icon: /* @__PURE__ */ jsx(AlertCircle, { className: "size-4" }),
				label: "Next Action",
				value: /* @__PURE__ */ jsxs("span", {
					className: cn("flex items-center gap-1 font-bold", nextActionColor),
					children: [nextAction, website.isOverdue ? /* @__PURE__ */ jsx(AlertCircle, { className: "size-3.5" }) : null]
				})
			})
		]
	})] });
}
function SummaryRow({ icon, label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between gap-3 py-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 text-sm text-[#64745F] dark:text-[#9fb49b]",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[#a0b89a]",
				children: icon
			}), label]
		}), /* @__PURE__ */ jsx("div", {
			className: "text-right text-sm font-semibold text-[#102315] dark:text-[#edf7ee]",
			children: value
		})]
	});
}
function ActivityCard({ websiteId }) {
	const [page, setPage] = useState(1);
	const [items, setItems] = useState([]);
	const activityQuery = useWebsiteActivity(websiteId, page);
	const activity = activityQuery.data;
	useEffect(() => {
		setPage(1);
		setItems([]);
	}, [websiteId]);
	useEffect(() => {
		if (!activity) return;
		setItems((prev) => {
			const existing = new Set(prev.map((i) => i.logId));
			return [...prev, ...activity.items.filter((i) => !existing.has(i.logId))];
		});
	}, [activity]);
	return /* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsx(CardHeader, { title: "History" }), /* @__PURE__ */ jsxs("div", {
		className: "grid gap-2 p-5 pt-0",
		children: [
			activityQuery.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-20 rounded-xl" }) : null,
			activityQuery.isError ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-destructive",
				children: activityQuery.error.message
			}) : null,
			activity && items.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-[#64745F] dark:text-[#9fb49b]",
				children: "No history yet."
			}) : null,
			items.map((item) => /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-[#e8f0e4] bg-[#f8faf7] p-3 dark:border-[#2f4a32] dark:bg-[#132018]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-sm font-semibold text-[#102315] dark:text-[#edf7ee]",
						children: item.description
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-[#64745F] dark:text-[#9fb49b]",
						children: formatDate(item.createdAt)
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-1 text-xs text-[#64745F] dark:text-[#9fb49b]",
					children: [
						item.action,
						" · ",
						item.userName
					]
				})]
			}, item.logId)),
			activity && activity.pagination.page < activity.pagination.totalPages ? /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "w-full rounded-xl border border-[#dde5d8] py-2 text-sm font-semibold text-[#64745F] transition hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:text-[#9fb49b] dark:hover:bg-[#203423]",
				onClick: () => setPage((p) => p + 1),
				children: "Load more"
			}) : null
		]
	})] });
}
function Card({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-hidden rounded-xl border border-[#e5ebe2] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]",
		children
	});
}
function CardHeader({ title, subtitle }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "border-b border-[#f0f4ee] px-5 py-4 dark:border-[#2f4a32]/60",
		children: [/* @__PURE__ */ jsx("h3", {
			className: "font-extrabold text-[#102315] dark:text-[#edf7ee]",
			children: title
		}), subtitle ? /* @__PURE__ */ jsx("p", {
			className: "mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
			children: subtitle
		}) : null]
	});
}
function actionPayload(action, website) {
	if (action === "mark-live") return { websiteStatus: "Live" };
	if (action === "mark-transfer-completed") return { transferCompleted: true };
	if (action === "put-on-hold") return {
		websiteStatus: "On Hold",
		maintenanceStatus: website.maintenanceStatus === "Active" ? "Paused" : website.maintenanceStatus
	};
	if (action === "discontinue") return {
		websiteStatus: "Discontinued",
		maintenanceStatus: "Cancelled"
	};
	return null;
}
//#endregion
//#region src/routes/_protected/_websites/websites.$websiteId.tsx?tsr-split=component
function WebsiteDetailPage() {
	const { websiteId } = Route.useParams();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const websiteQuery = useWebsite(websiteId);
	const website = websiteQuery.data;
	const [editOpen, setEditOpen] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(TopBarSlot, {
			routeKey: pathname,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex w-full items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 flex-col gap-1",
					children: [websiteQuery.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-64 rounded" }) : /* @__PURE__ */ jsxs("nav", {
						className: "flex items-center gap-1.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								search: {
									page: 1,
									limit: 10,
									showFilters: false
								},
								className: "transition hover:text-[#102315] dark:hover:text-[#edf7ee]",
								children: "Websites"
							}),
							/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-[#102315] dark:text-[#edf7ee]",
								children: website?.projectName ?? "Website Details"
							}),
							website ? /* @__PURE__ */ jsx("span", {
								className: "rounded-md bg-[#e8f0e4] px-2 py-0.5 text-xs font-bold text-[#64745F] dark:bg-[#203423] dark:text-[#9fb49b]",
								children: website.websiteId
							}) : null
						]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-[#64745F] dark:text-[#9fb49b]",
						children: "Review website information, status, and renewal details."
					})]
				}), /* @__PURE__ */ jsxs(Button, {
					className: "shrink-0 gap-2 rounded-xl bg-[#658354] font-bold text-white hover:bg-[#4b6043]",
					disabled: !website,
					onClick: () => setEditOpen(true),
					children: [/* @__PURE__ */ jsx(Pencil, { className: "size-4" }), "Edit Website"]
				})]
			})
		}),
		/* @__PURE__ */ jsx("div", {
			className: "flex flex-1 flex-col overflow-auto bg-[#f8faf7] dark:bg-[#0b110d]",
			children: /* @__PURE__ */ jsxs("main", {
				className: "flex flex-1 flex-col gap-4 px-8 py-8",
				children: [
					websiteQuery.isLoading ? /* @__PURE__ */ jsx(WebsiteDetailSkeleton, {}) : null,
					websiteQuery.isError ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-destructive",
						children: websiteQuery.error.message
					}) : null,
					website ? /* @__PURE__ */ jsx(WebsiteDetail, { website }) : null
				]
			})
		}),
		/* @__PURE__ */ jsx(WebsiteEditDialog, {
			websiteId,
			open: editOpen,
			onOpenChange: setEditOpen
		})
	] });
}
//#endregion
export { WebsiteDetailPage as component };
