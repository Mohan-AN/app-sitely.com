import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Dialog } from '@base-ui/react'
import { Mail, MapPin, Phone, UserRoundPlus, X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useCreateClient } from '#/hooks/use-clients'
import type { Client } from './types'

// ─── Schema ────────────────────────────────────────────────────────────

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
  company: nameLike('Company', 150),
  phone: z.preprocess(
    emptyToUndefined,
    z.string()
      .regex(/^[6-9]\d{9}$/, 'Must start with 6-9 and be exactly 10 digits')
      .refine((v) => !/^(\d)\1{9}$/.test(v), 'Cannot be a repeated digit pattern')
      .optional(),
  ),
  email: z.preprocess(emptyToUndefined, z.string({ message: 'Email is required' }).email('Invalid email')),
  city: z.preprocess(emptyToUndefined, nameLike('Address').optional()),
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
        company: values.company.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || undefined,
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

        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#E5E7EB] bg-white shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
            <Dialog.Title className="text-lg font-bold text-[#11141A]">
              Add Client
            </Dialog.Title>
            <Dialog.Close
              render={
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg text-[#8A8F98] transition hover:bg-[#F4F5F7] hover:text-[#11141A]"
                />
              }
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-5">
            {/* Section header */}
            <div className="mb-5 flex items-center gap-3 border-b border-[#E5E7EB] pb-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEEFFE] text-[#4F5DF5]">
                <UserRoundPlus className="size-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#11141A]">Client Details</p>
                <p className="text-xs text-[#5C6270]">Enter the basic information about the client.</p>
              </div>
            </div>

            <div className="grid gap-4">
              {/* Row 1: Name + Company */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#374151]">
                    Client Name <span className="text-[#DC2626]">*</span>
                  </label>
                  <Input placeholder="Enter client name" {...form.register('name')} />
                  {e.name ? <p className="text-[11px] font-semibold text-[#DC2626]">{e.name.message}</p> : null}
                </div>
                <div className="grid gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#374151]">Company <span className="text-[#DC2626]">*</span></label>
                  <Input placeholder="Enter company name" {...form.register('company')} />
                  {e.company ? <p className="text-[11px] font-semibold text-[#DC2626]">{e.company.message as string}</p> : null}
                </div>
              </div>

              {/* Row 2: Phone + Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#374151]">Phone</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <Input className="pl-9" placeholder="Enter 10-digit mobile number" {...form.register('phone')} />
                  </div>
                  {e.phone ? <p className="text-[11px] font-semibold text-[#DC2626]">{e.phone.message as string}</p> : null}
                </div>
                <div className="grid gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#374151]">Email <span className="text-[#DC2626]">*</span></label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <Input className="pl-9" type="email" placeholder="Enter email address" {...form.register('email')} />
                  </div>
                  {e.email ? <p className="text-[11px] font-semibold text-[#DC2626]">{e.email.message as string}</p> : null}
                </div>
              </div>

              {/* Row 3: Address */}
              <div className="grid gap-1.5">
                <label className="text-[11.5px] font-semibold text-[#374151]">Address</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <Input className="pl-9" placeholder="Enter address (optional)" {...form.register('city')} />
                </div>
                {e.city ? <p className="text-[11px] font-semibold text-[#DC2626]">{e.city.message as string}</p> : null}
              </div>
            </div>

            {createMutation.isError ? (
              <p className="mt-3 text-[12px] font-semibold text-[#DC2626]">{(createMutation.error as Error).message}</p>
            ) : null}

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 min-w-24 rounded-[9px] border-[#E5E7EB] text-[#5C6270]"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="h-10 gap-2 rounded-[9px] bg-[#4F5DF5] px-5 text-[13px] font-semibold text-white hover:bg-[#3F4DE0]"
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
