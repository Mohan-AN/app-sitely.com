import { n as cn, t as Button } from "./button-jrDuWETO.js";
import { t as Route } from "./clients.index-CsSY5vp0.js";
import { t as Input } from "./input-BUXT0p6g.js";
import { i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-BueuBkLZ.js";
import { t as TopBarSlot } from "./top-bar-slot-DmJpwj2W.js";
import { n as useClients, r as useCreateClient } from "./use-clients-CB207rwB.js";
import { t as formatDate } from "./format-BWQocT_r.js";
import { t as EditClientDialog } from "./edit-client-dialog-BeqRdlFa.js";
import { i as SearchBar, n as useDebounce, r as PageSizeSelector, t as NoResults } from "./no-results-DbhRO957.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Mail, MapPin, MoreHorizontal, Phone, Plus, UserRoundPlus, X } from "lucide-react";
import { Dialog } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//#region src/components/clients/clients-table.tsx
var gridClass = "grid grid-cols-[0.85fr_1.2fr_1.3fr_1fr_0.8fr_0.8fr_1fr_0.7fr]";
var SORTABLE = {
	Company: "company",
	City: "city",
	Websites: "websiteCount",
	Status: "isActive",
	Created: "createdAt"
};
function ClientsTable({ clients, isLoading, isError, error, sortBy, sortOrder, onSortChange, onEdit }) {
	const sorted = clients ? [...clients].sort((a, b) => {
		if (a.isActive === b.isActive) return 0;
		return a.isActive ? -1 : 1;
	}) : void 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#c7ddb5] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: cn(gridClass, "shrink-0 border-b border-[#c7ddb5] bg-[#ddead1] dark:border-[#2f4a32] dark:bg-[#203423]"),
			children: [
				/* @__PURE__ */ jsx(HeaderCell, { children: "Client ID" }),
				/* @__PURE__ */ jsx(HeaderCell, { children: "Name" }),
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
				className: cn("grid min-h-[54px] grid-cols-[0.85fr_1.2fr_1.3fr_1fr_0.8fr_0.8fr_1fr_0.7fr] items-center border-b border-[#c7ddb5]/40 text-[13px] dark:border-[#2f4a32]/70", client.isActive ? "hover:bg-[#ddead1]/30 dark:hover:bg-[#203423]/70" : "opacity-60 hover:opacity-80", index % 2 === 1 && "bg-[#ddead1]/20 dark:bg-[#17251b]"),
				children: [
					/* @__PURE__ */ jsx(Cell, {
						className: "font-bold text-[#102315] dark:text-[#edf7ee]",
						children: client.clientId
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-bold text-[#102315] dark:text-[#edf7ee]",
						children: client.name
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-medium text-[#64745F] dark:text-[#b7c8b3]",
						children: client.company ?? "-"
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-medium text-[#64745F] dark:text-[#b7c8b3]",
						children: client.city ?? "-"
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-bold text-[#102315] dark:text-[#edf7ee]",
						children: client.websiteCount
					}),
					/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx("span", {
						className: cn("rounded-full px-2.5 py-0.5 text-xs font-bold", client.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"),
						children: client.isActive ? "Active" : "Inactive"
					}) }),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-medium text-[#64745F] dark:text-[#b7c8b3]",
						children: formatDate(client.createdAt)
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "flex justify-end",
						children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
							render: /* @__PURE__ */ jsx(Button, {
								variant: "outline",
								size: "icon-sm",
								"aria-label": "Open actions",
								className: "border-[#c7ddb5] dark:border-[#2f4a32]"
							}),
							children: /* @__PURE__ */ jsx(MoreHorizontal, {})
						}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
							align: "end",
							className: "rounded-xl border border-[#c7ddb5] bg-white dark:border-[#2f4a32] dark:bg-[#132018]",
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
			className: "inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-[#3F6F39] transition hover:text-[#102315] dark:text-[#b6d7a8] dark:hover:text-[#edf7ee]",
			children: [label, active ? sortOrder === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "size-3.5" }) : /* @__PURE__ */ jsx(ArrowUpDown, { className: "size-3.5 opacity-50" })]
		})
	});
}
function HeaderCell({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-14 min-w-0 items-center overflow-hidden px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#3F6F39] dark:text-[#b6d7a8]", className),
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
		className: cn("flex h-40 items-center justify-center text-[#64745F]", className),
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
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Backdrop, { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" }), /* @__PURE__ */ jsxs(Dialog.Popup, {
			className: "fixed left-1/2 top-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#2f4a32] dark:bg-[#101912]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-[#f0f4ee] px-6 py-4 dark:border-[#2f4a32]/60",
				children: [/* @__PURE__ */ jsx(Dialog.Title, {
					className: "text-lg font-bold text-[#101828] dark:text-[#edf7ee]",
					children: "Add Client"
				}), /* @__PURE__ */ jsx(Dialog.Close, {
					render: /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "flex size-8 items-center justify-center rounded-lg text-[#64745F] transition hover:bg-[#f0f4ee] hover:text-[#101828] dark:hover:bg-[#203423] dark:hover:text-[#edf7ee]"
					}),
					children: /* @__PURE__ */ jsx(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "px-6 py-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-5 flex items-center gap-3 border-b border-[#f0f4ee] pb-4 dark:border-[#2f4a32]/60",
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
											className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
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
											className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
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
											className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
											children: "Phone"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Phone, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9fb49b]" }), /* @__PURE__ */ jsx(Input, {
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
											className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
											children: "Email"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9fb49b]" }), /* @__PURE__ */ jsx(Input, {
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
										className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
										children: "City"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9fb49b]" }), /* @__PURE__ */ jsx(Input, {
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
						className: "mt-6 flex justify-end gap-3",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							className: "h-10 min-w-24 rounded-xl border-[#dde5d8] dark:border-[#2f4a32]",
							onClick: handleCancel,
							children: "Cancel"
						}), /* @__PURE__ */ jsxs(Button, {
							type: "submit",
							disabled: createMutation.isPending,
							className: "h-10 gap-2 rounded-xl bg-[#658354] px-5 font-bold text-white hover:bg-[#4b6043]",
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
		className: "flex min-h-0 flex-1 flex-col gap-4 overflow-hidden bg-[#f2f6ee] p-4 dark:bg-[#0b110d]",
		children: [
			/* @__PURE__ */ jsx(TopBarSlot, {
				routeKey: "/clients",
				children: /* @__PURE__ */ jsxs("section", {
					className: "flex min-w-0 flex-wrap items-center justify-end gap-2",
					children: [/* @__PURE__ */ jsx(SearchBar, {
						value: searchQuery,
						onChange: setSearchQuery,
						placeholder: "Search by name or company...",
						className: "w-[300px]"
					}), /* @__PURE__ */ jsxs(Button, {
						className: "h-10 rounded-xl bg-[#658354] px-5 font-bold text-white hover:bg-[#4b6043]",
						onClick: () => setAddDialogOpen(true),
						children: [/* @__PURE__ */ jsx(Plus, { className: "size-4" }), "Add Client"]
					})]
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
				className: "flex shrink-0 items-center justify-between rounded-xl border border-[#c7ddb5] bg-white px-5 py-3.5 text-sm text-[#64745F] shadow-sm dark:border-[#2f4a32] dark:bg-[#101912] dark:text-[#b7c8b3]",
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
							className: cn(pageNumber === pagination.page && "bg-[#ddead1] text-[#658354] hover:bg-[#c7ddb5]"),
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
