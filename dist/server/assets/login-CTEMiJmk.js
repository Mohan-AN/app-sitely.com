import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_auth/login.tsx
var $$splitComponentImporter = () => import("./login-Bx6bvDVS.js");
var Route = createFileRoute("/_auth/login")({
	validateSearch: (search) => ({ redirect: typeof search.redirect === "string" ? search.redirect : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
