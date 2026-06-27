import { o as apiFetch } from "./utils-CR4dV3c0.js";
import { t as QUERY_KEYS } from "./queryKeys-iadVgs7d.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/lib/service-options-api.ts
function listServiceOptions(category) {
	const params = new URLSearchParams();
	if (category) params.set("category", category);
	return apiFetch(`/settings/options?${params.toString()}`);
}
function createServiceOption(category, name) {
	return apiFetch("/settings/options", {
		method: "POST",
		body: JSON.stringify({
			category,
			name
		})
	});
}
function updateServiceOption(option_id, input) {
	return apiFetch(`/settings/options/${option_id}`, {
		method: "PUT",
		body: JSON.stringify(input)
	});
}
//#endregion
//#region src/hooks/use-service-options.ts
function useServiceOptions(category) {
	return useQuery({
		queryKey: [QUERY_KEYS.SERVICE_OPTIONS, category ?? "all"],
		queryFn: () => listServiceOptions(category),
		staleTime: 300 * 1e3
	});
}
function useCreateServiceOption() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ category, name }) => createServiceOption(category, name),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_OPTIONS] });
		}
	});
}
function useUpdateServiceOption() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ option_id, ...input }) => updateServiceOption(option_id, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_OPTIONS] });
		},
		onError: (err) => toast.error(err.message ?? "Failed to update option.")
	});
}
//#endregion
export { useServiceOptions as n, useUpdateServiceOption as r, useCreateServiceOption as t };
