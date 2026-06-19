import { ChevronDown } from 'lucide-react'
import { cn } from '#/lib/utils'

interface PageSizeSelectorProps {
  value: number
  onChange: (value: number) => void
  options?: number[]
  total?: number
  page?: number
  limit?: number
  className?: string
}

export function PageSizeSelector({
  value,
  onChange,
  options = [10, 20, 50, 100],
  total,
  page,
  limit,
  className,
}: PageSizeSelectorProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2 text-[13px] text-[#475467]', className)}>
      <div className="flex items-center gap-2">
        <span>Show</span>
        <div className="relative">
          <select
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-white py-2 pl-3 pr-8 font-medium text-[#0f172a] outline-none transition hover:border-[#d8ddff] focus:border-[#5b38f6] focus:ring-2 focus:ring-[#5b38f6]/10"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
        </div>
      </div>
      {total !== undefined ? <span>of {total} results</span> : null}
    </div>
  )
}
