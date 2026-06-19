import { o as apiFetch } from "./button-FgxVcNwj.js";
import { t as QUERY_KEYS } from "./queryKeys-Cf7KC0QD.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/lib/settings-api.ts
function getSettings() {
	return apiFetch("/settings");
}
function updateRenewalWindowDays(value) {
	return apiFetch("/settings/renewal_window_days", {
		method: "PUT",
		body: JSON.stringify({ value: String(value) })
	});
}
//#endregion
//#region src/hooks/use-settings.ts
function useSettings() {
	return useQuery({
		queryKey: [QUERY_KEYS.SETTINGS],
		queryFn: getSettings,
		staleTime: 300 * 1e3
	});
}
function useUpdateRenewalWindowDays() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateRenewalWindowDays,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] });
			toast.success("Due Soon window updated.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to update setting.")
	});
}
//#endregion
export { useUpdateRenewalWindowDays as n, useSettings as t };
