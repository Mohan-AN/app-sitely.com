import { o as apiFetch } from "./utils-C3dXA-e9.js";
import { t as DATA_STALE_TIME } from "./query-client-Drfu_7uX.js";
import { i as listClientOptions } from "./clients-api-COKNRSk6.js";
import { t as QUERY_KEYS } from "./queryKeys-iadVgs7d.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
function useCurrentBillingId(websiteId) {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return useQuery({
		queryKey: [
			QUERY_KEYS.WEBSITE_TIMELINE,
			websiteId,
			year
		],
		queryFn: () => getWebsiteTimeline(websiteId, year),
		staleTime: DATA_STALE_TIME,
		enabled: !!websiteId,
		select: (data) => {
			return data.periods.find((p) => p.billing && (p.billing.status === "pending" || p.billing.status === "overdue"))?.billing?.billing_id ?? null;
		}
	});
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
export { useUpdateWebsite as a, useWebsiteTimeline as c, useDeleteWebsite as i, useWebsites as l, useCreateWebsite as n, useWebsite as o, useCurrentBillingId as r, useWebsiteStats as s, useClientOptions as t };
