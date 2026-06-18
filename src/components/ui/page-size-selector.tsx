import { cn } from '#/lib/utils'

interface PageSizeSelectorProps {
  value: number
  onChange: (value: number) => void
  options?: number[]
  total?: number
  className?: string
}

export function PageSizeSelector({ value, onChange, options = [10, 20, 30], total, className }: PageSizeSelectorProps) {
  return (
    <div className={cn('flex items-center gap-2 text-[13px] font-medium text-[#64745F]', className)}>
      <span>Show</span>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-9 cursor-pointer rounded-lg border border-[#c7ddb5] bg-white px-2.5 font-bold text-[#102315] shadow-sm outline-none transition hover:bg-[#ddead1]/20 focus:ring-3 focus:ring-[#658354]/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span>{total === undefined ? 'results per page' : `of ${total} results`}</span>
    </div>
  )
}
