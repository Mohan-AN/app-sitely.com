import { useState } from 'react'
import { Dialog } from '@base-ui/react'
import { X } from 'lucide-react'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { Skeleton } from '#/components/ui/skeleton'
import { useDeleteWebsite, useWebsite } from '#/hooks/use-websites'
import { WebsiteForm } from './website-form'

interface WebsiteEditDialogProps {
  websiteId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WebsiteEditDialog({ websiteId, open, onOpenChange }: WebsiteEditDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-[#e5ebe2] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#2f4a32] dark:bg-[#132018]">
          <EditDialogContent websiteId={websiteId} onClose={() => onOpenChange(false)} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function EditDialogContent({ websiteId, onClose }: { websiteId: string; onClose: () => void }) {
  const { data: website, isLoading, isError, error } = useWebsite(websiteId)
  const deleteMutation = useDeleteWebsite(websiteId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteDialog(false)
        onClose()
      },
    })
  }

  return (
    <>
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between border-b border-[#f0f4ee] px-6 py-4 dark:border-[#2f4a32]/60">
        <div>
          <Dialog.Title className="text-base font-extrabold text-[#102315] dark:text-[#edf7ee]">
            Edit Website
          </Dialog.Title>
          <Dialog.Description className="mt-0.5 text-sm text-[#64745F] dark:text-[#9fb49b]">
            {website ? website.project_name : 'Update website information and settings.'}
          </Dialog.Description>
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

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {isLoading ? (
          <div className="grid gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">{(error as Error).message}</p>
        ) : website ? (
          <WebsiteForm
            mode="edit"
            website={website}
            onUpdated={onClose}
            onCancel={onClose}
            onDelete={() => setShowDeleteDialog(true)}
            isDeleting={deleteMutation.isPending}
          />
        ) : null}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Website"
        description={`Are you sure you want to delete "${website?.project_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}
