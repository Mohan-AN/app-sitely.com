import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Dialog } from '@base-ui/react'
import { Mail, MapPin, Pencil, Phone, Trash2, X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Switch } from '#/components/ui/switch'
import { useDeleteClient, useUpdateClient } from '#/hooks/use-clients'
import { ConfirmDialog } from '#/components/ui/confirm-dialog'
import { useState } from 'react'
import type { Client } from './types'

// ─── Schema ───────────────────────────────────────────────────────────────────

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

const nameLike = (field: string, max = 100) =>
  z.preprocess(
    emptyToUndefined,
    z.string({ message: `${field} is required` })
      .min(3, `${field} must be at least 3 characters`)
      .max(max, `${field} must be at most ${max} characters`)
      .regex(/^[A-Za-z][A-Za-z0-9 ]*$/, `${field} must start with a letter and contain only letters, numbers and spaces`),
  )

const schema = z.object({
  name: nameLike('Name'),
  company: z.preprocess(emptyToUndefined, nameLike('Company', 150).optional()),
  phone: z.preprocess(
    emptyToUndefined,
    z.string()
      .regex(/^[6-9]\d{9}$/, 'Must start with 6-9 and be exactly 10 digits')
      .refine((v) => !/^(\d)\1{9}$/.test(v), 'Cannot be a repeated digit pattern')
      .optional(),
  ),
  email: z.preprocess(emptyToUndefined, z.string().email('Invalid email').optional()),
  city: z.preprocess(emptyToUndefined, nameLike('City').optional()),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

// ─── Props ────────────────────────────────────────────────────────────────────

interface ClientData {
  clientId: string
  name: string
  company: string | null
  phone: string | null
  email: string | null
  city: string | null
  isActive: boolean
}

interface EditClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: ClientData | null
  onUpdated?: (client: Client) => void
  onDeleted?: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditClientDialog({ open, onOpenChange, client, onUpdated, onDeleted }: EditClientDialogProps) {
  const updateMutation = useUpdateClient(client?.clientId ?? '')
  const deleteMutation = useDeleteClient(client?.clientId ?? '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: toDefaults(client),
  })

  // Prefill whenever a different client is loaded into the dialog
  useEffect(() => {
    if (open && client) {
      form.reset(toDefaults(client))
      updateMutation.reset()
    }
  }, [open, client?.clientId])

  const handleSubmit = form.handleSubmit((values) => {
    if (!client) return
    updateMutation.mutate(
      {
        name: values.name.trim(),
        company: values.company?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        email: values.email?.trim() || undefined,
        city: values.city?.trim() || undefined,
        isActive: values.isActive,
      },
      {
        onSuccess: (updated) => {
          onOpenChange(false)
          onUpdated?.(updated)
        },
      },
    )
  })

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false)
        onOpenChange(false)
        onDeleted?.()
      },
    })
  }

  const e = form.formState.errors

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#2f4a32] dark:bg-[#101912]">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#f0f4ee] px-6 py-4 dark:border-[#2f4a32]/60">
              <Dialog.Title className="text-lg font-bold text-[#101828] dark:text-[#edf7ee]">
                Edit Client
              </Dialog.Title>
              <Dialog.Close
                render={
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-lg text-[#64745F] transition hover:bg-[#f0f4ee] hover:text-[#101828] dark:hover:bg-[#203423] dark:hover:text-[#edf7ee]"
                  />
                }
              >
                <X className="size-4" />
              </Dialog.Close>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5">
              {/* Section header */}
              <div className="mb-5 flex items-center gap-3 border-b border-[#f0f4ee] pb-4 dark:border-[#2f4a32]/60">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ddead1] text-[#658354] dark:bg-[#203423] dark:text-[#85e0a3]">
                  <Pencil className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#101828] dark:text-[#edf7ee]">Client Details</p>
                  <p className="text-xs text-[#64745F] dark:text-[#9fb49b]">Update contact and company information.</p>
                </div>
              </div>

              <div className="grid gap-4">
                {/* Row 1: Name + Company */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <label className="text-sm font-semibold text-[#101828] dark:text-[#edf7ee]">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <Input placeholder="Enter client name" {...form.register('name')} />
                    {e.name ? <p className="text-xs text-destructive">{e.name.message}</p> : null}
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-sm font-semibold text-[#101828] dark:text-[#edf7ee]">Company</label>
                    <Input placeholder="Enter company name (optional)" {...form.register('company')} />
                    {e.company ? <p className="text-xs text-destructive">{e.company.message as string}</p> : null}
                  </div>
                </div>

                {/* Row 2: Phone + Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <label className="text-sm font-semibold text-[#101828] dark:text-[#edf7ee]">Phone</label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9fb49b]" />
                      <Input className="pl-9" placeholder="Enter 10-digit mobile number" {...form.register('phone')} />
                    </div>
                    {e.phone ? <p className="text-xs text-destructive">{e.phone.message as string}</p> : null}
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-sm font-semibold text-[#101828] dark:text-[#edf7ee]">Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9fb49b]" />
                      <Input className="pl-9" type="email" placeholder="Enter email address (optional)" {...form.register('email')} />
                    </div>
                    {e.email ? <p className="text-xs text-destructive">{e.email.message as string}</p> : null}
                  </div>
                </div>

                {/* Row 3: City */}
                <div className="grid gap-1.5">
                  <label className="text-sm font-semibold text-[#101828] dark:text-[#edf7ee]">City</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9fb49b]" />
                    <Input className="pl-9" placeholder="Enter city (optional)" {...form.register('city')} />
                  </div>
                  {e.city ? <p className="text-xs text-destructive">{e.city.message as string}</p> : null}
                </div>

                {/* Row 4: Status */}
                <div className="flex items-center justify-between rounded-xl border border-[#e5ebe2] px-4 py-3 dark:border-[#2f4a32]">
                  <div>
                    <p className="text-sm font-semibold text-[#101828] dark:text-[#edf7ee]">Status</p>
                    <p className="text-xs text-[#64745F] dark:text-[#9fb49b]">
                      {form.watch('isActive') ? 'Client is active and visible in listings.' : 'Client is inactive and hidden from active views.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${form.watch('isActive') ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#64745F] dark:text-[#9fb49b]'}`}>
                      {form.watch('isActive') ? 'Active' : 'Inactive'}
                    </span>
                    <Switch
                      checked={form.watch('isActive')}
                      onCheckedChange={(checked) => form.setValue('isActive', checked, { shouldDirty: true })}
                      className="data-checked:bg-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {updateMutation.isError ? (
                <p className="mt-3 text-sm text-destructive">{(updateMutation.error as Error).message}</p>
              ) : null}

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 rounded-xl border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                  disabled={deleteMutation.isPending}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="size-4" />
                  Delete Client
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 min-w-24 rounded-xl border-[#dde5d8] dark:border-[#2f4a32]"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="h-10 gap-2 rounded-xl bg-[#658354] px-5 font-bold text-white hover:bg-[#4b6043]"
                  >
                    <Pencil className="size-4" />
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Client"
        description={`Are you sure you want to delete "${client?.name}"? All associated data will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}

function toDefaults(client: ClientData | null): FormValues {
  return {
    name: client?.name ?? '',
    company: client?.company ?? '',
    phone: client?.phone ?? '',
    email: client?.email ?? '',
    city: client?.city ?? '',
    isActive: client?.isActive ?? true,
  }
}
