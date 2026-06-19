import { Dialog } from '@base-ui/react'
import { CirclePlus, X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { WebsiteForm } from './website-form'
import type { Website } from './types'

const FORM_ID = 'add-website-dialog-form'

interface AddWebsiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialClientId?: string
  onCreated?: (website: Website) => void
}

export function AddWebsiteDialog({ open, onOpenChange, initialClientId, onCreated }: AddWebsiteDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-[#0f172a]/55 backdrop-blur-[1px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#dce3ef] bg-white shadow-2xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#25304a] dark:bg-[#111827]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <Dialog.Title className="text-[17px] font-bold text-[#0b1020] dark:text-[#edf2ff]">
              Add Website
            </Dialog.Title>
            <Dialog.Close
              render={
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg text-[#475467] transition hover:bg-[#f5f3ff] hover:text-[#4f2df5] dark:hover:bg-[#172033] dark:hover:text-[#edf2ff]"
                />
              }
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>

          {/* Body — no scroll, form fits naturally */}
          <div className="px-4 pb-1">
            <WebsiteForm
              formId={FORM_ID}
              hideFooter
              mode="create"
              initialClientId={initialClientId}
              onCreated={(website) => {
                onOpenChange(false)
                onCreated?.(website)
              }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-4 py-3">
            <Button
              type="button"
              variant="outline"
              className="h-9 min-w-24 rounded-lg border-[#dce3ef] dark:border-[#25304a]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              className="h-9 gap-2 rounded-lg px-5 font-semibold text-white"
            >
              <CirclePlus className="size-4" />
              Save Website
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
