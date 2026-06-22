import { useState } from 'react'
import { Dialog } from '@base-ui/react'
import { CheckCircle2, CreditCard, Loader2, X, XCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { Input } from '#/components/ui/input'
import { Skeleton } from '#/components/ui/skeleton'
import { useCurrentBillingId, useUpdateWebsite, useWebsite } from '#/hooks/use-websites'
import { useRecordPayment } from '#/hooks/use-billing'
import { cn } from '#/lib/utils'
import type { UpdateWebsiteInput, WebsiteAction } from './types'

interface WebsiteUpdateDialogProps {
  websiteId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WebsiteUpdateDialog({ websiteId, open, onOpenChange }: WebsiteUpdateDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#2f4a32] dark:bg-[#132018]">
          <UpdateDialogContent websiteId={websiteId} onClose={() => onOpenChange(false)} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function getEffectiveActions(allowedActions: WebsiteAction[], websiteStatus: string, maintenanceStatus: string): WebsiteAction[] {
  const isOnHold = websiteStatus === 'On Hold'
  const actions = allowedActions.filter(a => {
    if (a === 'put-on-hold') return false
    if (a === 'mark-live') return isOnHold
    return true
  })
  if (maintenanceStatus === 'Due Soon') {
    if (!actions.includes('record-payment')) actions.push('record-payment')
    if (!actions.includes('discontinue')) actions.push('discontinue')
  }
  return actions
}

function UpdateDialogContent({ websiteId, onClose }: { websiteId: string; onClose: () => void }) {
  const { data: website, isLoading, isError, error } = useWebsite(websiteId)
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false)
  const [markLiveOpen, setMarkLiveOpen] = useState(false)
  const [discontinueOpen, setDiscontinueOpen] = useState(false)
  const today = new Date().toISOString().split('T')[0]!
  const [paymentDate, setPaymentDate] = useState(today)
  const [renewalDate, setRenewalDate] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [liveHostedDate, setLiveHostedDate] = useState(today)
  const [liveRenewalDate, setLiveRenewalDate] = useState('')
  const updateMutation = useUpdateWebsite(websiteId)
  const { data: billingId } = useCurrentBillingId(websiteId)
  const paymentMutation = useRecordPayment(websiteId)

  const runAction = (payload: UpdateWebsiteInput) => {
    updateMutation.mutate(payload, { onSuccess: onClose })
  }

  const actions = website ? getEffectiveActions(website.allowed_actions, website.website_status, website.maintenance_status) : []

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#f0f4ee] px-5 py-4 dark:border-[#2f4a32]/60">
        <div>
          <Dialog.Title className="font-extrabold text-[#102315] dark:text-[#edf7ee]">
            Quick Update
          </Dialog.Title>
          {website ? (
            <Dialog.Description className="mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]">
              {website.project_name}
            </Dialog.Description>
          ) : (
            <Skeleton className="mt-1 h-4 w-40" />
          )}
        </div>
        <Dialog.Close
          render={
            <button
              type="button"
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#e8f0e4] hover:text-[#102315] dark:hover:bg-[#203423] dark:hover:text-[#edf7ee]"
            />
          }
        >
          <X className="size-4" />
        </Dialog.Close>
      </div>

      {/* Body */}
      <div className="grid gap-2.5 p-5">
        {isLoading ? (
          <>
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
            <Skeleton className="h-11 rounded-xl" />
          </>
        ) : isError ? (
          <p className="text-sm text-destructive">{(error as Error).message}</p>
        ) : !website ? null : actions.length === 0 ? (
          <p className="text-sm text-[#64745F] dark:text-[#9fb49b]">No actions available.</p>
        ) : (
          actions.map((action) => {
            if (action === 'mark-live') {
              return (
                <div key={action}>
                  <ActionButton
                    icon={<CheckCircle2 className="size-4" />}
                    label="Mark as Live"
                    disabled={updateMutation.isPending}
                    onClick={() => setMarkLiveOpen((o) => !o)}
                  />
                  {markLiveOpen ? (
                    <div className="mt-2 grid gap-3 rounded-xl border border-[#e8f0e4] bg-[#f8faf7] p-4 dark:border-[#2f4a32] dark:bg-[#101912]">
                      <label className="grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">
                        URL <span className="text-red-500">*</span>
                        <Input placeholder="https://example.com" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
                      </label>
                      <label className="grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">
                        Hosted Date <span className="text-red-500">*</span>
                        <Input type="date" value={liveHostedDate} onChange={(e) => setLiveHostedDate(e.target.value)} />
                      </label>
                      <label className="grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">
                        Renewal Date <span className="text-red-500">*</span>
                        <Input type="date" value={liveRenewalDate} onChange={(e) => setLiveRenewalDate(e.target.value)} />
                      </label>
                      <Button
                        disabled={updateMutation.isPending || !liveUrl || !liveHostedDate || !liveRenewalDate}
                        className="rounded-lg bg-[#4F5DF5] text-white hover:bg-[#3F4DE0]"
                        onClick={() => runAction({ websiteStatus: 'Live', maintenanceStatus: 'Active', url: liveUrl, hostedDate: liveHostedDate, renewalDate: liveRenewalDate })}
                      >
                        {updateMutation.isPending ? 'Saving…' : 'Mark as Live'}
                      </Button>
                    </div>
                  ) : null}
                </div>
              )
            }

            if (action === 'record-payment') {
              return (
                <div key={action}>
                  <ActionButton
                    icon={<CreditCard className="size-4" />}
                    label="Record Payment & Renew"
                    onClick={() => setRecordPaymentOpen((o) => !o)}
                  />
                  {recordPaymentOpen ? (
                    <div className="mt-2 grid gap-3 rounded-xl border border-[#e8f0e4] bg-[#f8faf7] p-4 dark:border-[#2f4a32] dark:bg-[#101912]">
                      {!billingId ? (
                        <p className="text-sm text-[#DC2626]">No active billing period found.</p>
                      ) : (
                        <>
                          <label className="grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">
                            Payment amount <span className="text-red-500">*</span>
                            <div className="relative">
                              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-[#64745F] dark:text-[#9fb49b]">₹</span>
                              <Input
                                className="pl-7"
                                placeholder="0"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                              />
                            </div>
                          </label>
                          <label className="grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">
                            Payment date <span className="text-red-500">*</span>
                            <Input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
                          </label>
                          <label className="grid gap-1 text-sm font-semibold text-[#102315] dark:text-[#edf7ee]">
                            New renewal date <span className="text-red-500">*</span>
                            <Input type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} />
                          </label>
                          <Button
                            disabled={paymentMutation.isPending || !paymentAmount || !paymentDate || !renewalDate}
                            className="rounded-lg bg-[#658354] text-white hover:bg-[#4b6043]"
                            onClick={() =>
                              paymentMutation.mutate(
                                { websiteId, billingId, amount: paymentAmount, paymentDate, paymentMode: 'Bank Transfer', remarks: null },
                                {
                                  onSuccess: () => {
                                    updateMutation.mutate({ renewalDate, maintenanceStatus: 'Active' }, { onSuccess: onClose })
                                  },
                                },
                              )
                            }
                          >
                            {paymentMutation.isPending || updateMutation.isPending ? 'Saving…' : 'Save payment'}
                          </Button>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              )
            }

            if (action === 'discontinue') {
              return (
                <div key={action}>
                  <ActionButton
                    icon={<XCircle className="size-4" />}
                    label="Discontinue"
                    destructive
                    onClick={() => setDiscontinueOpen(true)}
                  />
                  <ConfirmDialog
                    open={discontinueOpen}
                    onOpenChange={setDiscontinueOpen}
                    title="Discontinue Website"
                    description="This will mark the website as Discontinued and cancel maintenance. This action is final."
                    confirmLabel="Discontinue"
                    onConfirm={() => {
                      runAction({ websiteStatus: 'Discontinued', maintenanceStatus: 'Cancelled' })
                      setDiscontinueOpen(false)
                    }}
                    isPending={updateMutation.isPending}
                  />
                </div>
              )
            }

            return null
          })
        )}

        {(updateMutation.isPending || paymentMutation.isPending) ? (
          <div className="flex items-center gap-2 text-xs text-[#64745F] dark:text-[#9fb49b]">
            <Loader2 className="size-3.5 animate-spin" />
            Saving…
          </div>
        ) : null}

        {updateMutation.isError ? (
          <p className="text-xs text-destructive">{(updateMutation.error as Error).message}</p>
        ) : paymentMutation.isError ? (
          <p className="text-xs text-destructive">{(paymentMutation.error as Error).message}</p>
        ) : null}
      </div>
    </>
  )
}

function ActionButton({
  icon, label, destructive, disabled, onClick,
}: {
  icon: React.ReactNode
  label: string
  destructive?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
        destructive
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40'
          : 'border-[#dde5d8] bg-white text-[#102315] hover:bg-[#f2f6ee] dark:border-[#2f4a32] dark:bg-[#132018] dark:text-[#edf7ee] dark:hover:bg-[#203423]',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
