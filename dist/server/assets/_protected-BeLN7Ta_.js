import { r as toPositiveInt } from "./button-FgxVcNwj.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_protected/index.tsx
var $$splitComponentImporter = () => import("./_protected-DR8RveII.js");
var Route = createFileRoute("/_protected/")({
	validateSearch: (search) => ({
		search: typeof search.search === "string" ? search.search : void 0,
		clientId: typeof search.clientId === "string" ? search.clientId : void 0,
		websiteStatus: typeof search.websiteStatus === "string" ? search.websiteStatus : void 0,
		maintenanceStatus: typeof search.maintenanceStatus === "string" ? search.maintenanceStatus : void 0,
		platform: typeof search.platform === "string" ? search.platform : void 0,
		siteType: typeof search.siteType === "string" ? search.siteType : void 0,
		overdueOnly: search.overdueOnly === true || search.overdueOnly === "true" ? true : void 0,
		sortBy: typeof search.sortBy === "string" ? search.sortBy : void 0,
		sortOrder: search.sortOrder === "asc" || search.sortOrder === "desc" ? search.sortOrder : void 0,
		tab: isWebsiteTab(search.tab) ? search.tab : "all",
		page: toPositiveInt(search.page, 1),
		limit: toPositiveInt(search.limit, 10),
		showFilters: search.showFilters === true || search.showFilters === "true"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function isWebsiteTab(value) {
	return value === "all" || value === "live" || value === "inProgress" || value === "overdue" || value === "dueSoon";
}
//#endregion
export { Route as t };
