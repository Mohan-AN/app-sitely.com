import { o as apiFetch } from "./button-jrDuWETO.js";
//#region src/lib/clients-api.ts
function listClientOptions(search) {
	const params = new URLSearchParams();
	params.set("limit", "100");
	if (search) params.set("search", search);
	return apiFetch(`/clients?${params.toString()}`);
}
function listClients(filters, page, limit = 20) {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("limit", String(limit));
	if (filters.search) params.set("search", filters.search);
	if (filters.sortBy) params.set("sortBy", filters.sortBy);
	if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
	return apiFetch(`/clients?${params.toString()}`);
}
function createClient(input) {
	return apiFetch("/clients", {
		method: "POST",
		body: JSON.stringify(input)
	});
}
function getClient(clientId) {
	return apiFetch(`/clients/${clientId}`);
}
function updateClient(clientId, input) {
	return apiFetch(`/clients/${clientId}`, {
		method: "PUT",
		body: JSON.stringify(input)
	});
}
function deleteClient(clientId) {
	return apiFetch(`/clients/${clientId}`, { method: "DELETE" });
}
//#endregion
export { listClients as a, listClientOptions as i, deleteClient as n, updateClient as o, getClient as r, createClient as t };
