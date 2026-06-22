import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarClock, Eye, EyeOff, KeyRound, Pencil, Plus, RefreshCw, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { Input } from '#/components/ui/input'
import { useSettings, useUpdateRenewalWindowDays } from '#/hooks/use-settings'
import { useServiceOptions, useCreateServiceOption, useUpdateServiceOption } from '#/hooks/use-service-options'
import { ApiError, apiFetch } from '#/lib/api'
import type { ServiceOptionCategory, ServiceOption } from '#/lib/service-options-api'

export const Route = createFileRoute('/_protected/settings')({ component: SettingsPage })

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES: Array<{ key: ServiceOptionCategory; label: string; usedIn: string }> = [
  { key: 'build_type',       label: 'Build Type',       usedIn: 'Add / Edit Website' },
  { key: 'hosting_provider', label: 'Hosting Provider', usedIn: 'Add / Edit Website' },
  { key: 'hosting_type',     label: 'Hosting Type',     usedIn: 'Add / Edit Website' },
  { key: 'domain_provider',  label: 'Domain Provider',  usedIn: 'Add / Edit Website' },
  { key: 'payment_mode',     label: 'Payment Mode',     usedIn: 'Record Payment' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

function SettingsPage() {
  const [addModalOpen, setAddModalOpen] = useState(false)

  return (
    <main className="flex flex-1 flex-col gap-8 overflow-y-auto bg-[#F4F5F7] p-8 dark:bg-[#0D0F1A]">
      <div>
        <h1 className="text-[21px] font-bold leading-none tracking-tight text-[#11141A] dark:text-[#E5E7EB]">Settings</h1>
        <p className="mt-1.5 text-[13.5px] text-[#8A8F98]">Manage workspace preferences and service options.</p>
      </div>

      {/* Renewal */}
      <section className="max-w-2xl">
        <SectionLabel>Renewal</SectionLabel>
        <DueSoonCard />
      </section>

      {/* Change Password */}
      <section className="max-w-2xl">
        <SectionLabel>Security</SectionLabel>
        <ChangePasswordCard />
      </section>

      {/* Service Options */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel>Service Options</SectionLabel>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-[9px] bg-[#4F5DF5] px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0]"
          >
            <Plus className="size-3.5" />
            Add Option
          </button>
        </div>
        <ServiceOptionsTable />
      </section>

      {addModalOpen && <AddOptionModal onClose={() => setAddModalOpen(false)} />}
    </main>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#8A8F98]">{children}</p>
  )
}

// ─── Due Soon Card ────────────────────────────────────────────────────────────

// ─── Change Password ──────────────────────────────────────────────────────────

function ChangePasswordCard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  return (
    <>
      <div className="flex items-center justify-between rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(17,20,26,.04)] dark:border-[#1e2244] dark:bg-[#181b2d]">
        <div className="flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-[#D97706] dark:bg-[#451A03]">
            <KeyRound className="size-5" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#11141A] dark:text-[#E5E7EB]">Change Password</p>
            <p className="mt-0.5 text-[13px] text-[#8A8F98]">Update your account password.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12.5px] font-medium text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] dark:border-[#1e2244] dark:text-[#8A8F98] dark:hover:bg-[#1c2045]"
        >
          <Pencil className="size-3.5" />
          Change
        </button>
      </div>
      {dialogOpen && <ChangePasswordDialog onClose={() => setDialogOpen(false)} />}
    </>
  )
}

function ChangePasswordDialog({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; api?: string }>({})
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function validate() {
    const errs: typeof errors = {}
    if (!currentPassword.trim()) errs.currentPassword = 'Current password is required'
    if (!newPassword.trim()) errs.newPassword = 'New password is required'
    else if (newPassword.length < 6) errs.newPassword = 'Must be at least 6 characters'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setIsPending(true)
    try {
      await apiFetch('/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      setSuccess(true)
      setTimeout(onClose, 1200)
    } catch (err) {
      setErrors({ api: (err as ApiError).message ?? 'Failed to change password.' })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-[0_24px_70px_rgba(17,20,26,.18)] dark:border-[#1e2244] dark:bg-[#181b2d]"
      >
        <h2 className="text-[17px] font-bold text-[#11141A] dark:text-[#E5E7EB]">Change Password</h2>
        <p className="mt-1 text-[13px] text-[#8A8F98]">Enter your current password then choose a new one.</p>

        {success ? (
          <p className="mt-5 rounded-[10px] bg-[#ECFDF5] px-4 py-3 text-[13px] font-semibold text-[#059669]">Password changed successfully!</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            {/* Current Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#5C6270]">
                Current Password <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => { setCurrentPassword(e.target.value); setErrors((p) => ({ ...p, currentPassword: undefined })) }}
                  placeholder="Enter current password"
                  className={`h-10 rounded-[9px] pr-10 text-[12.5px] ${errors.currentPassword ? 'border-[#DC2626] focus-visible:border-[#DC2626]' : 'border-[#E5E7EB] focus-visible:border-[#4F5DF5]'}`}
                  autoFocus
                />
                <button type="button" onClick={() => setShowCurrent((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#8A8F98] hover:text-[#5C6270]">
                  {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-[11.5px] font-semibold text-[#DC2626]">{errors.currentPassword}</p>}
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[#5C6270]">
                New Password <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setErrors((p) => ({ ...p, newPassword: undefined })) }}
                  placeholder="Enter new password"
                  className={`h-10 rounded-[9px] pr-10 text-[12.5px] ${errors.newPassword ? 'border-[#DC2626] focus-visible:border-[#DC2626]' : 'border-[#E5E7EB] focus-visible:border-[#4F5DF5]'}`}
                />
                <button type="button" onClick={() => setShowNew((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#8A8F98] hover:text-[#5C6270]">
                  {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.newPassword && <p className="text-[11.5px] font-semibold text-[#DC2626]">{errors.newPassword}</p>}
            </div>

            {errors.api && <p className="text-[12px] font-semibold text-[#DC2626]">{errors.api}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={onClose}
                className="rounded-[9px] border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7] dark:border-[#1e2244]">
                Cancel
              </button>
              <button type="submit" disabled={isPending}
                className="rounded-[9px] bg-[#4F5DF5] px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-50">
                {isPending ? 'Saving…' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

// ─── Due Soon Card ────────────────────────────────────────────────────────────

function DueSoonCard() {
  const { data: settings, isLoading } = useSettings()
  const [dialogOpen, setDialogOpen] = useState(false)
  const currentDays = settings ? parseInt(settings.renewal_window_days, 10) : null

  return (
    <>
      <div className="flex items-center justify-between rounded-[14px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(17,20,26,.04)] dark:border-[#1e2244] dark:bg-[#181b2d]">
        <div className="flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EEEFFE] text-[#4F5DF5] dark:bg-[#1c2045]">
            <CalendarClock className="size-5" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#11141A] dark:text-[#E5E7EB]">Due Soon window</p>
            <p className="mt-0.5 text-[13px] text-[#8A8F98]">
              Websites renewing within this many days appear under <span className="font-semibold text-[#11141A] dark:text-[#E5E7EB]">Due Soon</span>.
            </p>
          </div>
        </div>
        <div className="ml-6 flex shrink-0 items-center gap-3">
          {isLoading ? (
            <div className="h-7 w-16 animate-pulse rounded-lg bg-[#EEF0F2] dark:bg-[#1e2244]" />
          ) : (
            <span className="rounded-lg bg-[#EEEFFE] px-3 py-1 text-[15px] font-extrabold text-[#4F5DF5] dark:bg-[#1c2045] dark:text-[#818CF8]">
              {currentDays ?? '—'} days
            </span>
          )}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12.5px] font-medium text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5] disabled:opacity-50 dark:border-[#1e2244] dark:text-[#8A8F98] dark:hover:bg-[#1c2045]"
          >
            <Pencil className="size-3.5" />
            Edit
          </button>
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
      onError: (err) => setError((err as ApiError).message ?? 'Failed to update.'),
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby="duesoon-dialog-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#E5E7EB] bg-white p-6 shadow-[0_24px_70px_rgba(17,20,26,.18)] dark:border-[#1e2244] dark:bg-[#181b2d]"
      >
        <h2 id="duesoon-dialog-title" className="text-[17px] font-bold text-[#11141A] dark:text-[#E5E7EB]">Edit Due Soon window</h2>
        <p className="mt-1 text-[13px] text-[#8A8F98]">Set how many days ahead counts as "Due Soon" for maintenance renewals.</p>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="renewal-days" className="text-[11px] font-bold uppercase tracking-widest text-[#8A8F98]">Days</label>
            <div className="flex items-center gap-2">
              <Input
                id="renewal-days"
                type="number"
                min={1}
                max={365}
                value={value}
                onChange={(e) => { setValue(e.target.value); setError(undefined) }}
                className={`h-11 w-full rounded-[9px] border-[#E5E7EB] px-4 text-[15px] font-bold focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${error ? 'border-red-400' : ''}`}
                autoFocus
              />
              <span className="shrink-0 text-[14px] font-semibold text-[#8A8F98]">days</span>
            </div>
            {error ? <p className="text-[12px] font-semibold text-[#DC2626]">{error}</p> : null}
            <p className="text-[11.5px] text-[#8A8F98]">Current: {currentDays} days · Range: 1–365</p>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-[9px] border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7] dark:border-[#1e2244] dark:text-[#8A8F98]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !isValid || parsed === currentDays}
              className="rounded-[9px] bg-[#4F5DF5] px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-50"
            >
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// ─── Service Options Table ────────────────────────────────────────────────────

function ServiceOptionsTable() {
  const { data, isLoading, isError, refetch } = useServiceOptions()
  const updateMutation = useUpdateServiceOption()
  const [renameTarget, setRenameTarget] = useState<ServiceOption | null>(null)

  if (isLoading) {
    return (
      <div className="rounded-[14px] border border-[#E5E7EB] bg-white dark:border-[#1e2244] dark:bg-[#181b2d]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-[#EEF0F2] px-5 py-4 last:border-0 dark:border-[#252847]">
            <div className="h-4 w-32 animate-pulse rounded bg-[#EEF0F2] dark:bg-[#1e2244]" />
            <div className="h-4 flex-1 animate-pulse rounded bg-[#EEF0F2] dark:bg-[#1e2244]" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[14px] border border-[#E5E7EB] bg-white py-10 text-center dark:border-[#1e2244] dark:bg-[#181b2d]">
        <p className="text-[13.5px] text-[#8A8F98]">Could not load service options.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 rounded-[9px] border border-[#E5E7EB] px-3 py-1.5 text-[12.5px] font-medium text-[#5C6270] transition hover:border-[#D6D9FC] hover:text-[#4F5DF5]"
        >
          <RefreshCw className="size-3.5" />
          Retry
        </button>
      </div>
    )
  }

  const options = data ?? []

  return (
    <>
      <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(17,20,26,.04)] dark:border-[#1e2244] dark:bg-[#181b2d]">
        {/* Header */}
        <div className="grid grid-cols-[180px_1fr_160px_100px_80px] border-b border-[#E5E7EB] bg-[#FAFBFC] dark:border-[#1e2244] dark:bg-[#131624]">
          {['Category', 'Values', 'Used In', 'Status', 'Actions'].map((h) => (
            <div key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[.03em] text-[#8A8F98]">{h}</div>
          ))}
        </div>

        {CATEGORIES.map((cat) => {
          const catOptions = options.filter((o) => o.category === cat.key)
          const activeOpts = catOptions.filter((o) => o.is_active)
          const inactiveOpts = catOptions.filter((o) => !o.is_active)

          return (
            <div key={cat.key} className="grid grid-cols-[180px_1fr_160px_100px_80px] items-start border-b border-[#EEF0F2] py-4 last:border-0 dark:border-[#252847]">
              {/* Category */}
              <div className="px-5 text-[13px] font-semibold text-[#11141A] dark:text-[#E5E7EB]">{cat.label}</div>

              {/* Values */}
              <div className="px-5 flex flex-wrap gap-1.5">
                {catOptions.length === 0 ? (
                  <span className="text-[12.5px] text-[#C7CAD1]">No options yet</span>
                ) : (
                  catOptions.map((opt) => (
                    <span
                      key={opt.option_id}
                      className={`inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1 text-[11px] font-semibold ${
                        opt.is_active
                          ? 'bg-[#EEEFFE] text-[#4F5DF5] dark:bg-[#1c2045] dark:text-[#818CF8]'
                          : 'bg-[#F3F4F6] text-[#9CA3AF] line-through dark:bg-[#1F2937] dark:text-[#6B7280]'
                      }`}
                    >
                      {opt.name}
                    </span>
                  ))
                )}
              </div>

              {/* Used In */}
              <div className="px-5 text-[12.5px] text-[#8A8F98]">{cat.usedIn}</div>

              {/* Status */}
              <div className="px-5 text-[12.5px]">
                <span className={`font-semibold ${activeOpts.length > 0 ? 'text-[#059669]' : 'text-[#8A8F98]'}`}>
                  {activeOpts.length} active
                </span>
                {inactiveOpts.length > 0 && (
                  <span className="text-[#C7CAD1]">, {inactiveOpts.length} off</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1 px-3">
                {catOptions.map((opt) => (
                  <div key={opt.option_id} className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Rename"
                      onClick={() => setRenameTarget(opt)}
                      className="flex size-6 items-center justify-center rounded-[6px] text-[#8A8F98] transition hover:bg-[#EEEFFE] hover:text-[#4F5DF5]"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      title={opt.is_active ? 'Deactivate' : 'Activate'}
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ option_id: opt.option_id, is_active: !opt.is_active })}
                      className="flex size-6 items-center justify-center rounded-[6px] text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#3D4250]"
                    >
                      {opt.is_active
                        ? <ToggleRight className="size-3.5 text-[#4F5DF5]" />
                        : <ToggleLeft className="size-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {renameTarget && (
        <RenameOptionModal option={renameTarget} onClose={() => setRenameTarget(null)} />
      )}
    </>
  )
}

// ─── Add Option Modal ─────────────────────────────────────────────────────────

function AddOptionModal({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<ServiceOptionCategory>('build_type')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | undefined>()
  const mutation = useCreateServiceOption()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('Name is required.'); return }
    setError(undefined)
    mutation.mutate({ category, name: trimmed }, {
      onSuccess: () => { setName(''); onClose() },
      onError: (err) => {
        const apiErr = err as ApiError
        if (apiErr.code === 'CONFLICT') setError('This value already exists in this category.')
        else setError(apiErr.message ?? 'Failed to add option.')
      },
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby="add-option-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_70px_rgba(17,20,26,.18)] dark:border-[#1e2244] dark:bg-[#181b2d]"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 dark:border-[#1e2244]">
          <div>
            <h2 id="add-option-title" className="text-[16px] font-bold text-[#11141A] dark:text-[#E5E7EB]">Add Service Option</h2>
            <p className="mt-0.5 text-[12px] text-[#8A8F98]">Add a new value to a dropdown category.</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-7 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#8A8F98] transition hover:border-[#FECACA] hover:text-[#DC2626]">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-semibold text-[#5C6270]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceOptionCategory)}
              className="h-10 w-full rounded-[9px] border border-[#E5E7EB] bg-white px-3 text-[12.5px] text-[#11141A] outline-none focus:border-[#4F5DF5] dark:border-[#1e2244] dark:bg-[#131624] dark:text-[#E5E7EB]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-semibold text-[#5C6270]">Value name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(undefined) }}
              placeholder="e.g. Cloudflare Pages"
              className={`h-10 rounded-[9px] border-[#E5E7EB] text-[12.5px] focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${error ? 'border-[#DC2626]' : ''}`}
              autoFocus
            />
            {error ? <p className="text-[12px] font-semibold text-[#DC2626]">{error}</p> : null}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-[9px] border border-[#E5E7EB] px-4 py-2 text-[12.5px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7] dark:border-[#1e2244]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="rounded-[9px] bg-[#4F5DF5] px-4 py-2 text-[12.5px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-50"
            >
              {mutation.isPending ? 'Adding...' : 'Add Option'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// ─── Rename Option Modal ──────────────────────────────────────────────────────

function RenameOptionModal({ option, onClose }: { option: ServiceOption; onClose: () => void }) {
  const [name, setName] = useState(option.name)
  const [error, setError] = useState<string | undefined>()
  const mutation = useUpdateServiceOption()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('Name is required.'); return }
    if (trimmed === option.name) { onClose(); return }
    setError(undefined)
    mutation.mutate({ option_id: option.option_id, name: trimmed }, {
      onSuccess: () => onClose(),
      onError: (err) => {
        const apiErr = err as ApiError
        if (apiErr.code === 'CONFLICT') setError('This value already exists in this category.')
        else setError(apiErr.message ?? 'Failed to rename.')
      },
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-[#E5E7EB] bg-white p-5 shadow-[0_24px_70px_rgba(17,20,26,.18)] dark:border-[#1e2244] dark:bg-[#181b2d]"
      >
        <h2 className="mb-4 text-[15px] font-bold text-[#11141A] dark:text-[#E5E7EB]">Rename Option</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(undefined) }}
            className={`h-10 rounded-[9px] border-[#E5E7EB] text-[12.5px] focus-visible:border-[#4F5DF5] focus-visible:ring-[#D6D9FC] ${error ? 'border-[#DC2626]' : ''}`}
            autoFocus
          />
          {error ? <p className="text-[12px] font-semibold text-[#DC2626]">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-[9px] border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-medium text-[#5C6270] transition hover:bg-[#F4F5F7] dark:border-[#1e2244]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="rounded-[9px] bg-[#4F5DF5] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#3F4DE0] disabled:opacity-50"
            >
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
