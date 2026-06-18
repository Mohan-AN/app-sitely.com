import { n as cn, t as Button } from "./button-jrDuWETO.js";
import { t as Route } from "./clients._clientId-CQLX1qF1.js";
import { i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-BueuBkLZ.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { t as Skeleton } from "./skeleton-BcCjHA20.js";
import { t as useClient } from "./use-clients-CB207rwB.js";
import { t as formatDate } from "./format-BWQocT_r.js";
import { t as EditClientDialog } from "./edit-client-dialog-BeqRdlFa.js";
import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Building2, Calendar, ChevronLeft, ChevronRight, Code2, ExternalLink, Globe, Mail, MapPin, MoreHorizontal, Pencil, Phone, Plus, Users } from "lucide-react";
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
								params: { websiteId: w.websiteId },
								className: "block truncate font-bold text-[#102315] hover:underline dark:text-[#edf7ee]",
								children: w.projectName
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
								children: w.websiteId
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ jsx(SiteTypeCell, { siteType: w.siteType })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ jsx(PlatformBadge, { platform: w.platform })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ jsx(StatusDot, { label: w.websiteStatus })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ jsx(StatusDot, { label: w.maintenanceStatus })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "px-3 py-2 text-xs text-[#64745F] dark:text-[#9fb49b]",
							children: w.renewalDate ? formatDate(w.renewalDate) : /* @__PURE__ */ jsx("span", {
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
										params: { websiteId: w.websiteId }
									}),
									children: "View details"
								}), /* @__PURE__ */ jsx(DropdownMenuItem, {
									render: /* @__PURE__ */ jsx(Link, {
										to: "/websites/$websiteId/edit",
										params: { websiteId: w.websiteId }
									}),
									children: "Edit website"
								})]
							})] })
						})
					]
				}, w.websiteId);
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
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const clientQuery = useClient(clientId);
	const client = clientQuery.data;
	const [editOpen, setEditOpen] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(TopBarSlot, {
			routeKey: pathname,
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex w-full items-center justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ jsxs("nav", {
							className: "flex items-center gap-1.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/clients",
								search: {
									page: 1,
									limit: 20
								},
								className: "transition hover:text-[#102315] dark:hover:text-[#edf7ee]",
								children: "Clients"
							}), /* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-0.5 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ jsx("h1", {
								className: "text-xl font-extrabold text-[#102315] dark:text-[#edf7ee]",
								children: client?.name ?? ""
							}), client ? /* @__PURE__ */ jsx("span", {
								className: "rounded-md bg-[#e8f0e4] px-2 py-0.5 text-xs font-bold text-[#64745F] dark:bg-[#203423] dark:text-[#9fb49b]",
								children: client.clientId
							}) : null]
						}),
						client ? /* @__PURE__ */ jsxs("span", {
							className: cn("mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold", client.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"),
							children: [/* @__PURE__ */ jsx("span", { className: cn("size-2 rounded-full", client.isActive ? "bg-emerald-500" : "bg-gray-400") }), client.isActive ? "Active" : "Inactive"]
						}) : null
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ jsxs(Button, {
						variant: "outline",
						className: "gap-2 rounded-xl border-[#dde5d8] text-[#334155] dark:border-[#2f4a32] dark:text-[#d6e8cf]",
						disabled: !client,
						onClick: () => setEditOpen(true),
						children: [/* @__PURE__ */ jsx(Pencil, { className: "size-4" }), "Edit Client"]
					}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
						render: /* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "icon-lg",
							"aria-label": "More actions",
							className: "rounded-xl border-[#dde5d8] dark:border-[#2f4a32]",
							disabled: !client
						}),
						children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "size-4" })
					}), /* @__PURE__ */ jsx(DropdownMenuContent, {
						align: "end",
						children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
							render: /* @__PURE__ */ jsx(Link, {
								to: "/websites/new",
								search: { clientId }
							}),
							children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), "Add Website"]
						})
					})] })]
				})]
			})
		}),
		/* @__PURE__ */ jsx(EditClientDialog, {
			open: editOpen,
			onOpenChange: setEditOpen,
			client: client ?? null,
			onUpdated: () => clientQuery.refetch(),
			onDeleted: () => {}
		}),
		/* @__PURE__ */ jsx("div", {
			className: "flex flex-1 flex-col overflow-auto bg-[#f8faf7] dark:bg-[#0b110d]",
			children: /* @__PURE__ */ jsxs("main", {
				className: "flex flex-1 flex-col gap-5 px-8 py-6",
				children: [
					clientQuery.isLoading ? /* @__PURE__ */ jsxs("div", {
						className: "grid gap-4",
						children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-52 rounded-xl" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-96 rounded-xl" })]
					}) : null,
					clientQuery.isError ? /* @__PURE__ */ jsx("p", {
						className: "text-sm text-destructive",
						children: clientQuery.error.message
					}) : null,
					client ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-[#e5ebe2] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 px-6 py-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]",
								children: /* @__PURE__ */ jsx(Users, { className: "size-4" })
							}), /* @__PURE__ */ jsx("h3", {
								className: "font-extrabold text-[#102315] dark:text-[#edf7ee]",
								children: "Client Information"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "border-t border-[#f0f4ee] dark:border-[#2f4a32]/60",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "grid divide-x divide-[#f0f4ee] sm:grid-cols-3 dark:divide-[#2f4a32]/60",
								children: [
									/* @__PURE__ */ jsx(InfoCell, {
										icon: /* @__PURE__ */ jsx(Building2, { className: "size-4" }),
										label: "Company",
										children: client.company ?? /* @__PURE__ */ jsx(Dash, {})
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
											className: "font-semibold text-[#658354] underline-offset-2 hover:underline dark:text-[#85e0a3]",
											children: client.email
										}) : /* @__PURE__ */ jsx(Dash, {})
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid divide-x divide-[#f0f4ee] border-t border-[#f0f4ee] sm:grid-cols-3 dark:divide-[#2f4a32]/60 dark:border-[#2f4a32]/60",
								children: [
									/* @__PURE__ */ jsx(InfoCell, {
										icon: /* @__PURE__ */ jsx(MapPin, { className: "size-4" }),
										label: "City",
										children: client.city ?? /* @__PURE__ */ jsx(Dash, {})
									}),
									/* @__PURE__ */ jsx(InfoCell, {
										icon: /* @__PURE__ */ jsx(Calendar, { className: "size-4" }),
										label: "Created At",
										children: formatDate(client.createdAt)
									}),
									/* @__PURE__ */ jsx("div", {})
								]
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-[#e5ebe2] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between gap-4 px-6 py-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]",
									children: /* @__PURE__ */ jsx(Globe, { className: "size-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									className: "font-extrabold text-[#102315] dark:text-[#edf7ee]",
									children: "Websites"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-[#64745F] dark:text-[#9fb49b]",
									children: "Websites associated with this client."
								})] })]
							}), /* @__PURE__ */ jsxs(Button, {
								variant: "outline",
								className: "gap-2 rounded-xl border-[#dde5d8] text-[#334155] dark:border-[#2f4a32] dark:text-[#d6e8cf]",
								render: /* @__PURE__ */ jsx(Link, {
									to: "/websites/new",
									search: { clientId }
								}),
								children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), "Add Website"]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "border-t border-[#f0f4ee] px-6 py-4 dark:border-[#2f4a32]/60",
							children: /* @__PURE__ */ jsx(ClientWebsitesTable, { websites: client.websites })
						})]
					})] }) : null
				]
			})
		})
	] });
}
function InfoCell({ icon, label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-start gap-3 px-6 py-4",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mt-0.5 shrink-0 text-[#658354] dark:text-[#85e0a3]",
			children: icon
		}), /* @__PURE__ */ jsxs("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs font-medium text-[#64745F] dark:text-[#9fb49b]",
				children: label
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-0.5 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]",
				children
			})]
		})]
	});
}
function Dash() {
	return /* @__PURE__ */ jsx("span", {
		className: "font-normal text-[#a0b89a] dark:text-[#6a9b70]",
		children: "—"
	});
}
//#endregion
export { ClientDetailPage as component };
