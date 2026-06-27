import { t as cn } from "./utils-CR4dV3c0.js";
import { t as Route } from "./clients.index-D6oz7ZMf.js";
import { t as Button } from "./button-N4VO-qD6.js";
import { t as Input } from "./input-CyBl28YE.js";
import { i as DropdownMenuItem, n as DropdownMenuContent, o as DropdownMenuTrigger, t as DropdownMenu } from "./dropdown-menu-DpCy7uv2.js";
import { n as useClients, r as useCreateClient } from "./use-clients-Dn2jCq3x.js";
import { n as formatDate } from "./format-BiRzvK38.js";
import { t as EditClientDialog } from "./edit-client-dialog-BEMk0NX0.js";
import { n as useDebounce, r as PageSizeSelector, t as NoResults } from "./no-results-DYby2b_E.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Mail, MapPin, MoreHorizontal, Phone, UserRoundPlus, X } from "lucide-react";
import { Dialog } from "@base-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//#region src/components/clients/clients-table.tsx
var gridClass = "grid grid-cols-[1.2fr_1.9fr_1fr_1.2fr_1fr_0.6fr_0.8fr_1fr_0.5fr]";
var SORTABLE = {
	Company: "company",
	Address: "city",
	Websites: "website_count",
	Status: "is_active",
	Created: "created_at"
};
function ClientsTable({ clients, isLoading, isError, error, sortBy, sortOrder, onSortChange, onEdit }) {
	const sorted = clients ? [...clients].sort((a, b) => {
		if (a.is_active === b.is_active) return 0;
		return a.is_active ? -1 : 1;
	}) : void 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: cn(gridClass, "shrink-0 border-b border-[#E5E7EB] bg-[#FAFBFC] dark:border-[#1e2244] dark:bg-[#131624]"),
			children: [
				/* @__PURE__ */ jsx(HeaderCell, { children: "Name" }),
				/* @__PURE__ */ jsx(HeaderCell, { children: "Email" }),
				/* @__PURE__ */ jsx(HeaderCell, { children: "Phone" }),
				Object.keys(SORTABLE).map((label) => /* @__PURE__ */ jsx(SortableHeaderCell, {
					label,
					field: SORTABLE[label],
					sortBy,
					sortOrder,
					onSort: onSortChange
				}, label)),
				/* @__PURE__ */ jsx(HeaderCell, {
					className: "justify-end",
					children: "Actions"
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "min-h-0 flex-1 overflow-auto",
			children: isLoading ? /* @__PURE__ */ jsx(StateRow, { children: "Loading..." }) : isError ? /* @__PURE__ */ jsx(StateRow, {
				className: "text-[#DC2626]",
				children: error?.message ?? "Something went wrong."
			}) : !sorted || sorted.length === 0 ? /* @__PURE__ */ jsx(NoResults, { message: "No clients found." }) : sorted.map((client) => /* @__PURE__ */ jsxs("div", {
				className: cn(gridClass, "min-h-[54px] items-center border-b border-[#EEF0F2] text-[13px] transition-colors dark:border-[#252847]", client.is_active ? "hover:bg-[#F7F8FA] dark:hover:bg-[#131624]" : "opacity-60 hover:opacity-80"),
				children: [
					/* @__PURE__ */ jsx(Cell, {
						className: "font-semibold text-[#11141A] dark:text-[#E5E7EB]",
						children: client.name
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "overflow-hidden text-[#5C6270] dark:text-[#9CA3AF]",
						children: client.email ? /* @__PURE__ */ jsx("a", {
							href: `mailto:${client.email}`,
							className: "block truncate hover:text-[#4F5DF5] hover:underline",
							children: client.email
						}) : "—"
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "text-[#5C6270] dark:text-[#9CA3AF]",
						children: client.phone ? /* @__PURE__ */ jsx("a", {
							href: `tel:${client.phone}`,
							className: "hover:text-[#4F5DF5] hover:underline",
							children: client.phone
						}) : "—"
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "text-[#5C6270] dark:text-[#9CA3AF]",
						children: client.company ?? "—"
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "text-[#5C6270] dark:text-[#9CA3AF]",
						children: client.city ?? "—"
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "font-semibold text-[#11141A] dark:text-[#E5E7EB]",
						children: client.website_count
					}),
					/* @__PURE__ */ jsx(Cell, { children: /* @__PURE__ */ jsx("span", {
						className: cn("inline-flex items-center rounded-[7px] px-[11px] py-[4px] text-[11px] font-bold uppercase tracking-[.02em]", client.is_active ? "bg-[#ECFDF5] text-[#059669] dark:bg-[#064E3B] dark:text-[#34D399]" : "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#1F2937] dark:text-[#9CA3AF]"),
						children: client.is_active ? "Active" : "Inactive"
					}) }),
					/* @__PURE__ */ jsx(Cell, {
						className: "text-[#5C6270] dark:text-[#9CA3AF]",
						children: formatDate(client.created_at)
					}),
					/* @__PURE__ */ jsx(Cell, {
						className: "flex justify-end",
						children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
							render: /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "flex size-7 items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] dark:hover:bg-[#1c2045]",
								"aria-label": "Open actions"
							}),
							children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "size-4" })
						}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
							align: "end",
							className: "rounded-[10px] border border-[#E5E7EB] bg-white p-1 shadow-[0_10px_30px_rgba(17,20,26,.12)] dark:border-[#1e2244] dark:bg-[#181b2d]",
							children: [/* @__PURE__ */ jsx(DropdownMenuItem, {
								className: "cursor-pointer rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7] dark:text-[#E5E7EB] dark:focus:bg-[#1c2045]",
								render: /* @__PURE__ */ jsx(Link, {
									to: "/clients/$clientId",
									params: { clientId: String(client.id) }
								}),
								children: "View details"
							}), /* @__PURE__ */ jsx(DropdownMenuItem, {
								className: "cursor-pointer rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-[#3D4250] focus:bg-[#F4F5F7] dark:text-[#E5E7EB] dark:focus:bg-[#1c2045]",
								onClick: () => onEdit?.(client),
								children: "Edit client"
							})]
						})] })
					})
				]
			}, client.id))
		})]
	});
}
function SortableHeaderCell({ label, field, sortBy, sortOrder, onSort, className }) {
	const active = sortBy === field;
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-12 items-center px-3 py-2", className),
		children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => onSort?.(field),
			className: cn("inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[.03em] transition", active ? "text-[#4F5DF5]" : "text-[#8A8F98] hover:text-[#3D4250] dark:hover:text-[#E5E7EB]"),
			children: [label, active ? sortOrder === "asc" ? /* @__PURE__ */ jsx(ArrowUp, { className: "size-3" }) : /* @__PURE__ */ jsx(ArrowDown, { className: "size-3" }) : /* @__PURE__ */ jsx(ArrowUpDown, { className: "size-3 opacity-40" })]
		})
	});
}
function HeaderCell({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex h-12 min-w-0 items-center overflow-hidden px-3 py-2 text-[11px] font-semibold uppercase tracking-[.03em] text-[#8A8F98]", className),
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
		className: cn("flex h-40 items-center justify-center text-[13px] text-[#8A8F98]", className),
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
	company: nameLike("Company", 150),
	phone: z.preprocess(emptyToUndefined, z.string().regex(/^[6-9]\d{9}$/, "Must start with 6-9 and be exactly 10 digits").refine((v) => !/^(\d)\1{9}$/.test(v), "Cannot be a repeated digit pattern").optional()),
	email: z.preprocess(emptyToUndefined, z.string({ message: "Email is required" }).email("Invalid email")),
	city: z.preprocess(emptyToUndefined, nameLike("Address").optional())
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
			company: values.company.trim(),
			email: values.email.trim(),
			phone: values.phone?.trim() || void 0,
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
			className: "fixed left-1/2 top-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4",
				children: [/* @__PURE__ */ jsx(Dialog.Title, {
					className: "text-lg font-bold text-[#11141A]",
					children: "Add Client"
				}), /* @__PURE__ */ jsx(Dialog.Close, {
					render: /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "flex size-8 items-center justify-center rounded-lg text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]"
					}),
					children: /* @__PURE__ */ jsx(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "px-6 py-5",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-5 flex items-center gap-3 border-b border-[#E5E7EB] pb-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEEFFE] text-[#4F5DF5]",
							children: /* @__PURE__ */ jsx(UserRoundPlus, { className: "size-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold text-[#11141A]",
							children: "Client Details"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-[#5C6270]",
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
											className: "text-[11.5px] font-semibold text-[#374151]",
											children: ["Client Name ", /* @__PURE__ */ jsx("span", {
												className: "text-[#DC2626]",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx(Input, {
											placeholder: "Enter client name",
											...form.register("name")
										}),
										e.name ? /* @__PURE__ */ jsx("p", {
											className: "text-[11px] font-semibold text-[#DC2626]",
											children: e.name.message
										}) : null
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "text-[11.5px] font-semibold text-[#374151]",
											children: ["Company ", /* @__PURE__ */ jsx("span", {
												className: "text-[#DC2626]",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsx(Input, {
											placeholder: "Enter company name",
											...form.register("company")
										}),
										e.company ? /* @__PURE__ */ jsx("p", {
											className: "text-[11px] font-semibold text-[#DC2626]",
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
											className: "text-[11.5px] font-semibold text-[#374151]",
											children: "Phone"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Phone, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" }), /* @__PURE__ */ jsx(Input, {
												className: "pl-9",
												placeholder: "Enter 10-digit mobile number",
												...form.register("phone")
											})]
										}),
										e.phone ? /* @__PURE__ */ jsx("p", {
											className: "text-[11px] font-semibold text-[#DC2626]",
											children: e.phone.message
										}) : null
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-1.5",
									children: [
										/* @__PURE__ */ jsxs("label", {
											className: "text-[11.5px] font-semibold text-[#374151]",
											children: ["Email ", /* @__PURE__ */ jsx("span", {
												className: "text-[#DC2626]",
												children: "*"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" }), /* @__PURE__ */ jsx(Input, {
												className: "pl-9",
												type: "email",
												placeholder: "Enter email address",
												...form.register("email")
											})]
										}),
										e.email ? /* @__PURE__ */ jsx("p", {
											className: "text-[11px] font-semibold text-[#DC2626]",
											children: e.email.message
										}) : null
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-1.5",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "text-[11.5px] font-semibold text-[#374151]",
										children: "Address"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "relative",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" }), /* @__PURE__ */ jsx(Input, {
											className: "pl-9",
											placeholder: "Enter address (optional)",
											...form.register("city")
										})]
									}),
									e.city ? /* @__PURE__ */ jsx("p", {
										className: "text-[11px] font-semibold text-[#DC2626]",
										children: e.city.message
									}) : null
								]
							})
						]
					}),
					createMutation.isError ? /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-[12px] font-semibold text-[#DC2626]",
						children: createMutation.error.message
					}) : null,
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 flex justify-end gap-3",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							className: "h-10 min-w-24 rounded-[9px] border-[#E5E7EB] text-[#5C6270]",
							onClick: handleCancel,
							children: "Cancel"
						}), /* @__PURE__ */ jsxs(Button, {
							type: "submit",
							disabled: createMutation.isPending,
							className: "h-10 gap-2 rounded-[9px] bg-[#4F5DF5] px-5 text-[13px] font-semibold text-white hover:bg-[#3F4DE0]",
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
	const handleClientCreated = (_client) => {
		navigate({ search: (old) => ({
			...old,
			page: 1
		}) });
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
		className: "flex min-h-0 flex-1 flex-col gap-[22px] overflow-hidden bg-[#F4F5F7] px-[30px] py-[26px]",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[21px] font-bold tracking-tight text-[#11141A]",
					children: "Clients"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-[3px] text-[12.5px] text-[#8A8F98]",
					children: "Search, manage, and open each client's linked websites"
				})] }), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setAddDialogOpen(true),
					className: "inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]",
					children: "+ Add Client"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)]",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "border-b border-[#E5E7EB] px-[18px] py-[14px]",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2 rounded-[9px] border border-[#E5E7EB] bg-[#F7F8FA] px-3 py-2 max-w-[300px]",
							children: /* @__PURE__ */ jsx("input", {
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Search clients...",
								className: "w-full border-none bg-transparent text-[12.5px] text-[#1F2430] outline-none placeholder:text-[#A8ACB4]"
							})
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
					pagination ? /* @__PURE__ */ jsxs("footer", {
						className: "flex shrink-0 items-center justify-between border-t border-[#E5E7EB] bg-white px-5 py-3 text-sm text-[#8A8F98]",
						children: [/* @__PURE__ */ jsx(PageSizeSelector, {
							value: routeSearch.limit,
							onChange: (limit) => updateSearch({
								limit,
								page: 1
							}),
							total: pagination.total
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[12px] text-[#8A8F98]",
								children: [
									"Page ",
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-[#5C6270]",
										children: pagination.page
									}),
									" of ",
									/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-[#5C6270]",
										children: pagination.totalPages
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ jsx("button", {
										type: "button",
										disabled: pagination.page <= 1,
										onClick: () => updateSearch({ page: pagination.page - 1 }),
										"aria-label": "Previous page",
										className: "flex size-[29px] items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed",
										children: /* @__PURE__ */ jsx(ChevronLeft, { className: "size-4" })
									}),
									Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => updateSearch({ page: n }),
										className: cn("flex size-[29px] items-center justify-center rounded-[7px] text-[12px] font-semibold transition", n === pagination.page ? "bg-[#4F5DF5] text-white" : "text-[#5C6270] hover:bg-[#F4F5F7]"),
										children: n
									}, n)),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										disabled: pagination.page >= pagination.totalPages,
										onClick: () => updateSearch({ page: pagination.page + 1 }),
										"aria-label": "Next page",
										className: "flex size-[29px] items-center justify-center rounded-[7px] text-[#8A8F98] transition hover:bg-[#F4F5F7] disabled:opacity-40 disabled:cursor-not-allowed",
										children: /* @__PURE__ */ jsx(ChevronRight, { className: "size-4" })
									})
								]
							})]
						})]
					}) : null
				]
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
			})
		]
	});
}
//#endregion
export { ClientsPage as component };
