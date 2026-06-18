import { a as REFRESH_TOKEN_KEY, i as ACCESS_TOKEN_KEY, n as cn, o as apiFetch, t as Button } from "./button-jrDuWETO.js";
import { t as authMeQueryOptions } from "./auth-CMcyD9sB.js";
import { a as DropdownMenuSeparator, i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuGroup, t as DropdownMenu } from "./dropdown-menu-BueuBkLZ.js";
import { n as TopBarSlotProvider, r as useTopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronsLeft, ChevronsRight, ChevronsUpDown, Globe, LogOut, Moon, Settings, Sun, Users } from "lucide-react";
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
//#region src/hooks/use-theme.ts
var THEME_KEY = "sitely_theme";
function applyTheme(theme) {
	document.documentElement.classList.toggle("dark", theme === "dark");
	document.documentElement.style.colorScheme = theme;
}
function getInitialTheme() {
	if (typeof window === "undefined") return "light";
	const stored = window.localStorage.getItem(THEME_KEY);
	if (stored === "light" || stored === "dark") return stored;
	return "light";
}
function useTheme() {
	const [theme, setTheme] = useState(getInitialTheme);
	useEffect(() => {
		applyTheme(theme);
		window.localStorage.setItem(THEME_KEY, theme);
	}, [theme]);
	const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");
	return {
		theme,
		toggleTheme
	};
}
//#endregion
//#region src/components/theme-toggle.tsx
function ThemeToggle({ compact = false }) {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";
	return /* @__PURE__ */ jsxs(Button, {
		type: "button",
		variant: "outline",
		size: compact ? "icon" : "default",
		className: "h-10 border-[#c7ddb5] bg-white text-[#64745F] hover:bg-[#ddead1]/60 hover:text-[#658354] dark:border-[#2f4a32] dark:bg-[#132018] dark:text-[#d6e8cf] dark:hover:bg-[#203423]",
		onClick: toggleTheme,
		"aria-label": isDark ? "Switch to light mode" : "Switch to dark mode",
		title: isDark ? "Light mode" : "Dark mode",
		children: [isDark ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" }), compact ? null : /* @__PURE__ */ jsx("span", { children: isDark ? "Light" : "Dark" })]
	});
}
//#endregion
//#region src/components/layout/sidebar.tsx
var NAV_ITEMS = [{
	icon: Globe,
	path: "/",
	label: "Websites",
	id: "websites"
}, {
	icon: Users,
	path: "/clients",
	label: "Clients",
	id: "clients"
}];
function SitelyMark() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#658354] bg-[#ddead1] text-lg font-black text-[#658354] shadow-sm",
		children: "S"
	});
}
function initials(name) {
	if (!name) return "S";
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
function SidebarUserMenu({ isExpanded }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: user } = useQuery(authMeQueryOptions);
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
	const roleDisplay = (user?.role ?? "admin").toUpperCase().replace("_", " ");
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsxs(DropdownMenuTrigger, {
		render: /* @__PURE__ */ jsx("button", {
			type: "button",
			className: cn("flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#c7ddb5] bg-white p-2 shadow-sm transition hover:bg-[#ddead1]/40 dark:border-[#2f4a32] dark:bg-[#132018] dark:hover:bg-[#203423]", !isExpanded && "justify-center")
		}),
		children: [/* @__PURE__ */ jsx(Avatar$1, {
			className: "size-9 shrink-0 rounded-full",
			children: /* @__PURE__ */ jsx(AvatarFallback, {
				className: "rounded-full bg-[#658354] text-[12px] font-bold text-white",
				children: initials(user?.name)
			})
		}), isExpanded ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
			className: "min-w-0 flex-1 text-left",
			children: [/* @__PURE__ */ jsx("div", {
				className: "truncate text-[13px] font-bold leading-none text-[#102315] dark:text-[#edf7ee]",
				children: user?.name ?? "Loading..."
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-1 truncate text-[9px] font-extrabold uppercase tracking-wider text-[#64745F]",
				children: roleDisplay
			})]
		}), /* @__PURE__ */ jsx(ChevronsUpDown, { className: "size-3.5 shrink-0 text-[#64745F] dark:text-[#9fb49b]" })] }) : null]
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		side: "top",
		align: "start",
		sideOffset: 8,
		className: "min-w-[220px] rounded-xl border border-[#c7ddb5] bg-white p-1.5 shadow-lg dark:border-[#2f4a32] dark:bg-[#132018]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 px-2 py-2",
				children: [/* @__PURE__ */ jsx(Avatar$1, {
					className: "size-9 shrink-0 rounded-full",
					children: /* @__PURE__ */ jsx(AvatarFallback, {
						className: "rounded-full bg-[#658354] text-[12px] font-bold text-white",
						children: initials(user?.name)
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ jsx("p", {
						className: "truncate text-[13px] font-bold text-[#102315] dark:text-[#edf7ee]",
						children: user?.name ?? "—"
					}), /* @__PURE__ */ jsx("p", {
						className: "truncate text-[11px] text-[#64745F] dark:text-[#9fb49b]",
						children: user?.email
					})]
				})]
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			/* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
				className: "cursor-pointer gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-[#102315] focus:bg-[#f2f6ee] dark:text-[#edf7ee] dark:focus:bg-[#203423]",
				onClick: () => navigate({ to: "/settings" }),
				children: [/* @__PURE__ */ jsx(Settings, { className: "size-4 text-[#64745F]" }), "Settings"]
			}) }),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			/* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
				className: "cursor-pointer gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30",
				onClick: () => logoutMutation.mutate(),
				disabled: logoutMutation.isPending,
				children: [/* @__PURE__ */ jsx(LogOut, { className: "size-4" }), logoutMutation.isPending ? "Signing out…" : "Sign out"]
			}) })
		]
	})] });
}
function AppLayoutSidebar({ isExpanded, onToggle }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const ToggleIcon = isExpanded ? ChevronsLeft : ChevronsRight;
	return /* @__PURE__ */ jsxs("aside", {
		className: cn("relative flex h-full shrink-0 select-none flex-col justify-between border-r border-[#c7ddb5] bg-white pb-6 pt-3 text-[#102315] transition-all duration-300 ease-in-out dark:border-[#2f4a32] dark:bg-[#0f1712] dark:text-[#edf7ee]", isExpanded ? "w-56 px-4" : "w-[72px] px-3"),
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onToggle,
				className: "absolute -right-4 top-7 z-30 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#dde5d8] bg-white text-[#64745F] shadow-sm transition hover:border-[#c7ddb5] hover:bg-[#f2f6ee] hover:text-[#658354] dark:border-[#2f4a32] dark:bg-[#101912] dark:text-[#d6e8cf] dark:hover:bg-[#203423]",
				title: isExpanded ? "Collapse sidebar" : "Expand sidebar",
				"aria-label": isExpanded ? "Collapse sidebar" : "Expand sidebar",
				children: /* @__PURE__ */ jsx(ToggleIcon, { className: "size-4" })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: cn("mb-2 flex items-center gap-3 py-1.5 transition-all duration-300", isExpanded ? "justify-start px-3" : "justify-center px-1"),
						children: [/* @__PURE__ */ jsx(SitelyMark, {}), /* @__PURE__ */ jsx("div", {
							className: cn("min-w-0 overflow-hidden transition-all duration-300", isExpanded ? "w-auto opacity-100" : "h-0 w-0 opacity-0"),
							children: /* @__PURE__ */ jsx("div", {
								className: "whitespace-nowrap text-[17px] font-extrabold tracking-normal text-[#102015] dark:text-[#edf7ee]",
								children: "Sitely"
							})
						})]
					}),
					/* @__PURE__ */ jsx("div", { className: "mb-4 w-full border-b border-[#c7ddb5] dark:border-[#2f4a32]" }),
					/* @__PURE__ */ jsx("nav", {
						className: "flex w-full flex-col gap-1",
						children: NAV_ITEMS.map((item) => {
							const isActive = item.path === "/" ? pathname === "/" || pathname.startsWith("/websites") : pathname === item.path || pathname.startsWith(`${item.path}/`);
							return /* @__PURE__ */ jsxs(Link, {
								to: item.path,
								className: cn("flex items-center gap-3 rounded-xl py-2.5 text-[14px] font-medium transition-all duration-200", isActive ? "bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#b6d7a8]" : "text-[#64745F] hover:bg-[#ddead1]/60 hover:text-[#658354] dark:text-[#9fb49b] dark:hover:bg-[#203423] dark:hover:text-[#b6d7a8]", isExpanded ? "justify-start px-4" : "justify-center px-0"),
								title: isExpanded ? void 0 : item.label,
								children: [/* @__PURE__ */ jsx(item.icon, { className: cn("size-4 shrink-0 transition-transform duration-200", isActive ? "text-[#658354]" : "text-[#64745F]") }), /* @__PURE__ */ jsx("span", {
									className: cn("whitespace-nowrap transition-all duration-300", isExpanded ? "w-auto translate-x-0 opacity-100" : "pointer-events-none w-0 -translate-x-2 overflow-hidden opacity-0"),
									children: item.label
								})]
							}, item.id);
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ jsx(ThemeToggle, { compact: !isExpanded }), /* @__PURE__ */ jsx(SidebarUserMenu, { isExpanded })]
			})
		]
	});
}
//#endregion
//#region src/components/layout/top-bar.tsx
function getPageTitle(pathname) {
	if (pathname === "/") return "Websites";
	if (pathname === "/websites/new") return "Add Website";
	if (pathname.startsWith("/websites/") && pathname.endsWith("/edit")) return "Edit Website";
	if (pathname.startsWith("/websites/")) return "Website Details";
	if (pathname === "/clients" || pathname === "/clients/") return "Clients";
	if (pathname === "/clients/new") return "Add Client";
	if (pathname.startsWith("/clients/") && pathname.endsWith("/edit")) return "Edit Client";
	if (pathname.startsWith("/clients/")) return "Client Details";
	return "Sitely";
}
function TopBar() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const slot = useTopBarSlot();
	const slotContent = slot.routeKey === pathname ? slot.content : null;
	return /* @__PURE__ */ jsx("header", {
		className: "flex shrink-0 select-none border-b border-[#c7ddb5] bg-white px-8 py-4 text-[#102315] dark:border-[#2f4a32] dark:bg-[#0f1712] dark:text-[#edf7ee]",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex min-h-10 w-full items-center justify-between gap-4",
			children: Boolean(slotContent) && (pathname === "/" || pathname === "/websites/new" || pathname === "/clients/new" || pathname.startsWith("/websites/") && pathname !== "/websites/new" || pathname.startsWith("/clients/") && pathname !== "/clients/new") ? slotContent : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("h1", {
				className: "shrink-0 whitespace-nowrap text-[22px] font-extrabold leading-none tracking-normal text-[#102315] dark:text-[#edf7ee]",
				children: getPageTitle(pathname)
			}), slotContent ? /* @__PURE__ */ jsx("div", {
				className: "ml-6 flex min-w-0 flex-1 items-center justify-end",
				children: slotContent
			}) : null] })
		})
	});
}
//#endregion
//#region src/routes/_protected.tsx?tsr-split=component
function ProtectedLayout() {
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
	return /* @__PURE__ */ jsx(TopBarSlotProvider, { children: /* @__PURE__ */ jsxs("div", {
		className: "flex h-screen min-w-[1200px] overflow-hidden bg-[#f2f6ee] text-[#102315] selection:bg-[#658354] selection:text-white dark:bg-[#0b110d] dark:text-[#edf7ee]",
		children: [/* @__PURE__ */ jsx(AppLayoutSidebar, {
			isExpanded: isSidebarExpanded,
			onToggle: () => setIsSidebarExpanded((value) => !value)
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex min-w-0 flex-1 flex-col overflow-hidden",
			children: [/* @__PURE__ */ jsx(TopBar, {}), /* @__PURE__ */ jsx("div", {
				className: "flex min-h-0 flex-1 flex-col overflow-hidden",
				children: /* @__PURE__ */ jsx(Outlet, {})
			})]
		})]
	}) });
}
//#endregion
export { ProtectedLayout as component };
