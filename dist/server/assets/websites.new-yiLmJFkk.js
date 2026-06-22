import { t as Route } from "./websites.new-BeZmkSZ_.js";
import { t as WebsiteForm } from "./website-form-RBxqyJiq.js";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
//#region src/routes/_protected/_websites/websites.new.tsx?tsr-split=component
var FORM_ID = "new-website-form";
function NewWebsitePage() {
	const navigate = useNavigate();
	const { clientId } = Route.useSearch();
	return /* @__PURE__ */ jsx("div", {
		className: "flex flex-1 flex-col overflow-auto bg-[#F4F5F7]",
		children: /* @__PURE__ */ jsxs("main", {
			className: "flex flex-1 flex-col gap-[12px] px-[24px] py-[16px]",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-4 flex-wrap",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-[21px] font-bold tracking-tight text-[#11141A]",
						children: "Add Website"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-[3px] text-[12.5px] text-[#8A8F98]",
						children: "Capture website, type, domain ownership, maintenance, costs, and dates"
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [clientId ? /* @__PURE__ */ jsx(Link, {
							to: "/clients/$clientId",
							params: { clientId },
							className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]",
							children: "Cancel"
						}) : /* @__PURE__ */ jsx(Link, {
							to: "/",
							search: {
								page: 1,
								limit: 10,
								showFilters: false
							},
							className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] bg-white px-4 text-[12.5px] font-semibold text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							form: FORM_ID,
							className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]",
							children: "Save Website"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("nav", {
					className: "flex items-center gap-1.5 text-[13px] text-[#8A8F98]",
					children: [
						clientId ? /* @__PURE__ */ jsx(Link, {
							to: "/clients/$clientId",
							params: { clientId },
							className: "transition hover:text-[#4F5DF5]",
							children: "Client"
						}) : /* @__PURE__ */ jsxs(Link, {
							to: "/",
							search: {
								page: 1,
								limit: 10,
								showFilters: false
							},
							className: "flex items-center gap-1 transition hover:text-[#4F5DF5]",
							children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "size-3.5" }), "Websites"]
						}),
						/* @__PURE__ */ jsx(ChevronRight, { className: "size-3.5" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-[#11141A]",
							children: "Add Website"
						})
					]
				}),
				/* @__PURE__ */ jsx(WebsiteForm, {
					formId: FORM_ID,
					initialClientId: clientId,
					onCreated: (website) => navigate({
						to: "/websites/$websiteId",
						params: { websiteId: String(website.id) }
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
			]
		})
	});
}
//#endregion
export { NewWebsitePage as component };
