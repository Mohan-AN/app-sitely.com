import { t as cn } from "./utils-CR4dV3c0.js";
import { t as Route } from "./clients._clientId-ByOdkTdk.js";
import { t as Button } from "./button-N4VO-qD6.js";
import { i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-DpCy7uv2.js";
import { t as Skeleton } from "./skeleton-3GrrKxds.js";
import { t as useClient } from "./use-clients-Dn2jCq3x.js";
import { n as formatDate } from "./format-BiRzvK38.js";
import { t as EditClientDialog } from "./edit-client-dialog-BEMk0NX0.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Building2, ChevronLeft, ChevronRight, Code2, ExternalLink, Mail, MapPin, MoreHorizontal, Phone, Plus } from "lucide-react";
//#region src/components/clients/client-websites-table.tsx
var PAGE_SIZE = 5;
var STATUS_COLORS = {
	Live: {
		dot: "bg-emerald-500",
		text: "text-emerald-700 dark:text-emerald-400"
	},
	Active: {
		dot: "bg-emerald-500",
		text: "text-emerald-700 dark:text-emerald-400"
	},
	"In Progress": {
		dot: "bg-amber-400",
		text: "text-amber-700 dark:text-amber-400"
	},
	Expired: {
		dot: "bg-red-500",
		text: "text-red-600 dark:text-red-400"
	},
	Paused: {
		dot: "bg-gray-400",
		text: "text-gray-500 dark:text-gray-400"
	},
	Inactive: {
		dot: "bg-gray-400",
		text: "text-gray-500 dark:text-gray-400"
	},
	"On Hold": {
		dot: "bg-gray-400",
		text: "text-gray-500 dark:text-gray-400"
	},
	Completed: {
		dot: "bg-blue-500",
		text: "text-blue-600 dark:text-blue-400"
	},
	Discontinued: {
		dot: "bg-gray-400",
		text: "text-gray-500 dark:text-gray-400"
	},
	Cancelled: {
		dot: "bg-gray-400",
		text: "text-gray-500 dark:text-gray-400"
	},
	"Not Started": {
		dot: "bg-gray-400",
		text: "text-gray-500 dark:text-gray-400"
	}
};
var PLATFORM_STYLES = {
	wpx: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
	netlify: "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
};
function StatusDot({ label }) {
	const s = STATUS_COLORS[label] ?? {
		dot: "bg-gray-400",
		text: "text-gray-500"
	};
	return /* @__PURE__ */ jsxs("span", {
		className: cn("inline-flex items-center gap-1.5 text-xs font-semibold", s.text),
		children: [/* @__PURE__ */ jsx("span", { className: cn("size-2 shrink-0 rounded-full", s.dot) }), label]
	});
}
function PlatformBadge({ platform }) {
	if (!platform) return /* @__PURE__ */ jsx("span", {
		className: "text-xs text-[#9fb49b]",
		children: "—"
	});
	const label = platform === "wpx" ? "WPX" : platform === "netlify" ? "Netlify" : platform;
	return /* @__PURE__ */ jsx("span", {
		className: cn("rounded-md px-2 py-0.5 text-xs font-bold", PLATFORM_STYLES[platform] ?? "bg-gray-100 text-gray-600"),
		children: label
	});
}
function SiteTypeCell({ siteType }) {
	if (!siteType) return /* @__PURE__ */ jsx("span", {
		className: "text-xs text-[#9fb49b]",
		children: "—"
	});
	if (siteType === "wordpress") return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-[#334155] dark:text-[#d6e8cf]",
		children: [/* @__PURE__ */ jsx("span", {
			className: "flex size-4 items-center justify-center rounded-sm bg-[#21759b] text-[9px] font-black text-white",
			children: "W"
		}), "WordPress"]
	});
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1.5 text-xs font-semibold text-[#334155] dark:text-[#d6e8cf]",
		children: [/* @__PURE__ */ jsx(Code2, { className: "size-4 text-[#64745F] dark:text-[#9fb49b]" }), "Static"]
	});
}
var gridCols = "grid-cols-[2fr_0.75fr_0.85fr_0.7fr_0.7fr_0.7fr_0.85fr_44px]";
function ClientWebsitesTable({ websites }) {
	const [page, setPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(websites.length / PAGE_SIZE));
	const start = (page - 1) * PAGE_SIZE;
	const slice = websites.slice(start, start + PAGE_SIZE);
	const showing = websites.length === 0 ? 0 : start + slice.length;
	if (websites.length === 0) return /* @__PURE__ */ jsx("div", {
		className: "flex h-28 items-center justify-center rounded-xl border border-[#e5ebe2] text-sm text-[#64745F] dark:border-[#2f4a32] dark:text-[#9fb49b]",
		children: "No websites for this client yet."
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "overflow-hidden rounded-xl border border-[#e5ebe2] dark:border-[#2f4a32]",
			children: [/* @__PURE__ */ jsx("div", {
				className: cn("grid border-b border-[#e5ebe2] bg-[#f5f9f2] dark:border-[#2f4a32] dark:bg-[#17251b]", gridCols),
				children: [
					"Website",
					"Website ID",
					"Type",
					"Platform",
					"Status",
					"Maintenance",
					"Renewal Date",
					""
				].map((h) => /* @__PURE__ */ jsx("div", {
					className: "px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#3F6F39] dark:text-[#b6d7a8]",
					children: h
				}, h))
			}), slice.map((w, i) => {
				const cleanUrl = w.url ? w.url.replace(/^https?:\/\//, "") : null;
				return /* @__PURE__ */ jsxs("div", {
					className: cn("grid min-h-[56px] items-center border-b border-[#e5ebe2]/60 text-[13px] hover:bg-[#f5f9f2] dark:border-[#2f4a32]/40 dark:hover:bg-[#17251b]", gridCols, i % 2 === 1 && "bg-[#fafcf8] dark:bg-[#111a13]"),
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "min-w-0 px-3 py-2",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/websites/$websiteId",
								params: { websiteId: String(w.id) },
								className: "block truncate font-bold text-[#102315] hover:underline dark:text-[#edf7ee]",
								children: w.project_name
							}), cleanUrl ? /* @__PURE__ */ jsxs("a", {
								href: w.url,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-0.5 truncate text-xs text-[#658354] hover:underline dark:text-[#85e0a3]",
								children: [cleanUrl, /* @__PURE__ */ jsx(ExternalLink, { className: "size-3 shrink-0" })]
							}) : null]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ jsx("span", {
								className: "rounded-md bg-[#e8f0e4] px-1.5 py-0.5 text-[11px] font-bold text-[#64745F] dark:bg-[#203423] dark:text-[#9fb49b]",
								children: w.website_id
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ jsx(SiteTypeCell, { siteType: w.site_type })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ jsx(PlatformBadge, { platform: w.platform })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ jsx(StatusDot, { label: w.website_status })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ jsx(StatusDot, { label: w.maintenance_status })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2 text-xs text-[#64745F] dark:text-[#9fb49b]",
							children: w.current_billing_due_date ? formatDate(w.current_billing_due_date) : /* @__PURE__ */ jsx("span", {
								className: "text-[#9fb49b]",
								children: "—"
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center justify-center px-2",
							children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
								render: /* @__PURE__ */ jsx(Button, {
									variant: "outline",
									size: "icon-sm",
									"aria-label": "Actions",
									className: "border-[#dde5d8] dark:border-[#2f4a32]"
								}),
								children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "size-4" })
							}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
								align: "end",
								children: [/* @__PURE__ */ jsx(DropdownMenuItem, {
									render: /* @__PURE__ */ jsx(Link, {
										to: "/websites/$websiteId",
										params: { websiteId: String(w.id) }
									}),
									children: "View details"
								}), /* @__PURE__ */ jsx(DropdownMenuItem, {
									render: /* @__PURE__ */ jsx(Link, {
										to: "/websites/$websiteId/edit",
										params: { websiteId: String(w.id) }
									}),
									children: "Edit website"
								})]
							})] })
						})
					]
				}, w.id);
			})]
		}), websites.length > PAGE_SIZE ? /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between text-sm text-[#64745F] dark:text-[#9fb49b]",
			children: [/* @__PURE__ */ jsxs("span", { children: [
				"Showing ",
				start + 1,
				" to ",
				showing,
				" of ",
				websites.length,
				" websites"
			] }), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						size: "icon-lg",
						disabled: page <= 1,
						onClick: () => setPage((p) => p - 1),
						"aria-label": "Previous",
						children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" })
					}),
					Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsx(Button, {
						variant: n === page ? "default" : "ghost",
						size: "icon-lg",
						className: cn(n === page && "bg-[#ddead1] text-[#658354] hover:bg-[#c7ddb5]"),
						onClick: () => setPage(n),
						children: n
					}, n)),
					/* @__PURE__ */ jsx(Button, {
						variant: "outline",
						size: "icon-lg",
						disabled: page >= totalPages,
						onClick: () => setPage((p) => p + 1),
						"aria-label": "Next",
						children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
					})
				]
			})]
		}) : /* @__PURE__ */ jsxs("p", {
			className: "text-sm text-[#64745F] dark:text-[#9fb49b]",
			children: [
				"Showing 1 to ",
				websites.length,
				" of ",
				websites.length,
				" website",
				websites.length !== 1 ? "s" : ""
			]
		})]
	});
}
//#endregion
//#region src/routes/_protected/_clients/clients.$clientId.tsx?tsr-split=component
function ClientDetailPage() {
	const { clientId } = Route.useParams();
	const clientQuery = useClient(clientId);
	const client = clientQuery.data;
	const [editOpen, setEditOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-1 flex-col overflow-auto bg-[#F4F5F7]",
		children: [/* @__PURE__ */ jsxs("main", {
			className: "flex flex-1 flex-col gap-[20px] px-[30px] py-[26px]",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/clients",
					search: {
						page: 1,
						limit: 20
					},
					className: "flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[#5C6270] transition hover:text-[#4F5DF5]",
					children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" }), "Back to Clients"]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-4 flex-wrap",
					children: [/* @__PURE__ */ jsxs("div", { children: [clientQuery.isLoading ? /* @__PURE__ */ jsx(Skeleton, { className: "h-7 w-48 rounded" }) : /* @__PURE__ */ jsx("div", {
						className: "text-[22px] font-bold tracking-tight text-[#11141A]",
						children: client?.name ?? "Client Details"
					}), client ? /* @__PURE__ */ jsxs("div", {
						className: "mt-2 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "rounded-[7px] bg-[#F7F8FA] px-[11px] py-1 text-[11.5px] font-semibold text-[#5C6270]",
							children: client.client_id
						}), /* @__PURE__ */ jsxs("span", {
							className: cn("inline-flex items-center gap-1.5 rounded-full px-[11px] py-1 text-[11.5px] font-bold", client.is_active ? "bg-[#ECFDF5] text-[#059669]" : "bg-[#F3F4F6] text-[#6B7280]"),
							children: [/* @__PURE__ */ jsx("span", { className: cn("size-[5px] rounded-full", client.is_active ? "bg-[#10B981]" : "bg-[#9CA3AF]") }), client.is_active ? "Active" : "Inactive"]
						})]
					}) : null] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							disabled: !client,
							onClick: () => setEditOpen(true),
							className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] disabled:opacity-50 disabled:cursor-not-allowed",
							children: "Edit Client"
						}), /* @__PURE__ */ jsxs(Link, {
							to: "/websites/new",
							search: { clientId },
							className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]",
							children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), "Add Website for this Client"]
						})]
					})]
				}),
				clientQuery.isLoading ? /* @__PURE__ */ jsxs("div", {
					className: "grid gap-4",
					children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-52 rounded-[14px]" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-96 rounded-[14px]" })]
				}) : null,
				clientQuery.isError ? /* @__PURE__ */ jsx("p", {
					className: "text-[13px] text-[#DC2626]",
					children: clientQuery.error.message
				}) : null,
				client ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]",
					children: [/* @__PURE__ */ jsx("div", {
						className: "border-b border-[#EEF0F2] px-[18px] py-[14px]",
						children: /* @__PURE__ */ jsx("div", {
							className: "text-[11.5px] font-bold uppercase tracking-[.04em] text-[#8A8F98]",
							children: "Contact Information"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-4 gap-0 divide-x divide-[#EEF0F2]",
						children: [
							/* @__PURE__ */ jsx(InfoCell, {
								icon: /* @__PURE__ */ jsx(Building2, { className: "size-4" }),
								label: "Contact Name",
								children: client.name ?? /* @__PURE__ */ jsx(Dash, {})
							}),
							/* @__PURE__ */ jsx(InfoCell, {
								icon: /* @__PURE__ */ jsx(Phone, { className: "size-4" }),
								label: "Phone",
								children: client.phone ?? /* @__PURE__ */ jsx(Dash, {})
							}),
							/* @__PURE__ */ jsx(InfoCell, {
								icon: /* @__PURE__ */ jsx(Mail, { className: "size-4" }),
								label: "Email",
								children: client.email ? /* @__PURE__ */ jsx("a", {
									href: `mailto:${client.email}`,
									className: "text-[#4F5DF5] underline-offset-2 hover:underline",
									children: client.email
								}) : /* @__PURE__ */ jsx(Dash, {})
							}),
							/* @__PURE__ */ jsx(InfoCell, {
								icon: /* @__PURE__ */ jsx(MapPin, { className: "size-4" }),
								label: "Address",
								children: client.city ?? /* @__PURE__ */ jsx(Dash, {})
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex items-center justify-between gap-4 border-b border-[#EEF0F2] px-[18px] py-[14px]",
						children: /* @__PURE__ */ jsxs("strong", {
							className: "text-[13px] font-bold text-[#11141A]",
							children: [
								"Linked Websites (",
								client.websites?.length ?? 0,
								")"
							]
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "px-0",
						children: /* @__PURE__ */ jsx(ClientWebsitesTable, { websites: client.websites ?? [] })
					})]
				})] }) : null
			]
		}), /* @__PURE__ */ jsx(EditClientDialog, {
			open: editOpen,
			onOpenChange: setEditOpen,
			client: client ?? null,
			onUpdated: () => clientQuery.refetch(),
			onDeleted: () => {}
		})]
	});
}
function InfoCell({ icon, label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-1 px-[18px] py-[14px]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[.03em] text-[#8A8F98]",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[#8A8F98]",
				children: icon
			}), label]
		}), /* @__PURE__ */ jsx("div", {
			className: "text-[13px] font-semibold text-[#11141A]",
			children
		})]
	});
}
function Dash() {
	return /* @__PURE__ */ jsx("span", {
		className: "font-normal text-[#C7CAD1]",
		children: "—"
	});
}
//#endregion
export { ClientDetailPage as component };
