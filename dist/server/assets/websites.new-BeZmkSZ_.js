import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_protected/_websites/websites.new.tsx
var $$splitComponentImporter = () => import("./websites.new-yiLmJFkk.js");
var Route = createFileRoute("/_protected/_websites/websites/new")({
	validateSearch: (search) => ({ clientId: typeof search.clientId === "string" ? search.clientId : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
