import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2, RefreshCw } from 'lucide-react'
import { useRenewDomain } from '#/hooks/use-websites'
import { formatDate } from '#/lib/format'
import { cn } from '#/lib/utils'
import type { Website } from './types'

const schema = z.object({
  newRenewalDate: z.string().min(1, 'Renewal date is required'),
  domainCost: z.string().optional(),
  verifiedOn: z.string().min(1, 'Verified date is required'),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>
type Phase = 'form' | 'saving'

function addOneYear(dateStr: string): string {
  const d = new Date(dateStr)
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().split('T')[0]
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function dayDiff(dateStr: string): number {
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const due = new Date(dateStr); due.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
}

interface RenewDomainDialogProps {
  website: Website
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RenewDomainDialog({ website, open, onOpenChange, onSuccess }: RenewDomainDialogProps) {
  const [phase, setPhase] = useState<Phase>('form')
  const [renewedBy, setRenewedBy] = useState<'we' | 'client'>('we')
  const backdropRef = useRef<HTMLDivElement>(null)

  const renewMutation = useRenewDomain(String(website.id))

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (!open) return
    setPhase('form')
    setRenewedBy(website.domain_handled_by === 'client_side' ? 'client' : 'we')
    reset({
      newRenewalDate: website.domain_renewal_date ? addOneYear(website.domain_renewal_date) : todayStr(),
      domainCost: website.domain_cost ?? '',
      verifiedOn: todayStr(),
      notes: '',
    })
  }, [open, website, reset])

  function onSubmit(values: FormValues) {
    setPhase('saving')
    renewMutation.mutate(
      {
        domainRenewalDate: values.newRenewalDate,
        domainCost: values.domainCost || null,
        domainLastVerified: values.verifiedOn,
        domainHandledBy: renewedBy === 'we' ? 'our_side' : 'client_side',
        domainRemarks: values.notes || undefined,
      },
      {
        onSuccess: () => {
          setPhase('form')
          onSuccess?.()
          onOpenChange(false)
        },
        onError: () => setPhase('form'),
      },
    )
  }

  if (!open) return null

  const diff = website.domain_renewal_date ? dayDiff(website.domain_renewal_date) : null
  const overdueLine =
    diff !== null && diff < 0 ? ` · overdue ${Math.abs(diff)} days` :
    diff !== null && diff >= 0 && diff <= 30 ? ` · due in ${diff} days` : ''

  const fieldCls = (hasErr?: boolean) =>
    cn(
      'w-full rounded-[8px] border px-3 py-2 text-[13px] text-[#11141A] outline-none transition',
      'focus:border-[#4F5DF5] focus:ring-2 focus:ring-[#4F5DF5]/10 placeholder:text-[#C7CAD1]',
      hasErr ? 'border-[#EF4444]' : 'border-[#E5E7EB]',
    )

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onOpenChange(false) }}
    >
      <div
        className="w-full max-w-[460px] rounded-[14px] bg-white shadow-[0_20px_60px_rgba(17,20,26,.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-b border-[#EEF0F2] px-5 py-4">
            <div className="font-semibold text-[#11141A]">Renew Domain</div>
            <div className="mt-0.5 text-[12.5px] text-[#8A8F98]">
              {website.project_name}{website.domain_name ? ` · ${website.domain_name}` : ''}
            </div>
            {website.domain_renewal_date && (
              <div className="mt-1 text-[12px] text-[#8A8F98]">
                Current renewal date:{' '}
                <span className={cn('font-medium', diff !== null && diff < 0 ? 'text-[#DC2626]' : 'text-[#3D4250]')}>
                  {formatDate(website.domain_renewal_date)}{overdueLine}
                </span>
              </div>
            )}
          </div>

          <div className="px-5 pt-4">
            <div className="inline-flex rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-0.5">
              <button
                type="button"
                className={cn('rounded-[6px] px-4 py-1.5 text-[12.5px] font-medium transition',
                  renewedBy === 'we' ? 'bg-white text-[#11141A] shadow-sm' : 'text-[#8A8F98] hover:text-[#3D4250]')}
                onClick={() => setRenewedBy('we')}
              >
                We renewed it
              </button>
              <button
                type="button"
                className={cn('rounded-[6px] px-4 py-1.5 text-[12.5px] font-medium transition',
                  renewedBy === 'client' ? 'bg-white text-[#11141A] shadow-sm' : 'text-[#8A8F98] hover:text-[#3D4250]')}
                onClick={() => setRenewedBy('client')}
              >
                Client renewed it
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-5 pt-4 pb-5">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#5C6270]">
                New Renewal Date <span className="text-[#DC2626]">*</span>
              </label>
              <input type="date" {...register('newRenewalDate')} className={fieldCls(!!errors.newRenewalDate)} />
              {errors.newRenewalDate
                ? <p className="mt-1 text-[11px] text-[#DC2626]">{errors.newRenewalDate.message}</p>
                : <p className="mt-1 text-[10.5px] text-[#8A8F98]">Auto-filled: current date + 1 year</p>}
            </div>

            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#5C6270]">
                Verified On <span className="text-[#DC2626]">*</span>
              </label>
              <input type="date" {...register('verifiedOn')} className={fieldCls(!!errors.verifiedOn)} />
              {errors.verifiedOn
                ? <p className="mt-1 text-[11px] text-[#DC2626]">{errors.verifiedOn.message}</p>
                : <p className="mt-1 text-[10.5px] text-[#8A8F98]">Date you confirmed renewal</p>}
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-[12px] font-medium text-[#5C6270]">Domain Cost / Year (Rs)</label>
              <input
                type="text"
                {...register('domainCost')}
                placeholder="e.g. 1200"
                className={fieldCls()}
              />
              <p className="mt-1 text-[10.5px] text-[#8A8F98]">Pre-filled from current value - edit if changed</p>
            </div>

            <div className="col-span-2">
              <label className="mb-1 block text-[12px] font-medium text-[#5C6270]">
                Notes <span className="text-[11px] font-normal text-[#8A8F98]">(optional)</span>
              </label>
              <input
                type="text"
                {...register('notes')}
                placeholder='e.g. "auto-renewed via GoDaddy"'
                className={fieldCls()}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#EEF0F2] px-5 py-3.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-[8px] border border-[#E5E7EB] px-4 py-2 text-[13px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={phase === 'saving'}
              className="flex items-center gap-1.5 rounded-[8px] bg-[#4F5DF5] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#3D4DE3] disabled:opacity-60"
            >
              {phase === 'saving'
                ? <Loader2 className="size-3.5 animate-spin" />
                : <RefreshCw className="size-3.5" />}
              Save Renewal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
