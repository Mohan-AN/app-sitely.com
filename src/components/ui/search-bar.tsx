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
        'group flex h-12 items-center gap-3 rounded-lg border border-[#dce3ef] bg-white px-4 text-[#172554] shadow-sm transition hover:bg-[#fbfcff] dark:border-[#25304a] dark:bg-[#111827] dark:text-[#edf2ff]',
        className,
      )}
    >
      <Search className="size-5 shrink-0 text-[#253858] transition group-focus-within:text-[#4f2df5] dark:text-[#a6b2cf]" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent text-[14px] font-medium outline-none placeholder:text-[#6f7c99] focus:ring-0 dark:placeholder:text-[#8793ad]"
      />
    </div>
  )
}
