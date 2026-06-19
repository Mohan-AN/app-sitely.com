import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import type { WebsitesFilters } from './types'

const SITE_TYPES = ['static', 'wordpress']

interface ClientOption {
  clientId: string
  name: string
}

interface WebsitesFiltersBarProps {
  filters: WebsitesFilters
  onChange: (filters: WebsitesFilters) => void
  clients: ClientOption[]
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function FilterSelect({
  placeholder,
  value,
  onChange,
  options,
}: {
  placeholder: string
  value: string | undefined
  onChange: (value: string | undefined) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Select value={value ?? '__all'} onValueChange={(next) => onChange(next === '__all' ? undefined : next)}>
      <SelectTrigger className="h-10 w-full min-w-[180px] rounded-xl border-[#e4e8f0] bg-white px-3 text-[14px] font-medium text-[#0f172a] shadow-none sm:w-auto">
        <SelectValue>{value ? (options.find((option) => option.value === value)?.label ?? value) : placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start" className="rounded-xl border border-[#e4e8f0] bg-white p-1 shadow-lg">
        <SelectItem value="__all">{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function WebsitesFiltersBar({ filters, onChange, clients }: WebsitesFiltersBarProps) {
  const set = <K extends keyof WebsitesFilters>(key: K, value: WebsitesFilters[K]) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e8ecf4] bg-[#fbfcff] p-3 sm:flex-row sm:flex-wrap sm:items-center">
      <FilterSelect
        placeholder="All Clients"
        value={filters.clientId}
        onChange={(value) => set('clientId', value)}
        options={clients.map((client) => ({ value: client.clientId, label: client.name }))}
      />
      <FilterSelect
        placeholder="All Types"
        value={filters.siteType}
        onChange={(value) => set('siteType', value)}
        options={SITE_TYPES.map((type) => ({ value: type, label: capitalize(type) }))}
      />
    </div>
  )
}
