import { useRef, useState } from 'react'
import { CheckCircle2, CloudUpload, Paperclip, X } from 'lucide-react'
import { useAttachInvoice } from '#/hooks/use-billing'
import { cn } from '#/lib/utils'

interface Props {
  websiteId: string
  billingId: string
  periodLabel: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AttachInvoiceDialog({ websiteId, billingId, periodLabel, open, onOpenChange }: Props) {
  const fileRef  = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [done, setDone] = useState(false)
  const mutation = useAttachInvoice(websiteId)

  if (!open) return null

  const handleClose = () => {
    setFile(null)
    setDone(false)
    mutation.reset()
    onOpenChange(false)
  }

  const handleAttach = async () => {
    if (!file) return
    mutation.mutate(
      { billingId, file },
      {
        onSuccess: () => setDone(true),
      },
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_48px_rgba(17,20,26,.18)]">

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]"
        >
          <X className="size-4" />
        </button>

        {done ? (
          <div className="flex flex-col items-center gap-4 px-8 py-12">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#ECFDF5]">
              <CheckCircle2 className="size-7 text-[#059669]" />
            </div>
            <div className="text-center">
              <p className="text-[16px] font-bold text-[#11141A]">Invoice Attached</p>
              <p className="mt-1 text-[12.5px] text-[#6B7280]">{file?.name} attached to {periodLabel}.</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-1 h-9 rounded-[9px] bg-[#059669] px-6 text-[12.5px] font-semibold text-white transition hover:bg-[#047857]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-[#E5E7EB] px-6 py-4">
              <h2 className="text-[15px] font-bold text-[#11141A]">Attach Invoice</h2>
              <p className="mt-0.5 text-[12px] text-[#8A8F98]">
                Attach an invoice PDF or image to <span className="font-semibold text-[#374151]">{periodLabel}</span>.
              </p>
            </div>

            <div className="flex flex-col gap-4 p-5">

              {/* Drop zone */}
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-3 rounded-[12px] border-[1.5px] border-dashed py-8 transition',
                  dragOver ? 'border-[#4F5DF5] bg-[#F5F6FF]' : 'border-[#D1D5DB] bg-[#FAFBFC]',
                )}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault(); setDragOver(false)
                  const f = e.dataTransfer.files[0]
                  if (!f) return
                  if (f.size > 5 * 1024 * 1024) { alert('File is too large. Maximum size is 5 MB.'); return }
                  setFile(f)
                }}
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-[#EEF2FF]">
                  <CloudUpload className="size-5 text-[#4F5DF5]" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-[#374151]">Drop file here or browse</p>
                  <p className="text-[11.5px] text-[#9CA3AF]">PDF or image</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    e.target.value = ''
                    if (!f) return
                    if (f.size > 5 * 1024 * 1024) { alert('File is too large. Maximum size is 5 MB.'); return }
                    setFile(f)
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="h-8 rounded-[8px] border border-[#4F5DF5] px-4 text-[12px] font-semibold text-[#4F5DF5] transition hover:bg-[#EEEFFE]"
                >
                  Choose File
                </button>
              </div>

              {/* Selected file */}
              {file && (
                <div className="flex items-center gap-2 rounded-[9px] border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2.5">
                  <Paperclip className="size-3.5 shrink-0 text-[#059669]" />
                  <span className="flex-1 truncate text-[12px] font-semibold text-[#059669]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-[#059669] hover:text-[#047857]"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {mutation.isError && (
                <p className="text-[12px] font-semibold text-[#DC2626]">{(mutation.error as Error).message}</p>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-9 rounded-[9px] border border-[#E5E7EB] px-5 text-[12.5px] font-semibold text-[#5C6270] transition hover:bg-[#F4F5F7]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!file || mutation.isPending}
                  onClick={handleAttach}
                  className={cn(
                    'h-9 rounded-[9px] px-5 text-[12.5px] font-semibold text-white transition',
                    file && !mutation.isPending
                      ? 'bg-[#4F5DF5] hover:bg-[#3F4DE0]'
                      : 'cursor-not-allowed bg-[#E5E7EB] text-[#9CA3AF]',
                  )}
                >
                  {mutation.isPending ? 'Attaching…' : 'Attach Invoice'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
