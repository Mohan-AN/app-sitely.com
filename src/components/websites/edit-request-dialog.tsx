import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Paperclip, X } from 'lucide-react'
import { useUpdateRequest } from '#/hooks/use-requests'
import { cn } from '#/lib/utils'
import type { WebsiteRequest } from '#/lib/requests-api'

const schema = z.object({
  status:        z.enum(['open', 'in_progress', 'completed', 'wont_fix'] as const),
  deliveredDate: z.string().optional(),
  cost:          z.string().optional(),
  description:   z.string().optional(),
  paymentStatus: z.enum(['not_paid', 'paid'] as const),
  paymentDate:   z.string().optional(),
}).superRefine((d, ctx) => {
  if (d.paymentStatus === 'paid' && !d.paymentDate?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Payment date is required when paid', path: ['paymentDate'] })
  }
})

type FormValues = z.infer<typeof schema>

const sel = (hasError?: boolean) =>
  cn(
    'h-8 w-full rounded-[7px] border px-2.5 text-[12px] outline-none transition',
    hasError ? 'border-[#DC2626]' : 'border-[#E5E7EB] focus:border-[#4F5DF5]',
  )

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[10.5px] font-semibold text-[#5C6270]">
        {label}{required && <span className="ml-0.5 text-[#DC2626]">*</span>}
      </label>
      {children}
      {error && <p className="text-[10.5px] font-semibold text-[#DC2626]">{error}</p>}
    </div>
  )
}

interface Props {
  websiteId: string
  request: WebsiteRequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditRequestDialog({ websiteId, request, open, onOpenChange }: Props) {
  const mutation = useUpdateRequest(websiteId)
  const fileRef  = useRef<HTMLInputElement>(null)
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)

  const isFeature = request.type === 'feature'

  const resetValues = {
    status:        request.status,
    deliveredDate: request.delivered_date ?? '',
    cost:          request.cost ?? '',
    description:   request.description ?? '',
    paymentStatus: (request.payment_status as 'not_paid' | 'paid') ?? 'not_paid',
    paymentDate:   request.payment_date ?? '',
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: resetValues,
  })

  useEffect(() => {
    form.reset(resetValues)
    setInvoiceFile(null)
  // Reset whenever any server field changes, not just the ID
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    request.request_id,
    request.status,
    request.cost,
    request.description,
    request.payment_status,
    request.payment_date,
    request.delivered_date,
  ])

  if (!open) return null

  const handleClose = () => {
    form.reset()
    setInvoiceFile(null)
    mutation.reset()
    onOpenChange(false)
  }

  const watchedPaymentStatus = form.watch('paymentStatus')

  const submit = form.handleSubmit((values) => {
    mutation.mutate(
      {
        requestId: request.request_id,
        input: {
          description:   values.description || null,
          status:        values.status,
          deliveredDate: values.deliveredDate || null,
          cost:          values.cost || null,
          paymentStatus: values.paymentStatus,
          paymentDate:   values.paymentDate || null,
          invoiceFile:   invoiceFile ?? undefined,
        },
      },
      { onSuccess: handleClose },
    )
  })

  const typeBadge = request.type === 'bug'
    ? { label: 'Bug',     cls: 'bg-[#FEF2F2] text-[#DC2626]' }
    : { label: 'Feature', cls: 'bg-[#EEF2FF] text-[#4F5DF5]' }

  const existingInvoice = request.invoice_file_name
    ? { name: request.invoice_file_name, url: request.invoice_file_url }
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="relative flex w-full max-w-[520px] max-h-[90vh] flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]">

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]"
        >
          <X className="size-4" />
        </button>

        <div className="border-b border-[#E5E7EB] px-5 py-2.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[14px] font-bold text-[#11141A]">Edit Request</h2>
            <span className={cn('rounded-[6px] px-2.5 py-0.5 text-[11.5px] font-bold uppercase', typeBadge.cls)}>
              {typeBadge.label}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-[#8A8F98]">
            Feature cost is counted in annual profit only after payment is received.
          </p>
        </div>

        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col gap-[9px] overflow-y-auto px-4 py-3">

          {/* Status + Feature Cost in one row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status" required>
              <select {...form.register('status')} className={sel()}>
                <option value="open">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="wont_fix">Won&apos;t Fix</option>
              </select>
            </Field>
            <Field label="Feature Cost" required={isFeature} error={isFeature ? form.formState.errors.cost?.message : undefined}>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[12px] text-[#8A8F98]">₹</span>
                <input {...form.register('cost')} placeholder={isFeature ? '0' : '—'} disabled={!isFeature} className={cn(sel(isFeature && !!form.formState.errors.cost), 'pl-6', !isFeature && 'cursor-not-allowed bg-[#FAFBFC] text-[#C7CAD1]')} />
              </div>
            </Field>
          </div>

          <Field label="Title">
            <input
              value={request.title}
              readOnly
              disabled
              className={cn(sel(), 'cursor-not-allowed bg-[#FAFBFC] text-[#9CA3AF]')}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Requested Date">
              <input
                value={request.requested_date ?? ''}
                readOnly
                disabled
                placeholder="—"
                className={cn(sel(), 'cursor-not-allowed bg-[#FAFBFC] text-[#9CA3AF]')}
              />
            </Field>
            <Field label="Delivered Date">
              <input type="date" {...form.register('deliveredDate')} onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()} className={sel()} />
            </Field>
          </div>

          <Field label="Details" error={form.formState.errors.description?.message}>
            <textarea
              {...form.register('description')}
              rows={2}
              className={cn('w-full resize-none rounded-[7px] border px-2.5 py-1.5 text-[12px] outline-none transition', form.formState.errors.description ? 'border-[#DC2626]' : 'border-[#E5E7EB] focus:border-[#4F5DF5]')}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3 rounded-[9px] border border-[#E5E7EB] px-2.5 py-2">
            <Field label="Payment Status">
              <select {...form.register('paymentStatus')} className={sel()}>
                <option value="not_paid">Not Paid</option>
                <option value="paid">Paid</option>
              </select>
            </Field>
            <Field label="Payment Date" required={watchedPaymentStatus === 'paid'} error={form.formState.errors.paymentDate?.message}>
              <input
                type="date"
                {...form.register('paymentDate')}
                disabled={watchedPaymentStatus !== 'paid'}
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
                className={cn(sel(watchedPaymentStatus === 'paid' && !!form.formState.errors.paymentDate), watchedPaymentStatus !== 'paid' && 'cursor-not-allowed bg-[#FAFBFC] text-[#C7CAD1]')}
              />
            </Field>
          </div>

          <Field label="Feature Invoice">
            <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => setInvoiceFile(e.target.files?.[0] ?? null)} />
            {invoiceFile ? (
              <div className="flex items-center gap-2 rounded-[7px] border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-1.5">
                <Paperclip className="size-3.5 shrink-0 text-[#059669]" />
                <span className="flex-1 truncate text-[12px] font-semibold text-[#059669]">{invoiceFile.name}</span>
                <button type="button" onClick={() => { setInvoiceFile(null); if (fileRef.current) fileRef.current.value = '' }} className="text-[#059669] hover:text-[#178a50]"><X className="size-3.5" /></button>
              </div>
            ) : existingInvoice ? (
              <div className="flex items-center gap-2 rounded-[7px] border border-[#DBEAFE] bg-[#EFF6FF] px-2.5 py-1.5">
                <Paperclip className="size-3.5 shrink-0 text-[#3B82F6]" />
                {existingInvoice.url
                  ? <a href={existingInvoice.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-[12px] font-semibold text-[#3B82F6] underline underline-offset-2">{existingInvoice.name}</a>
                  : <span className="flex-1 truncate text-[12px] font-semibold text-[#3B82F6]">{existingInvoice.name}</span>
                }
                <button type="button" onClick={() => fileRef.current?.click()} className="text-[11px] font-semibold text-[#6B7280] underline hover:text-[#374151]">Replace</button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="flex h-8 w-full items-center justify-center rounded-[7px] border border-dashed border-[#C7CAD1] bg-[#FAFBFC] text-[12px] font-semibold text-[#4F5DF5] transition hover:border-[#4F5DF5] hover:bg-[#F4F5FF]">
                Click to upload feature invoice
              </button>
            )}
          </Field>

          {mutation.isError && (
            <p className="text-[12px] font-semibold text-[#DC2626]">{(mutation.error as Error).message}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-0.5">
            <button type="button" onClick={handleClose} className="h-8 rounded-[8px] border border-[#E5E7EB] px-4 text-[12px] font-semibold text-[#5C6270] transition hover:bg-[#F4F5F7]">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="h-8 rounded-[8px] bg-[#4F5DF5] px-4 text-[12px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-60">
              {mutation.isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
