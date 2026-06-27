import { o as apiFetch } from "./utils-CR4dV3c0.js";
import { t as DATA_STALE_TIME } from "./query-client-CsiSIc9f.js";
import { i as listClientOptions } from "./clients-api-B-aODw25.js";
import { t as QUERY_KEYS } from "./queryKeys-iadVgs7d.js";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/lib/websites-api.ts
function normalizePagination(raw) {
	const p = raw.pagination;
	return {
		...raw,
		pagination: {
			...p,
			totalPages: p.totalPages ?? p.total_pages ?? 1
		}
	};
}
async function listWebsites(filters, page, limit = 10) {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("limit", String(limit));
	for (const [key, value] of Object.entries(filters)) if (value !== void 0 && value !== "") params.set(key, String(value).replace(/ /g, "_"));
	return normalizePagination(await apiFetch(`/websites?${params.toString()}`));
}
function getWebsiteStats() {
	return apiFetch("/websites/stats");
}
function createWebsite(input) {
	return apiFetch("/websites", {
		method: "POST",
		body: JSON.stringify(input)
	});
}
function getWebsite(websiteId) {
	return apiFetch(`/websites/${websiteId}`);
}
function getWebsiteTimeline(websiteId, year) {
	return apiFetch(`/websites/${websiteId}/timeline?year=${year}`);
}
function updateWebsite(websiteId, input) {
	return apiFetch(`/websites/${websiteId}`, {
		method: "PUT",
		body: JSON.stringify(input)
	});
}
function deleteWebsite(websiteId) {
	return apiFetch(`/websites/${websiteId}`, { method: "DELETE" });
}
function previewImport(payload) {
	return apiFetch("/import/websites", {
		method: "POST",
		body: payload instanceof FormData ? payload : JSON.stringify(payload)
	});
}
function confirmImport(payload) {
	return apiFetch("/import/websites/confirm", {
		method: "POST",
		body: payload instanceof FormData ? payload : JSON.stringify(payload)
	});
}
//#endregion
//#region src/hooks/use-websites.ts
function useWebsites(filters, page, limit = 10) {
	return useQuery({
		queryKey: [QUERY_KEYS.WEBSITES_LIST, {
			page,
			limit,
			...filters
		}],
		queryFn: () => listWebsites(filters, page, limit),
		placeholderData: (prev) => prev,
		staleTime: DATA_STALE_TIME
	});
}
function useWebsiteStats() {
	return useQuery({
		queryKey: [QUERY_KEYS.WEBSITES_STATS],
		queryFn: getWebsiteStats,
		staleTime: DATA_STALE_TIME
	});
}
function useClientOptions(search) {
	return useQuery({
		queryKey: [QUERY_KEYS.CLIENTS_OPTIONS, { search }],
		queryFn: () => listClientOptions(search),
		staleTime: DATA_STALE_TIME
	});
}
function useCreateWebsite() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => createWebsite(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			toast.success("Website created successfully.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to create website.")
	});
}
function useWebsite(websiteId) {
	return useQuery({
		queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId],
		queryFn: () => getWebsite(websiteId),
		staleTime: DATA_STALE_TIME
	});
}
function useWebsiteTimeline(websiteId, year) {
	return useQuery({
		queryKey: [
			QUERY_KEYS.WEBSITE_TIMELINE,
			websiteId,
			year
		],
		queryFn: () => getWebsiteTimeline(websiteId, year),
		staleTime: DATA_STALE_TIME,
		enabled: !!websiteId
	});
}
/** Returns all non-paid billing periods from hosted year to current year, sorted oldest first. */
function useUnpaidBillingPeriods(websiteId, hostedDate) {
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const hostedYear = hostedDate ? new Date(hostedDate).getFullYear() : currentYear;
	const queries = useQueries({ queries: Array.from({ length: currentYear - hostedYear + 1 }, (_, i) => hostedYear + i).map((year) => ({
		queryKey: [
			QUERY_KEYS.WEBSITE_TIMELINE,
			websiteId,
			year
		],
		queryFn: () => getWebsiteTimeline(websiteId, year),
		staleTime: DATA_STALE_TIME,
		enabled: !!websiteId && !!hostedDate
	})) });
	return {
		periods: queries.flatMap((q) => q.data?.periods ?? []).filter((p) => p.billing && p.billing.status !== "paid" && p.billing.status !== "upcoming").sort((a, b) => a.period_start.localeCompare(b.period_start)),
		isLoading: queries.some((q) => q.isLoading),
		isError: queries.some((q) => q.isError)
	};
}
function useDeleteWebsite(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => deleteWebsite(websiteId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] });
			toast.success("Website deleted.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to delete website.")
	});
}
function useImportPreview() {
	return useMutation({
		mutationFn: (payload) => previewImport(payload),
		onError: (err) => toast.error(err.message ?? "Preview failed.")
	});
}
function useImportConfirm() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload) => confirmImport(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
		},
		onError: (err) => toast.error(err.message ?? "Import failed.")
	});
}
function useRenewDomain(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => updateWebsite(websiteId, {
			domainRenewalDate: input.domainRenewalDate,
			domainCost: input.domainCost,
			domainLastVerified: input.domainLastVerified,
			domainHandledBy: input.domainHandledBy,
			domainRemarks: input.domainRemarks
		}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			toast.success("Domain renewed.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to renew domain.")
	});
}
function useUpdateWebsite(websiteId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => updateWebsite(websiteId, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_ACTIVITY, websiteId] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			toast.success("Website updated successfully.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to update website.")
	});
}
//#endregion
export { useImportPreview as a, useUpdateWebsite as c, useWebsiteTimeline as d, useWebsites as f, useImportConfirm as i, useWebsite as l, useCreateWebsite as n, useRenewDomain as o, useDeleteWebsite as r, useUnpaidBillingPeriods as s, useClientOptions as t, useWebsiteStats as u };
