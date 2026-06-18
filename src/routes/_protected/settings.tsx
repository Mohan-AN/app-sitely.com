import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock, Pencil } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useSettings, useUpdateRenewalWindowDays } from '#/hooks/use-settings'
import { ApiError } from '#/lib/api'

export const Route = createFileRoute('/_protected/settings')({ component: SettingsPage })

function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
      <div>
        <h1 className="text-[22px] font-extrabold leading-none text-[#102315] dark:text-[#edf7ee]">Settings</h1>
        <p className="mt-1.5 text-[14px] text-[#64745F] dark:text-[#9fb49b]">Manage workspace preferences.</p>
      </div>

      <div className="max-w-2xl">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#64745F] dark:text-[#9fb49b]">Renewal</h2>
        <DueSoonCard />
      </div>
    </main>
  )
}

function DueSoonCard() {
  const { data: settings, isLoading } = useSettings()
  const [dialogOpen, setDialogOpen] = useState(false)

  const currentDays = settings ? parseInt(settings.renewal_window_days, 10) : null

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-[#e5ebe2] bg-white px-5 py-4 shadow-sm dark:border-[#2f4a32] dark:bg-[#101912]">
        <div className="flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#163c25] dark:text-[#85e0a3]">
            <CalendarClock className="size-5" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#102315] dark:text-[#edf7ee]">Due Soon window</p>
            <p className="mt-0.5 text-[13px] text-[#64745F] dark:text-[#9fb49b]">
              Websites with active maintenance renewing within this many days are shown under <span className="font-semibold text-[#102315] dark:text-[#edf7ee]">Due Soon</span>.
            </p>
          </div>
        </div>

        <div className="ml-6 flex shrink-0 items-center gap-3">
          {isLoading ? (
            <div className="h-7 w-16 animate-pulse rounded-lg bg-[#e5ebe2] dark:bg-[#2f4a32]" />
          ) : (
            <span className="rounded-lg bg-[#ddead1]/60 px-3 py-1 text-[15px] font-extrabold text-[#658354] dark:bg-[#1a3320] dark:text-[#85e0a3]">
              {currentDays ?? '—'} days
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
            disabled={isLoading}
            className="gap-1.5 rounded-lg border-[#dde5d8] text-[#334155] hover:border-[#c7ddb5] hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:text-[#d6e8cf] dark:hover:bg-[#203423]"
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
        </div>
      </div>

      {dialogOpen && currentDays !== null && (
        <DueSoonDialog currentDays={currentDays} onClose={() => setDialogOpen(false)} />
      )}
    </>
  )
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
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
            <p className="text-[12px] text-[#9fb49b]">Current value: {currentDays} days &nbsp;·&nbsp; Allowed range: 1–365</p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-[#dde5d8] text-[#334155] hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:text-[#d6e8cf]">
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
