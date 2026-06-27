import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CheckCircle2, Eye, Loader2, Paperclip, X } from 'lucide-react'
import { useRecordPayment } from '#/hooks/use-billing'
import { useUnpaidBillingPeriods } from '#/hooks/use-websites'
import { useServiceOptions } from '#/hooks/use-service-options'
import { formatCurrency } from '#/lib/format'
import { cn } from '#/lib/utils'

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  amount: z.string().trim().min(1, 'Amount is required').regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
  paymentDate: z.string().trim().min(1, 'Date is required'),
  paymentMode: z.string().trim().min(1, 'Payment mode is required'),
  transactionRef: z.string().optional(),
  remarks: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

// ── Props ─────────────────────────────────────────────────────────────────────

interface RecordPaymentDialogProps {
  websiteId: string
  projectName: string
  hostedDate: string | null
  maintenanceAmount?: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

type Phase = 'form' | 'saving' | 'success'

export function RecordPaymentDialog({
  websiteId,
  projectName,
  hostedDate,
  maintenanceAmount,
  open,
  onOpenChange,
  onSuccess,
}: RecordPaymentDialogProps) {
  const [phase, setPhase] = useState<Phase>('form')
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  const { periods, isLoading: periodsLoading } = useUnpaidBillingPeriods(websiteId, hostedDate)

  // Selected period metadata
  const selectedPeriod = periods.find((p) => p.period_key === selectedPeriodKey)
  const selectedBillingId = selectedPeriod?.billing?.billing_id ?? null
  const existingInvoiceUrl = selectedPeriod?.billing?.invoice_file_url ?? null
  const existingInvoiceName = selectedPeriod?.billing?.invoice_file_name ?? null

  const openPreview = (file: File) => {
    const url = URL.createObjectURL(file)
    if (file.type.startsWith('image/')) {
      setPreviewUrl(url)
    } else {
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    }
  }

  const closePreview = () => {
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null) }
  }

  const mutation = useRecordPayment(websiteId)

  const paymentModesQuery = useServiceOptions('payment_mode')
  const paymentModes = (paymentModesQuery.data ?? []).filter((o) => o.is_active)

  const today = new Date().toLocaleDateString('en-CA')

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      amount: maintenanceAmount ?? '',
      paymentDate: today,
      paymentMode: '',
      transactionRef: '',
      remarks: '',
    },
  })

  // Auto-select first unpaid period when periods load
  useEffect(() => {
    if (periods.length > 0 && !selectedPeriodKey) {
      setSelectedPeriodKey(periods[0].period_key)
    }
  }, [periods, selectedPeriodKey])

  useEffect(() => {
    if (open) {
      setPhase('form')
      setInvoiceFile(null)
      setSelectedPeriodKey('')
      form.reset({
        amount: maintenanceAmount ?? '',
        paymentDate: today,
        paymentMode: '',
        transactionRef: '',
        remarks: '',
      })
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (phase === 'saving') return
    if (e.target === backdropRef.current) onOpenChange(false)
  }

  const submit = form.handleSubmit((values) => {
    if (!selectedBillingId) {
      form.setError('root', { message: 'Please select a billing period.' })
      return
    }
    setPhase('saving')
    mutation.mutate(
      {
        websiteId,
        billingId: selectedBillingId,
        amount: values.amount,
        paymentDate: values.paymentDate,
        paymentMode: values.paymentMode,
        transactionRef: values.transactionRef || null,
        invoiceFile: invoiceFile ?? null,
        remarks: values.remarks || null,
      },
      {
        onSuccess: () => { setPhase('success'); onSuccess?.() },
        onError: () => setPhase('form'),
      },
    )
  })

  const fieldCls = (hasError?: boolean) =>
    cn(
      'h-10 w-full rounded-[9px] border px-3 text-[12.5px] outline-none transition',
      hasError ? 'border-[#DC2626]' : 'border-[#E5E7EB] focus:border-[#4F5DF5]',
    )

  return (
    <>
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]">

        {/* Close */}
        {phase !== 'saving' && (
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]"
          >
            <X className="size-4" />
          </button>
        )}

        {/* Saving */}
        {phase === 'saving' && (
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-14">
            <Loader2 className="size-10 animate-spin text-[#4F5DF5]" />
            <p className="text-[14px] font-semibold text-[#5C6270]">Recording payment…</p>
          </div>
        )}

        {/* Success */}
        {phase === 'success' && (
          <div className="flex flex-col items-center justify-center gap-5 px-8 py-12">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#ECFDF5]">
              <CheckCircle2 className="size-9 text-[#059669]" />
            </span>
            <div className="text-center">
              <p className="text-[17px] font-bold text-[#11141A]">Payment Recorded</p>
              <p className="mt-1 text-[13px] text-[#8A8F98]">
                {formatCurrency(form.getValues('amount'))} recorded for {projectName}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="mt-1 h-10 rounded-[9px] bg-[#059669] px-6 text-[13px] font-semibold text-white transition hover:bg-[#047857]"
            >
              Done
            </button>
          </div>
        )}

        {/* Form */}
        {phase === 'form' && (
          <>
            {/* Header */}
            <div className="border-b border-[#E5E7EB] px-6 py-5">
              <h2 className="text-[16px] font-bold text-[#11141A]">Record Payment Received</h2>
              <p className="mt-0.5 text-[12.5px] text-[#8A8F98]">Mark maintenance payment as paid and attach invoice.</p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4 p-6">

              {/* Website + Billing Period */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#5C6270]">Website</label>
                  <div className={cn(fieldCls(), 'flex items-center bg-[#FAFBFC] text-[#5C6270]')}>
                    {projectName}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#5C6270]">
                    Billing Period <span className="text-[#DC2626]">*</span>
                  </label>
                  {periodsLoading ? (
                    <div className={cn(fieldCls(), 'flex items-center bg-[#FAFBFC] text-[#9CA3AF]')}>
                      Loading periods…
                    </div>
                  ) : periods.length === 0 ? (
                    <div className={cn(fieldCls(), 'flex items-center bg-[#FAFBFC] text-[#059669]')}>
                      All periods paid
                    </div>
                  ) : (
                    <select
                      value={selectedPeriodKey}
                      onChange={(e) => setSelectedPeriodKey(e.target.value)}
                      className={cn(fieldCls(!selectedPeriodKey && periods.length > 0))}
                    >
                      <option value="">Select period</option>
                      {periods.map((p) => (
                        <option key={p.period_key} value={p.period_key}>
                          {p.period_label}
                          {p.billing?.status === 'overdue' ? ' (Overdue)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  {periods.length === 0 && !periodsLoading && (
                    <p className="text-[10.5px] font-semibold text-[#059669]">All periods are already paid</p>
                  )}
                </div>
              </div>

              {/* Amount + Payment Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#5C6270]">
                    Amount Received <span className="text-[#DC2626]">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[12px] text-[#8A8F98]">₹</span>
                    <input
                      {...form.register('amount')}
                      placeholder="0"
                      className={cn(fieldCls(!!form.formState.errors.amount), 'pl-7')}
                    />
                  </div>
                  {form.formState.errors.amount && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626]">{form.formState.errors.amount.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#5C6270]">
                    Payment Date <span className="text-[#DC2626]">*</span>
                  </label>
                  <input
                    type="date"
                    {...form.register('paymentDate')}
                    onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
                    className={fieldCls(!!form.formState.errors.paymentDate)}
                  />
                  {form.formState.errors.paymentDate && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626]">{form.formState.errors.paymentDate.message}</p>
                  )}
                </div>
              </div>

              {/* Payment Mode + Transaction Reference */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#5C6270]">
                    Payment Mode <span className="text-[#DC2626]">*</span>
                  </label>
                  {paymentModesQuery.isLoading ? (
                    <div className={cn(fieldCls(), 'flex items-center bg-[#FAFBFC] text-[#9CA3AF]')}>Loading modes…</div>
                  ) : paymentModes.length > 0 ? (
                    <select
                      {...form.register('paymentMode')}
                      className={fieldCls(!!form.formState.errors.paymentMode)}
                    >
                      <option value="">Select mode</option>
                      {paymentModes.map((m) => (
                        <option key={m.option_id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...form.register('paymentMode')}
                      placeholder="e.g. Bank Transfer"
                      className={fieldCls(!!form.formState.errors.paymentMode)}
                    />
                  )}
                  {form.formState.errors.paymentMode && (
                    <p className="text-[11.5px] font-semibold text-[#DC2626]">{form.formState.errors.paymentMode.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#5C6270]">Transaction Reference</label>
                  <input
                    {...form.register('transactionRef')}
                    placeholder="e.g. UPI2026061812"
                    className={fieldCls()}
                  />
                </div>
              </div>

              {/* Invoice Attachment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11.5px] font-semibold text-[#5C6270]">Invoice Attachment</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null
                    if (f && f.size > 5 * 1024 * 1024) {
                      alert('File is too large. Maximum size is 5 MB.')
                      e.target.value = ''
                      return
                    }
                    setInvoiceFile(f)
                    if (e.target) e.target.value = ''
                  }}
                />
                {invoiceFile ? (
                  <div className="flex items-center gap-2 rounded-[9px] border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3">
                    <Paperclip className="size-4 shrink-0 text-[#059669]" />
                    <span className="flex-1 truncate text-[12.5px] font-semibold text-[#059669]">{invoiceFile.name}</span>
                    <button
                      type="button"
                      onClick={() => openPreview(invoiceFile)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#059669] hover:text-[#047857]"
                    >
                      <Eye className="size-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setInvoiceFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      className="text-[#059669] hover:text-[#047857]"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : existingInvoiceName ? (
                  <div className="flex items-center gap-2 rounded-[9px] border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-3">
                    <Paperclip className="size-4 shrink-0 text-[#3B82F6]" />
                    {existingInvoiceUrl
                      ? <a href={existingInvoiceUrl} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-[12.5px] font-semibold text-[#3B82F6] underline underline-offset-2">{existingInvoiceName}</a>
                      : <span className="flex-1 truncate text-[12.5px] font-semibold text-[#3B82F6]">{existingInvoiceName}</span>
                    }
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 text-[11px] font-semibold text-[#6B7280] underline hover:text-[#374151]"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[52px] w-full items-center justify-center rounded-[9px] border border-dashed border-[#C7CAD1] bg-[#FAFBFC] text-[12.5px] font-semibold text-[#4F5DF5] transition hover:border-[#4F5DF5] hover:bg-[#F4F5FF]"
                  >
                    Click to upload invoice PDF/image
                  </button>
                )}
              </div>

              {/* Remarks */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11.5px] font-semibold text-[#5C6270]">Remarks</label>
                <textarea
                  {...form.register('remarks')}
                  rows={2}
                  placeholder="Payment notes..."
                  className="w-full resize-none rounded-[9px] border border-[#E5E7EB] px-3 py-2.5 text-[12.5px] outline-none focus:border-[#4F5DF5]"
                />
              </div>

              {(mutation.isError || form.formState.errors.root) && (
                <p className="text-[12px] font-semibold text-[#DC2626]">
                  {form.formState.errors.root?.message
                    ?? (mutation.error instanceof Error ? mutation.error.message : 'Something went wrong.')}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="h-10 rounded-[9px] border border-[#E5E7EB] px-5 text-[12.5px] font-semibold text-[#5C6270] transition hover:bg-[#F4F5F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={periods.length === 0 && !periodsLoading}
                  className="h-10 rounded-[9px] bg-[#059669] px-5 text-[12.5px] font-semibold text-white transition hover:bg-[#047857] disabled:opacity-50"
                >
                  Mark as Paid
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>

    {/* Image preview overlay */}
    {previewUrl && (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[3px]"
        onClick={closePreview}
      >
        <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={closePreview}
            className="absolute -right-3 -top-3 flex size-7 items-center justify-center rounded-full bg-white text-[#374151] shadow-md hover:bg-[#F4F5F7]"
          >
            <X className="size-4" />
          </button>
          <img
            src={previewUrl}
            alt="Invoice preview"
            className="max-h-[85vh] max-w-[85vw] rounded-[10px] object-contain shadow-2xl"
          />
        </div>
      </div>
    )}
    </>
  )
}
