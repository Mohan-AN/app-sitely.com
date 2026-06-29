import { o as apiFetch } from "./utils-CR4dV3c0.js";
//#region src/lib/auth.ts
var AUTH_ME_QUERY_KEY = ["auth", "me"];
var AUTH_ME_STALE_TIME = 300 * 1e3;
function fetchCurrentUser() {
	return apiFetch("/auth/me");
}
var authMeQueryOptions = {
	queryKey: AUTH_ME_QUERY_KEY,
	queryFn: fetchCurrentUser,
	staleTime: AUTH_ME_STALE_TIME,
	gcTime: 1800 * 1e3,
	retry: false,
	refetchOnMount: false,
	refetchOnWindowFocus: false,
	refetchOnReconnect: false
};
//#endregion
export { authMeQueryOptions as t };
