import { n as toPositiveInt } from "./utils-C3dXA-e9.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_protected/_clients/clients.index.tsx
var $$splitComponentImporter = () => import("./clients.index-f3j33zwz.js");
var Route = createFileRoute("/_protected/_clients/clients/")({
	validateSearch: (search) => ({
		search: typeof search.search === "string" ? search.search : void 0,
		sortBy: typeof search.sortBy === "string" ? search.sortBy : void 0,
		sortOrder: search.sortOrder === "asc" || search.sortOrder === "desc" ? search.sortOrder : void 0,
		page: toPositiveInt(search.page, 1),
		limit: toPositiveInt(search.limit, 20)
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
