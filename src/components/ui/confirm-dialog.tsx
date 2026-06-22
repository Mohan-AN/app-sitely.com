import { Dialog } from '@base-ui/react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '#/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
  isPending?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Delete',
  onConfirm,
  isPending,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

        {/* Panel */}
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white p-6 shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#2f4a32] dark:bg-[#132018]">

          {/* Icon */}
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
            <AlertTriangle className="size-5 text-red-600" />
          </div>

          {/* Text */}
          <Dialog.Title className="text-base font-bold text-[#101828] dark:text-[#edf7ee]">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-1.5 text-sm text-[#475467] dark:text-[#9fb49b]">
            {description}
          </Dialog.Description>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 min-w-20 rounded-lg border-[#dde5d8] dark:border-[#2f4a32]"
                />
              }
            >
              Cancel
            </Dialog.Close>
            <Button
              type="button"
              disabled={isPending}
              className="h-9 min-w-24 rounded-lg bg-red-600 font-semibold text-white hover:bg-red-700"
              onClick={onConfirm}
            >
              {isPending ? 'Deleting...' : confirmLabel}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
