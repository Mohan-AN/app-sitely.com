import { n as toPositiveInt } from "./utils-C3dXA-e9.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_protected/index.tsx
var $$splitComponentImporter = () => import("./_protected-D-b_nZb9.js");
var Route = createFileRoute("/_protected/")({
	validateSearch: (search) => ({
		search: typeof search.search === "string" ? search.search : void 0,
		clientId: typeof search.clientId === "string" ? search.clientId : void 0,
		websiteStatus: typeof search.websiteStatus === "string" ? search.websiteStatus : void 0,
		maintenanceStatus: typeof search.maintenanceStatus === "string" ? search.maintenanceStatus : void 0,
		platform: typeof search.platform === "string" ? search.platform : void 0,
		siteType: typeof search.siteType === "string" ? search.siteType : void 0,
		overdueOnly: search.overdueOnly === true || search.overdueOnly === "true" ? true : void 0,
		maintenanceOverdueOnly: search.maintenanceOverdueOnly === true || search.maintenanceOverdueOnly === "true" ? true : void 0,
		domainOverdueOnly: search.domainOverdueOnly === true || search.domainOverdueOnly === "true" ? true : void 0,
		sortBy: typeof search.sortBy === "string" ? search.sortBy : void 0,
		sortOrder: search.sortOrder === "asc" || search.sortOrder === "desc" ? search.sortOrder : void 0,
		tab: isWebsiteTab(search.tab) ? search.tab : "all",
		page: toPositiveInt(search.page, 1),
		limit: toPositiveInt(search.limit, 15),
		showFilters: search.showFilters === true || search.showFilters === "true"
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function isWebsiteTab(value) {
	return value === "all" || value === "inProgress" || value === "maintenanceOverdue" || value === "domainOverdue" || value === "dueSoon";
}
//#endregion
export { Route as t };
