import { t as DATA_STALE_TIME } from "./query-client-DjZXlTZ-.js";
import { a as listClients, n as deleteClient, o as updateClient, r as getClient, t as createClient } from "./clients-api-BxQDtEPj.js";
import { t as QUERY_KEYS } from "./queryKeys-Cf7KC0QD.js";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/hooks/use-clients.ts
function useClients(filters, page, limit = 20, options) {
	return useQuery({
		queryKey: [QUERY_KEYS.CLIENTS_LIST, {
			page,
			limit,
			...filters
		}],
		queryFn: () => listClients(filters, page, limit),
		staleTime: DATA_STALE_TIME,
		placeholderData: options?.keepPrevious ? keepPreviousData : void 0
	});
}
function useClient(clientId) {
	return useQuery({
		queryKey: [QUERY_KEYS.CLIENT_DETAIL, clientId],
		queryFn: () => getClient(clientId),
		staleTime: DATA_STALE_TIME
	});
}
function useCreateClient() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => createClient(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENTS_LIST] });
			toast.success("Client created successfully.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to create client.")
	});
}
function useUpdateClient(clientId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input) => updateClient(clientId, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENTS_LIST] });
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_DETAIL, clientId] });
			toast.success("Client updated successfully.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to update client.")
	});
}
function useDeleteClient(clientId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => deleteClient(clientId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENTS_LIST] });
			queryClient.removeQueries({ queryKey: [QUERY_KEYS.CLIENT_DETAIL, clientId] });
			toast.success("Client deleted.");
		},
		onError: (err) => toast.error(err.message ?? "Failed to delete client.")
	});
}
//#endregion
export { useUpdateClient as a, useDeleteClient as i, useClients as n, useCreateClient as r, useClient as t };
