import { t as Button } from "./button-jrDuWETO.js";
import { t as Input } from "./input-BUXT0p6g.js";
import { n as useUpdateRenewalWindowDays, t as useSettings } from "./use-settings-Bg9DPHxD.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CalendarClock, Pencil } from "lucide-react";
//#region src/routes/_protected/settings.tsx?tsr-split=component
function SettingsPage() {
	return /* @__PURE__ */ jsxs("main", {
		className: "flex flex-1 flex-col gap-6 overflow-y-auto p-8",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-[22px] font-extrabold leading-none text-[#102315] dark:text-[#edf7ee]",
			children: "Settings"
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-1.5 text-[14px] text-[#64745F] dark:text-[#9fb49b]",
			children: "Manage workspace preferences."
		})] }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "mb-3 text-[11px] font-bold uppercase tracking-widest text-[#64745F] dark:text-[#9fb49b]",
				children: "Renewal"
			}), /* @__PURE__ */ jsx(DueSoonCard, {})]
		})]
	});
}
function DueSoonCard() {
	const { data: settings, isLoading } = useSettings();
	const [dialogOpen, setDialogOpen] = useState(false);
	const currentDays = settings ? parseInt(settings.renewal_window_days, 10) : null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between rounded-xl border border-[#e5ebe2] bg-white px-5 py-4 shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#163c25] dark:text-[#85e0a3]",
				children: /* @__PURE__ */ jsx(CalendarClock, { className: "size-5" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-[14px] font-bold text-[#102315] dark:text-[#edf7ee]",
				children: "Due Soon window"
			}), /* @__PURE__ */ jsxs("p", {
				className: "mt-0.5 text-[13px] text-[#64745F] dark:text-[#9fb49b]",
				children: [
					"Websites with active maintenance renewing within this many days are shown under ",
					/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-[#102315] dark:text-[#edf7ee]",
						children: "Due Soon"
					}),
					"."
				]
			})] })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "ml-6 flex shrink-0 items-center gap-3",
			children: [isLoading ? /* @__PURE__ */ jsx("div", { className: "h-7 w-16 animate-pulse rounded-lg bg-[#e5ebe2] dark:bg-[#2f4a32]" }) : /* @__PURE__ */ jsxs("span", {
				className: "rounded-lg bg-[#ddead1]/60 px-3 py-1 text-[15px] font-extrabold text-[#658354] dark:bg-[#1a3320] dark:text-[#85e0a3]",
				children: [currentDays ?? "—", " days"]
			}), /* @__PURE__ */ jsxs(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => setDialogOpen(true),
				disabled: isLoading,
				className: "gap-1.5 rounded-lg border-[#dde5d8] text-[#334155] hover:border-[#c7ddb5] hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:text-[#d6e8cf] dark:hover:bg-[#203423]",
				children: [/* @__PURE__ */ jsx(Pencil, { className: "size-3.5" }), "Edit"]
			})]
		})]
	}), dialogOpen && currentDays !== null && /* @__PURE__ */ jsx(DueSoonDialog, {
		currentDays,
		onClose: () => setDialogOpen(false)
	})] });
}
function DueSoonDialog({ currentDays, onClose }) {
	const [value, setValue] = useState(String(currentDays));
	const [error, setError] = useState();
	const mutation = useUpdateRenewalWindowDays();
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	const parsed = parseInt(value, 10);
	const isValid = !isNaN(parsed) && parsed >= 1 && parsed <= 365;
	function handleSubmit(e) {
		e.preventDefault();
		if (!isValid) {
			setError("Enter a number between 1 and 365.");
			return;
		}
		setError(void 0);
		mutation.mutate(parsed, {
			onSuccess: () => onClose(),
			onError: (err) => {
				setError(err.message ?? "Failed to update. Please try again.");
			}
		});
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm",
		onClick: onClose,
		"aria-hidden": "true"
	}), /* @__PURE__ */ jsxs("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "duesoon-dialog-title",
		className: "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white p-6 shadow-xl dark:border-[#2f4a32] dark:bg-[#101912]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-5",
			children: [/* @__PURE__ */ jsx("h2", {
				id: "duesoon-dialog-title",
				className: "text-[17px] font-extrabold text-[#102315] dark:text-[#edf7ee]",
				children: "Edit Due Soon window"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-[13px] text-[#64745F] dark:text-[#9fb49b]",
				children: "Set how many days ahead counts as \"Due Soon\" for maintenance renewals."
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ jsx("label", {
						htmlFor: "renewal-days",
						className: "text-[11px] font-bold uppercase tracking-widest text-[#64745F]",
						children: "Days"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Input, {
							id: "renewal-days",
							type: "number",
							min: 1,
							max: 365,
							value,
							onChange: (e) => {
								setValue(e.target.value);
								setError(void 0);
							},
							className: `h-11 w-full rounded-xl border-[#c7ddb5] bg-white px-4 text-[15px] font-bold text-[#102015] focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${error ? "border-red-400" : ""}`,
							autoFocus: true
						}), /* @__PURE__ */ jsx("span", {
							className: "shrink-0 text-[14px] font-semibold text-[#64745F]",
							children: "days"
						})]
					}),
					error ? /* @__PURE__ */ jsx("p", {
						className: "text-[13px] font-semibold text-red-500",
						children: error
					}) : null,
					/* @__PURE__ */ jsxs("p", {
						className: "text-[12px] text-[#9fb49b]",
						children: [
							"Current value: ",
							currentDays,
							" days \xA0·\xA0 Allowed range: 1–365"
						]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex justify-end gap-2 pt-1",
				children: [/* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "outline",
					onClick: onClose,
					className: "rounded-xl border-[#dde5d8] text-[#334155] hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:text-[#d6e8cf]",
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: mutation.isPending || !isValid || parsed === currentDays,
					className: "rounded-xl bg-[#658354] font-bold text-white hover:bg-[#4b6043]",
					children: mutation.isPending ? "Saving..." : "Save"
				})]
			})]
		})]
	})] });
}
//#endregion
export { SettingsPage as component };
