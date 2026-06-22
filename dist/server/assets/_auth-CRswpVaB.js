import { Outlet } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CalendarClock, Globe2, Users } from "lucide-react";
//#region src/routes/_auth.tsx?tsr-split=component
function AuthLayout() {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen w-full bg-white text-[#11141A]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative hidden w-[45%] overflow-hidden border-r border-[#D6D9FC] bg-[#EEEFFE] lg:flex lg:flex-col",
			children: [
				/* @__PURE__ */ jsx("div", { className: "absolute right-[-10%] top-[-20%] h-[50%] w-[80%] rounded-full border border-[#4F5DF5]/20" }),
				/* @__PURE__ */ jsx("div", { className: "absolute right-[-20%] top-[-10%] h-[60%] w-[90%] rounded-full border border-[#4F5DF5]/10" }),
				/* @__PURE__ */ jsxs("div", {
					className: "relative z-10 flex h-full flex-col p-12 xl:p-16",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-20 flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex size-10 items-center justify-center rounded-xl border border-[#D6D9FC] bg-white text-lg font-black text-[#4F5DF5] shadow-sm",
								children: "S"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-2xl font-extrabold tracking-normal text-[#11141A]",
								children: "Sitely"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mb-12 max-w-[420px]",
							children: [/* @__PURE__ */ jsx("h1", {
								className: "mb-4 text-[38px] font-bold leading-[1.1] tracking-normal text-[#11141A]",
								children: "Manage every website with clarity"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[17px] font-medium leading-relaxed text-[#5C6270]",
								children: "Track clients, projects, renewals, maintenance, and handovers from one calm workspace."
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "relative z-10 flex max-w-[420px] flex-col gap-8",
							children: [
								/* @__PURE__ */ jsx(AuthFeature, {
									icon: Globe2,
									title: "Website operations",
									description: "Follow each project from build to live status and renewal."
								}),
								/* @__PURE__ */ jsx(AuthFeature, {
									icon: Users,
									title: "Client workspace",
									description: "Keep client records and linked websites organized."
								}),
								/* @__PURE__ */ jsx(AuthFeature, {
									icon: CalendarClock,
									title: "Renewal tracking",
									description: "Spot overdue work, active maintenance, and upcoming due dates."
								})
							]
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute bottom-[-20%] left-[-10%] z-0 h-[40%] w-[60%] rounded-full bg-[#D6D9FC] opacity-60 blur-3xl" })
					]
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "relative flex flex-1 flex-col bg-white",
			children: /* @__PURE__ */ jsx("div", {
				className: "relative z-10 flex flex-1 items-center justify-center p-6 sm:p-12",
				children: /* @__PURE__ */ jsx(Outlet, {})
			})
		})]
	});
}
function AuthFeature({ icon: Icon, title, description }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex gap-5",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#D6D9FC] bg-white text-[#4F5DF5]",
			children: /* @__PURE__ */ jsx(Icon, { className: "size-6" })
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col pt-1",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "mb-1 text-[16px] font-bold text-[#4F5DF5]",
				children: title
			}), /* @__PURE__ */ jsx("p", {
				className: "text-[13px] font-medium leading-relaxed text-[#5C6270]",
				children: description
			})]
		})]
	});
}
//#endregion
export { AuthLayout as component };
