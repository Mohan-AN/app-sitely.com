import "./utils-CR4dV3c0.js";
import { n as queryClient } from "./query-client-CsiSIc9f.js";
import { t as authMeQueryOptions } from "./auth-CDcOwtrS.js";
import { t as Route$8 } from "./_protected-D-OIm8vq.js";
import { t as Route$9 } from "./login-zlOWmyWK.js";
import { t as Route$10 } from "./clients.index-D6oz7ZMf.js";
import { t as Route$11 } from "./websites.new-D5xRjCEV.js";
import { t as Route$12 } from "./websites._websiteId-DXCb2VpQ.js";
import { t as Route$13 } from "./clients._clientId-ByOdkTdk.js";
import { t as Route$14 } from "./websites._websiteId.edit-0vX7X314.js";
import { t as Route$15 } from "./clients._clientId.edit-DcYAV3e-.js";
import { t as Button } from "./button-N4VO-qD6.js";
import { HeadContent, Link, Scripts, createFileRoute, createRootRoute, createRouter, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
//#region src/styles.css?url
var styles_default = "/assets/styles-CK3SmlO8.css";
//#endregion
//#region src/routes/__root.tsx
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Sitely" }
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			type: "image/svg+xml",
			href: "/favicon.svg"
		}]
	}),
	shellComponent: RootDocument
});
function RootDocument({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsxs("head", { children: [/* @__PURE__ */ jsx(HeadContent, {}), /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: "try{var t=localStorage.getItem('sitely_theme')||'light';document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t}catch(e){}" } })] }), /* @__PURE__ */ jsxs("body", { children: [/* @__PURE__ */ jsxs(QueryClientProvider, {
			client: queryClient,
			children: [children, /* @__PURE__ */ jsx(Toaster, {
				richColors: true,
				position: "top-right"
			})]
		}), /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
//#endregion
//#region src/routes/_protected.tsx
var $$splitComponentImporter$6 = () => import("./_protected-BxOeckSx.js");
var Route$6 = createFileRoute("/_protected")({
	beforeLoad: ({ location }) => {
		if (typeof window === "undefined") return;
		if (!localStorage.getItem("sitely_access_token")) throw redirect({
			to: "/login",
			search: { redirect: location.pathname }
		});
		const state = queryClient.getQueryState(authMeQueryOptions.queryKey);
		if (state?.status === "error" && state.errorUpdatedAt > Date.now() - 1e4) throw redirect({
			to: "/login",
			search: { redirect: location.pathname }
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/_auth.tsx
var $$splitComponentImporter$5 = () => import("./_auth-C2kk7gHj.js");
var Route$5 = createFileRoute("/_auth")({
	beforeLoad: () => {
		if (typeof window !== "undefined" && localStorage.getItem("sitely_access_token")) throw redirect({
			to: "/",
			search: {
				page: 1,
				limit: 10,
				showFilters: false
			}
		});
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/_protected/settings.tsx
var $$splitComponentImporter$4 = () => import("./settings-DJ-SaOYp.js");
var Route$4 = createFileRoute("/_protected/settings")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/_protected/_websites.tsx
var $$splitComponentImporter$3 = () => import("./_websites-DuRqIIO8.js");
var Route$3 = createFileRoute("/_protected/_websites")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/_protected/_clients.tsx
var $$splitComponentImporter$2 = () => import("./_clients--ro8vlLj.js");
var Route$2 = createFileRoute("/_protected/_clients")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/_protected/_websites/websites.import.tsx
var $$splitComponentImporter$1 = () => import("./websites.import-UZu18Gu2.js");
var Route$1 = createFileRoute("/_protected/_websites/websites/import")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/_protected/_clients/clients.new.tsx
var $$splitComponentImporter = () => import("./clients.new-Dm5ZThbZ.js");
var Route = createFileRoute("/_protected/_clients/clients/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var ProtectedRoute = Route$6.update({
	id: "/_protected",
	getParentRoute: () => Route$7
});
var AuthRoute = Route$5.update({
	id: "/_auth",
	getParentRoute: () => Route$7
});
var ProtectedIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => ProtectedRoute
});
var ProtectedSettingsRoute = Route$4.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => ProtectedRoute
});
var ProtectedWebsitesRoute = Route$3.update({
	id: "/_websites",
	getParentRoute: () => ProtectedRoute
});
var ProtectedClientsRoute = Route$2.update({
	id: "/_clients",
	getParentRoute: () => ProtectedRoute
});
var AuthLoginRoute = Route$9.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AuthRoute
});
var ProtectedClientsClientsIndexRoute = Route$10.update({
	id: "/clients/",
	path: "/clients/",
	getParentRoute: () => ProtectedClientsRoute
});
var ProtectedWebsitesWebsitesNewRoute = Route$11.update({
	id: "/websites/new",
	path: "/websites/new",
	getParentRoute: () => ProtectedWebsitesRoute
});
var ProtectedWebsitesWebsitesImportRoute = Route$1.update({
	id: "/websites/import",
	path: "/websites/import",
	getParentRoute: () => ProtectedWebsitesRoute
});
var ProtectedWebsitesWebsitesWebsiteIdRoute = Route$12.update({
	id: "/websites/$websiteId",
	path: "/websites/$websiteId",
	getParentRoute: () => ProtectedWebsitesRoute
});
var ProtectedClientsClientsNewRoute = Route.update({
	id: "/clients/new",
	path: "/clients/new",
	getParentRoute: () => ProtectedClientsRoute
});
var ProtectedClientsClientsClientIdRoute = Route$13.update({
	id: "/clients/$clientId",
	path: "/clients/$clientId",
	getParentRoute: () => ProtectedClientsRoute
});
var ProtectedWebsitesWebsitesWebsiteIdEditRoute = Route$14.update({
	id: "/edit",
	path: "/edit",
	getParentRoute: () => ProtectedWebsitesWebsitesWebsiteIdRoute
});
var ProtectedClientsClientsClientIdEditRoute = Route$15.update({
	id: "/edit",
	path: "/edit",
	getParentRoute: () => ProtectedClientsClientsClientIdRoute
});
var AuthRouteChildren = { AuthLoginRoute };
var AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren);
var ProtectedClientsClientsClientIdRouteChildren = { ProtectedClientsClientsClientIdEditRoute };
var ProtectedClientsRouteChildren = {
	ProtectedClientsClientsClientIdRoute: ProtectedClientsClientsClientIdRoute._addFileChildren(ProtectedClientsClientsClientIdRouteChildren),
	ProtectedClientsClientsNewRoute,
	ProtectedClientsClientsIndexRoute
};
var ProtectedClientsRouteWithChildren = ProtectedClientsRoute._addFileChildren(ProtectedClientsRouteChildren);
var ProtectedWebsitesWebsitesWebsiteIdRouteChildren = { ProtectedWebsitesWebsitesWebsiteIdEditRoute };
var ProtectedWebsitesRouteChildren = {
	ProtectedWebsitesWebsitesWebsiteIdRoute: ProtectedWebsitesWebsitesWebsiteIdRoute._addFileChildren(ProtectedWebsitesWebsitesWebsiteIdRouteChildren),
	ProtectedWebsitesWebsitesImportRoute,
	ProtectedWebsitesWebsitesNewRoute
};
var ProtectedRouteChildren = {
	ProtectedClientsRoute: ProtectedClientsRouteWithChildren,
	ProtectedWebsitesRoute: ProtectedWebsitesRoute._addFileChildren(ProtectedWebsitesRouteChildren),
	ProtectedSettingsRoute,
	ProtectedIndexRoute
};
var rootRouteChildren = {
	AuthRoute: AuthRouteWithChildren,
	ProtectedRoute: ProtectedRoute._addFileChildren(ProtectedRouteChildren)
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/components/common/not-found.tsx
function NotFound() {
	return /* @__PURE__ */ jsx("main", {
		className: "flex min-h-screen items-center justify-center bg-[#f2f6ee] p-6 text-[#102315]",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md rounded-2xl border border-[#c7ddb5] bg-white p-8 text-center shadow-sm",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-extrabold",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm font-medium text-[#64745F]",
					children: "The page you are looking for does not exist."
				}),
				/* @__PURE__ */ jsx(Button, {
					className: "mt-6 bg-[#658354] hover:bg-[#4b6043]",
					render: /* @__PURE__ */ jsx(Link, {
						to: "/",
						search: {
							page: 1,
							limit: 10,
							showFilters: false
						}
					}),
					children: "Back to Websites"
				})
			]
		})
	});
}
//#endregion
//#region src/router.tsx
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultNotFoundComponent: NotFound
	});
}
//#endregion
export { getRouter };
