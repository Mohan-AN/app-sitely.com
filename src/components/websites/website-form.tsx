import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Save, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { ServiceOptionSelect } from '#/components/ui/service-option-select'
import { useClientOptions, useCreateWebsite, useUpdateWebsite } from '#/hooks/use-websites'
import { cn } from '#/lib/utils'
import type { ClientOption, CreateWebsiteInput, UpdateWebsiteInput, Website, WebsiteDetail } from './types'

// ─── Zod helpers ──────────────────────────────────────────────────────────────

const emptyToNull      = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? null : v)
const emptyToUndefined = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? undefined : v)

const optionalDate = z.preprocess(emptyToUndefined, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional())
const optionalUrl  = z.preprocess(emptyToUndefined, z.string().url('Invalid url').optional())
const optionalStr  = z.preprocess(emptyToNull, z.string().nullable().optional())
const optionalAmt  = z.preprocess(emptyToUndefined, z.string().regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid amount').optional())
// Keep empty string as-is so min(1) fires "Required" instead of Zod's "expected string, received undefined"
const requiredAmt  = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z.string().min(1, 'Required').regex(/^\d+(\.\d{1,2})?$/, 'Must be a valid amount'),
)
const requiredDate = (msg: string) => z.string().trim().min(1, msg).refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Must be YYYY-MM-DD')

const websiteFormSchema = z.object({
  clientId:            z.string().min(1, 'Client is required'),
  projectName:         z.string().trim().min(1, 'Project name is required').max(150, 'Too long'),
  url:                 optionalUrl,
  siteType:            z.string().optional(),
  platform:            z.string().optional(),
  buildType:           optionalStr,
  hostingProvider:     optionalStr,
  buildCost:           requiredAmt,
  websiteStatus:       z.string().optional(),
  maintenanceStatus:   z.string().optional(),
  startDate:           requiredDate('Start date is required'),
  completedDate:       optionalDate,
  hostedDate:          optionalDate,
  lastInvoiceSent:     optionalDate,
  lastPaymentReceived: optionalDate,
  renewalDate:         optionalDate,
  domainName:          optionalStr,
  domainHandledBy:     z.enum(['our_side', 'client_side']).nullable().optional(),
  domainProvider:      optionalStr,
  domainRenewalDate:   optionalDate,
  domainCost:          optionalAmt,
  billingCycle:        z.enum(['monthly', 'yearly']).nullable().optional(),
  maintenanceAmount:   optionalAmt,
  hostingCost:         optionalAmt,
  hostingRenewalDate:  optionalDate,
  lastPaymentAmount:   optionalAmt,
  remarks:             z.string().optional(),
}).refine(
  (d) => {
    const hasAmt  = !!d.lastPaymentAmount
    const hasDate = !!d.lastPaymentReceived
    return hasAmt === hasDate
  },
  { message: 'Payment amount and date must be recorded together', path: ['lastPaymentAmount'] },
)

type WebsiteFormValues = z.infer<typeof websiteFormSchema>

// ─── Props ────────────────────────────────────────────────────────────────────

type WebsiteFormProps =
  | { mode?: 'create'; formId?: string; initialClientId?: string; onCreated: (w: Website) => void; onCancel?: () => void; onDelete?: never; isDeleting?: never }
  | { mode: 'edit';   formId?: string; website: WebsiteDetail; onUpdated: (w: Website) => void; onCancel?: () => void; onDelete?: () => void; isDeleting?: boolean }

// ─── Constants ────────────────────────────────────────────────────────────────

const WEBSITE_STATUSES     = ['In Progress', 'Live', 'On Hold', 'Completed', 'Discontinued']
const MAINTENANCE_STATUSES = ['Not Started', 'Active', 'Paused', 'Overdue', 'Cancelled', 'Due Soon']

const DOT_COLORS: Record<string, string> = {
  'In Progress': 'bg-[#F59E0B]', Live: 'bg-[#10B981]', 'On Hold': 'bg-[#9CA3AF]',
  Completed: 'bg-[#3B82F6]', Discontinued: 'bg-[#9CA3AF]', 'Not Started': 'bg-[#9CA3AF]',
  Active: 'bg-[#10B981]', Paused: 'bg-[#9CA3AF]', Expired: 'bg-[#EF4444]', Cancelled: 'bg-[#9CA3AF]',
}

// ─── Payload builders ─────────────────────────────────────────────────────────

function deriveSiteType(buildType: string | null | undefined): 'static' | 'wordpress' {
  return (buildType ?? '').toLowerCase().includes('wordpress') ? 'wordpress' : 'static'
}

function derivePlatform(hostingProvider: string | null | undefined): 'netlify' | 'wpx' {
  return (hostingProvider ?? '').toLowerCase().includes('wpx') ? 'wpx' : 'netlify'
}

function toCreatePayload(v: WebsiteFormValues): CreateWebsiteInput {
  return {
    clientId: v.clientId, projectName: v.projectName.trim(),
    url: v.url ?? null,
    siteType: (v.siteType as 'static' | 'wordpress') || deriveSiteType(v.buildType),
    platform: (v.platform as 'netlify' | 'wpx') || derivePlatform(v.hostingProvider),
    startDate: v.startDate ?? null, completedDate: v.completedDate ?? null,
    hostedDate: v.hostedDate ?? null,
    buildCost: v.buildCost, buildType: v.buildType ?? null,
    hostingProvider: v.hostingProvider ?? null,
    hostingCost: v.hostingCost || undefined, hostingRenewalDate: v.hostingRenewalDate ?? null,
    domainName: v.domainName ?? null, domainHandledBy: v.domainHandledBy ?? null,
    domainProvider: v.domainProvider ?? null, domainRenewalDate: v.domainRenewalDate ?? null,
    domainCost: v.domainCost || undefined, billingCycle: v.billingCycle ?? null,
    maintenanceAmount: v.maintenanceAmount || undefined, remarks: v.remarks?.trim() || null,
  }
}

function toUpdatePayload(v: WebsiteFormValues): UpdateWebsiteInput {
  return {
    ...toCreatePayload(v),
    websiteStatus: v.websiteStatus, maintenanceStatus: v.maintenanceStatus,
    renewalDate: v.renewalDate ?? null,
    lastPaymentReceived: v.lastPaymentReceived ?? null,
    lastPaymentAmount: v.lastPaymentAmount ?? null,
  }
}

function toDateValue(raw: string | null | undefined): string {
  if (!raw) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  return raw.split('T')[0] ?? ''
}

function getDefaultValues(website?: WebsiteDetail, initialClientId = ''): WebsiteFormValues {
  return {
    clientId: website?.client_row_id ? String(website.client_row_id) : initialClientId,
    projectName: website?.project_name ?? '',
    url: website?.url ?? '',
    siteType: website?.site_type?.toLowerCase() ?? '',
    platform: website?.platform?.toLowerCase() ?? '',
    buildType: website?.build_type ?? '', hostingProvider: website?.hosting_provider ?? '',
    buildCost: website?.build_cost ?? '',
    websiteStatus: website?.website_status ?? '', maintenanceStatus: website?.maintenance_status ?? '',
    startDate: toDateValue(website?.start_date) || '', completedDate: toDateValue(website?.completed_date),
    hostedDate: toDateValue(website?.hosted_date), lastInvoiceSent: toDateValue(website?.last_invoice_sent),
    lastPaymentReceived: toDateValue(website?.last_payment_received),
    renewalDate: toDateValue(website?.current_billing_due_date),
    domainName: website?.domain_name ?? '', domainHandledBy: website?.domain_handled_by ?? null,
    domainProvider: website?.domain_provider ?? '', domainRenewalDate: toDateValue(website?.domain_renewal_date),
    domainCost: website?.domain_cost ?? '', billingCycle: website?.billing_cycle ?? null,
    maintenanceAmount: website?.maintenance_amount ?? '', hostingCost: website?.hosting_cost ?? '',
    hostingRenewalDate: toDateValue(website?.hosting_renewal_date),
    lastPaymentAmount: website?.last_payment_amount ?? '',
    remarks: website?.remarks ?? '',
  }
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Field({ label, required, hint, error, children, className }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn('grid gap-[3px]', className)}>
      <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#374151]">
        {label}
        {required && <span className="text-[#DC2626]">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10.5px] text-[#6B7280]">{hint}</p>}
      {error && <p className="text-[11px] font-semibold text-[#DC2626]">{error}</p>}
    </div>
  )
}

function FormCard({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#D1D5DB] bg-white shadow-[0_1px_4px_rgba(17,20,26,.07)]">
      <div className="border-b border-[#E5E7EB] px-[14px] py-[9px]">
        <h3 className="text-[13px] font-bold text-[#11141A]">{title}</h3>
        {description && <p className="mt-[1px] text-[11px] text-[#6B7280]">{description}</p>}
      </div>
      <div className="grid grid-cols-2 gap-[9px] p-[12px]">
        {children}
      </div>
    </div>
  )
}

function MoneyInput({ placeholder, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { placeholder?: string }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[12px] text-[#6B7280]">₹</span>
      <input
        type="text"
        inputMode="decimal"
        placeholder={placeholder ?? '0'}
        className={cn('h-10 w-full rounded-[9px] border border-[#C9CDD6] bg-white pl-7 pr-3 text-[12.5px] text-[#11141A] outline-none placeholder:text-[#9CA3AF] focus:border-[#4F5DF5]', className)}
        {...props}
      />
    </div>
  )
}

function StatusSelect({ value, onChange, options, placeholder }: {
  value: string | null | undefined; onChange: (v: string) => void; options: string[]; placeholder: string
}) {
  return (
    <Select value={(value ?? '') as string} onValueChange={(v: string | null) => v && onChange(v)}>
      <SelectTrigger className="h-8 w-full rounded-[8px] border-[#C9CDD6] text-[12px]">
        <SelectValue placeholder={placeholder}>
          {value ? (
            <span className="flex items-center gap-2">
              <span className={cn('size-2 rounded-full', DOT_COLORS[value] ?? 'bg-[#8A8F98]')} />
              {value}
            </span>
          ) : <span className="text-[#9CA3AF]">{placeholder}</span>}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((s) => (
          <SelectItem key={s} value={s}>
            <span className="flex items-center gap-2">
              <span className={cn('size-2 rounded-full', DOT_COLORS[s] ?? 'bg-[#8A8F98]')} />
              {s}
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
  const formId = props.formId ?? (isEdit ? 'edit-website-form' : 'new-website-form')

  const clientsQuery = useClientOptions(undefined)
  const createMutation = useCreateWebsite()
  const updateMutation = useUpdateWebsite(website ? String(website.id) : '')
  const mutation = isEdit ? updateMutation : createMutation

  const form = useForm<WebsiteFormValues>({
    resolver: zodResolver(websiteFormSchema) as any,
    defaultValues: getDefaultValues(website, initialClientId),
  })

  useEffect(() => {
    if (website) form.reset(getDefaultValues(website))
  }, [website]) // eslint-disable-line react-hooks/exhaustive-deps

  const clients = clientsQuery.data?.items ?? []
  const buildType = form.watch('buildType')
  const hostingProvider = form.watch('hostingProvider')
  const domainHandledBy = form.watch('domainHandledBy')

  // Auto-derive siteType and platform from buildType / hostingProvider
  useEffect(() => {
    form.setValue('siteType', deriveSiteType(buildType))
  }, [buildType]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    form.setValue('platform', derivePlatform(hostingProvider))
  }, [hostingProvider]) // eslint-disable-line react-hooks/exhaustive-deps

  const clientOptions = useMemo(() => {
    if (!website || !form.watch('clientId') || clients.some((c) => String(c.id) === form.watch('clientId'))) return clients
    const selected: ClientOption = { id: website.client_row_id ?? 0, client_id: website.client_id, name: website.client_name ?? '' }
    return [selected, ...clients]
  }, [clients, website, form.watch('clientId')]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = form.handleSubmit((values: WebsiteFormValues) => {
    if (isEdit) {
      updateMutation.mutate(toUpdatePayload(values), {
        onSuccess: (w) => (props as any).onUpdated(w),
      })
    } else {
      createMutation.mutate(toCreatePayload(values), {
        onSuccess: (w) => (props as any).onCreated(w),
      })
    }
  })

  const e = form.formState.errors

  return (
    <form id={formId} onSubmit={submit} className="flex w-full flex-1 flex-col gap-[12px]">

      {/* ── Row 1: Website Details | Dates ── */}
      <div className="grid grid-cols-1 gap-[12px] xl:grid-cols-2">

        {/* Website Details */}
        <FormCard title="Website Details" description="Main website and type information">
          <Field label="Client" required error={e.clientId?.message}>
            <Select
              value={form.watch('clientId') || ''}
              onValueChange={(v) => v && form.setValue('clientId', v, { shouldDirty: true, shouldValidate: true })}
            >
              <SelectTrigger className="h-8 w-full rounded-[8px] border-[#C9CDD6] text-[12px]">
                <SelectValue placeholder={clientsQuery.isLoading ? 'Loading...' : 'Select client'}>
                  {clientOptions.find((c) => String(c.id) === form.watch('clientId'))?.name ?? null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {clientOptions.map((c) => (
                  <SelectItem key={String(c.id)} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Project Name" required error={e.projectName?.message}>
            <Input placeholder="e.g. Quill Books" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('projectName')} />
          </Field>

          <Field label="Website URL" error={e.url?.message} className="col-span-2"
            hint="Can be added later — required before marking the site Live">
            <Input placeholder="https://example.com" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('url')} />
          </Field>

          <Field label="Build Type" error={e.buildType?.message}>
            <ServiceOptionSelect
              category="build_type"
              value={form.watch('buildType') ?? ''}
              onChange={(v) => form.setValue('buildType', v, { shouldDirty: true })}
              placeholder="Select build type"
            />
          </Field>

          <Field label="Hosting Provider" error={e.hostingProvider?.message}>
            <ServiceOptionSelect
              category="hosting_provider"
              value={form.watch('hostingProvider') ?? ''}
              onChange={(v) => form.setValue('hostingProvider', v, { shouldDirty: true })}
              placeholder="Select provider"
            />
          </Field>

          <Field label="Build Cost" required error={e.buildCost?.message}>
            <MoneyInput placeholder="25000" {...form.register('buildCost')} />
          </Field>

          {isEdit && (
            <>
              <Field label="Website Status" error={e.websiteStatus?.message}>
                <StatusSelect value={form.watch('websiteStatus')} onChange={(v) => form.setValue('websiteStatus', v, { shouldDirty: true })} options={WEBSITE_STATUSES} placeholder="Select status" />
              </Field>
              <Field label="Maintenance Status" error={e.maintenanceStatus?.message}>
                <StatusSelect value={form.watch('maintenanceStatus')} onChange={(v) => form.setValue('maintenanceStatus', v, { shouldDirty: true })} options={MAINTENANCE_STATUSES} placeholder="Select status" />
              </Field>
            </>
          )}
        </FormCard>

        {/* Dates */}
        <FormCard title="Dates" description="Hosted Date anchors all future billing due dates">
          <Field label="Start Date" error={e.startDate?.message} hint="When work on the build began">
            <Input type="date" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('startDate')} />
          </Field>

          <Field label="Completed Date" error={e.completedDate?.message} hint="When the build was finished">
            <Input type="date" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('completedDate')} />
          </Field>

          <Field label="Hosted Date" required={false} error={e.hostedDate?.message} className="col-span-2"
            hint="Anchors every future invoice due date — monthly bills fall on this day each month, yearly on this date each year">
            <Input type="date" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('hostedDate')} />
          </Field>

          {isEdit && (
            <>
              <Field label="Renewal Date" error={e.renewalDate?.message}>
                <Input type="date" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('renewalDate')} />
              </Field>

              <Field label="Last Invoice Sent" error={e.lastInvoiceSent?.message}>
                <Input type="date" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('lastInvoiceSent')} />
              </Field>

              <Field label="Last Payment Date" error={e.lastPaymentReceived?.message}>
                <Input type="date" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('lastPaymentReceived')} />
              </Field>

              <Field label="Last Payment Amount" error={e.lastPaymentAmount?.message}>
                <MoneyInput placeholder="0" {...form.register('lastPaymentAmount')} />
              </Field>

            </>
          )}
        </FormCard>
      </div>

      {/* ── Row 2: Domain Details | Maintenance Billing ── */}
      <div className="grid grid-cols-1 gap-[12px] xl:grid-cols-2">

        {/* Domain Details */}
        <FormCard title="Domain Details" description="Domain is optional at first, but ownership must be clear">
          <Field label="Domain Name" error={e.domainName?.message}>
            <Input placeholder="example.com" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('domainName')} />
          </Field>

          <Field label="Domain Handled By" required error={e.domainHandledBy?.message}>
            <Select
              value={form.watch('domainHandledBy') ?? ''}
              onValueChange={(v) => form.setValue('domainHandledBy', v as 'our_side' | 'client_side', { shouldDirty: true })}
            >
              <SelectTrigger className="h-8 w-full rounded-[8px] border-[#C9CDD6] text-[12px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="our_side">Our Side</SelectItem>
                <SelectItem value="client_side">Client Side</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Domain Provider" error={e.domainProvider?.message}>
            <ServiceOptionSelect
              category="domain_provider"
              value={form.watch('domainProvider') ?? ''}
              onChange={(v) => form.setValue('domainProvider', v, { shouldDirty: true })}
              placeholder="Select provider"
              disabled={domainHandledBy === 'client_side'}
            />
          </Field>

          <Field label="Domain Cost / Year" error={e.domainCost?.message} className="col-span-2"
            hint="Deducted from annual profit only if handled by our side">
            <MoneyInput placeholder="1200" {...form.register('domainCost')} />
          </Field>

          <Field label="Domain Renewal Date" error={e.domainRenewalDate?.message}>
            <Input type="date" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('domainRenewalDate')} />
          </Field>
        </FormCard>

        {/* Right column: Remarks in create mode, Maintenance Billing in edit mode */}
        {!isEdit && (
          <div className="flex flex-col overflow-hidden rounded-[14px] border border-[#D1D5DB] bg-white shadow-[0_1px_4px_rgba(17,20,26,.07)]">
            <div className="border-b border-[#E5E7EB] px-[14px] py-[9px]">
              <h3 className="text-[13px] font-bold text-[#11141A]">Remarks</h3>
              <p className="mt-[1px] text-[11px] text-[#6B7280]">Internal notes about this website</p>
            </div>
            <div className="flex flex-1 flex-col p-[12px]">
              <textarea
                rows={5}
                className="w-full flex-1 resize-none rounded-[8px] border border-[#C9CDD6] bg-transparent px-3 py-2 text-[12px] text-[#11141A] outline-none placeholder:text-[#9CA3AF] focus:border-[#4F5DF5]"
                placeholder="Internal notes..."
                {...form.register('remarks')}
              />
            </div>
          </div>
        )}

        {isEdit && <FormCard title="Maintenance Billing" description="Drives the rolling billing records and renewal reminders">
          <Field label="Billing Cycle" required error={e.billingCycle?.message}>
            <Select
              value={form.watch('billingCycle') ?? ''}
              onValueChange={(v) => form.setValue('billingCycle', v as 'monthly' | 'yearly', { shouldDirty: true })}
            >
              <SelectTrigger className="h-8 w-full rounded-[8px] border-[#C9CDD6] text-[12px]">
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Maintenance Amount" required error={e.maintenanceAmount?.message}>
            <MoneyInput placeholder="5000" {...form.register('maintenanceAmount')} />
          </Field>

          <Field label="Hosting Cost / Year" required error={e.hostingCost?.message} className="col-span-2"
            hint="Always our side — always deducted from annual profit">
            <MoneyInput placeholder="3000" {...form.register('hostingCost')} />
          </Field>

          <Field label="Hosting Renewal Date" error={e.hostingRenewalDate?.message} className="col-span-2">
            <Input type="date" className="h-8 rounded-[8px] border-[#C9CDD6] text-[12px] placeholder:text-[#9CA3AF]" {...form.register('hostingRenewalDate')} />
          </Field>
        </FormCard>}
      </div>

      {/* ── Remarks — full width only in edit mode (create mode shows it in row 2 right column) ── */}
      {isEdit && (
        <div className="overflow-hidden rounded-[14px] border border-[#D1D5DB] bg-white shadow-[0_1px_4px_rgba(17,20,26,.07)]">
          <div className="border-b border-[#E5E7EB] px-[14px] py-[9px]">
            <h3 className="text-[13px] font-bold text-[#11141A]">Remarks</h3>
            <p className="mt-[1px] text-[11px] text-[#6B7280]">Internal notes about this website</p>
          </div>
          <div className="p-[12px]">
            <textarea
              rows={3}
              className="w-full resize-y rounded-[8px] border border-[#C9CDD6] bg-transparent px-3 py-2 text-[12px] text-[#11141A] outline-none placeholder:text-[#9CA3AF] focus:border-[#4F5DF5]"
              placeholder="Internal notes..."
              {...form.register('remarks')}
            />
          </div>
        </div>
      )}

      {mutation.isError && (
        <p className="text-[12.5px] font-semibold text-[#DC2626]">{(mutation.error as Error).message}</p>
      )}

      {/* Footer — only shown in edit mode (new website uses page-bar buttons) */}
      {isEdit && (
        <div className="mt-2 flex shrink-0 items-center justify-between gap-3 pb-4">
          {props.onDelete ? (
            <button
              type="button"
              disabled={props.isDeleting}
              onClick={props.onDelete}
              className="inline-flex items-center gap-2 rounded-[9px] border border-[#FECACA] px-4 py-2 text-[12.5px] font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2] disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              {props.isDeleting ? 'Deleting...' : 'Delete Website'}
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            {props.onCancel && (
              <Button type="button" variant="outline" className="h-9 min-w-24 rounded-[9px] border-[#E5E7EB] text-[12.5px]" onClick={props.onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={mutation.isPending || clientsQuery.isLoading}
              className="h-9 min-w-36 gap-2 rounded-[9px] bg-[#4F5DF5] text-[12.5px] font-semibold text-white hover:bg-[#3F4DE0]"
            >
              <Save className="size-4" />
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
