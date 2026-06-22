import { t as Route } from "./websites.new-CHExPPTG.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { t as WebsiteForm } from "./website-form-BHMfhLsp.js";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronRight } from "lucide-react";
//#region src/routes/_protected/_websites/websites.new.tsx?tsr-split=component
function NewWebsitePage() {
	const navigate = useNavigate();
	const { clientId } = Route.useSearch();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden bg-[#fbfdf8] dark:bg-[#0b110d]",
		children: [/* @__PURE__ */ jsx(TopBarSlot, {
			routeKey: "/websites/new",
			children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("nav", {
				className: "flex items-center gap-2 text-sm text-[#64745F] dark:text-[#b7c8b3]",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						search: {
							page: 1,
							limit: 10,
							showFilters: false
						},
						className: "transition-colors hover:text-[#08712f] dark:hover:text-[#b6d7a8]",
						children: "Websites"
					}),
					/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
					/* @__PURE__ */ jsx("span", {
						className: "text-base font-extrabold text-[#102315] dark:text-[#edf7ee]",
						children: "Add Website"
					})
				]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]",
				children: "Create a new website project and assign it to an existing client."
			})] })
		}), /* @__PURE__ */ jsx("main", {
			className: "flex min-h-0 flex-1 flex-col overflow-y-auto px-8 pb-0 pt-6",
			children: /* @__PURE__ */ jsx(WebsiteForm, {
				initialClientId: clientId,
				onCreated: (website) => navigate({
					to: "/websites/$websiteId",
					params: { websiteId: website.websiteId }
				}),
				onCancel: () => navigate({
					to: "/",
					search: {
						page: 1,
						limit: 10,
						showFilters: false
					}
				})
			})
		})]
	});
}
//#endregion
export { NewWebsitePage as component };
