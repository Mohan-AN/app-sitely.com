import { a as REFRESH_TOKEN_KEY, i as ACCESS_TOKEN_KEY, n as cn, o as apiFetch, t as Button } from "./button-FgxVcNwj.js";
import { t as authMeQueryOptions } from "./auth-DdGkSPfx.js";
import { a as DropdownMenuSeparator, i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuGroup, t as DropdownMenu } from "./dropdown-menu-B8E-ZA17.js";
import { n as TopBarSlotProvider, r as useTopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import * as React from "react";
import { useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, Bell, ChevronDown, Globe2, Grid2x2, LogOut, Menu, Search, Settings, SunMedium, Users, XIcon } from "lucide-react";
import { Avatar } from "@base-ui/react/avatar";
import { Dialog } from "@base-ui/react/dialog";
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
//#region src/components/ui/sheet.tsx
function Sheet({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Root, {
		"data-slot": "sheet",
		...props
	});
}
function SheetPortal({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Portal, {
		"data-slot": "sheet-portal",
		...props
	});
}
function SheetOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Backdrop, {
		"data-slot": "sheet-overlay",
		className: cn("fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs", className),
		...props
	});
}
function SheetContent({ className, children, side = "right", showCloseButton = true, ...props }) {
	return /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(Dialog.Popup, {
		"data-slot": "sheet-content",
		"data-side": side,
		className: cn("fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ jsxs(Dialog.Close, {
			"data-slot": "sheet-close",
			render: /* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				className: "absolute top-3 right-3",
				size: "icon-sm"
			}),
			children: [/* @__PURE__ */ jsx(XIcon, {}), /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
//#endregion
//#region src/components/layout/sidebar.tsx
var NAV_ITEMS = [
	{
		id: "dashboard",
		label: "Dashboard",
		icon: Grid2x2,
		route: "/",
		active: () => false
	},
	{
		id: "clients",
		label: "Clients",
		icon: Users,
		route: "/clients",
		active: (pathname) => pathname === "/clients" || pathname.startsWith("/clients/")
	},
	{
		id: "websites",
		label: "Websites",
		icon: Globe2,
		route: "/",
		active: (pathname) => pathname === "/" || pathname.startsWith("/websites")
	},
	{
		id: "users",
		label: "Users",
		icon: Users
	},
	{
		id: "settings",
		label: "Settings",
		icon: Settings,
		route: "/settings",
		active: (pathname) => pathname === "/settings"
	},
	{
		id: "activity",
		label: "Activity Logs",
		icon: Activity
	}
];
function initials$1(name) {
	if (!name) return "A";
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
function Brand() {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex size-9 items-center justify-center rounded-xl bg-[#5b38f6] text-[18px] font-bold text-white shadow-[0_12px_24px_rgba(91,56,246,0.22)]",
			children: "S"
		}), /* @__PURE__ */ jsx("span", {
			className: "text-[20px] font-semibold tracking-normal text-[#111827]",
			children: "Sitely"
		})]
	});
}
function SidebarUserCard() {
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
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsxs(DropdownMenuTrigger, {
		render: /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "flex w-full items-center gap-3 rounded-2xl border border-[#edf1f7] bg-white px-3 py-3 text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:border-[#e1e7f0] hover:bg-[#fafbff]"
		}),
		children: [
			/* @__PURE__ */ jsx(Avatar$1, {
				className: "size-11 shrink-0 rounded-full",
				children: /* @__PURE__ */ jsx(AvatarFallback, {
					className: "rounded-full bg-[#5b38f6] text-[14px] font-semibold text-white",
					children: initials$1(user?.name)
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ jsx("div", {
					className: "truncate text-[15px] font-semibold text-[#111827]",
					children: user?.name ?? "Admin"
				}), /* @__PURE__ */ jsx("div", {
					className: "truncate text-[13px] text-[#64748b]",
					children: user?.role?.replace("_", " ") ?? "Admin"
				})]
			}),
			/* @__PURE__ */ jsx(ChevronDown, { className: "size-4 text-[#64748b]" })
		]
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		align: "start",
		side: "top",
		sideOffset: 8,
		className: "min-w-[220px] rounded-2xl border border-[#e4e8f0] bg-white p-1.5 shadow-xl",
		children: [
			/* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
				className: "cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-[#0f172a] focus:bg-[#f4f1ff]",
				onClick: () => navigate({ to: "/settings" }),
				children: [/* @__PURE__ */ jsx(Settings, { className: "size-4 text-[#64748b]" }), "Settings"]
			}) }),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			/* @__PURE__ */ jsx(DropdownMenuGroup, { children: /* @__PURE__ */ jsxs(DropdownMenuItem, {
				className: "cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium text-red-600 focus:bg-red-50",
				onClick: () => logoutMutation.mutate(),
				disabled: logoutMutation.isPending,
				children: [/* @__PURE__ */ jsx(LogOut, { className: "size-4" }), logoutMutation.isPending ? "Signing out..." : "Sign out"]
			}) })
		]
	})] });
}
function SidebarInner({ onNavigate }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-full w-[210px] flex-col border-r border-[#e7ecf3] bg-white px-4 py-6",
		children: [
			/* @__PURE__ */ jsx(Brand, {}),
			/* @__PURE__ */ jsx("nav", {
				className: "mt-8 flex flex-1 flex-col gap-2",
				children: NAV_ITEMS.map((item) => {
					const isActive = item.active ? item.active(pathname) : false;
					const content = /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx(item.icon, { className: cn("size-[18px] shrink-0", isActive ? "text-[#5b38f6]" : "text-[#334155]") }),
						/* @__PURE__ */ jsx("span", {
							className: cn("text-[14px] font-medium", isActive ? "text-[#5b38f6]" : "text-[#1f2937]"),
							children: item.label
						}),
						isActive ? /* @__PURE__ */ jsx("span", { className: "absolute inset-y-1 right-0 w-[3px] rounded-full bg-[#5b38f6]" }) : null
					] });
					if (item.route) return /* @__PURE__ */ jsx(Link, {
						to: item.route,
						onClick: onNavigate,
						className: cn("relative flex h-12 items-center gap-3 rounded-2xl px-5 transition", isActive ? "bg-[#f3eeff]" : "hover:bg-[#f8fafc]"),
						children: content
					}, item.id);
					return /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "relative flex h-12 items-center gap-3 rounded-2xl px-5 text-left transition hover:bg-[#f8fafc]",
						children: content
					}, item.id);
				})
			}),
			/* @__PURE__ */ jsx(SidebarUserCard, {})
		]
	});
}
function AppLayoutSidebar({ isMobile = false, mobileOpen = false, onMobileOpenChange }) {
	if (isMobile) return /* @__PURE__ */ jsx(Sheet, {
		open: mobileOpen,
		onOpenChange: onMobileOpenChange,
		children: /* @__PURE__ */ jsx(SheetContent, {
			side: "left",
			className: "w-[260px] border-r border-[#e7ecf3] bg-white p-0",
			showCloseButton: false,
			children: /* @__PURE__ */ jsx(SidebarInner, { onNavigate: () => onMobileOpenChange?.(false) })
		})
	});
	return /* @__PURE__ */ jsx("aside", {
		className: "hidden shrink-0 lg:block",
		children: /* @__PURE__ */ jsx(SidebarInner, {})
	});
}
//#endregion
//#region src/components/layout/top-bar.tsx
function initials(name) {
	if (!name) return "A";
	return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
function TopBar({ onMenuClick, showMenuButton = false }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const slot = useTopBarSlot();
	const slotContent = slot.routeKey === pathname ? slot.content : null;
	const { data: user } = useQuery(authMeQueryOptions);
	const showWebsitesActions = pathname === "/" || pathname.startsWith("/websites");
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-20 flex shrink-0 items-center gap-3 border-b border-[#e7ecf3] bg-white px-4 py-3 lg:px-5 xl:gap-4 xl:px-7 xl:py-4",
		children: [
			showMenuButton ? /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				size: "icon-lg",
				className: "shrink-0 xl:hidden",
				onClick: onMenuClick,
				"aria-label": "Open navigation",
				children: /* @__PURE__ */ jsx(Menu, { className: "size-4" })
			}) : null,
			/* @__PURE__ */ jsx("div", {
				className: "min-w-0 flex-1",
				children: slotContent
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "hidden min-w-0 shrink-0 items-center gap-3 lg:flex xl:gap-4",
				children: [
					showWebsitesActions ? /* @__PURE__ */ jsx(Button, {
						size: "lg",
						className: "h-9 rounded-xl bg-[#5b38f6] px-3.5 text-[13px] font-medium text-white shadow-[0_14px_24px_rgba(91,56,246,0.22)] hover:bg-[#4e30e0] xl:h-10 xl:px-4 xl:text-[14px]",
						render: /* @__PURE__ */ jsx(Link, {
							to: "/websites/new",
							search: { clientId: void 0 }
						}),
						children: "+ Add Website"
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "relative min-w-0",
						children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" }), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Search anything...",
							className: "h-9 w-[170px] rounded-xl border border-[#e5e7ef] bg-[#f8fafc] pl-10 pr-4 text-[13px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#c7bdfd] xl:h-10 xl:w-[235px] xl:text-[14px]"
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "relative text-[#334155] transition hover:text-[#111827]",
						children: [/* @__PURE__ */ jsx(Bell, { className: "size-5" }), /* @__PURE__ */ jsx("span", {
							className: "absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-[#ef4444] text-[10px] font-semibold text-white",
							children: "3"
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "text-[#334155] transition hover:text-[#111827]",
						children: /* @__PURE__ */ jsx(SunMedium, { className: "size-5" })
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Avatar$1, {
							className: "size-9 rounded-full xl:size-10",
							children: /* @__PURE__ */ jsx(AvatarFallback, {
								className: "rounded-full bg-[#5b38f6] text-[13px] font-semibold text-white",
								children: initials(user?.name)
							})
						}), /* @__PURE__ */ jsx(ChevronDown, { className: "hidden size-4 text-[#64748b] xl:block" })]
					})
				]
			})
		]
	});
}
//#endregion
//#region src/hooks/use-mobile.ts
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState(void 0);
	React.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
//#endregion
//#region src/routes/_protected.tsx?tsr-split=component
function ProtectedLayout() {
	const isMobile = useIsMobile();
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	return /* @__PURE__ */ jsx(TopBarSlotProvider, { children: /* @__PURE__ */ jsxs("div", {
		className: "flex h-screen overflow-hidden bg-[#f7f8fc] text-[#0f172a] selection:bg-[#4f2df5] selection:text-white dark:bg-[#0b1020] dark:text-[#edf2ff]",
		children: [/* @__PURE__ */ jsx(AppLayoutSidebar, {
			isExpanded: isSidebarExpanded,
			isMobile,
			mobileOpen: isSidebarOpen,
			onMobileOpenChange: setIsSidebarOpen,
			onToggle: () => {
				if (isMobile) {
					setIsSidebarOpen((value) => !value);
					return;
				}
				setIsSidebarExpanded((value) => !value);
			}
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex min-w-0 flex-1 flex-col overflow-hidden",
			children: [/* @__PURE__ */ jsx(TopBar, {
				onMenuClick: () => setIsSidebarOpen(true),
				showMenuButton: isMobile
			}), /* @__PURE__ */ jsx("div", {
				className: "flex min-h-0 flex-1 flex-col overflow-hidden",
				children: /* @__PURE__ */ jsx(Outlet, {})
			})]
		})]
	}) });
}
//#endregion
export { ProtectedLayout as component };
