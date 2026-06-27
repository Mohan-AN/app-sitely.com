import { n as toPositiveInt } from "./utils-CR4dV3c0.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_protected/_clients/clients.index.tsx
var $$splitComponentImporter = () => import("./clients.index-n5fPjJ5x.js");
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
