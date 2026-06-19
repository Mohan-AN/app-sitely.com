import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CirclePlus, Save, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { useClientOptions, useCreateWebsite, useUpdateWebsite } from '#/hooks/use-websites'
import { cn } from '#/lib/utils'
import type { ClientOption, CreateWebsiteInput, UpdateWebsiteInput, Website, WebsiteDetail } from './types'

// ─── Zod helpers ──────────────────────────────────────────────────────────────

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

const optionalDate = z.preprocess(
  emptyToUndefined,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
)

const optionalUrl = z.preprocess(emptyToUndefined, z.string().url('Invalid url').optional())

const websiteFormSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  projectName: z.string().trim().min(1, 'Project name is required').max(150, 'Too long'),
  url: optionalUrl,
  siteType: z.enum(['static', 'wordpress'], { message: 'Required' }),
  platform: z.enum(['netlify', 'wpx'], { message: 'Required' }),
  websiteStatus: z.string().optional(),
  maintenanceStatus: z.string().optional(),
  startDate: optionalDate,
  hostedDate: optionalDate,
  lastInvoiceSent: optionalDate,
  lastPaymentReceived: optionalDate,
  renewalDate: optionalDate,
  transferCompleted: z.boolean(),
  remarks: z.string().optional(),
})

type WebsiteFormValues = z.infer<typeof websiteFormSchema>

// ─── Props ────────────────────────────────────────────────────────────────────

type WebsiteFormProps =
  | {
      mode?: 'create'
      initialClientId?: string
      onCreated: (website: Website) => void
      onCancel?: () => void
      onDelete?: never
      isDeleting?: never
      formId?: string
      hideFooter?: boolean
    }
  | {
      mode: 'edit'
      website: WebsiteDetail
      onUpdated: (website: Website) => void
      onCancel?: () => void
      onDelete?: () => void
      isDeleting?: boolean
      formId?: string
      hideFooter?: boolean
    }

// ─── Constants ────────────────────────────────────────────────────────────────

const SITE_TYPES = [
  { value: 'static', label: 'Static' },
  { value: 'wordpress', label: 'WordPress' },
] as const

const PLATFORMS = [
  { value: 'netlify', label: 'Netlify' },
  { value: 'wpx', label: 'WPX' },
] as const

const WEBSITE_STATUSES = ['In Progress', 'Live', 'On Hold', 'Completed', 'Discontinued']
const MAINTENANCE_STATUSES = ['Not Started', 'Active', 'Paused', 'Overdue', 'Cancelled']
const DOT_COLORS: Record<string, string> = {
  'In Progress': 'bg-amber-500',
  Live: 'bg-emerald-500',
  'On Hold': 'bg-gray-400',
  Completed: 'bg-blue-500',
  Discontinued: 'bg-gray-400',
  'Not Started': 'bg-gray-400',
  Active: 'bg-emerald-500',
  Paused: 'bg-gray-400',
  Overdue: 'bg-red-500',
  Cancelled: 'bg-gray-400',
}

// ─── Payload builders ─────────────────────────────────────────────────────────

function toCreatePayload(values: WebsiteFormValues): CreateWebsiteInput {
  return {
    clientId: values.clientId,
    projectName: values.projectName.trim(),
    url: values.url ?? null,
    siteType: values.siteType,
    platform: values.platform,
    startDate: values.startDate ?? null,
    hostedDate: values.hostedDate ?? null,
    lastInvoiceSent: values.lastInvoiceSent ?? null,
    lastPaymentReceived: values.lastPaymentReceived ?? null,
    renewalDate: values.renewalDate ?? null,
    remarks: values.remarks?.trim() || null,
  }
}

function toUpdatePayload(values: WebsiteFormValues): UpdateWebsiteInput {
  return {
    clientId: values.clientId,
    projectName: values.projectName.trim(),
    url: values.url ?? null,
    siteType: values.siteType,
    platform: values.platform,
    websiteStatus: values.websiteStatus,
    maintenanceStatus: values.maintenanceStatus,
    startDate: values.startDate ?? null,
    hostedDate: values.hostedDate ?? null,
    lastInvoiceSent: values.lastInvoiceSent ?? null,
    lastPaymentReceived: values.lastPaymentReceived ?? null,
    renewalDate: values.renewalDate ?? null,
    transferCompleted: values.transferCompleted,
    remarks: values.remarks?.trim() || null,
  }
}

function toDateValue(raw: string | null | undefined): string {
  if (!raw) return ''
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  // ISO datetime — take the date portion only
  const datePart = raw.split('T')[0]
  return datePart ?? ''
}

function getDefaultValues(website?: WebsiteDetail, initialClientId = ''): WebsiteFormValues {
  const siteType = website?.siteType?.toLowerCase() as WebsiteFormValues['siteType'] | undefined
  const platform = website?.platform?.toLowerCase() as WebsiteFormValues['platform'] | undefined
  return {
    clientId: website?.clientId ?? initialClientId,
    projectName: website?.projectName ?? '',
    url: website?.url ?? '',
    siteType: siteType ?? 'static',
    platform: platform ?? 'netlify',
    websiteStatus: website?.websiteStatus ?? '',
    maintenanceStatus: website?.maintenanceStatus ?? '',
    startDate: toDateValue(website?.startDate),
    hostedDate: toDateValue(website?.hostedDate),
    lastInvoiceSent: toDateValue(website?.lastInvoiceSent),
    lastPaymentReceived: toDateValue(website?.lastPaymentReceived),
    renewalDate: toDateValue(website?.renewalDate),
    transferCompleted: website?.transferCompleted ?? false,
    remarks: website?.remarks ?? '',
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[13px] font-semibold text-[#101828] dark:text-[#edf2ff]">
      {children}
    </h3>
  )
}

function Field({
  label,
  required,
  info,
  error,
  children,
}: {
  label: string
  required?: boolean
  info?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1">
      <label className="flex items-center gap-1 text-[12px] font-semibold text-[#344054] dark:text-[#edf2ff]">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
        {info ? (
          <span className="ml-0.5 flex size-3.5 items-center justify-center rounded-full bg-[#eef2f7] text-[9px] font-bold text-[#253858] dark:bg-[#172033] dark:text-[#a6b2cf]" title={info}>
            ⓘ
          </span>
        ) : null}
      </label>
      {children}
      {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
    </div>
  )
}

function StatusSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string | null | undefined
  onChange: (v: string) => void
  options: string[]
  placeholder: string
}) {
  return (
    <Select value={(value ?? '') as string} onValueChange={(v: string | null) => v && onChange(v)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {value ? (
            <span className="flex items-center gap-2">
              <span className={cn('size-2 rounded-full', DOT_COLORS[value] ?? 'bg-gray-400')} />
              {value}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((status) => (
          <SelectItem key={status} value={status}>
            <span className="flex items-center gap-2">
              <span className={cn('size-2 rounded-full', DOT_COLORS[status] ?? 'bg-gray-400')} />
              {status}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WebsiteForm(props: WebsiteFormProps) {
  const mode = props.mode ?? 'create'
  const isEdit = mode === 'edit'
  const website = props.mode === 'edit' ? props.website : undefined
  const initialClientId = props.mode !== 'edit' ? props.initialClientId : undefined
  const hideFooter = props.hideFooter ?? false

  const clientsQuery = useClientOptions(undefined)
  const createMutation = useCreateWebsite()
  const updateMutation = useUpdateWebsite(website ? website.websiteId : '')
  const mutation = isEdit ? updateMutation : createMutation

  const form = useForm<WebsiteFormValues>({
    resolver: zodResolver(websiteFormSchema) as any,
    defaultValues: getDefaultValues(website, initialClientId),
  })

  // Sync form values if the website data arrives after the form mounts
  useEffect(() => {
    if (website) form.reset(getDefaultValues(website))
  }, [website]) // eslint-disable-line react-hooks/exhaustive-deps

  const clients = clientsQuery.data?.items ?? []
  const selectedClient = form.watch('clientId')

  const clientOptions = useMemo(() => {
    if (!website || !selectedClient || clients.some((c) => c.clientId === selectedClient)) return clients
    const selected: ClientOption = { clientId: website.clientId, name: website.clientName }
    return [selected, ...clients]
  }, [clients, website, selectedClient])

  const submit = form.handleSubmit((values: WebsiteFormValues) => {
    if (props.mode === 'edit') {
      updateMutation.mutate(toUpdatePayload(values), { onSuccess: props.onUpdated })
    } else {
      createMutation.mutate(toCreatePayload(values), { onSuccess: props.onCreated })
    }
  })

  const trigger = 'h-8 text-[12px] bg-white dark:bg-[#111827]'
  const input = 'h-8 text-[12px] bg-white dark:bg-[#111827]'

  return (
    <form id={props.formId} onSubmit={submit} className="flex w-full flex-1 flex-col gap-2">

      {/* ── Website Details ── */}
      <section className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] p-3 dark:border-[#25304a] dark:bg-[#0d1117]">
        <SectionTitle>Website Details</SectionTitle>

        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
          <Field label="Client" required error={form.formState.errors.clientId?.message}>
            <Select
              value={form.watch('clientId') || ''}
              onValueChange={(v) => v && form.setValue('clientId', v, { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger className={`w-full ${trigger}`}>
                <SelectValue placeholder={clientsQuery.isLoading ? 'Loading...' : 'Select client'} />
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map((client) => (
                  <SelectItem key={client.clientId} value={client.clientId}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Project Name" required error={form.formState.errors.projectName?.message}>
            <Input className={input} placeholder="e.g. Redesign Project" {...form.register('projectName')} />
          </Field>

          <Field label="Website URL" error={form.formState.errors.url?.message}>
            <Input className={input} placeholder="e.g. https://example.com" {...form.register('url')} />
          </Field>

          <Field label="Site Type" required error={form.formState.errors.siteType?.message}>
            <Select
              value={form.watch('siteType') || ''}
              onValueChange={(v) => form.setValue('siteType', v as WebsiteFormValues['siteType'], { shouldDirty: true })}
            >
              <SelectTrigger className={`w-full ${trigger}`}>
                <SelectValue placeholder="Select site type" />
              </SelectTrigger>
              <SelectContent>
                {SITE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Platform" required error={form.formState.errors.platform?.message}>
            <Select
              value={form.watch('platform') || ''}
              onValueChange={(v) => form.setValue('platform', v as WebsiteFormValues['platform'], { shouldDirty: true })}
            >
              <SelectTrigger className={`w-full ${trigger}`}>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {isEdit ? (
            <Field label="Website Status" error={form.formState.errors.websiteStatus?.message}>
              <StatusSelect
                value={form.watch('websiteStatus') ?? ''}
                onChange={(v) => form.setValue('websiteStatus', v, { shouldDirty: true })}
                options={WEBSITE_STATUSES}
                placeholder="Select status"
              />
            </Field>
          ) : null}

          {isEdit ? (
            <Field label="Maintenance Status" error={form.formState.errors.maintenanceStatus?.message}>
              <StatusSelect
                value={form.watch('maintenanceStatus') ?? ''}
                onChange={(v) => form.setValue('maintenanceStatus', v, { shouldDirty: true })}
                options={MAINTENANCE_STATUSES}
                placeholder="Select status"
              />
            </Field>
          ) : null}
        </div>
      </section>

      {/* ── Dates & Notes ── */}
      <section className="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] p-3 dark:border-[#25304a] dark:bg-[#0d1117]">
        <SectionTitle>Dates &amp; Notes</SectionTitle>

        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
          <Field label="Start Date" error={form.formState.errors.startDate?.message}>
            <Input type="date" className={input} {...form.register('startDate')} />
          </Field>
          <Field label="Hosted Date" error={form.formState.errors.hostedDate?.message}>
            <Input type="date" className={input} {...form.register('hostedDate')} />
          </Field>
          <Field label="Last Invoice Sent" error={form.formState.errors.lastInvoiceSent?.message}>
            <Input type="date" className={input} {...form.register('lastInvoiceSent')} />
          </Field>
          <Field label="Last Payment Received" error={form.formState.errors.lastPaymentReceived?.message}>
            <Input type="date" className={input} {...form.register('lastPaymentReceived')} />
          </Field>
          <Field label="Renewal Date" error={form.formState.errors.renewalDate?.message}>
            <Input type="date" className={input} {...form.register('renewalDate')} />
          </Field>
        </div>

        <div className="mt-2">
          <Field label="Remarks" error={form.formState.errors.remarks?.message}>
            <textarea
              rows={2}
              className="w-full resize-none rounded-lg border border-[#dce3ef] bg-white px-2.5 py-1.5 text-[12px] text-[#172554] outline-none placeholder:text-[#7f8aa3] focus-visible:border-[#4f2df5] focus-visible:ring-3 focus-visible:ring-[#4f2df5]/15 dark:border-[#25304a] dark:bg-[#111827] dark:text-[#edf2ff]"
              placeholder="Add any additional notes about this website..."
              {...form.register('remarks')}
            />
          </Field>
        </div>

        {isEdit ? (
          <div className="mt-2">
            <Field
              label="Transfer Completed"
              info="Whether the domain and assets transfer has been finalized."
              error={form.formState.errors.transferCompleted?.message}
            >
              <Select
                value={form.watch('transferCompleted') ? 'yes' : 'no'}
                onValueChange={(v) => form.setValue('transferCompleted', v === 'yes', { shouldDirty: true })}
              >
                <SelectTrigger className={`w-full ${trigger}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        ) : null}
      </section>

      {mutation.isError ? (
        <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>
      ) : null}

      {!hideFooter ? (
        /* ── Footer ── */
        <div className="mt-auto flex shrink-0 items-center justify-between gap-3 rounded-lg border border-[#dce3ef] bg-white px-7 py-4 dark:border-[#25304a] dark:bg-[#111827]">
          {/* Left: Delete (edit only) */}
          <div>
            {isEdit && props.onDelete ? (
              <Button
                type="button"
                variant="outline"
                className="gap-2 rounded-xl border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                disabled={props.isDeleting}
                onClick={props.onDelete}
              >
                <Trash2 className="size-4" />
                {props.isDeleting ? 'Deleting...' : 'Delete Website'}
              </Button>
            ) : null}
          </div>

          {/* Right: Cancel + Save */}
          <div className="flex items-center gap-3">
            {props.onCancel ? (
              <Button type="button" variant="outline" className="h-12 min-w-28 rounded-lg" onClick={props.onCancel}>
                Cancel
              </Button>
            ) : null}
            <Button
              type="submit"
              disabled={mutation.isPending || clientsQuery.isLoading}
              className="h-12 min-w-40 gap-2 rounded-lg font-bold text-white"
            >
              {isEdit ? <Save className="size-4" /> : <CirclePlus className="size-4" />}
              {mutation.isPending
                ? isEdit ? 'Saving...' : 'Creating...'
                : isEdit ? 'Save Changes' : 'Create Website'}
            </Button>
          </div>
        </div>
      ) : null}
    </form>
  )
}
