import { a as REFRESH_TOKEN_KEY, o as apiFetch, r as ACCESS_TOKEN_KEY, t as cn } from "./utils-CR4dV3c0.js";
import { t as authMeQueryOptions } from "./auth-CDcOwtrS.js";
import { a as DropdownMenuSeparator, i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuGroup, t as DropdownMenu } from "./dropdown-menu-DpCy7uv2.js";
import { u as useWebsiteStats } from "./use-websites-BnWcvb5r.js";
import { useState } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronUp, ChevronsLeft, ChevronsRight, Globe, LogOut, Settings, Users } from "lucide-react";
import { Avatar } from "@base-ui/react/avatar";
//#region src/components/ui/avatar.tsx
function Avatar$1({ className, size = "default", ...props }) {
	return /* @__PURE__ */ jsx(Avatar.Root, {
		"data-slot": "avatar",
		"data-size": size,
		className: cn("group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten", className),
		...props
	});
}
function AvatarFallback({ className, ...props }) {
	return /* @__PURE__ */ jsx(Avatar.Fallback, {
		"data-slot": "avatar-fallback",
		className: cn("flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs", className),
		...props
	});
}
//#endregion
//#region src/components/layout/sidebar.tsx
var SIDEBAR_KEY = "sitely-sidebar-collapsed";
function initials(name) {
	if (!name) return "S";
	return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
function AppLayoutSidebar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: user } = useQuery(authMeQueryOptions);
	const { data: stats } = useWebsiteStats();
	const [collapsed, setCollapsed] = useState(() => localStorage.getItem(SIDEBAR_KEY) === "true");
	const toggle = () => {
		setCollapsed((prev) => {
			localStorage.setItem(SIDEBAR_KEY, String(!prev));
			return !prev;
		});
	};
	const logoutMutation = useMutation({
		mutationFn: () => apiFetch("/auth/logout", {
			method: "POST",
			body: JSON.stringify({ refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) })
		}),
		onSettled: () => {
			localStorage.removeItem(ACCESS_TOKEN_KEY);
			localStorage.removeItem(REFRESH_TOKEN_KEY);
			queryClient.clear();
			navigate({
				to: "/login",
				search: { redirect: void 0 }
			});
		}
	});
	const overdueCount = stats ? stats.maintenance_overdue_count + stats.domain_overdue_count : 0;
	const isWebsitesActive = pathname === "/" || pathname.startsWith("/websites");
	const isClientsActive = pathname.startsWith("/clients");
	return /* @__PURE__ */ jsxs("aside", {
		className: cn("flex h-full shrink-0 select-none flex-col border-r border-[#E5E7EB] bg-white transition-[width] duration-200 ease-in-out overflow-hidden", collapsed ? "w-[60px]" : "w-[220px]"),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: cn("flex items-center border-b border-[#E5E7EB] px-[12px] py-[14px]", collapsed ? "justify-center" : "justify-between gap-[10px]"),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex shrink-0 items-center gap-[10px]",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[#4F5DF5] text-[14px] font-bold text-white",
						children: "S"
					}), !collapsed && /* @__PURE__ */ jsx("span", {
						className: "whitespace-nowrap text-[15px] font-bold tracking-tight text-[#11141A]",
						children: "Sitely"
					})]
				}), !collapsed && /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: toggle,
					title: "Collapse sidebar",
					className: "flex size-[26px] shrink-0 items-center justify-center rounded-[7px] text-[#A8ACB4] transition hover:bg-[#F4F5F7] hover:text-[#4F5DF5]",
					children: /* @__PURE__ */ jsx(ChevronsLeft, { className: "size-[15px]" })
				})]
			}),
			collapsed && /* @__PURE__ */ jsx("div", {
				className: "flex justify-center border-b border-[#E5E7EB] py-[10px]",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: toggle,
					title: "Expand sidebar",
					className: "flex size-[28px] items-center justify-center rounded-[7px] text-[#A8ACB4] transition hover:bg-[#EEEFFE] hover:text-[#4F5DF5]",
					children: /* @__PURE__ */ jsx(ChevronsRight, { className: "size-[15px]" })
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: cn("mt-[10px] px-[8px]"),
				children: [/* @__PURE__ */ jsx(SbItem, {
					icon: /* @__PURE__ */ jsx(Globe, { className: "size-[17px]" }),
					label: "Websites",
					active: isWebsitesActive,
					badge: overdueCount > 0 ? String(overdueCount) : void 0,
					collapsed,
					onClick: () => navigate({
						to: "/",
						search: {
							page: 1,
							limit: 15,
							showFilters: false
						}
					})
				}), /* @__PURE__ */ jsx(SbItem, {
					icon: /* @__PURE__ */ jsx(Users, { className: "size-[17px]" }),
					label: "Clients",
					active: isClientsActive,
					collapsed,
					onClick: () => navigate({
						to: "/clients",
						search: {
							page: 1,
							limit: 20
						}
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", { className: "flex-1" }),
			/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsxs(DropdownMenuTrigger, {
				render: /* @__PURE__ */ jsx("button", {
					type: "button",
					className: cn("flex cursor-pointer items-center border-t border-[#E5E7EB] transition hover:bg-[#F7F8FA]", collapsed ? "w-full justify-center px-0 py-[11px]" : "gap-[10px] px-[11px] py-[11px]")
				}),
				children: [/* @__PURE__ */ jsx(Avatar$1, {
					className: "size-8 shrink-0 rounded-full",
					children: /* @__PURE__ */ jsx(AvatarFallback, {
						className: "rounded-full bg-[#4F5DF5] text-[12px] font-bold text-white",
						children: initials(user?.name)
					})
				}), !collapsed && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0 flex-1 text-left",
					children: [/* @__PURE__ */ jsx("div", {
						className: "truncate text-[12.5px] font-semibold text-[#11141A]",
						children: user?.name ?? "Actnos Admin"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-[11px] capitalize text-[#8A8F98]",
						children: (user?.role ?? "owner").replace("_", " ")
					})]
				}), /* @__PURE__ */ jsx(ChevronUp, { className: "size-[15px] shrink-0 text-[#A8ACB4]" })] })]
			}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
				side: "top",
				align: "start",
				sideOffset: 8,
				className: "min-w-[200px] rounded-xl border border-[#E5E7EB] bg-white p-1.5 shadow-lg",
				children: [
					/* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
						className: "cursor-pointer gap-2 rounded-lg px-2 py-2 text-[12.5px] font-medium text-[#11141A] focus:bg-[#F4F5F7]",
						onClick: () => navigate({ to: "/settings" }),
						children: [/* @__PURE__ */ jsx(Settings, { className: "size-4 text-[#8A8F98]" }), " Settings"]
					}) }),
					/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
					/* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
						className: "cursor-pointer gap-2 rounded-lg px-2 py-2 text-[12.5px] font-medium text-[#DC2626] focus:bg-[#FEF2F2] focus:text-[#DC2626]",
						onClick: () => logoutMutation.mutate(),
						disabled: logoutMutation.isPending,
						children: [/* @__PURE__ */ jsx(LogOut, { className: "size-4" }), logoutMutation.isPending ? "Signing out…" : "Sign out"]
					}) })
				]
			})] })
		]
	});
}
function SbItem({ icon, label, active, badge, collapsed, onClick }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick,
		title: collapsed ? label : void 0,
		className: cn("relative mb-[1px] flex w-full items-center rounded-[9px] transition-all duration-150", collapsed ? "justify-center px-0 py-[10px]" : "gap-[10px] px-[11px] py-[9px]", active ? "bg-[#EEEFFE] font-semibold text-[#4F5DF5]" : "text-[#5C6270] hover:bg-[#F7F8FA] hover:text-[#11141A]"),
		children: [
			/* @__PURE__ */ jsx("span", {
				className: cn("shrink-0", active ? "text-[#4F5DF5]" : "text-[#8A8F98]"),
				children: icon
			}),
			!collapsed && /* @__PURE__ */ jsx("span", {
				className: "flex-1 text-left text-[13px] font-medium",
				children: label
			}),
			badge && !collapsed && /* @__PURE__ */ jsx("span", {
				className: "rounded-[10px] bg-[#DC2626] px-[7px] py-[1px] text-[10.5px] font-bold text-white",
				children: badge
			}),
			badge && collapsed && /* @__PURE__ */ jsx("span", { className: "absolute right-[8px] top-[8px] size-[7px] rounded-full bg-[#DC2626]" })
		]
	});
}
//#endregion
//#region src/routes/_protected.tsx?tsr-split=component
function ProtectedLayout() {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-screen overflow-hidden bg-[#F4F5F7]",
		children: [/* @__PURE__ */ jsx(AppLayoutSidebar, {}), /* @__PURE__ */ jsx("div", {
			className: "flex min-w-0 flex-1 flex-col overflow-hidden",
			children: /* @__PURE__ */ jsx(Outlet, {})
		})]
	});
}
//#endregion
export { ProtectedLayout as component };
