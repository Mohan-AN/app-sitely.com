import { a as REFRESH_TOKEN_KEY, i as ACCESS_TOKEN_KEY, o as apiFetch, t as Button } from "./button-jrDuWETO.js";
import { t as Route } from "./login-C2YCQDp8.js";
import { t as Input } from "./input-BUXT0p6g.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
//#region src/routes/_auth/login.tsx?tsr-split=component
function mapApiErrors(apiErr, fieldKeys) {
	if (apiErr.errors?.length) {
		const fields = {};
		for (const msg of apiErr.errors) {
			const lower = msg.toLowerCase();
			const matched = fieldKeys.find((k) => lower.includes(k));
			if (matched) fields[matched] = (fields[matched] ? fields[matched] + " · " : "") + msg;
			else fields[fieldKeys[fieldKeys.length - 1]] = (fields[fieldKeys[fieldKeys.length - 1]] ? fields[fieldKeys[fieldKeys.length - 1]] + " · " : "") + msg;
		}
		return { fields };
	}
	return {
		fields: {},
		form: apiErr.message ?? "Something went wrong. Please try again."
	};
}
function FieldError({ msg }) {
	if (!msg) return null;
	return /* @__PURE__ */ jsx("p", {
		className: "text-center text-[13px] font-semibold text-red-500",
		children: msg
	});
}
function LoginScreen() {
	const navigate = useNavigate();
	const { redirect: redirectTo } = Route.useSearch();
	const [view, setView] = useState("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loginFieldErrors, setLoginFieldErrors] = useState({});
	const [loginFormError, setLoginFormError] = useState();
	const [recoveryEmail, setRecoveryEmail] = useState("");
	const [recoveryEmailError, setRecoveryEmailError] = useState();
	const [recoveryFormError, setRecoveryFormError] = useState();
	const [otp, setOtp] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [resetFieldErrors, setResetFieldErrors] = useState({});
	const [resetFormError, setResetFormError] = useState();
	const [resetSuccess, setResetSuccess] = useState(false);
	const loginMutation = useMutation({
		mutationFn: () => apiFetch("/auth/login", {
			method: "POST",
			body: JSON.stringify({
				email,
				password
			})
		}),
		onSuccess: (data) => {
			localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
			localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
			navigate({ to: redirectTo ?? "/" });
		},
		onError: (err) => {
			const { fields, form } = mapApiErrors(err, ["email", "password"]);
			setLoginFieldErrors(fields);
			setLoginFormError(form);
		}
	});
	const forgotPasswordMutation = useMutation({
		mutationFn: () => apiFetch("/auth/forgot-password", {
			method: "POST",
			body: JSON.stringify({ email: recoveryEmail })
		}),
		onSuccess: () => {
			setOtp("");
			setNewPassword("");
			setResetFieldErrors({});
			setResetFormError(void 0);
			setResetSuccess(false);
			setView("reset");
		},
		onError: (err) => {
			const apiErr = err;
			if (apiErr.errors?.length) setRecoveryEmailError(apiErr.errors.find((m) => m.toLowerCase().includes("email")) ?? apiErr.errors[0]);
			else setRecoveryFormError(apiErr.message ?? "Something went wrong. Please try again.");
		}
	});
	const resetPasswordMutation = useMutation({
		mutationFn: () => apiFetch("/auth/reset-password", {
			method: "POST",
			body: JSON.stringify({
				email: recoveryEmail,
				otp,
				newPassword
			})
		}),
		onSuccess: () => {
			setResetSuccess(true);
		},
		onError: (err) => {
			const { fields, form } = mapApiErrors(err, ["otp", "password"]);
			setResetFieldErrors(fields);
			setResetFormError(form);
		}
	});
	function goToRecovery() {
		setRecoveryEmail("");
		setRecoveryEmailError(void 0);
		setRecoveryFormError(void 0);
		forgotPasswordMutation.reset();
		setView("recovery");
	}
	function goToLogin() {
		setView("login");
	}
	return /* @__PURE__ */ jsx("div", {
		className: "mx-auto w-full max-w-[460px] animate-in fade-in duration-500",
		children: /* @__PURE__ */ jsxs("div", {
			className: "rounded-[24px] border border-[#c7ddb5] bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-12",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-8 flex flex-col items-center",
					children: [/* @__PURE__ */ jsx("div", {
						className: "mb-3 flex size-14 items-center justify-center rounded-full border border-[#658354] bg-[#ddead1] text-2xl font-bold text-[#658354]",
						children: "S"
					}), /* @__PURE__ */ jsx("h2", {
						className: "text-[15px] font-extrabold tracking-normal text-[#102015]",
						children: "Sitely"
					})]
				}),
				view === "login" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-8 text-center",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "mb-2 text-3xl font-bold tracking-normal text-[#102015]",
						children: "Welcome back"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[15px] font-medium text-[#64748B]",
						children: "Sign in to continue to your workspace"
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						loginMutation.mutate();
					},
					className: "flex flex-col gap-5",
					noValidate: true,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									htmlFor: "email",
									className: "text-[11px] font-bold uppercase tracking-widest text-[#64748B]",
									children: "Email address"
								}),
								/* @__PURE__ */ jsx(Input, {
									id: "email",
									type: "email",
									value: email,
									onChange: (e) => {
										setEmail(e.target.value);
										setLoginFieldErrors((f) => ({
											...f,
											email: void 0
										}));
										setLoginFormError(void 0);
									},
									className: `h-12 w-full rounded-xl border-[#c7ddb5] bg-white px-4 font-semibold text-[#102015] transition-all focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${loginFieldErrors.email ? "border-red-400" : ""}`,
									placeholder: "name@example.com",
									required: true,
									autoComplete: "username"
								}),
								/* @__PURE__ */ jsx(FieldError, { msg: loginFieldErrors.email })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									htmlFor: "password",
									className: "text-[11px] font-bold uppercase tracking-widest text-[#64748B]",
									children: "Password"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx(Input, {
										id: "password",
										type: showPassword ? "text" : "password",
										value: password,
										onChange: (e) => {
											setPassword(e.target.value);
											setLoginFieldErrors((f) => ({
												...f,
												password: void 0
											}));
											setLoginFormError(void 0);
										},
										className: `h-12 w-full rounded-xl border-[#c7ddb5] bg-white px-4 pr-10 font-semibold text-[#102015] transition-all focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${loginFieldErrors.password ? "border-red-400" : ""}`,
										placeholder: "Enter your password",
										required: true,
										autoComplete: "current-password"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setShowPassword((v) => !v),
										className: "absolute bottom-0 right-3 top-0 m-auto text-[#64748B] transition hover:text-[#102015]",
										"aria-label": showPassword ? "Hide password" : "Show password",
										children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4.5" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4.5" })
									})]
								}),
								/* @__PURE__ */ jsx(FieldError, { msg: loginFieldErrors.password }),
								/* @__PURE__ */ jsx(FieldError, { msg: loginFormError })
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center justify-end",
							children: /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: goToRecovery,
								className: "text-[13px] font-bold text-[#658354] transition hover:text-[#4b6043]",
								children: "Forgot password?"
							})
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: loginMutation.isPending,
							className: "h-12 rounded-xl bg-[#658354] text-[15px] font-bold text-white shadow-sm hover:bg-[#4b6043]",
							children: loginMutation.isPending ? "Signing in..." : "Sign in"
						})
					]
				})] }),
				view === "recovery" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-8 text-center",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "mb-2 text-3xl font-bold tracking-normal text-[#102015]",
						children: "Reset password"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[15px] font-medium text-[#64748B]",
						children: "Enter your email and we'll send you a reset code."
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						forgotPasswordMutation.mutate();
					},
					className: "flex flex-col gap-6",
					noValidate: true,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									htmlFor: "recovery-email",
									className: "text-[11px] font-bold uppercase tracking-widest text-[#64748B]",
									children: "Email address"
								}),
								/* @__PURE__ */ jsx(Input, {
									id: "recovery-email",
									type: "email",
									value: recoveryEmail,
									onChange: (e) => {
										setRecoveryEmail(e.target.value);
										setRecoveryEmailError(void 0);
										setRecoveryFormError(void 0);
									},
									className: `h-12 w-full rounded-xl border-[#c7ddb5] bg-white px-4 font-semibold text-[#102015] transition-all focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${recoveryEmailError ? "border-red-400" : ""}`,
									placeholder: "name@example.com",
									required: true,
									autoComplete: "email"
								}),
								/* @__PURE__ */ jsx(FieldError, { msg: recoveryEmailError }),
								/* @__PURE__ */ jsx(FieldError, { msg: recoveryFormError })
							]
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: forgotPasswordMutation.isPending,
							className: "h-12 rounded-xl bg-[#658354] text-[15px] font-bold text-white shadow-sm hover:bg-[#4b6043]",
							children: forgotPasswordMutation.isPending ? "Sending..." : "Send reset code"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							className: "py-2 text-[13px] font-bold text-[#64748B] transition hover:text-[#102015]",
							onClick: goToLogin,
							children: "Back to login"
						})
					]
				})] }),
				view === "reset" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-8 text-center",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "mb-2 text-3xl font-bold tracking-normal text-[#102015]",
						children: "Enter reset code"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[15px] font-medium text-[#64748B]",
						children: ["We sent a 4-digit code to ", /* @__PURE__ */ jsx("span", {
							className: "font-bold text-[#102015]",
							children: recoveryEmail
						})]
					})]
				}), resetSuccess ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-[#c7ddb5] bg-[#ddead1]/40 px-4 py-5 text-center",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[15px] font-bold text-[#658354]",
							children: "Password updated"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[13px] font-medium text-[#64748B]",
							children: "You can now sign in with your new password."
						})]
					}), /* @__PURE__ */ jsx(Button, {
						className: "h-12 rounded-xl bg-[#658354] text-[15px] font-bold text-white shadow-sm hover:bg-[#4b6043]",
						onClick: goToLogin,
						children: "Back to login"
					})]
				}) : /* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						resetPasswordMutation.mutate();
					},
					className: "flex flex-col gap-5",
					noValidate: true,
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									htmlFor: "otp",
									className: "text-[11px] font-bold uppercase tracking-widest text-[#64748B]",
									children: "Reset code"
								}),
								/* @__PURE__ */ jsx(Input, {
									id: "otp",
									type: "text",
									inputMode: "numeric",
									maxLength: 4,
									value: otp,
									onChange: (e) => {
										setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
										setResetFieldErrors((f) => ({
											...f,
											otp: void 0
										}));
										setResetFormError(void 0);
									},
									className: `h-12 w-full rounded-xl border-[#c7ddb5] bg-white px-4 text-center text-xl font-bold tracking-[0.4em] text-[#102015] transition-all focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${resetFieldErrors.otp ? "border-red-400" : ""}`,
									placeholder: "····",
									required: true,
									autoComplete: "one-time-code"
								}),
								/* @__PURE__ */ jsx(FieldError, { msg: resetFieldErrors.otp }),
								/* @__PURE__ */ jsx(FieldError, { msg: resetFormError })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									htmlFor: "new-password",
									className: "text-[11px] font-bold uppercase tracking-widest text-[#64748B]",
									children: "New password"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx(Input, {
										id: "new-password",
										type: showNewPassword ? "text" : "password",
										value: newPassword,
										onChange: (e) => {
											setNewPassword(e.target.value);
											setResetFieldErrors((f) => ({
												...f,
												password: void 0
											}));
											setResetFormError(void 0);
										},
										className: `h-12 w-full rounded-xl border-[#c7ddb5] bg-white px-4 pr-10 font-semibold text-[#102015] transition-all focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${resetFieldErrors.password ? "border-red-400" : ""}`,
										placeholder: "Enter new password",
										required: true,
										autoComplete: "new-password"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setShowNewPassword((v) => !v),
										className: "absolute bottom-0 right-3 top-0 m-auto text-[#64748B] transition hover:text-[#102015]",
										"aria-label": showNewPassword ? "Hide password" : "Show password",
										children: showNewPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "size-4.5" }) : /* @__PURE__ */ jsx(Eye, { className: "size-4.5" })
									})]
								}),
								/* @__PURE__ */ jsx(FieldError, { msg: resetFieldErrors.password })
							]
						}),
						/* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: resetPasswordMutation.isPending,
							className: "h-12 rounded-xl bg-[#658354] text-[15px] font-bold text-white shadow-sm hover:bg-[#4b6043]",
							children: resetPasswordMutation.isPending ? "Resetting..." : "Reset password"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-1 text-[13px] font-medium text-[#64748B]",
							children: [/* @__PURE__ */ jsx("span", { children: "Didn't receive a code?" }), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: goToRecovery,
								className: "font-bold text-[#658354] transition hover:text-[#4b6043]",
								children: "Resend"
							})]
						})
					]
				})] })
			]
		})
	});
}
//#endregion
export { LoginScreen as component };
