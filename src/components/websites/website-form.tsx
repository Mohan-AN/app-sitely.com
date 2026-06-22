import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CalendarDays, CirclePlus, Globe, Save, Trash2 } from 'lucide-react'
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
  handoverDate: optionalDate,
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
    }
  | {
      mode: 'edit'
      website: WebsiteDetail
      onUpdated: (website: Website) => void
      onCancel?: () => void
      onDelete?: () => void
      isDeleting?: boolean
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
const MAINTENANCE_STATUSES = ['Not Started', 'Active', 'Paused', 'Expired', 'Cancelled']
const DOT_COLORS: Record<string, string> = {
  'In Progress': 'bg-amber-500',
  Live: 'bg-emerald-500',
  'On Hold': 'bg-gray-400',
  Completed: 'bg-blue-500',
  Discontinued: 'bg-gray-400',
  'Not Started': 'bg-gray-400',
  Active: 'bg-emerald-500',
  Paused: 'bg-gray-400',
  Expired: 'bg-red-500',
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
    handoverDate: values.handoverDate ?? null,
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
    handoverDate: values.handoverDate ?? null,
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
    handoverDate: toDateValue(website?.handoverDate),
    transferCompleted: website?.transferCompleted ?? false,
    remarks: website?.remarks ?? '',
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#163c25] dark:text-[#85e0a3]">
      {children}
    </div>
  )
}

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-[#f0f4ee] pb-4 dark:border-[#2f4a32]/60">
      <SectionIcon>{icon}</SectionIcon>
      <div>
        <h2 className="text-base font-extrabold leading-tight text-[#101828] dark:text-[#edf7ee]">{title}</h2>
        <p className="mt-0.5 text-sm text-[#475467] dark:text-[#b7c8b3]">{description}</p>
      </div>
    </div>
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
    <div className="grid gap-1.5">
      <label className="flex items-center gap-1 text-sm font-semibold text-[#101828] dark:text-[#edf7ee]">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
        {info ? (
          <span className="ml-0.5 flex size-4 items-center justify-center rounded-full bg-[#e5ebe2] text-[10px] font-bold text-[#64745F] dark:bg-[#203423] dark:text-[#9fb49b]" title={info}>
            ⓘ
          </span>
        ) : null}
      </label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
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

  return (
    <form onSubmit={submit} className="flex w-full flex-1 flex-col gap-4">

      {/* ── Website Details ── */}
      <div className="rounded-xl border border-[#e5ebe2] bg-white p-6 shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
        <SectionHeader
          icon={<Globe className="size-5" />}
          title="Website Details"
          description={isEdit ? 'Update the basic information about the website.' : 'Basic information about the website project.'}
        />

        {/* Row 1: Client, Project Name, Website URL, Site Type */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Client" required error={form.formState.errors.clientId?.message}>
            <Select
              value={form.watch('clientId') || ''}
              onValueChange={(v) => v && form.setValue('clientId', v, { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger className="w-full">
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
            <Input placeholder="Enter project name" {...form.register('projectName')} />
          </Field>

          <Field label="Website URL" error={form.formState.errors.url?.message}>
            <Input placeholder="https://example.com" {...form.register('url')} />
          </Field>

          <Field label="Site Type" required error={form.formState.errors.siteType?.message}>
            <Select
              value={form.watch('siteType') || ''}
              onValueChange={(v) => form.setValue('siteType', v as WebsiteFormValues['siteType'], { shouldDirty: true })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {SITE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Row 2: Platform, Website Status, Maintenance Status, Service Type */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Platform" required error={form.formState.errors.platform?.message}>
            <Select
              value={form.watch('platform') || ''}
              onValueChange={(v) => form.setValue('platform', v as WebsiteFormValues['platform'], { shouldDirty: true })}
            >
              <SelectTrigger className="w-full">
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
          ) : <div />}

          {isEdit ? (
            <Field label="Maintenance Status" error={form.formState.errors.maintenanceStatus?.message}>
              <StatusSelect
                value={form.watch('maintenanceStatus') ?? ''}
                onChange={(v) => form.setValue('maintenanceStatus', v, { shouldDirty: true })}
                options={MAINTENANCE_STATUSES}
                placeholder="Select status"
              />
            </Field>
          ) : <div />}

        </div>
      </div>

      {/* ── Dates & Notes ── */}
      {true ? (
        <div className="rounded-xl border border-[#e5ebe2] bg-white p-6 shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
          <SectionHeader
            icon={<CalendarDays className="size-5" />}
            title="Dates & Notes"
            description={isEdit ? 'Update important dates and other details.' : 'Add key dates and notes for this website.'}
          />

          {/* Row 1: Start Date, Hosted Date, Handover Date */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Start Date" error={form.formState.errors.startDate?.message}>
              <Input type="date" {...form.register('startDate')} />
            </Field>
            <Field label="Hosted Date" error={form.formState.errors.hostedDate?.message}>
              <Input type="date" {...form.register('hostedDate')} />
            </Field>
            <Field label="Handover Date" error={form.formState.errors.handoverDate?.message}>
              <Input type="date" {...form.register('handoverDate')} />
            </Field>
          </div>

          {/* Row 2: Last Invoice Sent, Last Payment Received, Renewal Date */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Last Invoice Sent" error={form.formState.errors.lastInvoiceSent?.message}>
              <Input type="date" {...form.register('lastInvoiceSent')} />
            </Field>
            <Field label="Last Payment Received" error={form.formState.errors.lastPaymentReceived?.message}>
              <Input type="date" {...form.register('lastPaymentReceived')} />
            </Field>
            <Field label="Renewal Date" error={form.formState.errors.renewalDate?.message}>
              <Input type="date" {...form.register('renewalDate')} />
            </Field>
          </div>

          {/* Row 3: Remarks + Transfer Completed (edit only) */}
          <div className={cn('mt-5 grid gap-5', isEdit ? 'lg:grid-cols-3' : '')}>
            <div className={isEdit ? 'lg:col-span-2' : ''}>
              <Field label="Remarks" error={form.formState.errors.remarks?.message}>
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  placeholder="Enter any notes or remarks (optional)"
                  {...form.register('remarks')}
                />
              </Field>
            </div>
            {isEdit ? (
              <Field
                label="Transfer Completed"
                info="Whether the domain and assets transfer has been finalized."
                error={form.formState.errors.transferCompleted?.message}
              >
                <Select
                  value={form.watch('transferCompleted') ? 'yes' : 'no'}
                  onValueChange={(v) => form.setValue('transferCompleted', v === 'yes', { shouldDirty: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            ) : null}
          </div>
        </div>
      ) : null}

      {mutation.isError ? (
        <p className="text-sm text-destructive">{(mutation.error as Error).message}</p>
      ) : null}

      {/* ── Footer ── */}
      <div className="mt-auto flex shrink-0 items-center justify-between gap-3 py-4">
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
            <Button type="button" variant="outline" className="h-10 min-w-24 rounded-xl" onClick={props.onCancel}>
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={mutation.isPending || clientsQuery.isLoading}
            className="h-10 min-w-36 gap-2 rounded-xl bg-[#658354] font-bold text-white hover:bg-[#4b6043]"
          >
            {isEdit ? <Save className="size-4" /> : <CirclePlus className="size-4" />}
            {mutation.isPending
              ? isEdit ? 'Saving...' : 'Creating...'
              : isEdit ? 'Save Changes' : 'Create Website'}
          </Button>
        </div>
      </div>
    </form>
  )
}
