import { n as cn, t as Button } from "./button-FgxVcNwj.js";
import { t as Route } from "./clients.index-CIJJwXO_.js";
import { t as Input } from "./input-DJQsF0Xj.js";
import { i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-B8E-ZA17.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { n as useClients, r as useCreateClient } from "./use-clients-Dj4Jlz99.js";
import { t as EditClientDialog } from "./edit-client-dialog-C_H1VPqL.js";
import { n as useDebounce, r as PageSizeSelector, t as NoResults } from "./no-results-Dvtqy8IC.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Mail, MapPin, MoreHorizontal, Phone, Plus, Search, SlidersHorizontal, UserRoundPlus, Users, X } from "lucide-react";
import { Dialog } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//#region src/components/ui/search-bar.tsx
function SearchBar({ value, onChange, placeholder = "Search...", className }) {
	return /* @__PURE__ */ jsxs("div", {
		className: cn("group flex h-12 items-center gap-3 rounded-lg border border-[#dce3ef] bg-white px-4 text-[#172554] shadow-sm transition hover:bg-[#fbfcff] dark:border-[#25304a] dark:bg-[#111827] dark:text-[#edf2ff]", className),
		children: [/* @__PURE__ */ jsx(Search, { className: "size-5 shrink-0 text-[#253858] transition group-focus-within:text-[#4f2df5] dark:text-[#a6b2cf]" }), /* @__PURE__ */ jsx("input", {
			type: "text",
			value,
			onChange: (event) => onChange(event.target.value),
			placeholder,
			className: "min-w-0 flex-1 border-0 bg-transparent text-[14px] font-medium outline-none placeholder:text-[#6f7c99] focus:ring-0 dark:placeholder:text-[#8793ad]"
		})]
	});
}
//#endregion
//#region src/components/clients/clients-table.tsx
var gridClass = "grid grid-cols-[1.35fr_1.25fr_1.1fr_1.6fr_1fr_0.85fr_0.75fr_0.6fr]";
var SORTABLE = {
	Company: "company",
	Phone: "phone",
	Email: "email",
	City: "city",
	Status: "isActive",
	Websites: "websiteCount"
};
function ClientsTable({ clients, isLoading, isError, error, sortBy, sortOrder, onSortChange, onEdit }) {
	const sorted = clients ? [...clients].sort((a, b) => {
		if (a.isActive === b.isActive) return 0;
		return a.isActive ? -1 : 1;
	}) : void 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#dce3ef] bg-white shadow-sm dark:border-[#25304a] dark:bg-[#111827]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: cn(gridClass, "shrink-0 border-b border-[#dce3ef] bg-[#fbfcff] dark:border-[#25304a] dark:bg-[#111827]"),
			children: [
				/* @__PURE__ */ jsx(HeaderCell, { children: "Client Name" }),
				Object.keys(SORTABLE).map((label) => /* @__PURE__ */ jsx(SortableHeaderCell, {
					label,
					field: SORTABLE[label],
					sortBy,
					sortOrder,
					onSort: onSortChange,
					className: label === "Actions" ? "justify-end" : void 0
				}, label)),
				/* @__PURE__ */ jsx(HeaderCell, {
					className: "justify-end",
					children: "Actions"
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "min-h-0 flex-1 overflow-auto",
			children: isLoading ? /* @__PURE__ */ jsx(StateRow, { children: "Loading..." }) : isError ? /* @__PURE__ */ jsx(StateRow, {
				className: "text-destructive",
				children: error?.message ?? "Something went wrong."
			}) : !sorted || sorted.length === 0 ? /* @__PURE__ */ jsx(NoResults, { message: "No clients found." }) : sorted.map((client, index) => /* @__PURE__ */ jsxs("div", {
				className: cn("grid min-h-[70px] grid-cols-[1.35fr_1.25fr_1.1fr_1.6fr_1fr_0.85fr_0.75fr_0.6fr] items-center border-b border-[#dce3ef] text-[14px] dark:border-[#25304a]", client.isActive ? "hover:bg-[#fbfcff] dark:hover:bg-[#172033]" : "opacity-60 hover:opacity-80", index % 2 === 1 && "bg-white dark:bg-[#111827]"),
				children: [
					/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ jsx("span", {
							className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f1edff] text-xs font-bold text-[#4f2df5]",
							children: client.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("div", {
								className: "truncate font-bold text-[#0b1020] dark:text-[#edf2ff]",
								children: client.name
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-1 truncate text-xs font-medium text-[#253858] dark:text-[#a6b2cf]",
								children: client.email ?? "-"
							})]
						})]
					}) }),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-medium text-[#172554] dark:text-[#a6b2cf]",
						children: client.company ?? "-"
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-medium text-[#172554] dark:text-[#a6b2cf]",
						children: client.phone ?? "-"
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-medium text-[#4f2df5] dark:text-[#a78bfa]",
						children: client.email ?? "-"
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-medium text-[#172554] dark:text-[#a6b2cf]",
						children: client.city ?? "-"
					}),
					/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsxs("span", {
						className: cn("inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-bold", client.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"),
						children: [/* @__PURE__ */ jsx("span", { className: cn("size-1.5 rounded-full", client.isActive ? "bg-emerald-500" : "bg-red-500") }), client.isActive ? "Active" : "Inactive"]
					}) }),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-bold text-[#172554] dark:text-[#edf2ff]",
						children: client.websiteCount
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "flex justify-end",
						children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
							render: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon-sm",
								"aria-label": "Open actions",
								className: "text-[#172554]"
							}),
							children: /* @__PURE__ */ jsx(MoreHorizontal, {})
						}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
							align: "end",
							className: "rounded-xl border border-[#dce3ef] bg-white dark:border-[#25304a] dark:bg-[#111827]",
							children: [/* @__PURE__ */ jsx(DropdownMenuItem, {
								render: /* @__PURE__ */ jsx(Link, {
									to: "/clients/$clientId",
									params: { clientId: client.clientId }
								}),
								children: "View details"
							}), /* @__PURE__ */ jsx(DropdownMenuItem, {
								onClick: () => onEdit?.(client),
								children: "Edit client"
							})]
						})] })
					})
				]
			}, client.clientId))
		})]
	});
}
function SortableHeaderCell({ label, field, sortBy, sortOrder, onSort, className }) {
	const active = sortBy === field;
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-14 items-center px-3 py-2", className),
		children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => onSort?.(field),
			className: "inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-normal text-[#253858] transition hover:text-[#4f2df5] dark:text-[#a6b2cf] dark:hover:text-[#edf2ff]",
			children: [label, active ? sortOrder === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ArrowUpDown, { className: "size-3.5 opacity-50" })]
		})
	});
}
function HeaderCell({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-14 min-w-0 items-center overflow-hidden px-3 py-2 text-[11px] font-extrabold uppercase tracking-normal text-[#253858] dark:text-[#a6b2cf]", className),
		children
	});
}
function Cell({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("min-w-0 px-3 py-2", className),
		children
	});
}
function StateRow({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-40 items-center justify-center text-[#253858]", className),
		children
	});
}
//#endregion
//#region src/components/clients/add-client-dialog.tsx
var emptyToUndefined = (value) => {
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	return trimmed === "" ? void 0 : trimmed;
};
var nameLike = (field, max = 100) => z.preprocess(emptyToUndefined, z.string({ message: `${field} is required` }).min(3, `${field} must be at least 3 characters`).max(max, `${field} must be at most ${max} characters`).regex(/^[A-Za-z][A-Za-z0-9 ]*$/, `${field} must start with a letter and contain only letters, numbers and spaces`));
var schema = z.object({
	name: nameLike("Name"),
	company: z.preprocess(emptyToUndefined, nameLike("Company", 150).optional()),
	phone: z.preprocess(emptyToUndefined, z.string().regex(/^[6-9]\d{9}$/, "Must start with 6-9 and be exactly 10 digits").refine((v) => !/^(\d)\1{9}$/.test(v), "Cannot be a repeated digit pattern").optional()),
	email: z.preprocess(emptyToUndefined, z.string().email("Invalid email").optional()),
	city: z.preprocess(emptyToUndefined, nameLike("City").optional())
});
function AddClientDialog({ open, onOpenChange, onCreated }) {
	const createMutation = useCreateClient();
	const form = useForm({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			company: "",
			phone: "",
			email: "",
			city: ""
		}
	});
	const handleSubmit = form.handleSubmit((values) => {
		createMutation.mutate({
			name: values.name.trim(),
			company: values.company?.trim() || void 0,
			phone: values.phone?.trim() || void 0,
			email: values.email?.trim() || void 0,
			city: values.city?.trim() || void 0
		}, { onSuccess: (client) => {
			form.reset();
			onOpenChange(false);
			onCreated?.(client);
		} });
	});
	const handleCancel = () => {
		form.reset();
		onOpenChange(false);
	};
	const e = form.formState.errors;
	return /* @__PURE__ */ jsx(Dialog.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Backdrop, { className: "fixed inset-0 z-40 bg-[#0f172a]/55 backdrop-blur-[1px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" }), /* @__PURE__ */ jsxs(Dialog.Popup, {
			className: "fixed left-1/2 top-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#dce3ef] bg-white shadow-2xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#25304a] dark:bg-[#111827]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between px-8 pt-9",
				children: [/* @__PURE__ */ jsx(Dialog.Title, {
					className: "text-[26px] font-extrabold text-[#0b1020] dark:text-[#edf2ff]",
					children: "Add Client"
				}), /* @__PURE__ */ jsx(Dialog.Close, {
					render: /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "flex size-8 items-center justify-center rounded-lg text-[#172554] transition hover:bg-[#f5f3ff] hover:text-[#4f2df5] dark:hover:bg-[#172033] dark:hover:text-[#edf2ff]"
					}),
					children: /* @__PURE__ */ jsx(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "px-8 pb-8 pt-7",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "hidden",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]",
							children: /* @__PURE__ */ jsx(UserRoundPlus, { className: "size-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold text-[#101828] dark:text-[#edf7ee]",
							children: "Client Details"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-[#64745F] dark:text-[#9fb49b]",
							children: "Enter the basic information about the client."
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "text-sm font-semibold text-[#172554] dark:text-[#edf2ff]",
											children: ["Client Name ", /* @__PURE__ */ jsx("span", {
												className: "text-red-500",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx(Input, {
											placeholder: "Enter client name",
											...form.register("name")
										}),
										e.name ? /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: e.name.message
										}) : null
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "text-sm font-semibold text-[#172554] dark:text-[#edf2ff]",
											children: "Company"
										}),
										/* @__PURE__ */ jsx(Input, {
											placeholder: "Enter company name (optional)",
											...form.register("company")
										}),
										e.company ? /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: e.company.message
										}) : null
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "text-sm font-semibold text-[#172554] dark:text-[#edf2ff]",
											children: "Phone"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Phone, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f8aa3]" }), /* @__PURE__ */ jsx(Input, {
												className: "pl-9",
												placeholder: "Enter 10-digit mobile number",
												...form.register("phone")
											})]
										}),
										e.phone ? /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: e.phone.message
										}) : null
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsx("label", {
											className: "text-sm font-semibold text-[#172554] dark:text-[#edf2ff]",
											children: "Email"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f8aa3]" }), /* @__PURE__ */ jsx(Input, {
												className: "pl-9",
												type: "email",
												placeholder: "Enter email address (optional)",
												...form.register("email")
											})]
										}),
										e.email ? /* @__PURE__ */ jsx("p", {
											className: "text-xs text-destructive",
											children: e.email.message
										}) : null
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "text-sm font-semibold text-[#172554] dark:text-[#edf2ff]",
										children: "City"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f8aa3]" }), /* @__PURE__ */ jsx(Input, {
											className: "pl-9",
											placeholder: "Enter city (optional)",
											...form.register("city")
										})]
									}),
									e.city ? /* @__PURE__ */ jsx("p", {
										className: "text-xs text-destructive",
										children: e.city.message
									}) : null
								]
							})
						]
					}),
					createMutation.isError ? /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-sm text-destructive",
						children: createMutation.error.message
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex justify-end gap-4",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							className: "h-12 min-w-28 rounded-lg border-[#dce3ef] dark:border-[#25304a]",
							onClick: handleCancel,
							children: "Cancel"
						}), /* @__PURE__ */ jsxs(Button, {
							type: "submit",
							disabled: createMutation.isPending,
							className: "h-12 gap-2 rounded-lg px-6 font-bold text-white",
							children: [/* @__PURE__ */ jsx(UserRoundPlus, { className: "size-4" }), createMutation.isPending ? "Creating..." : "Create Client"]
						})]
					})
				]
			})]
		})] })
	});
}
//#endregion
//#region src/routes/_protected/_clients/clients.index.tsx?tsr-split=component
function ClientsPage() {
	const routeSearch = Route.useSearch();
	const navigate = Route.useNavigate();
	const globalNavigate = useNavigate();
	const filters = {
		search: routeSearch.search,
		sortBy: routeSearch.sortBy,
		sortOrder: routeSearch.sortOrder
	};
	const [searchQuery, setSearchQuery] = useState(routeSearch.search ?? "");
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [editTarget, setEditTarget] = useState(null);
	const debouncedSearch = useDebounce(searchQuery, 300);
	const clientsQuery = useClients(filters, routeSearch.page, routeSearch.limit, { keepPrevious: true });
	const pagination = clientsQuery.data?.pagination;
	const handleClientCreated = (client) => {
		globalNavigate({
			to: "/clients/$clientId",
			params: { clientId: client.clientId }
		});
	};
	useEffect(() => {
		setSearchQuery(routeSearch.search ?? "");
	}, [routeSearch.search]);
	useEffect(() => {
		if (debouncedSearch === (routeSearch.search ?? "")) return;
		navigate({
			search: (old) => ({
				...old,
				search: debouncedSearch || void 0,
				page: 1
			}),
			replace: true
		});
	}, [
		debouncedSearch,
		navigate,
		routeSearch.search
	]);
	const updateSearch = (next) => {
		navigate({ search: (old) => ({
			...old,
			...next
		}) });
	};
	const handleSortChange = (col) => {
		updateSearch({
			sortBy: col,
			sortOrder: routeSearch.sortBy === col && routeSearch.sortOrder === "asc" ? "desc" : "asc",
			page: 1
		});
	};
	return /* @__PURE__ */ jsxs("main", {
		className: "flex min-h-0 flex-1 flex-col gap-4 overflow-hidden bg-white px-10 pb-6 pt-5 dark:bg-[#0b1020]",
		children: [
			/* @__PURE__ */ jsx(TopBarSlot, {
				routeKey: "/clients",
				children: /* @__PURE__ */ jsx("section", {
					className: "flex min-w-0 flex-wrap items-center justify-end gap-6",
					children: /* @__PURE__ */ jsx(SearchBar, {
						value: searchQuery,
						onChange: setSearchQuery,
						placeholder: "Search anything...",
						className: "w-[300px]"
					})
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "flex shrink-0 items-start justify-between gap-6",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-[30px] font-extrabold leading-tight tracking-normal text-[#0b1020] dark:text-[#edf2ff]",
					children: "Clients"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-[15px] font-medium text-[#253858] dark:text-[#a6b2cf]",
					children: "Manage and monitor all your clients in one place."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [
						/* @__PURE__ */ jsx(SearchBar, {
							value: searchQuery,
							onChange: setSearchQuery,
							placeholder: "Search clients...",
							className: "w-[290px]"
						}),
						/* @__PURE__ */ jsxs(Button, {
							variant: "outline",
							size: "lg",
							className: "h-12 rounded-lg px-6",
							children: [/* @__PURE__ */ jsx(SlidersHorizontal, { className: "size-4" }), "Filters"]
						}),
						/* @__PURE__ */ jsxs(Button, {
							className: "h-12 rounded-lg px-6 text-[15px]",
							onClick: () => setAddDialogOpen(true),
							children: [/* @__PURE__ */ jsx(Plus, { className: "size-5" }), "Add Client"]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "flex h-14 shrink-0 items-end border-b border-[#dce3ef]",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex h-full items-center gap-9",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "flex h-full items-center gap-3 border-b-2 border-[#4f2df5] px-4 text-[15px] font-semibold text-[#4f2df5]",
							children: [
								/* @__PURE__ */ jsx(Users, { className: "size-5" }),
								"All",
								/* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-[#eef2f7] px-2 py-0.5 text-[13px] font-bold text-[#253858]",
									children: pagination?.total ?? 20
								})
							]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-3 text-[15px] font-semibold text-[#253858]",
							children: [
								/* @__PURE__ */ jsx("span", { className: "size-3 rounded-full bg-emerald-500" }),
								"Active",
								/* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-[#eef2f7] px-2 py-0.5 text-[13px] font-bold text-[#253858]",
									children: "16"
								})
							]
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-3 text-[15px] font-semibold text-[#253858]",
							children: [
								/* @__PURE__ */ jsx("span", { className: "size-3 rounded-full bg-slate-400" }),
								"Inactive",
								/* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-[#eef2f7] px-2 py-0.5 text-[13px] font-bold text-[#253858]",
									children: "4"
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(ClientsTable, {
				clients: clientsQuery.data?.items,
				isLoading: clientsQuery.isLoading,
				isError: clientsQuery.isError,
				error: clientsQuery.error,
				sortBy: routeSearch.sortBy,
				sortOrder: routeSearch.sortOrder,
				onSortChange: handleSortChange,
				onEdit: setEditTarget
			}),
			/* @__PURE__ */ jsx(AddClientDialog, {
				open: addDialogOpen,
				onOpenChange: setAddDialogOpen,
				onCreated: handleClientCreated
			}),
			/* @__PURE__ */ jsx(EditClientDialog, {
				open: editTarget !== null,
				onOpenChange: (open) => {
					if (!open) setEditTarget(null);
				},
				client: editTarget
			}),
			pagination ? /* @__PURE__ */ jsxs("footer", {
				className: "flex shrink-0 items-center justify-between rounded-b-lg border border-t-0 border-[#dce3ef] bg-white px-5 py-3.5 text-sm text-[#253858] shadow-sm dark:border-[#25304a] dark:bg-[#111827] dark:text-[#a6b2cf]",
				children: [/* @__PURE__ */ jsx(PageSizeSelector, {
					value: routeSearch.limit,
					onChange: (limit) => updateSearch({
						limit,
						page: 1
					}),
					total: pagination.total
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "icon-lg",
							disabled: pagination.page <= 1,
							onClick: () => updateSearch({ page: pagination.page - 1 }),
							"aria-label": "Previous page",
							children: /* @__PURE__ */ jsx(ChevronLeft, {})
						}),
						Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((pageNumber) => /* @__PURE__ */ jsx(Button, {
							variant: pageNumber === pagination.page ? "default" : "ghost",
							size: "icon-lg",
							className: cn(pageNumber === pagination.page && "bg-[#f1edff] text-[#4f2df5] hover:bg-[#e6ddff]"),
							onClick: () => updateSearch({ page: pageNumber }),
							children: pageNumber
						}, pageNumber)),
						/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							size: "icon-lg",
							disabled: pagination.page >= pagination.totalPages,
							onClick: () => updateSearch({ page: pagination.page + 1 }),
							"aria-label": "Next page",
							children: /* @__PURE__ */ jsx(ChevronRight, {})
						})
					]
				})]
			}) : null
		]
	});
}
//#endregion
export { ClientsPage as component };
