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
	fieldErrors;
	constructor(message, code, status, errors, rawFieldErrors) {
		super(message);
		this.code = code;
		this.status = status;
		this.errors = errors;
		this.fieldErrors = rawFieldErrors ?? parseFieldErrors(errors);
	}
};
function parseFieldErrors(errors) {
	if (!errors?.length) return {};
	const result = {};
	for (const entry of errors) {
		const spaceIdx = entry.indexOf(" ");
		if (spaceIdx === -1) result[entry] = entry;
		else {
			const key = entry.slice(0, spaceIdx);
			result[key] = entry.slice(spaceIdx + 1);
		}
	}
	return result;
}
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
	localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
	if (tokens.refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
	return true;
}
async function apiFetch(path, options = {}, hasRetried = false) {
	const accessToken = getAccessToken();
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			...options.body instanceof FormData ? {} : { "Content-Type": "application/json" },
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
	if (!json.success) throw new ApiError(json.error?.message ?? json.message ?? "Something went wrong", json.error?.code, res.status, Array.isArray(json.errors) ? json.errors : void 0, json.field_errors && typeof json.field_errors === "object" ? json.field_errors : void 0);
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
export { REFRESH_TOKEN_KEY as a, ApiError as i, toPositiveInt as n, apiFetch as o, ACCESS_TOKEN_KEY as r, cn as t };
