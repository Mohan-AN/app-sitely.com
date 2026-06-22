import { t as Button } from "./button-BJN112tG.js";
import { t as Input } from "./input-B9pPcpqc.js";
import { a as useUpdateClient, r as useCreateClient } from "./use-clients-BcKNT9QA.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Save, Trash2, UserRound } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//#region src/components/clients/client-form.tsx
var emptyToUndefined = (value) => {
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	return trimmed === "" ? void 0 : trimmed;
};
var nameLike = (field, max = 100) => z.preprocess(emptyToUndefined, z.string({ message: `${field} is required` }).min(3, `${field} must be at least 3 characters`).max(max, `${field} must be at most ${max} characters`).regex(/^[A-Za-z][A-Za-z0-9 ]*$/, `${field} must start with a letter and contain only letters, numbers and spaces`));
var optionalNameLike = (field, max = 100) => nameLike(field, max).optional();
var clientFormSchema = z.object({
	name: nameLike("Name"),
	company: nameLike("Company", 150),
	phone: z.preprocess(emptyToUndefined, z.string().regex(/^[6-9]\d{9}$/, "Must start with 6-9 and be exactly 10 digits").refine((v) => !/^(\d)\1{9}$/.test(v), "Cannot be a repeated digit pattern").optional()),
	email: z.preprocess(emptyToUndefined, z.string({ message: "Email is required" }).email("Invalid email")),
	city: optionalNameLike("Address")
});
function getDefaultValues(client) {
	return {
		name: client?.name ?? "",
		company: client?.company ?? "",
		phone: client?.phone ?? "",
		email: client?.email ?? "",
		city: client?.city ?? ""
	};
}
function toPayload(values) {
	return {
		name: values.name.trim(),
		company: values.company.trim(),
		email: values.email.trim(),
		phone: values.phone?.trim() || void 0,
		city: values.city?.trim() || void 0
	};
}
function Field({ label, required, error, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-1.5",
		children: [
			/* @__PURE__ */ jsxs("label", {
				className: "text-sm font-semibold text-[#101828] dark:text-[#edf7ee]",
				children: [label, required ? /* @__PURE__ */ jsx("span", {
					className: "ml-0.5 text-red-500",
					children: "*"
				}) : null]
			}),
			children,
			error ? /* @__PURE__ */ jsx("p", {
				className: "text-xs text-destructive",
				children: error
			}) : null
		]
	});
}
function ClientForm(props) {
	const isEdit = props.mode === "edit";
	const client = isEdit ? props.client : void 0;
	const createMutation = useCreateClient();
	const updateMutation = useUpdateClient(client?.id ? String(client.id) : "");
	const mutation = isEdit ? updateMutation : createMutation;
	const form = useForm({
		resolver: zodResolver(clientFormSchema),
		defaultValues: getDefaultValues(client)
	});
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: form.handleSubmit((values) => {
			if (isEdit) updateMutation.mutate(toPayload(values), { onSuccess: props.onUpdated });
			else createMutation.mutate(toPayload(values), { onSuccess: props.onCreated });
		}),
		className: "flex w-full flex-1 flex-col gap-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-[#e5ebe2] bg-white p-6 shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4 border-b border-[#f0f4ee] pb-4 dark:border-[#2f4a32]/60",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]",
						children: /* @__PURE__ */ jsx(UserRound, { className: "size-5" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "font-extrabold text-[#101828] dark:text-[#edf7ee]",
						children: "Client Details"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-0.5 text-sm text-[#475467] dark:text-[#b7c8b3]",
						children: isEdit ? "Update contact and company information." : "Add a new client to start tracking their websites."
					})] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-5 grid gap-5",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "Name",
							required: true,
							error: form.formState.errors.name?.message,
							children: /* @__PURE__ */ jsx(Input, {
								placeholder: "e.g. Acme Corp",
								...form.register("name")
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-5 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Company",
								required: true,
								error: form.formState.errors.company?.message,
								children: /* @__PURE__ */ jsx(Input, {
									placeholder: "e.g. Acme Pvt Ltd",
									...form.register("company")
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Address",
								error: form.formState.errors.city?.message,
								children: /* @__PURE__ */ jsx(Input, {
									placeholder: "e.g. 123 MG Road, Bengaluru",
									...form.register("city")
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-5 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsx(Field, {
								label: "Phone",
								error: form.formState.errors.phone?.message,
								children: /* @__PURE__ */ jsx(Input, {
									placeholder: "9876543210",
									...form.register("phone")
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Email",
								required: true,
								error: form.formState.errors.email?.message,
								children: /* @__PURE__ */ jsx(Input, {
									type: "email",
									placeholder: "client@example.com",
									...form.register("email")
								})
							})]
						})
					]
				})]
			}),
			mutation.isError ? /* @__PURE__ */ jsx("p", {
				className: "text-sm text-destructive",
				children: mutation.error.message
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "mt-auto flex shrink-0 items-center justify-between gap-3 rounded-xl border border-[#e5ebe2] bg-white px-6 py-4 shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]",
				children: [/* @__PURE__ */ jsx("div", { children: isEdit && props.onDelete ? /* @__PURE__ */ jsxs(Button, {
					type: "button",
					variant: "outline",
					className: "gap-2 rounded-lg border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30",
					disabled: props.isDeleting,
					onClick: props.onDelete,
					children: [/* @__PURE__ */ jsx(Trash2, { className: "size-4" }), props.isDeleting ? "Deleting..." : "Delete Client"]
				}) : null }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [props.onCancel ? /* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "outline",
						className: "h-10 min-w-24 rounded-lg",
						onClick: props.onCancel,
						children: "Cancel"
					}) : null, /* @__PURE__ */ jsxs(Button, {
						type: "submit",
						disabled: mutation.isPending,
						className: "h-10 min-w-36 gap-2 rounded-lg bg-[#658354] font-bold text-white hover:bg-[#4b6043]",
						children: [/* @__PURE__ */ jsx(Save, { className: "size-4" }), mutation.isPending ? isEdit ? "Saving..." : "Creating..." : isEdit ? "Save Changes" : "Create Client"]
					})]
				})]
			})
		]
	});
}
//#endregion
export { ClientForm as t };
