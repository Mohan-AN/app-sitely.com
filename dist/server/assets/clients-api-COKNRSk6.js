import { o as apiFetch } from "./utils-C3dXA-e9.js";
//#region src/lib/clients-api.ts
function listClientOptions(search) {
	const params = new URLSearchParams();
	params.set("limit", "100");
	if (search) params.set("search", search);
	return apiFetch(`/clients?${params.toString()}`);
}
async function listClients(filters, page, limit = 20) {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("limit", String(limit));
	if (filters.search) params.set("search", filters.search);
	if (filters.sortBy) params.set("sortBy", filters.sortBy);
	if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
	const raw = await apiFetch(`/clients?${params.toString()}`);
	const p = raw.pagination;
	return {
		...raw,
		pagination: {
			...p,
			totalPages: p.totalPages ?? p.total_pages ?? 1
		}
	};
}
function createClient(input) {
	return apiFetch("/clients", {
		method: "POST",
		body: JSON.stringify(input)
	});
}
function getClient(id) {
	return apiFetch(`/clients/${id}`);
}
function updateClient(id, input) {
	return apiFetch(`/clients/${id}`, {
		method: "PUT",
		body: JSON.stringify(input)
	});
}
function deleteClient(id) {
	return apiFetch(`/clients/${id}`, { method: "DELETE" });
}
//#endregion
export { listClients as a, listClientOptions as i, deleteClient as n, updateClient as o, getClient as r, createClient as t };
