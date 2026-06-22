//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/__root.tsx",
		children: ["/_auth", "/_protected"],
		preloads: [
			"/assets/index-DgeT88qz.js",
			"/assets/jsx-runtime-bzQ4Vb5N.js",
			"/assets/button-B9vHjsaa.js",
			"/assets/useButton-Bl2fRC12.js",
			"/assets/useRenderElement-_7sY3EPS.js",
			"/assets/useStore-HRoxwnXs.js",
			"/assets/matchContext-mH6aKBB8.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-DgeT88qz.js"
		} }]
	},
	"/_auth": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_auth.tsx",
		children: ["/_auth/login"],
		preloads: [
			"/assets/_auth-D2AWpyMs.js",
			"/assets/createLucideIcon-Drdcc3tR.js",
			"/assets/calendar-clock-CB5VYk6Q.js",
			"/assets/users-vbCYdkTj.js"
		]
	},
	"/_protected": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected.tsx",
		children: [
			"/_protected/_clients",
			"/_protected/_websites",
			"/_protected/settings",
			"/_protected/"
		],
		preloads: [
			"/assets/_protected-C6sMX4-Q.js",
			"/assets/dropdown-menu-DkJpLz01.js",
			"/assets/useOnFirstRender-CRYhUq9u.js",
			"/assets/createBaseUIEventDetails-CVqZIfUz.js",
			"/assets/queryKeys-DUrUB7A5.js",
			"/assets/createLucideIcon-Drdcc3tR.js",
			"/assets/use-websites-D317qbAQ.js",
			"/assets/users-vbCYdkTj.js"
		]
	},
	"/_auth/login": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_auth/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-Cnjigsgu.js",
			"/assets/input-D2ModMCQ.js",
			"/assets/createBaseUIEventDetails-CVqZIfUz.js",
			"/assets/eye-off-DRFEBcAD.js",
			"/assets/eye-Cbfmq2ka.js"
		]
	},
	"/_protected/_clients": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/_clients.tsx",
		children: [
			"/_protected/_clients/clients/$clientId",
			"/_protected/_clients/clients/new",
			"/_protected/_clients/clients/"
		],
		preloads: ["/assets/_clients-DhWJrd-z.js"]
	},
	"/_protected/_websites": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/_websites.tsx",
		children: ["/_protected/_websites/websites/$websiteId", "/_protected/_websites/websites/new"],
		preloads: ["/assets/_websites-DhWJrd-z.js"]
	},
	"/_protected/settings": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-Mbkphigi.js",
			"/assets/input-D2ModMCQ.js",
			"/assets/calendar-clock-CB5VYk6Q.js",
			"/assets/eye-off-DRFEBcAD.js",
			"/assets/eye-Cbfmq2ka.js",
			"/assets/pencil-C3aO_eIz.js",
			"/assets/plus-lFC6EHhR.js",
			"/assets/use-settings-MDdITr18.js",
			"/assets/x-C0nJtaLE.js",
			"/assets/use-service-options-B7Vie4g2.js"
		]
	},
	"/_protected/": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/index.tsx",
		children: void 0,
		preloads: [
			"/assets/_protected-B3gUXwJK.js",
			"/assets/confirm-dialog-gSWSj_ZA.js",
			"/assets/input-D2ModMCQ.js",
			"/assets/website-form-BRESk6KP.js",
			"/assets/schemas-DQ8sTQ9C.js",
			"/assets/chevron-right-CMqoPSN8.js",
			"/assets/status-badges-DnycZyDR.js",
			"/assets/eye-Cbfmq2ka.js",
			"/assets/pencil-C3aO_eIz.js",
			"/assets/use-settings-MDdITr18.js",
			"/assets/no-results-CIiVG4rT.js",
			"/assets/x-C0nJtaLE.js",
			"/assets/skeleton-DMX2AfzX.js",
			"/assets/format-DN6wIiCG.js"
		]
	},
	"/_protected/_clients/clients/$clientId": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/_clients/clients.$clientId.tsx",
		children: ["/_protected/_clients/clients/$clientId/edit"],
		preloads: [
			"/assets/clients._clientId-DS16sa00.js",
			"/assets/edit-client-dialog-DYttxEFF.js",
			"/assets/chevron-right-CMqoPSN8.js",
			"/assets/external-link-BT6q1SRm.js",
			"/assets/plus-lFC6EHhR.js",
			"/assets/skeleton-DMX2AfzX.js",
			"/assets/use-clients-99pj1Vsf.js",
			"/assets/format-DN6wIiCG.js"
		]
	},
	"/_protected/_clients/clients/new": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/_clients/clients.new.tsx",
		children: void 0,
		preloads: ["/assets/clients.new-Dz4E8c6C.js", "/assets/client-form-xFgh9cft.js"]
	},
	"/_protected/_websites/websites/$websiteId": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/_websites/websites.$websiteId.tsx",
		children: ["/_protected/_websites/websites/$websiteId/edit"],
		preloads: [
			"/assets/websites._websiteId-BrK6uYWq.js",
			"/assets/confirm-dialog-gSWSj_ZA.js",
			"/assets/input-D2ModMCQ.js",
			"/assets/chevron-right-CMqoPSN8.js",
			"/assets/status-badges-DnycZyDR.js",
			"/assets/external-link-BT6q1SRm.js",
			"/assets/skeleton-DMX2AfzX.js",
			"/assets/format-DN6wIiCG.js"
		]
	},
	"/_protected/_websites/websites/new": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/_websites/websites.new.tsx",
		children: void 0,
		preloads: [
			"/assets/websites.new-BUqwG9BY.js",
			"/assets/website-form-BRESk6KP.js",
			"/assets/chevron-right-CMqoPSN8.js"
		]
	},
	"/_protected/_clients/clients/": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/_clients/clients.index.tsx",
		children: void 0,
		preloads: [
			"/assets/clients.index-C0riddza.js",
			"/assets/confirm-dialog-gSWSj_ZA.js",
			"/assets/input-D2ModMCQ.js",
			"/assets/edit-client-dialog-DYttxEFF.js",
			"/assets/schemas-DQ8sTQ9C.js",
			"/assets/chevron-right-CMqoPSN8.js",
			"/assets/no-results-CIiVG4rT.js",
			"/assets/x-C0nJtaLE.js",
			"/assets/use-clients-99pj1Vsf.js",
			"/assets/format-DN6wIiCG.js"
		]
	},
	"/_protected/_clients/clients/$clientId/edit": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/_clients/clients.$clientId.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/clients._clientId.edit-BVzIWxaI.js",
			"/assets/confirm-dialog-gSWSj_ZA.js",
			"/assets/client-form-xFgh9cft.js"
		]
	},
	"/_protected/_websites/websites/$websiteId/edit": {
		filePath: "C:/Users/sirig/Actnos-project/app.sitely.com/src/routes/_protected/_websites/websites.$websiteId.edit.tsx",
		children: void 0,
		preloads: ["/assets/websites._websiteId.edit-Ofyl_OKp.js", "/assets/website-form-BRESk6KP.js"]
	}
} });
//#endregion
export { tsrStartManifest };
