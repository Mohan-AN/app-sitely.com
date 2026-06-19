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
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-[#0f172a]/55 backdrop-blur-[1px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[#dce3ef] bg-white shadow-2xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 dark:border-[#25304a] dark:bg-[#111827]">

          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-9">
            <Dialog.Title className="text-[26px] font-extrabold text-[#0b1020] dark:text-[#edf2ff]">
              Add Client
            </Dialog.Title>
            <Dialog.Close
              render={
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-lg text-[#172554] transition hover:bg-[#f5f3ff] hover:text-[#4f2df5] dark:hover:bg-[#172033] dark:hover:text-[#edf2ff]"
                />
              }
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 pt-7">
            {/* Section header */}
            <div className="hidden">
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
                <label className="text-sm font-semibold text-[#172554] dark:text-[#edf2ff]">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <Input placeholder="Enter client name" {...form.register('name')} />
                  {e.name ? <p className="text-xs text-destructive">{e.name.message}</p> : null}
                </div>
                <div className="grid gap-1.5">
                <label className="text-sm font-semibold text-[#172554] dark:text-[#edf2ff]">Company</label>
                  <Input placeholder="Enter company name (optional)" {...form.register('company')} />
                  {e.company ? <p className="text-xs text-destructive">{e.company.message as string}</p> : null}
                </div>
              </div>

              {/* Row 2: Phone + Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label className="text-sm font-semibold text-[#172554] dark:text-[#edf2ff]">Phone</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f8aa3]" />
                    <Input className="pl-9" placeholder="Enter 10-digit mobile number" {...form.register('phone')} />
                  </div>
                  {e.phone ? <p className="text-xs text-destructive">{e.phone.message as string}</p> : null}
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-semibold text-[#172554] dark:text-[#edf2ff]">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f8aa3]" />
                    <Input className="pl-9" type="email" placeholder="Enter email address (optional)" {...form.register('email')} />
                  </div>
                  {e.email ? <p className="text-xs text-destructive">{e.email.message as string}</p> : null}
                </div>
              </div>

              {/* Row 3: City */}
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold text-[#172554] dark:text-[#edf2ff]">City</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#7f8aa3]" />
                  <Input className="pl-9" placeholder="Enter city (optional)" {...form.register('city')} />
                </div>
                {e.city ? <p className="text-xs text-destructive">{e.city.message as string}</p> : null}
              </div>
            </div>

            {createMutation.isError ? (
              <p className="mt-3 text-sm text-destructive">{(createMutation.error as Error).message}</p>
            ) : null}

            {/* Footer */}
            <div className="mt-8 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                className="h-12 min-w-28 rounded-lg border-[#dce3ef] dark:border-[#25304a]"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="h-12 gap-2 rounded-lg px-6 font-bold text-white"
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
