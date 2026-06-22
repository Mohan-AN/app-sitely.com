import { o as apiFetch } from "./utils-C3dXA-e9.js";
import { t as Input } from "./input-B9pPcpqc.js";
import { n as useServiceOptions, r as useUpdateServiceOption, t as useCreateServiceOption } from "./use-service-options-CsGN06oa.js";
import { n as useUpdateRenewalWindowDays, t as useSettings } from "./use-settings-_4vsvzKq.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CalendarClock, Eye, EyeOff, KeyRound, Pencil, Plus, RefreshCw, ToggleLeft, ToggleRight, X } from "lucide-react";
//#region src/routes/_protected/settings.tsx?tsr-split=component
var CATEGORIES = [
	{
		key: "build_type",
		label: "Build Type",
		usedIn: "Add / Edit Website"
	},
	{
		key: "hosting_provider",
		label: "Hosting Provider",
		usedIn: "Add / Edit Website"
	},
	{
		key: "hosting_type",
		label: "Hosting Type",
		usedIn: "Add / Edit Website"
	},
	{
		key: "domain_provider",
		label: "Domain Provider",
		usedIn: "Add / Edit Website"
	},
	{
		key: "payment_mode",
		label: "Payment Mode",
		usedIn: "Record Payment"
	}
];
function SettingsPage() {
	const [addModalOpen, setAddModalOpen] = useState(false);
	return /* @__PURE__ */ jsxs("main", {
		className: "flex flex-1 flex-col gap-8 overflow-y-auto bg-[#F4F5F7] p-8 dark:bg-[#0D0F1A]",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-[21px] font-bold leading-none tracking-tight text-[#11141A] dark:text-[#E5E7EB]",
				children: "Settings"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1.5 text-[13.5px] text-[#8A8F98]",
				children: "Manage workspace preferences and service options."
			})] }),
			/* @__PURE__ */ jsxs("section", {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ jsx(SectionLabel, { children: "Renewal" }), /* @__PURE__ */ jsx(DueSoonCard, {})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ jsx(SectionLabel, { children: "Security" }), /* @__PURE__ */ jsx(ChangePasswordCard, {})]
			}),
			/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ jsx(SectionLabel, { children: "Service Options" }), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setAddModalOpen(true),
					className: "inline-flex items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]",
					children: [/* @__PURE__ */ jsx(Plus, { className: "size-3.5" }), "Add Option"]
				})]
			}), /* @__PURE__ */ jsx(ServiceOptionsTable, {})] }),
			addModalOpen && /* @__PURE__ */ jsx(AddOptionModal, { onClose: () => setAddModalOpen(false) })
		]
	});
}
function SectionLabel({ children }) {
	return /* @__PURE__ */ jsx("p", {
		className: "mb-3 text-[11px] font-bold uppercase tracking-widest text-[#8A8F98]",
		children
	});
}
function ChangePasswordCard() {
	const [dialogOpen, setDialogOpen] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(17,20,26,.04)] dark:border-[#1e2244] dark:bg-[#181b2d]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-[#D97706] dark:bg-[#451A03]",
				children: /* @__PURE__ */ jsx(KeyRound, { className: "size-5" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-[14px] font-bold text-[#11141A] dark:text-[#E5E7EB]",
				children: "Change Password"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-0.5 text-[13px] text-[#8A8F98]",
				children: "Update your account password."
			})] })]
		}), /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => setDialogOpen(true),
			className: "inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12.5px] font-medium text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] dark:border-[#1e2244] dark:text-[#8A8F98] dark:hover:bg-[#1c2045]",
			children: [/* @__PURE__ */ jsx(Pencil, { className: "size-3.5" }), "Change"]
		})]
	}), dialogOpen && /* @__PURE__ */ jsx(ChangePasswordDialog, { onClose: () => setDialogOpen(false) })] });
}
function ChangePasswordDialog({ onClose }) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [errors, setErrors] = useState({});
	const [isPending, setIsPending] = useState(false);
	const [success, setSuccess] = useState(false);
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	function validate() {
		const errs = {};
		if (!currentPassword.trim()) errs.currentPassword = "Current password is required";
		if (!newPassword.trim()) errs.newPassword = "New password is required";
		else if (newPassword.length < 6) errs.newPassword = "Must be at least 6 characters";
		return errs;
	}
	async function handleSubmit(e) {
		e.preventDefault();
		const errs = validate();
		if (Object.keys(errs).length) {
			setErrors(errs);
			return;
		}
		setErrors({});
		setIsPending(true);
		try {
			await apiFetch("/auth/password", {
				method: "PUT",
				body: JSON.stringify({
					currentPassword,
					newPassword
				})
			});
			setSuccess(true);
			setTimeout(onClose, 1200);
		} catch (err) {
			setErrors({ api: err.message ?? "Failed to change password." });
		} finally {
			setIsPending(false);
		}
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm",
		onClick: onClose,
		"aria-hidden": "true"
	}), /* @__PURE__ */ jsxs("div", {
		role: "dialog",
		"aria-modal": "true",
		className: "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-[0_24px_70px_rgba(17,20,26,.18)] dark:border-[#1e2244] dark:bg-[#181b2d]",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-[17px] font-bold text-[#11141A] dark:text-[#E5E7EB]",
				children: "Change Password"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-[13px] text-[#8A8F98]",
				children: "Enter your current password then choose a new one."
			}),
			success ? /* @__PURE__ */ jsx("p", {
				className: "mt-5 rounded-[10px] bg-[#ECFDF5] px-4 py-3 text-[13px] font-semibold text-[#059669]",
				children: "Password changed successfully!"
			}) : /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "mt-5 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "text-[11px] font-semibold text-[#5C6270]",
								children: ["Current Password ", /* @__PURE__ */ jsx("span", {
									className: "text-[#DC2626]",
									children: "*"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(Input, {
									type: showCurrent ? "text" : "password",
									value: currentPassword,
									onChange: (e) => {
										setCurrentPassword(e.target.value);
										setErrors((p) => ({
											...p,
											currentPassword: void 0
										}));
									},
									placeholder: "Enter current password",
									className: `h-10 rounded-[9px] pr-10 text-[12.5px] ${errors.currentPassword ? "border-[#DC2626] focus-visible:border-[#DC2626]" : "border-[#E5E7EB] focus-visible:border-[#4F5DF5]"}`,
									autoFocus: true
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowCurrent((v) => !v),
									className: "absolute inset-y-0 right-3 flex items-center text-[#8A8F98] hover:text-[#5C6270]",
									children: showCurrent ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
								})]
							}),
							errors.currentPassword && /* @__PURE__ */ jsx("p", {
								className: "text-[11.5px] font-semibold text-[#DC2626]",
								children: errors.currentPassword
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1.5",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "text-[11px] font-semibold text-[#5C6270]",
								children: ["New Password ", /* @__PURE__ */ jsx("span", {
									className: "text-[#DC2626]",
									children: "*"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(Input, {
									type: showNew ? "text" : "password",
									value: newPassword,
									onChange: (e) => {
										setNewPassword(e.target.value);
										setErrors((p) => ({
											...p,
											newPassword: void 0
										}));
									},
									placeholder: "Enter new password",
									className: `h-10 rounded-[9px] pr-10 text-[12.5px] ${errors.newPassword ? "border-[#DC2626] focus-visible:border-[#DC2626]" : "border-[#E5E7EB] focus-visible:border-[#4F5DF5]"}`
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowNew((v) => !v),
									className: "absolute inset-y-0 right-3 flex items-center text-[#8A8F98] hover:text-[#5C6270]",
									children: showNew ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4" })
								})]
							}),
							errors.newPassword && /* @__PURE__ */ jsx("p", {
								className: "text-[11.5px] font-semibold text-[#DC2626]",
								children: errors.newPassword
							})
						]
					}),
					errors.api && /* @__PURE__ */ jsx("p", {
						className: "text-[12px] font-semibold text-[#DC2626]",
						children: errors.api
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-2 pt-1",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-[9px] border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7] dark:border-[#1e2244]",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: isPending,
							className: "rounded-[9px] bg-[#4F5DF5] px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-50",
							children: isPending ? "Saving…" : "Update Password"
						})]
					})
				]
			})
		]
	})] });
}
function DueSoonCard() {
	const { data: settings, isLoading } = useSettings();
	const [dialogOpen, setDialogOpen] = useState(false);
	const currentDays = settings ? parseInt(settings.renewal_window_days, 10) : null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(17,20,26,.04)] dark:border-[#1e2244] dark:bg-[#181b2d]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EEEFFE] text-[#4F5DF5] dark:bg-[#1c2045]",
				children: /* @__PURE__ */ jsx(CalendarClock, { className: "size-5" })
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-[14px] font-bold text-[#11141A] dark:text-[#E5E7EB]",
				children: "Due Soon window"
			}), /* @__PURE__ */ jsxs("p", {
				className: "mt-0.5 text-[13px] text-[#8A8F98]",
				children: [
					"Websites renewing within this many days appear under ",
					/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-[#11141A] dark:text-[#E5E7EB]",
						children: "Due Soon"
					}),
					"."
				]
			})] })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "ml-6 flex shrink-0 items-center gap-3",
			children: [isLoading ? /* @__PURE__ */ jsx("div", { className: "h-7 w-16 animate-pulse rounded-lg bg-[#EEF0F2] dark:bg-[#1e2244]" }) : /* @__PURE__ */ jsxs("span", {
				className: "rounded-lg bg-[#EEEFFE] px-3 py-1 text-[15px] font-extrabold text-[#4F5DF5] dark:bg-[#1c2045] dark:text-[#818CF8]",
				children: [currentDays ?? "—", " days"]
			}), /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setDialogOpen(true),
				disabled: isLoading,
				className: "inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12.5px] font-medium text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] disabled:opacity-50 dark:border-[#1e2244] dark:text-[#8A8F98] dark:hover:bg-[#1c2045]",
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
			onError: (err) => setError(err.message ?? "Failed to update.")
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
		className: "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-[0_24px_70px_rgba(17,20,26,.18)] dark:border-[#1e2244] dark:bg-[#181b2d]",
		children: [
			/* @__PURE__ */ jsx("h2", {
				id: "duesoon-dialog-title",
				className: "text-[17px] font-bold text-[#11141A] dark:text-[#E5E7EB]",
				children: "Edit Due Soon window"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-[13px] text-[#8A8F98]",
				children: "Set how many days ahead counts as \"Due Soon\" for maintenance renewals."
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "mt-5 flex flex-col gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-1.5",
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "renewal-days",
							className: "text-[11px] font-bold uppercase tracking-widest text-[#8A8F98]",
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
								className: `h-11 w-full rounded-[9px] border-[#E5E7EB] px-4 text-[15px] font-bold focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${error ? "border-red-400" : ""}`,
								autoFocus: true
							}), /* @__PURE__ */ jsx("span", {
								className: "shrink-0 text-[14px] font-semibold text-[#8A8F98]",
								children: "days"
							})]
						}),
						error ? /* @__PURE__ */ jsx("p", {
							className: "text-[12px] font-semibold text-[#DC2626]",
							children: error
						}) : null,
						/* @__PURE__ */ jsxs("p", {
							className: "text-[11.5px] text-[#8A8F98]",
							children: [
								"Current: ",
								currentDays,
								" days · Range: 1–365"
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex justify-end gap-2 pt-1",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-[9px] border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7] dark:border-[#1e2244] dark:text-[#8A8F98]",
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: mutation.isPending || !isValid || parsed === currentDays,
						className: "rounded-[9px] bg-[#4F5DF5] px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-50",
						children: mutation.isPending ? "Saving..." : "Save"
					})]
				})]
			})
		]
	})] });
}
function ServiceOptionsTable() {
	const { data, isLoading, isError, refetch } = useServiceOptions();
	const updateMutation = useUpdateServiceOption();
	const [renameTarget, setRenameTarget] = useState(null);
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "rounded-[14px] border border-[#E5E7EB] bg-white dark:border-[#1e2244] dark:bg-[#181b2d]",
		children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-4 border-b border-[#EEF0F2] px-5 py-4 last:border-0 dark:border-[#252847]",
			children: [/* @__PURE__ */ jsx("div", { className: "h-4 w-32 animate-pulse rounded bg-[#EEF0F2] dark:bg-[#1e2244]" }), /* @__PURE__ */ jsx("div", { className: "h-4 flex-1 animate-pulse rounded bg-[#EEF0F2] dark:bg-[#1e2244]" })]
		}, i))
	});
	if (isError) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center gap-3 rounded-[14px] border border-[#E5E7EB] bg-white py-10 text-center dark:border-[#1e2244] dark:bg-[#181b2d]",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-[13.5px] text-[#8A8F98]",
			children: "Could not load service options."
		}), /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => refetch(),
			className: "inline-flex items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] px-3 py-1.5 text-[12.5px] font-medium text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]",
			children: [/* @__PURE__ */ jsx(RefreshCw, { className: "size-3.5" }), "Retry"]
		})]
	});
	const options = data ?? [];
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)] dark:border-[#1e2244] dark:bg-[#181b2d]",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-[180px_1fr_160px_100px_80px] border-b border-[#E5E7EB] bg-[#FAFBFC] dark:border-[#1e2244] dark:bg-[#131624]",
			children: [
				"Category",
				"Values",
				"Used In",
				"Status",
				"Actions"
			].map((h) => /* @__PURE__ */ jsx("div", {
				className: "px-5 py-3 text-[11px] font-semibold uppercase tracking-[.03em] text-[#8A8F98]",
				children: h
			}, h))
		}), CATEGORIES.map((cat) => {
			const catOptions = options.filter((o) => o.category === cat.key);
			const activeOpts = catOptions.filter((o) => o.is_active);
			const inactiveOpts = catOptions.filter((o) => !o.is_active);
			return /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-[180px_1fr_160px_100px_80px] items-start border-b border-[#EEF0F2] py-4 last:border-0 dark:border-[#252847]",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "px-5 text-[13px] font-semibold text-[#11141A] dark:text-[#E5E7EB]",
						children: cat.label
					}),
					/* @__PURE__ */ jsx("div", {
						className: "px-5 flex flex-wrap gap-1.5",
						children: catOptions.length === 0 ? /* @__PURE__ */ jsx("span", {
							className: "text-[12.5px] text-[#C7CAD1]",
							children: "No options yet"
						}) : catOptions.map((opt) => /* @__PURE__ */ jsx("span", {
							className: `inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1 text-[11px] font-semibold ${opt.is_active ? "bg-[#EEEFFE] text-[#4F5DF5] dark:bg-[#1c2045] dark:text-[#818CF8]" : "bg-[#F3F4F6] text-[#9CA3AF] line-through dark:bg-[#1F2937] dark:text-[#6B7280]"}`,
							children: opt.name
						}, opt.option_id))
					}),
					/* @__PURE__ */ jsx("div", {
						className: "px-5 text-[12.5px] text-[#8A8F98]",
						children: cat.usedIn
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "px-5 text-[12.5px]",
						children: [/* @__PURE__ */ jsxs("span", {
							className: `font-semibold ${activeOpts.length > 0 ? "text-[#059669]" : "text-[#8A8F98]"}`,
							children: [activeOpts.length, " active"]
						}), inactiveOpts.length > 0 && /* @__PURE__ */ jsxs("span", {
							className: "text-[#C7CAD1]",
							children: [
								", ",
								inactiveOpts.length,
								" off"
							]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-1 px-3",
						children: catOptions.map((opt) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								title: "Rename",
								onClick: () => setRenameTarget(opt),
								className: "flex size-6 items-center justify-center rounded-[6px] text-[#8A8F98] transition hover:bg-[#EEEFFE] hover:text-[#4F5DF5]",
								children: /* @__PURE__ */ jsx(Pencil, { className: "size-3" })
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								title: opt.is_active ? "Deactivate" : "Activate",
								disabled: updateMutation.isPending,
								onClick: () => updateMutation.mutate({
									option_id: opt.option_id,
									is_active: !opt.is_active
								}),
								className: "flex size-6 items-center justify-center rounded-[6px] text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#3D4250]",
								children: opt.is_active ? /* @__PURE__ */ jsx(ToggleRight, { className: "size-3.5 text-[#4F5DF5]" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "size-3.5" })
							})]
						}, opt.option_id))
					})
				]
			}, cat.key);
		})]
	}), renameTarget && /* @__PURE__ */ jsx(RenameOptionModal, {
		option: renameTarget,
		onClose: () => setRenameTarget(null)
	})] });
}
function AddOptionModal({ onClose }) {
	const [category, setCategory] = useState("build_type");
	const [name, setName] = useState("");
	const [error, setError] = useState();
	const mutation = useCreateServiceOption();
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	function handleSubmit(e) {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) {
			setError("Name is required.");
			return;
		}
		setError(void 0);
		mutation.mutate({
			category,
			name: trimmed
		}, {
			onSuccess: () => {
				setName("");
				onClose();
			},
			onError: (err) => {
				const apiErr = err;
				if (apiErr.code === "CONFLICT") setError("This value already exists in this category.");
				else setError(apiErr.message ?? "Failed to add option.");
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
		"aria-labelledby": "add-option-title",
		className: "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_70px_rgba(17,20,26,.18)] dark:border-[#1e2244] dark:bg-[#181b2d]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 dark:border-[#1e2244]",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				id: "add-option-title",
				className: "text-[16px] font-bold text-[#11141A] dark:text-[#E5E7EB]",
				children: "Add Service Option"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-0.5 text-[12px] text-[#8A8F98]",
				children: "Add a new value to a dropdown category."
			})] }), /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onClose,
				className: "flex size-7 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#8A8F98] transition hover:border-[#FECACA] hover:text-[#DC2626]",
				children: /* @__PURE__ */ jsx(X, { className: "size-4" })
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "flex flex-col gap-4 p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ jsx("label", {
						className: "text-[11.5px] font-semibold text-[#5C6270]",
						children: "Category"
					}), /* @__PURE__ */ jsx("select", {
						value: category,
						onChange: (e) => setCategory(e.target.value),
						className: "h-10 w-full rounded-[9px] border border-[#E5E7EB] bg-white px-3 text-[12.5px] text-[#11141A] outline-none focus:border-[#4F5DF5] dark:border-[#1e2244] dark:bg-[#131624] dark:text-[#E5E7EB]",
						children: CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", {
							value: c.key,
							children: c.label
						}, c.key))
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-1.5",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "text-[11.5px] font-semibold text-[#5C6270]",
							children: "Value name"
						}),
						/* @__PURE__ */ jsx(Input, {
							type: "text",
							value: name,
							onChange: (e) => {
								setName(e.target.value);
								setError(void 0);
							},
							placeholder: "e.g. Cloudflare Pages",
							className: `h-10 rounded-[9px] border-[#E5E7EB] text-[12.5px] focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${error ? "border-[#DC2626]" : ""}`,
							autoFocus: true
						}),
						error ? /* @__PURE__ */ jsx("p", {
							className: "text-[12px] font-semibold text-[#DC2626]",
							children: error
						}) : null
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-end gap-2 pt-1",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-[9px] border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7] dark:border-[#1e2244]",
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: mutation.isPending || !name.trim(),
						className: "rounded-[9px] bg-[#4F5DF5] px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-50",
						children: mutation.isPending ? "Adding..." : "Add Option"
					})]
				})
			]
		})]
	})] });
}
function RenameOptionModal({ option, onClose }) {
	const [name, setName] = useState(option.name);
	const [error, setError] = useState();
	const mutation = useUpdateServiceOption();
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	function handleSubmit(e) {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) {
			setError("Name is required.");
			return;
		}
		if (trimmed === option.name) {
			onClose();
			return;
		}
		setError(void 0);
		mutation.mutate({
			option_id: option.option_id,
			name: trimmed
		}, {
			onSuccess: () => onClose(),
			onError: (err) => {
				const apiErr = err;
				if (apiErr.code === "CONFLICT") setError("This value already exists in this category.");
				else setError(apiErr.message ?? "Failed to rename.");
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
		className: "fixed left-1/2 top-1/2 z-50 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-[0_24px_70px_rgba(17,20,26,.18)] dark:border-[#1e2244] dark:bg-[#181b2d]",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-4 text-[15px] font-bold text-[#11141A] dark:text-[#E5E7EB]",
			children: "Rename Option"
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "flex flex-col gap-3",
			children: [
				/* @__PURE__ */ jsx(Input, {
					type: "text",
					value: name,
					onChange: (e) => {
						setName(e.target.value);
						setError(void 0);
					},
					className: `h-10 rounded-[9px] border-[#E5E7EB] text-[12.5px] focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${error ? "border-[#DC2626]" : ""}`,
					autoFocus: true
				}),
				error ? /* @__PURE__ */ jsx("p", {
					className: "text-[12px] font-semibold text-[#DC2626]",
					children: error
				}) : null,
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-[9px] border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7] dark:border-[#1e2244]",
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: mutation.isPending || !name.trim(),
						className: "rounded-[9px] bg-[#4F5DF5] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-50",
						children: mutation.isPending ? "Saving..." : "Save"
					})]
				})
			]
		})]
	})] });
}
//#endregion
export { SettingsPage as component };
