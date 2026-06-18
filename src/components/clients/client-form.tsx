import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Save, Trash2, UserRound } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useCreateClient, useUpdateClient } from '#/hooks/use-clients'
import type { Client, ClientDetail, ClientInput } from './types'

// ─── Schema ───────────────────────────────────────────────────────────────────

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

const nameLike = (field: string, max = 100) =>
  z.preprocess(
    emptyToUndefined,
    z.string({ message: `${field} is required` })
      .min(3, `${field} must be at least 3 characters`)
      .max(max, `${field} must be at most ${max} characters`)
      .regex(/^[A-Za-z][A-Za-z0-9 ]*$/, `${field} must start with a letter and contain only letters, numbers and spaces`),
  )

const optionalNameLike = (field: string, max = 100) => nameLike(field, max).optional()

const clientFormSchema = z.object({
  name: nameLike('Name'),
  company: optionalNameLike('Company', 150),
  phone: z.preprocess(
    emptyToUndefined,
    z.string()
      .regex(/^[6-9]\d{9}$/, 'Must start with 6-9 and be exactly 10 digits')
      .refine((v) => !/^(\d)\1{9}$/.test(v), 'Cannot be a repeated digit pattern')
      .optional(),
  ),
  email: z.preprocess(emptyToUndefined, z.string().email('Invalid email').optional()),
  city: optionalNameLike('City'),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

// ─── Props ────────────────────────────────────────────────────────────────────

type ClientFormProps =
  | {
      mode?: 'create'
      onCreated: (client: Client) => void
      onCancel?: () => void
      onDelete?: never
      isDeleting?: never
    }
  | {
      mode: 'edit'
      client: ClientDetail
      onUpdated: (client: Client) => void
      onCancel?: () => void
      onDelete?: () => void
      isDeleting?: boolean
    }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDefaultValues(client?: ClientDetail): ClientFormValues {
  return {
    name: client?.name ?? '',
    company: client?.company ?? '',
    phone: client?.phone ?? '',
    email: client?.email ?? '',
    city: client?.city ?? '',
  }
}

function toPayload(values: ClientFormValues): ClientInput {
  return {
    name: values.name.trim(),
    company: values.company?.trim() || undefined,
    phone: values.phone?.trim() || undefined,
    email: values.email?.trim() || undefined,
    city: values.city?.trim() || undefined,
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-semibold text-[#101828] dark:text-[#edf7ee]">
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ClientForm(props: ClientFormProps) {
  const isEdit = props.mode === 'edit'
  const client = isEdit ? props.client : undefined

  const createMutation = useCreateClient()
  const updateMutation = useUpdateClient(client?.clientId ?? '')
  const mutation = isEdit ? updateMutation : createMutation

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema) as any,
    defaultValues: getDefaultValues(client),
  })

  const submit = form.handleSubmit((values) => {
    if (isEdit) {
      updateMutation.mutate(toPayload(values), { onSuccess: (props as any).onUpdated })
    } else {
      createMutation.mutate(toPayload(values), { onSuccess: (props as any).onCreated })
    }
  })

  return (
    <form onSubmit={submit} className="flex w-full flex-1 flex-col gap-4">

      {/* ── Client Details card ── */}
      <div className="rounded-xl border border-[#e5ebe2] bg-white p-6 shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
        {/* Section header */}
        <div className="flex items-center gap-4 border-b border-[#f0f4ee] pb-4 dark:border-[#2f4a32]/60">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]">
            <UserRound className="size-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-[#101828] dark:text-[#edf7ee]">Client Details</h2>
            <p className="mt-0.5 text-sm text-[#475467] dark:text-[#b7c8b3]">
              {isEdit ? 'Update contact and company information.' : 'Add a new client to start tracking their websites.'}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="mt-5 grid gap-5">
          {/* Row 1: Name (full width) */}
          <Field label="Name" required error={form.formState.errors.name?.message}>
            <Input placeholder="e.g. Acme Corp" {...form.register('name')} />
          </Field>

          {/* Row 2: Company + City */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Company" error={form.formState.errors.company?.message}>
              <Input placeholder="e.g. Acme Pvt Ltd" {...form.register('company')} />
            </Field>
            <Field label="City" error={form.formState.errors.city?.message}>
              <Input placeholder="e.g. Bengaluru" {...form.register('city')} />
            </Field>
          </div>

          {/* Row 3: Phone + Email */}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Phone" error={form.formState.errors.phone?.message}>
              <Input placeholder="9876543210" {...form.register('phone')} />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <Input type="email" placeholder="client@example.com" {...form.register('email')} />
            </Field>
          </div>
        </div>
      </div>

      {mutation.isError ? (
        <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>
      ) : null}

      {/* ── Footer ── */}
      <div className="mt-auto flex shrink-0 items-center justify-between gap-3 rounded-xl border border-[#e5ebe2] bg-white px-6 py-4 shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
        {/* Left: Delete (edit only) */}
        <div>
          {isEdit && props.onDelete ? (
            <Button
              type="button"
              variant="outline"
              className="gap-2 rounded-lg border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
              disabled={props.isDeleting}
              onClick={props.onDelete}
            >
              <Trash2 className="size-4" />
              {props.isDeleting ? 'Deleting...' : 'Delete Client'}
            </Button>
          ) : null}
        </div>

        {/* Right: Cancel + Save */}
        <div className="flex items-center gap-3">
          {props.onCancel ? (
            <Button type="button" variant="outline" className="h-10 min-w-24 rounded-lg" onClick={props.onCancel}>
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="h-10 min-w-36 gap-2 rounded-lg bg-[#658354] font-bold text-white hover:bg-[#4b6043]"
          >
            <Save className="size-4" />
            {mutation.isPending
              ? isEdit ? 'Saving...' : 'Creating...'
              : isEdit ? 'Save Changes' : 'Create Client'}
          </Button>
        </div>
      </div>
    </form>
  )
}
