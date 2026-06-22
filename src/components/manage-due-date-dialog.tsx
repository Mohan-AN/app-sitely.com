import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useSettings, useUpdateRenewalWindowDays } from '#/hooks/use-settings'
import { ApiError } from '#/lib/api'

interface ManageDueDateDialogProps {
  open: boolean
  onClose: () => void
}


export function ManageDueDateDialog({ open, onClose }: ManageDueDateDialogProps) {
  const { data: settings, isLoading } = useSettings()
  const currentDays = settings ? parseInt(settings.renewal_window_days, 10) : null

  if (!open) return null
  if (isLoading || currentDays === null) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
        <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white p-6 shadow-xl dark:border-[#2f4a32] dark:bg-[#101912]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354]">
              <CalendarClock className="size-5" />
            </div>
            <div className="h-4 w-40 animate-pulse rounded bg-[#e5ebe2] dark:bg-[#2f4a32]" />
          </div>
        </div>
      </>
    )
  }

  return <DueSoonDialog currentDays={currentDays} onClose={onClose} />
}

function DueSoonDialog({ currentDays, onClose }: { currentDays: number; onClose: () => void }) {
  const [value, setValue] = useState(String(currentDays))
  const [error, setError] = useState<string | undefined>()
  const mutation = useUpdateRenewalWindowDays()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Reset value when currentDays changes (e.g. after a successful save elsewhere)
  useEffect(() => { setValue(String(currentDays)) }, [currentDays])

  const parsed = parseInt(value, 10)
  const isValid = !isNaN(parsed) && parsed >= 1 && parsed <= 365

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) { setError('Enter a number between 1 and 365.'); return }
    setError(undefined)
    mutation.mutate(parsed, {
      onSuccess: () => onClose(),
      onError: (err) => {
        const apiErr = err as ApiError
        setError(apiErr.message ?? 'Failed to update. Please try again.')
      },
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="duesoon-dialog-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white p-6 shadow-xl dark:border-[#2f4a32] dark:bg-[#101912]"
      >
        <div className="mb-5">
          <h2 id="duesoon-dialog-title" className="text-[17px] font-extrabold text-[#102315] dark:text-[#edf7ee]">
            Edit Due Soon window
          </h2>
          <p className="mt-1 text-[13px] text-[#64745F] dark:text-[#9fb49b]">
            Set how many days ahead counts as "Due Soon" for maintenance renewals.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="renewal-days" className="text-[11px] font-bold uppercase tracking-widest text-[#64745F]">
              Days
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="renewal-days"
                type="number"
                min={1}
                max={365}
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(undefined) }}
                className={`h-11 w-full rounded-xl border-[#c7ddb5] bg-white px-4 text-[15px] font-bold text-[#102015] focus-visible:border-[#658354] focus-visible:ring-[#658354]/20 ${error ? 'border-red-400' : ''}`}
                autoFocus
              />
              <span className="shrink-0 text-[14px] font-semibold text-[#64745F]">days</span>
            </div>
            {error ? <p className="text-[13px] font-semibold text-red-500">{error}</p> : null}
            <p className="text-[12px] text-[#9fb49b]">
              Current value: {currentDays} days &nbsp;·&nbsp; Allowed range: 1–365
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-[#dde5d8] text-[#334155] hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:text-[#d6e8cf]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !isValid || parsed === currentDays}
              className="rounded-xl bg-[#658354] font-bold text-white hover:bg-[#4b6043]"
            >
              {mutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
