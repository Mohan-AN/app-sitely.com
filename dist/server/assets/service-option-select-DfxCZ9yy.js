import { t as cn } from "./utils-CR4dV3c0.js";
import { n as useServiceOptions, t as useCreateServiceOption } from "./use-service-options-1VyXK7Is.js";
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, CheckIcon, ChevronDown, ChevronDownIcon, ChevronUpIcon, Loader2, Plus, X } from "lucide-react";
import { Select } from "@base-ui/react/select";
import { createPortal } from "react-dom";
//#region src/components/ui/select.tsx
var Select$1 = Select.Root;
function SelectValue({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.Value, {
		"data-slot": "select-value",
		className: cn("flex flex-1 text-left", className),
		...props
	});
}
function SelectTrigger({ className, size = "default", children, ...props }) {
	return /* @__PURE__ */ jsxs(Select.Trigger, {
		"data-slot": "select-trigger",
		"data-size": size,
		className: cn("flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(Select.Icon, { render: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "pointer-events-none size-4 text-muted-foreground" }) })]
	});
}
function SelectContent({ className, children, side = "bottom", sideOffset = 4, align = "center", alignOffset = 0, alignItemWithTrigger = false, ...props }) {
	return /* @__PURE__ */ jsx(Select.Portal, { children: /* @__PURE__ */ jsx(Select.Positioner, {
		side,
		sideOffset,
		align,
		alignOffset,
		alignItemWithTrigger,
		className: "isolate z-50",
		children: /* @__PURE__ */ jsxs(Select.Popup, {
			"data-slot": "select-content",
			"data-align-trigger": alignItemWithTrigger,
			className: cn("relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
			...props,
			children: [
				/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
				/* @__PURE__ */ jsx(Select.List, { children }),
				/* @__PURE__ */ jsx(SelectScrollDownButton, {})
			]
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ jsxs(Select.Item, {
		"data-slot": "select-item",
		className: cn("relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
		...props,
		children: [/* @__PURE__ */ jsx(Select.ItemText, {
			className: "flex flex-1 shrink-0 gap-2 whitespace-nowrap",
			children
		}), /* @__PURE__ */ jsx(Select.ItemIndicator, {
			render: /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center" }),
			children: /* @__PURE__ */ jsx(CheckIcon, { className: "pointer-events-none" })
		})]
	});
}
function SelectScrollUpButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.ScrollUpArrow, {
		"data-slot": "select-scroll-up-button",
		className: cn("top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronUpIcon, {})
	});
}
function SelectScrollDownButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.ScrollDownArrow, {
		"data-slot": "select-scroll-down-button",
		className: cn("bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronDownIcon, {})
	});
}
//#endregion
//#region src/components/ui/service-option-select.tsx
function ServiceOptionSelect({ category, value, onChange, placeholder = "Select...", disabled, error }) {
	const { data, isLoading, isError, refetch } = useServiceOptions(category);
	const createMutation = useCreateServiceOption();
	const [open, setOpen] = useState(false);
	const [addingNew, setAddingNew] = useState(false);
	const [newName, setNewName] = useState("");
	const [addError, setAddError] = useState();
	const triggerRef = useRef(null);
	const [dropRect, setDropRect] = useState(null);
	const options = (data ?? []).filter((o) => o.is_active);
	function measureTrigger() {
		return triggerRef.current?.getBoundingClientRect() ?? null;
	}
	function openDropdown() {
		const rect = measureTrigger();
		if (!rect) return;
		setDropRect(rect);
		setOpen(true);
	}
	useEffect(() => {
		if (!open) return;
		document.body.style.overflow = "hidden";
		const onResize = () => {
			const rect = measureTrigger();
			if (rect) setDropRect(rect);
		};
		window.addEventListener("resize", onResize);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("resize", onResize);
		};
	}, [open]);
	function handleSelect(name) {
		onChange(name);
		setOpen(false);
	}
	function handleAddNew(e) {
		e?.preventDefault();
		const trimmed = newName.trim();
		if (!trimmed) {
			setAddError("Name is required.");
			return;
		}
		setAddError(void 0);
		createMutation.mutate({
			category,
			name: trimmed
		}, {
			onSuccess: async (created) => {
				await refetch();
				onChange(created.name);
				setAddingNew(false);
				setNewName("");
			},
			onError: async (err) => {
				const apiErr = err;
				if (apiErr.code === "CONFLICT" || apiErr.status === 409) {
					await refetch();
					onChange(trimmed);
					setAddingNew(false);
					setNewName("");
				} else setAddError(apiErr.message ?? "Failed to add.");
			}
		});
	}
	if (isError) return /* @__PURE__ */ jsx("div", {
		className: "flex h-8 items-center rounded-[8px] border border-[#DC2626] bg-[#FEF2F2] px-3 text-[12px] text-[#DC2626]",
		children: "Could not load options"
	});
	const DROPDOWN_MAX_H = 240;
	const spaceBelow = dropRect ? window.innerHeight - dropRect.bottom - 4 : 0;
	const openUpward = dropRect ? spaceBelow < DROPDOWN_MAX_H && dropRect.top > DROPDOWN_MAX_H : false;
	const portalStyle = dropRect ? {
		position: "fixed",
		...openUpward ? { bottom: window.innerHeight - dropRect.top + 4 } : { top: dropRect.bottom + 4 },
		left: dropRect.left,
		width: dropRect.width,
		zIndex: 9999
	} : { display: "none" };
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ jsxs("button", {
				ref: triggerRef,
				type: "button",
				disabled: disabled || isLoading,
				onClick: openDropdown,
				className: cn("flex h-8 w-full items-center justify-between rounded-[8px] border px-3 text-[12px] transition bg-white", error ? "border-[#DC2626]" : "border-[#C9CDD6] hover:border-[#4F5DF5]", !value ? "text-[#9CA3AF]" : "text-[#11141A]"),
				children: [/* @__PURE__ */ jsx("span", {
					className: "truncate",
					children: value || placeholder
				}), isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 shrink-0 animate-spin text-[#8A8F98]" }) : /* @__PURE__ */ jsx(ChevronDown, { className: cn("size-3.5 shrink-0 text-[#8A8F98] transition", open && "rotate-180") })]
			}),
			open && createPortal(/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 9998
				},
				onClick: () => setOpen(false)
			}), /* @__PURE__ */ jsxs("div", {
				style: portalStyle,
				className: "flex flex-col overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(17,20,26,.16)]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "overflow-y-auto",
					style: { maxHeight: Math.min(200, spaceBelow - 44) },
					children: [options.length === 0 && /* @__PURE__ */ jsx("p", {
						className: "px-3 py-2 text-[12px] text-[#8A8F98]",
						children: "No options yet — add one below."
					}), options.map((opt) => /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => handleSelect(opt.name),
						className: "flex w-full items-center gap-2 px-3 py-[9px] text-left text-[12.5px] text-[#3D4250] transition hover:bg-[#F4F5F7]",
						children: [opt.name === value && /* @__PURE__ */ jsx(Check, { className: "size-3.5 shrink-0 text-[#4F5DF5]" }), /* @__PURE__ */ jsx("span", {
							className: opt.name === value ? "font-semibold text-[#4F5DF5]" : "",
							children: opt.name
						})]
					}, opt.option_id))]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => {
						setOpen(false);
						setAddingNew(true);
					},
					className: "flex w-full shrink-0 items-center gap-2 border-t border-[#EEF0F2] px-3 py-[9px] text-left text-[12.5px] font-semibold text-[#4F5DF5] transition hover:bg-[#EEEFFE]",
					children: [/* @__PURE__ */ jsx(Plus, { className: "size-3.5" }), "Add new option…"]
				})]
			})] }), document.body),
			addingNew && /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1.5",
				children: [
					/* @__PURE__ */ jsx("input", {
						type: "text",
						value: newName,
						onChange: (e) => {
							setNewName(e.target.value);
							setAddError(void 0);
						},
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleAddNew();
							}
							if (e.key === "Escape") {
								setAddingNew(false);
								setNewName("");
								setAddError(void 0);
							}
						},
						placeholder: "New option name",
						autoFocus: true,
						className: cn("h-8 flex-1 rounded-[8px] border px-3 text-[12px] outline-none transition", addError ? "border-[#DC2626]" : "border-[#C9CDD6] focus:border-[#4F5DF5]")
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => handleAddNew(),
						disabled: createMutation.isPending,
						className: "flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#4F5DF5] text-white transition hover:bg-[#3F4DE0] disabled:opacity-50",
						children: createMutation.isPending ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Check, { className: "size-3.5" })
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							setAddingNew(false);
							setNewName("");
							setAddError(void 0);
						},
						className: "flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E7EB] text-[#8A8F98] transition hover:border-[#FECACA] hover:text-[#DC2626]",
						children: /* @__PURE__ */ jsx(X, { className: "size-3.5" })
					})
				]
			}),
			addError && /* @__PURE__ */ jsx("p", {
				className: "text-[11px] font-semibold text-[#DC2626]",
				children: addError
			})
		]
	});
}
//#endregion
export { SelectTrigger as a, SelectItem as i, Select$1 as n, SelectValue as o, SelectContent as r, ServiceOptionSelect as t };
