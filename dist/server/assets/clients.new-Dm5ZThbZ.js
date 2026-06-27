import { t as Button } from "./button-N4VO-qD6.js";
import { t as ClientForm } from "./client-form-DBlG46ds.js";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft } from "lucide-react";
//#region src/routes/_protected/_clients/clients.new.tsx?tsr-split=component
function NewClientPage() {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-1 flex-col",
		children: [/* @__PURE__ */ jsx("header", {
			className: "flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ jsxs(Button, {
					variant: "link",
					className: "h-auto justify-start p-0 text-muted-foreground",
					render: /* @__PURE__ */ jsx(Link, {
						to: "/clients",
						search: {
							page: 1,
							limit: 20
						}
					}),
					children: [/* @__PURE__ */ jsx(ArrowLeft, {}), "Clients"]
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold",
					children: "Add Client"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: "Create a client record before adding websites."
				})] })]
			})
		}), /* @__PURE__ */ jsx("main", {
			className: "flex flex-1 flex-col gap-4 p-6",
			children: /* @__PURE__ */ jsx(ClientForm, { onCreated: (client) => navigate({
				to: "/clients/$clientId",
				params: { clientId: String(client.id) }
			}) })
		})]
	});
}
//#endregion
export { NewClientPage as component };
