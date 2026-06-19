//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/__root.tsx",
		children: ["/_auth", "/_protected"],
		preloads: [
			"/assets/index-wKFdIqyj.js",
			"/assets/jsx-runtime-bzQ4Vb5N.js",
			"/assets/button-BR3woEaa.js",
			"/assets/useStore-HRoxwnXs.js",
			"/assets/link-BL_4Vv5x.js",
			"/assets/matchContext-mH6aKBB8.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-wKFdIqyj.js"
		} }]
	},
	"/_auth": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_auth.tsx",
		children: ["/_auth/login"],
		preloads: ["/assets/_auth-DesboUQG.js"]
	},
	"/_protected": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected.tsx",
		children: [
			"/_protected/_clients",
			"/_protected/_websites",
			"/_protected/settings",
			"/_protected/"
		],
		preloads: [
			"/assets/_protected-kFcT2WoM.js",
			"/assets/dropdown-menu-C_9e6JcH.js",
			"/assets/DialogRoot-CIDdZDVn.js",
			"/assets/top-bar-slot-CbGk8DVp.js",
			"/assets/createBaseUIEventDetails-CLOZRwzV.js",
			"/assets/useQuery-C4Sw9OEu.js",
			"/assets/useRouterState-t-wSjhYT.js",
			"/assets/chevron-down-FCdFB0O_.js",
			"/assets/earth-Ob6IYHnm.js",
			"/assets/search-D2imfpFm.js",
			"/assets/users-P4bkuqcT.js",
			"/assets/x-Bj7R7_xO.js"
		]
	},
	"/_auth/login": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_auth/login.tsx",
		children: void 0,
		preloads: [
			"/assets/login-BEiaNbQQ.js",
			"/assets/input-RHmyu2zQ.js",
			"/assets/createBaseUIEventDetails-CLOZRwzV.js",
			"/assets/mail-CdYhodBe.js"
		]
	},
	"/_protected/_clients": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/_clients.tsx",
		children: [
			"/_protected/_clients/clients/$clientId",
			"/_protected/_clients/clients/new",
			"/_protected/_clients/clients/"
		],
		preloads: ["/assets/_clients-BtwoDWAG.js"]
	},
	"/_protected/_websites": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/_websites.tsx",
		children: ["/_protected/_websites/websites/$websiteId", "/_protected/_websites/websites/new"],
		preloads: ["/assets/_websites-BtwoDWAG.js"]
	},
	"/_protected/settings": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/settings.tsx",
		children: void 0,
		preloads: [
			"/assets/settings-CMgHhMHI.js",
			"/assets/input-RHmyu2zQ.js",
			"/assets/calendar-clock-VxRSxPum.js",
			"/assets/pencil-CuRB2_ob.js",
			"/assets/use-settings-BuTp4pLy.js"
		]
	},
	"/_protected/": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/index.tsx",
		children: void 0,
		preloads: [
			"/assets/_protected-5nThMT5-.js",
			"/assets/confirm-dialog-DQBq_HT5.js",
			"/assets/input-RHmyu2zQ.js",
			"/assets/website-form-CHYsoGji.js",
			"/assets/clients-api-oxbGReKJ.js",
			"/assets/no-results-qOfMGLNx.js",
			"/assets/chevron-left-DhhQA6vI.js",
			"/assets/chevron-right-DDKhODYc.js",
			"/assets/website-edit-dialog-Cp5hzRT4.js",
			"/assets/pencil-CuRB2_ob.js",
			"/assets/skeleton-BQmwzgfO.js",
			"/assets/use-settings-BuTp4pLy.js",
			"/assets/format-Ce_rjCYj.js"
		]
	},
	"/_protected/_clients/clients/$clientId": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/_clients/clients.$clientId.tsx",
		children: ["/_protected/_clients/clients/$clientId/edit"],
		preloads: [
			"/assets/clients._clientId-DLIoDk9A.js",
			"/assets/edit-client-dialog-BmgNjipP.js",
			"/assets/chevron-left-DhhQA6vI.js",
			"/assets/chevron-right-DDKhODYc.js",
			"/assets/external-link-CWFATDjY.js",
			"/assets/globe-EERy7GiV.js",
			"/assets/mail-CdYhodBe.js",
			"/assets/pencil-CuRB2_ob.js",
			"/assets/skeleton-BQmwzgfO.js",
			"/assets/use-clients-By1RvQT0.js",
			"/assets/format-Ce_rjCYj.js"
		]
	},
	"/_protected/_clients/clients/new": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/_clients/clients.new.tsx",
		children: void 0,
		preloads: [
			"/assets/clients.new-Bse1xmX4.js",
			"/assets/arrow-left-B5tV-kfP.js",
			"/assets/client-form--v5UO5Jc.js"
		]
	},
	"/_protected/_websites/websites/$websiteId": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/_websites/websites.$websiteId.tsx",
		children: ["/_protected/_websites/websites/$websiteId/edit"],
		preloads: [
			"/assets/websites._websiteId-BPouaz2B.js",
			"/assets/confirm-dialog-DQBq_HT5.js",
			"/assets/input-RHmyu2zQ.js",
			"/assets/website-form-CHYsoGji.js",
			"/assets/calendar-clock-VxRSxPum.js",
			"/assets/chevron-right-DDKhODYc.js",
			"/assets/website-edit-dialog-Cp5hzRT4.js",
			"/assets/external-link-CWFATDjY.js",
			"/assets/globe-EERy7GiV.js",
			"/assets/pencil-CuRB2_ob.js",
			"/assets/skeleton-BQmwzgfO.js",
			"/assets/format-Ce_rjCYj.js"
		]
	},
	"/_protected/_websites/websites/new": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/_websites/websites.new.tsx",
		children: void 0,
		preloads: [
			"/assets/websites.new-B62NzwtS.js",
			"/assets/website-form-CHYsoGji.js",
			"/assets/chevron-right-DDKhODYc.js"
		]
	},
	"/_protected/_clients/clients/": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/_clients/clients.index.tsx",
		children: void 0,
		preloads: [
			"/assets/clients.index-D3dZ7s60.js",
			"/assets/confirm-dialog-DQBq_HT5.js",
			"/assets/input-RHmyu2zQ.js",
			"/assets/edit-client-dialog-BmgNjipP.js",
			"/assets/clients-api-oxbGReKJ.js",
			"/assets/no-results-qOfMGLNx.js",
			"/assets/chevron-left-DhhQA6vI.js",
			"/assets/chevron-right-DDKhODYc.js",
			"/assets/mail-CdYhodBe.js",
			"/assets/use-clients-By1RvQT0.js"
		]
	},
	"/_protected/_clients/clients/$clientId/edit": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/_clients/clients.$clientId.edit.tsx",
		children: void 0,
		preloads: [
			"/assets/clients._clientId.edit-Cvacc1kE.js",
			"/assets/confirm-dialog-DQBq_HT5.js",
			"/assets/arrow-left-B5tV-kfP.js",
			"/assets/client-form--v5UO5Jc.js"
		]
	},
	"/_protected/_websites/websites/$websiteId/edit": {
		filePath: "C:/Users/sirig/Actnos-project/app-sitely.com/src/routes/_protected/_websites/websites.$websiteId.edit.tsx",
		children: void 0,
		preloads: ["/assets/websites._websiteId.edit-CY-hc043.js", "/assets/arrow-left-B5tV-kfP.js"]
	}
} });
//#endregion
export { tsrStartManifest };
