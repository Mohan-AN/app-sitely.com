import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, Loader2, Plus, X } from 'lucide-react'
import { useServiceOptions, useCreateServiceOption } from '#/hooks/use-service-options'
import { cn } from '#/lib/utils'
import type { ServiceOptionCategory } from '#/lib/service-options-api'
import { ApiError } from '#/lib/api'

interface ServiceOptionSelectProps {
  category: ServiceOptionCategory
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
}

export function ServiceOptionSelect({
  category,
  value,
  onChange,
  placeholder = 'Select...',
  disabled,
  error,
}: ServiceOptionSelectProps) {
  const { data, isLoading, isError, refetch } = useServiceOptions(category)
  const createMutation = useCreateServiceOption()

  const [open, setOpen] = useState(false)
  const [addingNew, setAddingNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [addError, setAddError] = useState<string | undefined>()

  const triggerRef = useRef<HTMLButtonElement>(null)
  const [dropRect, setDropRect] = useState<DOMRect | null>(null)

  const options = (data ?? []).filter((o) => o.is_active)

  function measureTrigger() {
    return triggerRef.current?.getBoundingClientRect() ?? null
  }

  function openDropdown() {
    const rect = measureTrigger()
    if (!rect) return
    setDropRect(rect)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    // Lock body scroll while dropdown is open
    document.body.style.overflow = 'hidden'
    const onResize = () => {
      const rect = measureTrigger()
      if (rect) setDropRect(rect)
    }
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  function handleSelect(name: string) {
    onChange(name)
    setOpen(false)
  }

  function handleAddNew(e?: React.SyntheticEvent) {
    e?.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) { setAddError('Name is required.'); return }
    setAddError(undefined)
    createMutation.mutate({ category, name: trimmed }, {
      onSuccess: async (created) => {
        await refetch()
        onChange(created.name)
        setAddingNew(false)
        setNewName('')
      },
      onError: async (err) => {
        const apiErr = err as ApiError
        if (apiErr.code === 'CONFLICT' || apiErr.status === 409) {
          // Already exists — refetch list and select it
          await refetch()
          onChange(trimmed)
          setAddingNew(false)
          setNewName('')
        } else {
          setAddError(apiErr.message ?? 'Failed to add.')
        }
      },
    })
  }

  if (isError) {
    return (
      <div className="flex h-8 items-center rounded-[8px] border border-[#DC2626] bg-[#FEF2F2] px-3 text-[12px] text-[#DC2626]">
        Could not load options
      </div>
    )
  }

  const DROPDOWN_MAX_H = 200 + 40 // list + footer button
  const spaceBelow = dropRect ? window.innerHeight - dropRect.bottom - 4 : 0
  const openUpward = dropRect ? spaceBelow < DROPDOWN_MAX_H && dropRect.top > DROPDOWN_MAX_H : false

  const portalStyle = dropRect
    ? {
        position: 'fixed' as const,
        ...(openUpward
          ? { bottom: window.innerHeight - dropRect.top + 4 }
          : { top: dropRect.bottom + 4 }),
        left: dropRect.left,
        width: dropRect.width,
        zIndex: 9999,
      }
    : { display: 'none' as const }

  return (
    <div className="relative flex flex-col gap-1.5">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled || isLoading}
        onClick={openDropdown}
        className={cn(
          'flex h-8 w-full items-center justify-between rounded-[8px] border px-3 text-[12px] transition bg-white',
          error ? 'border-[#DC2626]' : 'border-[#C9CDD6] hover:border-[#4F5DF5]',
          !value ? 'text-[#9CA3AF]' : 'text-[#11141A]',
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        {isLoading
          ? <Loader2 className="size-3.5 shrink-0 animate-spin text-[#8A8F98]" />
          : <ChevronDown className={cn('size-3.5 shrink-0 text-[#8A8F98] transition', open && 'rotate-180')} />}
      </button>

      {/* Portal dropdown */}
      {open && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }} onClick={() => setOpen(false)} />
          <div
            style={portalStyle}
            className="flex flex-col overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(17,20,26,.16)]"
          >
            {/* Scrollable options list */}
            <div className="overflow-y-auto" style={{ maxHeight: Math.min(200, spaceBelow - 44) }}>
              {options.length === 0 && (
                <p className="px-3 py-2 text-[12px] text-[#8A8F98]">No options yet — add one below.</p>
              )}
              {options.map((opt) => (
                <button
                  key={opt.option_id}
                  type="button"
                  onClick={() => handleSelect(opt.name)}
                  className="flex w-full items-center gap-2 px-3 py-[9px] text-left text-[12.5px] text-[#3D4250] transition hover:bg-[#F4F5F7]"
                >
                  {opt.name === value && <Check className="size-3.5 shrink-0 text-[#4F5DF5]" />}
                  <span className={opt.name === value ? 'font-semibold text-[#4F5DF5]' : ''}>{opt.name}</span>
                </button>
              ))}
            </div>

            {/* Pinned footer — always visible */}
            <button
              type="button"
              onClick={() => { setOpen(false); setAddingNew(true) }}
              className="flex w-full shrink-0 items-center gap-2 border-t border-[#EEF0F2] px-3 py-[9px] text-left text-[12.5px] font-semibold text-[#4F5DF5] transition hover:bg-[#EEEFFE]"
            >
              <Plus className="size-3.5" />
              Add new option…
            </button>
          </div>
        </>,
        document.body,
      )}

      {/* Inline add-new input — plain div, not <form>, to avoid submitting parent form */}
      {addingNew && (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={newName}
            onChange={(e) => { setNewName(e.target.value); setAddError(undefined) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); handleAddNew() }
              if (e.key === 'Escape') { setAddingNew(false); setNewName(''); setAddError(undefined) }
            }}
            placeholder="New option name"
            autoFocus
            className={cn(
              'h-8 flex-1 rounded-[8px] border px-3 text-[12px] outline-none transition',
              addError ? 'border-[#DC2626]' : 'border-[#C9CDD6] focus:border-[#4F5DF5]',
            )}
          />
          <button
            type="button"
            onClick={() => handleAddNew()}
            disabled={createMutation.isPending}
            className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#4F5DF5] text-white transition hover:bg-[#3F4DE0] disabled:opacity-50"
          >
            {createMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => { setAddingNew(false); setNewName(''); setAddError(undefined) }}
            className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E5E7EB] text-[#8A8F98] transition hover:border-[#FECACA] hover:text-[#DC2626]"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
      {addError && <p className="text-[11px] font-semibold text-[#DC2626]">{addError}</p>}
    </div>
  )
}
