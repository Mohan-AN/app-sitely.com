import { useState, useMemo, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Check, ChevronRight, Trash2 } from 'lucide-react'
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
const requiredDate = (msg: string) => z.string().trim().min(1, msg).refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Must be YYYY-MM-DD')

const wizardSchema = z.object({
  clientId:            z.string().min(1, 'Client is required'),
  projectName:         z.string().trim().min(1, 'Project name is required').max(150, 'Too long'),
  url:                 optionalUrl,
  siteType:            z.string().optional(),
  platform:            z.string().optional(),
  buildType:           z.string().trim().min(1, 'Build type is required'),
  hostingProvider:     optionalStr,
  buildCost:           optionalAmt,
  websiteStatus:       z.string().optional(),
  maintenanceStatus:   z.string().optional(),
  domainName:          optionalStr,
  domainHandledBy:     z.enum(['our_side', 'client_side']).nullable().optional(),
  domainProvider:      optionalStr,
  domainRenewalDate:   optionalDate,
  domainCost:          optionalAmt,
  hostingCost:         optionalAmt,
  hostingRenewalDate:  optionalDate,
  startDate:           requiredDate('Start date is required'),
  completedDate:       optionalDate,
  hostedDate:          optionalDate,
  billingCycle:        z.enum(['monthly', 'yearly']).nullable().optional(),
  maintenanceAmount:   optionalAmt,
  lastInvoiceSent:     optionalDate,
  lastPaymentReceived: optionalDate,
  lastPaymentAmount:   optionalAmt,
  renewalDate:         optionalDate,
  remarks:             z.string().optional(),
}).refine(
  (d) => { const hasAmt = !!d.lastPaymentAmount; const hasDate = !!d.lastPaymentReceived; return hasAmt === hasDate },
  { message: 'Payment amount and date must be recorded together', path: ['lastPaymentAmount'] },
)

type WizardFormValues = z.infer<typeof wizardSchema>

// ─── Props ────────────────────────────────────────────────────────────────────

type WebsiteWizardProps =
  | { mode?: 'create'; formId?: string; initialClientId?: string; cancelHref?: string; onCreated: (w: Website) => void; onDelete?: never; isDeleting?: never }
  | { mode: 'edit'; formId?: string; website: WebsiteDetail; cancelHref?: string; onUpdated: (w: Website) => void; onDelete?: () => void; isDeleting?: boolean }

// ─── Constants ────────────────────────────────────────────────────────────────

const WEBSITE_STATUSES     = ['In Progress', 'Live', 'On Hold', 'Completed', 'Discontinued']
const MAINTENANCE_STATUSES = ['Not Started', 'Active', 'Paused', 'Overdue', 'Cancelled', 'Due Soon']

const DOT_COLORS: Record<string, string> = {
  'In Progress': 'bg-[#F59E0B]', Live: 'bg-[#10B981]', 'On Hold': 'bg-[#9CA3AF]',
  Completed: 'bg-[#3B82F6]', Discontinued: 'bg-[#9CA3AF]', 'Not Started': 'bg-[#9CA3AF]',
  Active: 'bg-[#10B981]', Paused: 'bg-[#9CA3AF]', Expired: 'bg-[#EF4444]', Cancelled: 'bg-[#9CA3AF]',
}

const STEP_META = [
  { label: 'Basics',          sub: 'Client & project' },
  { label: 'Domain & Hosting', sub: 'Ownership & costs' },
  { label: 'Dates & Billing', sub: 'Timeline & cycle' },
  { label: 'Review',          sub: 'Confirm & save' },
]

const STEP_REQUIRED_FIELDS: Record<number, (keyof WizardFormValues)[]> = {
  1: ['clientId', 'projectName', 'buildType'],
  2: [],
  3: ['startDate'],
  4: [],
}

// Maps backend snake_case field names → { formKey, step }
const FIELD_ERROR_MAP: Record<string, { key: keyof WizardFormValues; step: number }> = {
  project_name:      { key: 'projectName',      step: 1 },
  client_id:         { key: 'clientId',          step: 1 },
  build_type:        { key: 'buildType',         step: 1 },
  url:               { key: 'url',               step: 1 },
  domain_name:       { key: 'domainName',        step: 2 },
  domain_provider:   { key: 'domainProvider',    step: 2 },
  domain_cost:       { key: 'domainCost',        step: 2 },
  hosting_provider:  { key: 'hostingProvider',   step: 1 },
  hosting_cost:      { key: 'hostingCost',       step: 2 },
  start_date:        { key: 'startDate',         step: 3 },
  hosted_date:       { key: 'hostedDate',        step: 3 },
  billing_cycle:     { key: 'billingCycle',      step: 3 },
  maintenance_amount:{ key: 'maintenanceAmount', step: 3 },
  remarks:           { key: 'remarks',           step: 3 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveSiteType(buildType: string | null | undefined): 'static' | 'wordpress' {
  return (buildType ?? '').toLowerCase().includes('wordpress') ? 'wordpress' : 'static'
}

function derivePlatform(hostingProvider: string | null | undefined): 'netlify' | 'wpx' {
  return (hostingProvider ?? '').toLowerCase().includes('wpx') ? 'wpx' : 'netlify'
}

function toCreatePayload(v: WizardFormValues): CreateWebsiteInput {
  return {
    clientId: v.clientId, projectName: v.projectName.trim(),
    url: v.url ?? null,
    siteType: (v.siteType as 'static' | 'wordpress') || deriveSiteType(v.buildType),
    platform: (v.platform as 'netlify' | 'wpx') || derivePlatform(v.hostingProvider),
    startDate: v.startDate ?? null, completedDate: v.completedDate ?? null,
    hostedDate: v.hostedDate ?? null,
    buildCost: v.buildCost || undefined, buildType: v.buildType ?? null,
    hostingProvider: v.hostingProvider ?? null,
    hostingCost: v.hostingCost || undefined, hostingRenewalDate: v.hostingRenewalDate ?? null,
    domainName: v.domainName ?? null, domainHandledBy: v.domainHandledBy ?? null,
    domainProvider: v.domainProvider ?? null, domainRenewalDate: v.domainRenewalDate ?? null,
    domainCost: v.domainCost || undefined, billingCycle: v.billingCycle ?? null,
    maintenanceAmount: v.maintenanceAmount || undefined, remarks: v.remarks?.trim() || null,
  }
}

function toUpdatePayload(v: WizardFormValues): UpdateWebsiteInput {
  return {
    ...toCreatePayload(v),
    websiteStatus: v.websiteStatus, maintenanceStatus: v.maintenanceStatus,
    renewalDate: v.renewalDate ?? null,
    lastPaymentReceived: v.lastPaymentReceived ?? null,
    lastPaymentAmount: v.lastPaymentAmount ?? null,
    lastInvoiceSent: v.lastInvoiceSent ?? null,
  }
}

function toDateValue(raw: string | null | undefined): string {
  if (!raw) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  return raw.split('T')[0] ?? ''
}

function getDefaultValues(website?: WebsiteDetail, initialClientId = ''): WizardFormValues {
  return {
    clientId: website?.client_row_id ? String(website.client_row_id) : initialClientId,
    projectName: website?.project_name ?? '',
    url: website?.url ?? '',
    siteType: website?.site_type?.toLowerCase() ?? '',
    platform: website?.platform?.toLowerCase() ?? '',
    buildType: website?.build_type ?? '',
    hostingProvider: website?.hosting_provider ?? '',
    buildCost: website?.build_cost ?? '',
    websiteStatus: website?.website_status ?? '',
    maintenanceStatus: website?.maintenance_status ?? '',
    domainName: website?.domain_name ?? '',
    domainHandledBy: website?.domain_handled_by ?? null,
    domainProvider: website?.domain_provider ?? '',
    domainRenewalDate: toDateValue(website?.domain_renewal_date),
    domainCost: website?.domain_cost ?? '',
    hostingCost: website?.hosting_cost ?? '',
    hostingRenewalDate: toDateValue(website?.hosting_renewal_date),
    startDate: toDateValue(website?.start_date) || '',
    completedDate: toDateValue(website?.completed_date),
    hostedDate: toDateValue(website?.hosted_date),
    billingCycle: website?.billing_cycle ?? null,
    maintenanceAmount: website?.maintenance_amount ?? '',
    lastInvoiceSent: toDateValue(website?.last_invoice_sent),
    lastPaymentReceived: toDateValue(website?.last_payment_received),
    renewalDate: toDateValue(website?.current_billing_due_date),
    lastPaymentAmount: website?.last_payment_amount ?? '',
    remarks: website?.remarks ?? '',
  }
}

function fmt(value: string | null | undefined): string {
  if (!value) return '—'
  const n = Number(value)
  if (isNaN(n)) return value
  return '₹' + n.toLocaleString('en-IN')
}

function computeDueDates(hostedDate: string, cycle: 'monthly' | 'yearly'): string[] {
  const base = new Date(hostedDate)
  if (isNaN(base.getTime())) return []
  return Array.from({ length: 4 }, (_, i) => {
    const d = new Date(base)
    if (cycle === 'monthly') d.setMonth(d.getMonth() + i)
    else d.setFullYear(d.getFullYear() + i)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  })
}

// ─── UI Primitives ────────────────────────────────────────────────────────────

function Field({ label, required, hint, hintGreen, error, children, className }: {
  label: string; required?: boolean; hint?: string; hintGreen?: boolean; error?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="flex items-center gap-1 text-[12px] font-bold text-[#374151]">
        {label}{required && <span className="text-[#DC2626]">*</span>}
      </label>
      {children}
      {hint && <p className={cn('text-[11.5px] leading-snug', hintGreen ? 'font-bold text-[#16a34a]' : 'text-[#8a94a6]')}>{hint}</p>}
      {error && <p className="text-[11px] font-semibold text-[#DC2626]">{error}</p>}
    </div>
  )
}

function MoneyInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[12px] text-[#6B7280]">₹</span>
      <input
        type="text"
        inputMode="decimal"
        className={cn('h-9 w-full rounded-[9px] border border-[#d9dee8] bg-white pl-7 pr-3 text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#4f5df7] focus:shadow-[0_0_0_3px_rgba(79,93,247,.10)]', className)}
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
      <SelectTrigger className="h-9 w-full rounded-[9px] border-[#d9dee8] text-[13px]">
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

function StdInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn('h-9 w-full rounded-[9px] border border-[#d9dee8] bg-white px-3 text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#4f5df7] focus:shadow-[0_0_0_3px_rgba(79,93,247,.10)]', className)}
      {...props}
    />
  )
}


function OwnerCard({ active, title, desc, onClick }: { active: boolean; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-[12px] border-[1.5px] p-3 text-left transition',
        active ? 'border-[#4f5df7] bg-[#eef0ff]' : 'border-[#d9dee8] hover:border-[#b0b8f0]',
      )}
    >
      <strong className="block text-[13.5px] font-bold text-[#111827]">{title}</strong>
      <p className="mt-1 text-[12px] leading-snug text-[#64748b]">{desc}</p>
    </button>
  )
}

function CycleCard({ active, label, sub, onClick }: { active: boolean; label: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-[12px] border-[1.5px] p-3 text-center transition',
        active ? 'border-[#4f5df7] bg-[#eef0ff]' : 'border-[#d9dee8] hover:border-[#b0b8f0]',
      )}
    >
      <strong className="block text-[13px] font-bold text-[#111827]">{label}</strong>
      <span className="text-[11.5px] text-[#8a94a6]">{sub}</span>
    </button>
  )
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ step, maxReached, onStepClick }: { step: number; maxReached: number; onStepClick: (n: number) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2.5 rounded-[14px] border border-[#e5e7eb] bg-white p-3">
      {STEP_META.map((meta, i) => {
        const n = i + 1
        const isActive   = n === step
        const isDone     = n < step
        const isLocked   = n > maxReached
        return (
          <button
            key={n}
            type="button"
            disabled={isLocked}
            onClick={() => !isLocked && onStepClick(n)}
            className={cn(
              'flex items-center gap-2.5 rounded-[11px] border px-3 py-2.5 text-left transition',
              isActive  ? 'border-[#d9ddff] bg-[#eef0ff]'
              : isLocked ? 'cursor-default border-transparent opacity-40'
              : 'border-transparent hover:bg-[#f9fafb]',
            )}
          >
            <span className={cn(
              'flex size-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px] font-bold',
              isDone    ? 'border-[#16a34a] bg-[#16a34a] text-white'
              : isActive  ? 'border-[#4f5df7] bg-[#4f5df7] text-white'
              : 'border-[#cfd6e6] bg-white text-[#64748b]',
            )}>
              {isDone ? <Check className="size-3.5 stroke-[3]" /> : n}
            </span>
            <span>
              <strong className="block text-[13px] font-bold text-[#111827]">{meta.label}</strong>
              <span className="mt-0.5 block text-[11.5px] text-[#8a94a6]">{meta.sub}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Summary Panel ────────────────────────────────────────────────────────────

function SummaryPanel({ v, clientOptions }: { v: WizardFormValues; clientOptions: ClientOption[] }) {
  const clientName = clientOptions.find((c) => String(c.id) === v.clientId)?.name ?? (v.clientId ? `ID:${v.clientId}` : '—')
  const owner = v.domainHandledBy === 'our_side' ? 'Our side' : v.domainHandledBy === 'client_side' ? 'Client side' : '—'
  const cycle = v.billingCycle === 'monthly' ? 'Monthly' : v.billingCycle === 'yearly' ? 'Yearly' : '—'
  const maintenance = v.maintenanceAmount
    ? fmt(v.maintenanceAmount) + (v.billingCycle === 'yearly' ? ' / yr' : ' / mo')
    : '—'
  const profitRule = v.domainHandledBy === 'our_side'
    ? 'Domain + hosting costs deducted.'
    : v.domainHandledBy === 'client_side'
    ? 'Only hosting cost deducted. Domain is client side.'
    : 'Set domain ownership to see rule.'

  const rows: [string, string][] = [
    ['Client',      v.clientId ? clientName : '—'],
    ['Project',     v.projectName || '—'],
    ['Build',       v.buildType || '—'],
    ['Hosting',     v.hostingProvider || '—'],
    ['Domain',      v.domainName || 'Not added'],
    ['Owner',       owner],
    ['Billing',     cycle],
    ['Maintenance', maintenance],
  ]

  return (
    <aside className="flex w-[260px] shrink-0 flex-col overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
      <div className="border-b border-[#e5e7eb] px-4 py-2.5">
        <h3 className="text-[13px] font-bold text-[#111827]">Website Summary</h3>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-0.5">
        {rows.map(([label, val]) => (
          <div key={label} className="flex justify-between gap-3 border-b border-[#eef0f4] py-[7px] last:border-0">
            <span className="text-[11.5px] text-[#8a94a6]">{label}</span>
            <strong className="text-right text-[12px] text-[#111827]">{val}</strong>
          </div>
        ))}
        <div className="mb-2 mt-1.5 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2">
          <p className="mb-0.5 block text-[11px] font-bold uppercase text-[#14532d]">Profit rule</p>
          <p className="text-[11.5px] leading-snug text-[#14532d]">{profitRule}</p>
        </div>
      </div>
    </aside>
  )
}

// ─── Review Box ───────────────────────────────────────────────────────────────

function ReviewBox({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb]">
      <h4 className="border-b border-[#e5e7eb] bg-[#fafbff] px-3 py-2.5 text-[13px] font-bold text-[#111827]">{title}</h4>
      {rows.map(([label, val]) => (
        <div key={label} className="flex justify-between gap-3 border-b border-[#eef0f4] px-3 py-2 last:border-0">
          <span className="text-[11.5px] text-[#8a94a6]">{label}</span>
          <strong className="text-right text-[12px] text-[#111827]">{val}</strong>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WebsiteWizard(props: WebsiteWizardProps) {
  const isEdit = props.mode === 'edit'
  const website = props.mode === 'edit' ? props.website : undefined
  const initialClientId = props.mode !== 'edit' ? (props.initialClientId ?? '') : ''

  const [step, setStep] = useState(1)
  const [maxReached, setMaxReached] = useState(1)

  const clientsQuery  = useClientOptions(undefined)
  const createMutation = useCreateWebsite()
  const updateMutation = useUpdateWebsite(website ? String(website.id) : '')
  const mutation = isEdit ? updateMutation : createMutation

  const form = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema) as any,
    defaultValues: getDefaultValues(website, initialClientId),
    mode: 'onChange',
  })

  useEffect(() => {
    if (website) form.reset(getDefaultValues(website))
  }, [website]) // eslint-disable-line react-hooks/exhaustive-deps

  const clients = clientsQuery.data?.items ?? []
  const buildType      = form.watch('buildType')
  const hostingProvider = form.watch('hostingProvider')
  const domainHandledBy = form.watch('domainHandledBy')
  const hostedDate     = form.watch('hostedDate')
  const billingCycle   = form.watch('billingCycle')
  const vals           = form.watch()

  useEffect(() => { form.setValue('siteType', deriveSiteType(buildType)) }, [buildType])           // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { form.setValue('platform', derivePlatform(hostingProvider)) }, [hostingProvider]) // eslint-disable-line react-hooks/exhaustive-deps

  const clientOptions = useMemo(() => {
    if (!website || !form.watch('clientId') || clients.some((c) => String(c.id) === form.watch('clientId'))) return clients
    const selected: ClientOption = { id: website.client_row_id ?? 0, client_id: website.client_id, name: website.client_name ?? '' }
    return [selected, ...clients]
  }, [clients, website, form.watch('clientId')]) // eslint-disable-line react-hooks/exhaustive-deps

  const dueDates = useMemo(() => {
    if (!hostedDate || !billingCycle) return []
    return computeDueDates(hostedDate, billingCycle)
  }, [hostedDate, billingCycle])

  async function advance() {
    const fields = STEP_REQUIRED_FIELDS[step] as (keyof WizardFormValues)[]

    // Block if any field on this step already has an error showing (e.g. server error from API).
    // mode:'onChange' clears a server error automatically once the user types a valid value.
    const stepFieldKeys = Object.values(FIELD_ERROR_MAP)
      .filter((m) => m.step === step)
      .map((m) => m.key)
    const currentErrors = form.formState.errors
    if (stepFieldKeys.some((f) => !!currentErrors[f])) return

    if (fields.length) {
      const ok = await form.trigger(fields)
      if (!ok) return
    }
    if (step < 4) {
      const next = step + 1
      setStep(next)
      setMaxReached((m) => Math.max(m, next))
    }
  }

  function handleMutationError(err: unknown) {
    const apiErr = err as import('#/lib/api').ApiError
    const fieldErrors = apiErr?.fieldErrors ?? {}
    if (Object.keys(fieldErrors).length > 0) {
      let earliestStep = 4
      for (const [backendKey, msg] of Object.entries(fieldErrors)) {
        const mapping = FIELD_ERROR_MAP[backendKey]
        if (mapping) {
          form.setError(mapping.key, { message: msg })
          if (mapping.step < earliestStep) earliestStep = mapping.step
        }
      }
      setStep(earliestStep)
      setMaxReached((m) => Math.max(m, earliestStep))
    }
  }

  const submit = form.handleSubmit((values) => {
    // Only allow submission from the Review step
    if (step !== 4) return
    if (isEdit) {
      updateMutation.mutate(toUpdatePayload(values), {
        onSuccess: (w) => (props as any).onUpdated(w),
        onError: handleMutationError,
      })
    } else {
      createMutation.mutate(toCreatePayload(values), {
        onSuccess: (w) => (props as any).onCreated(w),
        onError: handleMutationError,
      })
    }
  })

  const e = form.formState.errors

  // ── Step titles ──
  const titles = STEP_META[step - 1]

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex h-full flex-col overflow-hidden bg-[#f4f5f8]">

      {/* Page header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e5e7eb] bg-white px-6">
        <div>
          <h1 className="text-[20px] font-bold leading-tight text-[#111827]">
            {isEdit ? 'Edit Website' : 'Add Website'}
          </h1>
          <p className="mt-1 text-[12.5px] text-[#8a94a6]">
            {isEdit ? 'Update website information and settings.' : 'Step-by-step form to add a new website.'}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {props.cancelHref ? (
            <a
              href={props.cancelHref}
              className="inline-flex h-[34px] items-center rounded-[9px] border border-[#e5e7eb] bg-white px-4 text-[12.5px] font-bold text-[#374151] transition hover:bg-[#f9fafb]"
            >
              Cancel
            </a>
          ) : null}
          {isEdit && props.onDelete && (
            <button
              type="button"
              disabled={props.isDeleting}
              onClick={props.onDelete}
              className="inline-flex h-[34px] items-center gap-1.5 rounded-[9px] border border-[#FECACA] px-4 text-[12.5px] font-semibold text-[#DC2626] transition hover:bg-[#FEF2F2] disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
              {props.isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
          {step < 4 && (
            <button
              type="button"
              onClick={advance}
              className="inline-flex h-[34px] items-center rounded-[9px] bg-[#4f5df7] px-4 text-[12.5px] font-bold text-white transition hover:bg-[#3f4de0]"
            >
              Continue
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden px-6 py-4">

        {/* Stepper */}
        <Stepper step={step} maxReached={maxReached} onStepClick={(n) => {
          if (n <= maxReached) setStep(n)
        }} />

        {/* Work area */}
        <div className="flex min-h-0 flex-1 gap-3.5 overflow-hidden">

          {/* Form card */}
          <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
            <div className="shrink-0 border-b border-[#e5e7eb] px-[18px] py-3">
              <h2 className="text-[16px] font-bold text-[#111827]">{titles.label}</h2>
              <p className="text-[12px] leading-snug text-[#8a94a6]">
                {step === 1 && 'Add the core website information, type, and build details.'}
                {step === 2 && 'Set domain ownership and all cost information.'}
                {step === 3 && 'Set the hosted date and billing cycle so Sitely can generate due dates.'}
                {step === 4 && 'Confirm the details before saving the website.'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-[14px]">

              {/* ── Step 1: Basics ── */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Client" required error={e.clientId?.message}>
                    <Select
                      value={form.watch('clientId') || ''}
                      onValueChange={(v) => v && form.setValue('clientId', v, { shouldDirty: true, shouldValidate: true })}
                    >
                      <SelectTrigger className="h-9 w-full rounded-[9px] border-[#d9dee8] text-[13px]">
                        <SelectValue placeholder={clientsQuery.isLoading ? 'Loading…' : 'Select client'}>
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
                    <StdInput placeholder="e.g. Quill Books" {...form.register('projectName')} />
                  </Field>

                  <Field label="Website URL" error={e.url?.message} className="col-span-2"
                    hint="Optional now. Required before marking the website as Live.">
                    <StdInput placeholder="https://example.com" {...form.register('url')} />
                  </Field>

                  <Field label="Build Type" required error={e.buildType?.message}>
                    <ServiceOptionSelect
                      category="build_type"
                      value={form.watch('buildType') ?? ''}
                      onChange={(v) => form.setValue('buildType', v, { shouldDirty: true, shouldValidate: true })}
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

                  <Field label="Build Cost" error={e.buildCost?.message}>
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
                </div>
              )}

              {/* ── Step 2: Domain & Hosting ── */}
              {step === 2 && (
                <div>
                  <div className="mb-3.5 grid grid-cols-2 gap-3">
                    <OwnerCard
                      active={domainHandledBy === 'our_side'}
                      title="We manage it"
                      desc="Domain cost is deducted from annual profit."
                      onClick={() => form.setValue('domainHandledBy', 'our_side', { shouldDirty: true })}
                    />
                    <OwnerCard
                      active={domainHandledBy === 'client_side'}
                      title="Client manages it"
                      desc="Domain cost is not deducted from annual profit."
                      onClick={() => form.setValue('domainHandledBy', 'client_side', { shouldDirty: true })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Domain Name" error={e.domainName?.message}>
                      <StdInput placeholder="example.com" {...form.register('domainName')} />
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

                    <Field label="Domain Cost / Year" error={e.domainCost?.message}
                      hint="Deducted only when domain is handled by our side." hintGreen>
                      <MoneyInput placeholder="1200" {...form.register('domainCost')} />
                    </Field>

                    <Field label="Domain Renewal Date" error={e.domainRenewalDate?.message}>
                      <Input type="date" className="h-9 rounded-[9px] border-[#d9dee8] text-[13px]" {...form.register('domainRenewalDate')} />
                    </Field>

                    <Field label="Hosting Cost / Year" error={e.hostingCost?.message}
                      hint="Always deducted from annual profit." hintGreen>
                      <MoneyInput placeholder="3000" {...form.register('hostingCost')} />
                    </Field>

                    <Field label="Hosting Renewal Date" error={e.hostingRenewalDate?.message}>
                      <Input type="date" className="h-9 rounded-[9px] border-[#d9dee8] text-[13px]" {...form.register('hostingRenewalDate')} />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── Step 3: Dates & Billing ── */}
              {step === 3 && (
                <div>
                  <div className="mb-3.5 grid grid-cols-3 gap-3.5">
                    <Field label="Start Date" required error={e.startDate?.message} hint="When work on the build began">
                      <Input type="date" className="h-9 rounded-[9px] border-[#d9dee8] text-[13px]" {...form.register('startDate')} />
                    </Field>
                    <Field label="Completed Date" error={e.completedDate?.message} hint="When the build was finished">
                      <Input type="date" className="h-9 rounded-[9px] border-[#d9dee8] text-[13px]" {...form.register('completedDate')} />
                    </Field>
                    <Field label="Hosted Date" error={e.hostedDate?.message} hint="Billing anchor date">
                      <Input type="date" className="h-9 rounded-[9px] border-[#d9dee8] text-[13px]" {...form.register('hostedDate')} />
                    </Field>
                  </div>

                  <div className="mb-3.5 rounded-[10px] border border-[#dbe4ff] bg-[#f5f7ff] px-3 py-2.5 text-[12px] leading-snug text-[#41506b]">
                    Hosted Date decides every future due date. Monthly billing repeats on this date each month.
                  </div>

                  <div className="mb-3.5 grid grid-cols-2 gap-3">
                    <CycleCard active={billingCycle === 'monthly'} label="Monthly" sub="Same day every month"
                      onClick={() => form.setValue('billingCycle', 'monthly', { shouldDirty: true })} />
                    <CycleCard active={billingCycle === 'yearly'} label="Yearly" sub="Same date every year"
                      onClick={() => form.setValue('billingCycle', 'yearly', { shouldDirty: true })} />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <Field label="Maintenance Amount" error={e.maintenanceAmount?.message}>
                      <MoneyInput placeholder="5000" {...form.register('maintenanceAmount')} />
                    </Field>

                    <Field label="Remarks" error={e.remarks?.message}>
                      <textarea
                        rows={2}
                        className="w-full resize-none rounded-[9px] border border-[#d9dee8] bg-white px-3 py-2 text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#4f5df7] focus:shadow-[0_0_0_3px_rgba(79,93,247,.10)]"
                        placeholder="Internal notes..."
                        {...form.register('remarks')}
                      />
                    </Field>

                    {isEdit && (
                      <>
                        <Field label="Renewal Date" error={e.renewalDate?.message}>
                          <Input type="date" className="h-9 rounded-[9px] border-[#d9dee8] text-[13px]" {...form.register('renewalDate')} />
                        </Field>
                        <Field label="Last Invoice Sent" error={e.lastInvoiceSent?.message}>
                          <Input type="date" className="h-9 rounded-[9px] border-[#d9dee8] text-[13px]" {...form.register('lastInvoiceSent')} />
                        </Field>
                        <Field label="Last Payment Date" error={e.lastPaymentReceived?.message}>
                          <Input type="date" className="h-9 rounded-[9px] border-[#d9dee8] text-[13px]" {...form.register('lastPaymentReceived')} />
                        </Field>
                        <Field label="Last Payment Amount" error={e.lastPaymentAmount?.message}>
                          <MoneyInput placeholder="0" {...form.register('lastPaymentAmount')} />
                        </Field>
                      </>
                    )}
                  </div>

                  {dueDates.length > 0 && (
                    <div className="mt-3.5 rounded-[9px] border border-[#d9ddff] bg-[#eef0ff] px-3 py-2.5">
                      <p className="mb-2 text-[11px] font-bold uppercase text-[#4f5df7]">Auto due dates</p>
                      <div className="flex flex-wrap gap-1.5">
                        {dueDates.map((d) => (
                          <span key={d} className="rounded-[6px] border border-[#d9ddff] bg-white px-2 py-0.5 text-[11.5px] font-bold text-[#4f5df7]">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 4: Review ── */}
              {step === 4 && (
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <ReviewBox title="Basics" rows={[
                      ['Client', clientOptions.find((c) => String(c.id) === vals.clientId)?.name || vals.clientId || '—'],
                      ['Project', vals.projectName || '—'],
                      ['Build Type', vals.buildType || '—'],
                      ['Hosting Provider', vals.hostingProvider || '—'],
                    ]} />
                    <ReviewBox title="Domain & Cost" rows={[
                      ['Domain Handling', vals.domainHandledBy === 'our_side' ? 'Our side' : vals.domainHandledBy === 'client_side' ? 'Client side' : '—'],
                      ['Domain', vals.domainName || 'Not added'],
                      ['Domain Cost', vals.domainHandledBy === 'our_side' ? (vals.domainCost ? fmt(vals.domainCost) + ' / yr' : '—') : 'Not deducted'],
                      ['Hosting Cost', vals.hostingCost ? fmt(vals.hostingCost) + ' / yr' : '—'],
                    ]} />
                    <ReviewBox title="Dates & Billing" rows={[
                      ['Start Date', vals.startDate || '—'],
                      ['Hosted Date', vals.hostedDate || 'Not set'],
                      ['Billing Cycle', vals.billingCycle === 'monthly' ? 'Monthly' : vals.billingCycle === 'yearly' ? 'Yearly' : '—'],
                      ['Maintenance', vals.maintenanceAmount ? fmt(vals.maintenanceAmount) + (vals.billingCycle === 'yearly' ? ' / yr' : ' / mo') : '—'],
                    ]} />
                    <ReviewBox title="System Result" rows={[
                      ['Billing Records', vals.hostedDate ? 'Auto generated' : 'Requires hosted date'],
                      ['Domain Tracking', vals.domainName ? 'Enabled' : 'Not set'],
                      ['Hosting Tracking', vals.hostingCost ? 'Enabled' : 'Not set'],
                      ['Profit Rule', vals.domainHandledBy === 'our_side' ? 'Costs deducted' : vals.domainHandledBy === 'client_side' ? 'Hosting only' : '—'],
                    ]} />
                  </div>
                  <div className="mt-3 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2.5 text-[12.5px] leading-snug text-[#14532d]">
                    After saving, Sitely creates the website and generates billing records from the hosted date.
                  </div>
                  {mutation.isError && !Object.keys((mutation.error as any)?.fieldErrors ?? {}).length && (
                    <p className="mt-2 text-[12.5px] font-semibold text-[#DC2626]">{(mutation.error as Error).message}</p>
                  )}
                </div>
              )}

            </div>
          </section>

          {/* Summary */}
          <SummaryPanel v={vals} clientOptions={clientOptions} />
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between rounded-[14px] border border-[#e5e7eb] bg-white px-4 py-3">
          <span className="text-[13px] font-bold text-[#64748b]">Step {step} of 4</span>
          <div className="flex gap-2.5">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="inline-flex h-[34px] items-center rounded-[9px] border border-[#e5e7eb] bg-white px-4 text-[12.5px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-40"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={advance}
                className="inline-flex h-[34px] items-center gap-1.5 rounded-[9px] bg-[#4f5df7] px-4 text-[12.5px] font-bold text-white transition hover:bg-[#3f4de0]"
              >
                Continue <ChevronRight className="size-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={mutation.isPending}
                className="inline-flex h-[34px] items-center rounded-[9px] bg-[#16a34a] px-4 text-[12.5px] font-bold text-white transition hover:bg-[#15803d] disabled:opacity-50"
              >
                {mutation.isPending
                  ? (isEdit ? 'Updating…' : 'Creating…')
                  : (isEdit ? 'Update Website' : 'Create Website')}
              </button>
            )}
          </div>
        </footer>

      </div>
    </form>
  )
}
