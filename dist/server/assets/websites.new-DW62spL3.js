import { t as Route } from "./websites.new-BNPNNj4X.js";
import { t as WebsiteWizard } from "./website-wizard-BW_GAV4I.js";
import { useNavigate } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
//#region src/routes/_protected/_websites/websites.new.tsx?tsr-split=component
function NewWebsitePage() {
	const navigate = useNavigate();
	const { clientId } = Route.useSearch();
	return /* @__PURE__ */ jsx("div", {
		className: "flex h-full flex-col overflow-hidden",
		children: /* @__PURE__ */ jsx(WebsiteWizard, {
			initialClientId: clientId,
			cancelHref: clientId ? `/clients/${clientId}` : "/",
			onCreated: (website) => navigate({
				to: "/websites/$websiteId",
				params: { websiteId: String(website.id) }
			})
		})
	});
}
//#endregion
export { NewWebsitePage as component };
