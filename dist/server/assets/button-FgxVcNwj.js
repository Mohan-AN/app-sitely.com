import { jsx } from "react/jsx-runtime";
import { Button } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
//#region src/lib/api.ts
var API_URL = "https://sitely-api-staging.orotron.workers.dev/api/v1.0";
var ACCESS_TOKEN_KEY = "sitely_access_token";
var REFRESH_TOKEN_KEY = "sitely_refresh_token";
var ApiError = class extends Error {
	code;
	status;
	errors;
	constructor(message, code, status, errors) {
		super(message);
		this.code = code;
		this.status = status;
		this.errors = errors;
	}
};
var isRefreshing = false;
var pendingQueue = [];
var SKIP_REFRESH_PATHS = [
	"/auth/refresh",
	"/auth/login",
	"/auth/reset-password"
];
function getAccessToken() {
	return typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
}
function getRefreshToken() {
	return typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
}
function clearTokens() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
}
function redirectToLogin() {
	if (typeof window === "undefined") return;
	if (window.location.pathname !== "/login") window.location.assign("/login");
}
function drainQueue(error) {
	const queue = pendingQueue;
	pendingQueue = [];
	queue.forEach(({ resolve, reject }) => error ? reject(error) : resolve());
}
async function parseJson(res) {
	try {
		return await res.json();
	} catch {
		throw new ApiError("Something went wrong", void 0, res.status);
	}
}
async function performRefresh() {
	const refreshToken = getRefreshToken();
	if (!refreshToken) return false;
	const res = await fetch(`${API_URL}/auth/refresh`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refreshToken })
	});
	const json = await parseJson(res);
	if (!res.ok || !json.success) return false;
	const tokens = json.data;
	localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
	if (tokens.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
	return true;
}
async function apiFetch(path, options = {}, hasRetried = false) {
	const accessToken = getAccessToken();
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
			...options.headers
		}
	});
	if (res.status === 401 && !hasRetried && !SKIP_REFRESH_PATHS.includes(path)) {
		if (isRefreshing) return new Promise((resolve, reject) => {
			pendingQueue.push({
				resolve: () => resolve(apiFetch(path, options, true)),
				reject
			});
		});
		isRefreshing = true;
		let refreshed = false;
		try {
			refreshed = await performRefresh();
		} catch {} finally {
			isRefreshing = false;
		}
		if (refreshed) {
			drainQueue();
			return apiFetch(path, options, true);
		}
		const err = new ApiError("Session expired. Please sign in again.", "UNAUTHORIZED", 401);
		drainQueue(err);
		clearTokens();
		redirectToLogin();
		throw err;
	}
	const json = await parseJson(res);
	if (!json.success) throw new ApiError(json.error?.message ?? json.message ?? "Something went wrong", json.error?.code, res.status, Array.isArray(json.errors) ? json.errors : void 0);
	return json.data;
}
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function toPositiveInt(value, fallback) {
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-[#4f2df5] focus-visible:ring-3 focus-visible:ring-[#4f2df5]/20 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-[#4f2df5] text-white shadow-[0_10px_24px_rgba(79,45,245,0.18)] hover:bg-[#3f22d8]",
			outline: "border-[#dce3ef] bg-white text-[#0f172a] shadow-sm hover:bg-[#f8fafc] hover:text-[#4f2df5] aria-expanded:bg-[#f5f3ff] aria-expanded:text-[#4f2df5] dark:border-[#25304a] dark:bg-[#111827] dark:hover:bg-[#172033]",
			secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
			destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
			lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			icon: "size-8",
			"icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
			"icon-lg": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button$1({ className, variant = "default", size = "default", nativeButton, render, ...props }) {
	return /* @__PURE__ */ jsx(Button, {
		"data-slot": "button",
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		nativeButton: nativeButton ?? render === void 0,
		render,
		...props
	});
}
//#endregion
export { REFRESH_TOKEN_KEY as a, ACCESS_TOKEN_KEY as i, cn as n, apiFetch as o, toPositiveInt as r, Button$1 as t };
