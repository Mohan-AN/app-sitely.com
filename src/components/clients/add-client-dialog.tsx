import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Dialog } from '@base-ui/react'
import { Mail, MapPin, Phone, UserRoundPlus, X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useCreateClient } from '#/hooks/use-clients'
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
})

type FormValues = z.infer<typeof schema>

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (client: Client) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddClientDialog({ open, onOpenChange, onCreated }: AddClientDialogProps) {
  const createMutation = useCreateClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { name: '', company: '', phone: '', email: '', city: '' },
  })

  const handleSubmit = form.handleSubmit((values) => {
    createMutation.mutate(
      {
        name: values.name.trim(),
        company: values.company?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        email: values.email?.trim() || undefined,
        city: values.city?.trim() || undefined,
      },
      {
        onSuccess: (client) => {
          form.reset()
          onOpenChange(false)
          onCreated?.(client)
        },
      },
    )
  })

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  const e = form.formState.errors

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#e5ebe2] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#2f4a32] dark:bg-[#101912]">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#f0f4ee] px-6 py-4 dark:border-[#2f4a32]/60">
            <Dialog.Title className="text-lg font-bold text-[#101828] dark:text-[#edf7ee]">
              Add Client
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
                <UserRoundPlus className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#101828] dark:text-[#edf7ee]">Client Details</p>
                <p className="text-xs text-[#64745F] dark:text-[#9fb49b]">Enter the basic information about the client.</p>
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
            </div>

            {createMutation.isError ? (
              <p className="mt-3 text-sm text-destructive">{(createMutation.error as Error).message}</p>
            ) : null}

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 min-w-24 rounded-xl border-[#dde5d8] dark:border-[#2f4a32]"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="h-10 gap-2 rounded-xl bg-[#658354] px-5 font-bold text-white hover:bg-[#4b6043]"
              >
                <UserRoundPlus className="size-4" />
                {createMutation.isPending ? 'Creating...' : 'Create Client'}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
