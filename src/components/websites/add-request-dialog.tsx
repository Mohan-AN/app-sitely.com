import { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Paperclip, X } from 'lucide-react'
import { useCreateRequest } from '#/hooks/use-requests'
import { cn } from '#/lib/utils'
import type { RequestType } from '#/lib/requests-api'

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  type:          z.enum(['bug', 'feature'] as const),
  status:        z.enum(['open', 'in_progress', 'completed', 'wont_fix'] as const),
  title:         z.string().trim().min(1, 'Title is required').max(200, 'Too long'),
  requestedDate: z.string().trim().min(1, 'Requested date is required'),
  cost:          z.string().optional(),
  description:   z.string().optional(),
  paymentStatus: z.enum(['not_paid', 'paid'] as const),
  paymentDate:   z.string().optional(),
}).superRefine((d, ctx) => {
  if (d.type === 'feature' && !d.cost?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost is required for features', path: ['cost'] })
  }
  if (d.paymentStatus === 'paid' && !d.paymentDate?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Payment date is required when paid', path: ['paymentDate'] })
  }
})

type FormValues = z.infer<typeof schema>

// ── Props ─────────────────────────────────────────────────────────────────────

interface AddRequestDialogProps {
  websiteId: string
  projectName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const sel = (hasError?: boolean) =>
  cn(
    'h-9 w-full rounded-[8px] border px-3 text-[12.5px] outline-none transition',
    hasError ? 'border-[#DC2626]' : 'border-[#E5E7EB] focus:border-[#4F5DF5]',
  )

// ── Component ─────────────────────────────────────────────────────────────────

export function AddRequestDialog({ websiteId, open, onOpenChange }: AddRequestDialogProps) {
  const mutation = useCreateRequest(websiteId)
  const [backdropEl, setBackdropEl] = useState<HTMLDivElement | null>(null)
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      type: 'bug',
      status: 'open',
      title: '',
      requestedDate: '',
      cost: '',
      description: '',
      paymentStatus: 'not_paid',
      paymentDate: '',
    },
  })

  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropEl) onOpenChange(false)
  }

  const handleClose = () => {
    form.reset()
    setInvoiceFile(null)
    onOpenChange(false)
  }

  const submit = form.handleSubmit((values) => {
    mutation.mutate(
      {
        websiteId,
        type: values.type as RequestType,
        title: values.title,
        description: values.description || null,
        status: values.status,
        requestedDate: values.requestedDate || null,
        cost: values.cost || null,
        paymentStatus: values.paymentStatus,
        paymentDate: values.paymentDate || null,
        invoiceFile: invoiceFile ?? null,
      },
      { onSuccess: handleClose },
    )
  })

  const watchedType = form.watch('type')
  const watchedPaymentStatus = form.watch('paymentStatus')
  const isFeature = watchedType === 'feature'

  return (
    <div
      ref={setBackdropEl}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]">

        {/* Close */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-[15px] font-bold text-[#11141A]">Add Bug / Feature Request</h2>
          <p className="mt-0.5 text-[12px] text-[#8A8F98]">
            Feature cost is counted in annual profit only after payment is received.
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3 p-5">

          {/* Request Type + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#5C6270]">
                Request Type <span className="text-[#DC2626]">*</span>
              </label>
              <select {...form.register('type')} className={sel()}>
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#5C6270]">Status</label>
              <select {...form.register('status')} className={sel()}>
                <option value="open">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="wont_fix">Won&apos;t Fix</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#5C6270]">
              Title <span className="text-[#DC2626]">*</span>
            </label>
            <input
              {...form.register('title')}
              placeholder="Brief summary of the request…"
              className={sel(!!form.formState.errors.title)}
            />
            {form.formState.errors.title && (
              <p className="text-[11px] font-semibold text-[#DC2626]">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Requested Date + Feature Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#5C6270]">
                Requested Date <span className="text-[#DC2626]">*</span>
              </label>
              <input type="date" {...form.register('requestedDate')} onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()} className={sel(!!form.formState.errors.requestedDate)} />
              {form.formState.errors.requestedDate && (
                <p className="text-[11px] font-semibold text-[#DC2626]">{form.formState.errors.requestedDate.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#5C6270]">
                Feature Cost {isFeature && <span className="text-[#DC2626]">*</span>}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[12px] text-[#8A8F98]">₹</span>
                <input
                  {...form.register('cost')}
                  placeholder={isFeature ? '0' : '—'}
                  disabled={!isFeature}
                  className={cn(sel(isFeature && !!form.formState.errors.cost), 'pl-7', !isFeature && 'cursor-not-allowed bg-[#FAFBFC] text-[#C7CAD1]')}
                />
              </div>
              {form.formState.errors.cost ? (
                <p className="text-[11px] font-semibold text-[#DC2626]">{form.formState.errors.cost.message}</p>
              ) : (
                <p className="text-[10px] text-[#94A3B8]">Leave blank for bugs — bugs are always free</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#5C6270]">Details</label>
            <textarea
              {...form.register('description')}
              rows={3}
              placeholder="Client requested contact form redesign…"
              className={cn(
                'w-full resize-none rounded-[8px] border px-3 py-2 text-[12.5px] outline-none transition',
                form.formState.errors.description ? 'border-[#DC2626]' : 'border-[#E5E7EB] focus:border-[#4F5DF5]',
              )}
            />
            {form.formState.errors.description && (
              <p className="text-[11px] font-semibold text-[#DC2626]">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Payment Status + Payment Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#5C6270]">Payment Status</label>
              <select {...form.register('paymentStatus')} className={sel()}>
                <option value="not_paid">Not Paid</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#5C6270]">
                Payment Date {watchedPaymentStatus === 'paid' && <span className="text-[#DC2626]">*</span>}
              </label>
              <input
                type="date"
                {...form.register('paymentDate')}
                disabled={watchedPaymentStatus !== 'paid'}
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
                className={cn(sel(watchedPaymentStatus === 'paid' && !!form.formState.errors.paymentDate), watchedPaymentStatus !== 'paid' && 'cursor-not-allowed bg-[#FAFBFC] text-[#C7CAD1]')}
              />
              {form.formState.errors.paymentDate && (
                <p className="text-[11px] font-semibold text-[#DC2626]">{form.formState.errors.paymentDate.message}</p>
              )}
            </div>
          </div>

          {/* Feature Invoice */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#5C6270]">Feature Invoice</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => setInvoiceFile(e.target.files?.[0] ?? null)}
            />
            {invoiceFile ? (
              <div className="flex items-center gap-2 rounded-[8px] border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2.5">
                <Paperclip className="size-3.5 shrink-0 text-[#059669]" />
                <span className="flex-1 truncate text-[12px] font-semibold text-[#059669]">{invoiceFile.name}</span>
                <button
                  type="button"
                  onClick={() => { setInvoiceFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="text-[#059669] hover:text-[#178a50]"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[44px] w-full items-center justify-center rounded-[8px] border border-dashed border-[#C7CAD1] bg-[#FAFBFC] text-[12.5px] font-semibold text-[#4F5DF5] transition hover:border-[#4F5DF5] hover:bg-[#F4F5FF]"
              >
                Click to upload feature invoice
              </button>
            )}
          </div>

          {mutation.isError && (
            <p className="text-[12px] font-semibold text-[#DC2626]">{(mutation.error as Error).message}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="h-9 rounded-[9px] border border-[#E5E7EB] px-5 text-[12.5px] font-semibold text-[#5C6270] transition hover:bg-[#F4F5F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="h-9 rounded-[9px] bg-[#4F5DF5] px-5 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-60"
            >
              {mutation.isPending ? 'Saving…' : 'Save Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
