import { t as Route } from "./websites.new-p0JLaxl6.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { t as WebsiteForm } from "./website-form-DTxAujeE.js";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronRight } from "lucide-react";
//#region src/routes/_protected/_websites/websites.new.tsx?tsr-split=component
function NewWebsitePage() {
	const navigate = useNavigate();
	const { clientId } = Route.useSearch();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-[#0b1020]",
		children: [/* @__PURE__ */ jsx(TopBarSlot, {
			routeKey: "/websites/new",
			children: /* @__PURE__ */ jsx("div", {
				className: "flex w-full items-center justify-end",
				children: /* @__PURE__ */ jsx("div", { className: "h-12 w-[300px]" })
			})
		}), /* @__PURE__ */ jsxs("main", {
			className: "flex min-h-0 flex-1 flex-col overflow-y-auto px-10 pb-0 pt-5",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ jsxs("nav", {
						className: "flex items-center gap-2 text-[16px] font-medium text-[#253858] dark:text-[#a6b2cf]",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								search: {
									page: 1,
									limit: 10,
									showFilters: false
								},
								className: "font-semibold text-[#4f2df5] transition-colors hover:text-[#3f22d8]",
								children: "Websites"
							}),
							/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
							/* @__PURE__ */ jsx("span", { children: "Add Website" })
						]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-5 text-[34px] font-extrabold leading-tight tracking-normal text-[#0b1020] dark:text-[#edf2ff]",
						children: "Add Website"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-[16px] font-medium text-[#253858] dark:text-[#a6b2cf]",
						children: "Add a new website to start tracking its status, maintenance, and important dates."
					})
				]
			}), /* @__PURE__ */ jsx(WebsiteForm, {
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
			})]
		})]
	});
}
//#endregion
export { NewWebsitePage as component };
