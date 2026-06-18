import { Search } from 'lucide-react'
import { cn } from '#/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
  return (
    <div
      className={cn(
        'group flex h-10 items-center gap-2 rounded-xl border border-[#c7ddb5] bg-white px-4 text-[#102315] shadow-sm transition hover:bg-[#f8faf7] dark:border-[#2f4a32] dark:bg-[#132018] dark:text-[#edf7ee] dark:hover:bg-[#203423]',
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-[#64745F] transition group-focus-within:text-[#658354] dark:text-[#9fb49b] dark:group-focus-within:text-[#b6d7a8]" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent text-[13px] font-medium outline-none placeholder:text-[#94A3B8] focus:ring-0 dark:placeholder:text-[#7f947b]"
      />
    </div>
  )
}
