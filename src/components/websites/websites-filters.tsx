import { Button } from '#/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from '#/components/ui/select'
import type { WebsitesFilters } from './types'

const WEBSITE_STATUSES = ['In Progress', 'Live', 'On Hold', 'Completed', 'Discontinued']
const MAINTENANCE_STATUSES = ['Not Started', 'Active', 'Paused', 'Expired', 'Cancelled']
const PLATFORMS = ['netlify', 'wpx']
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
    <Select value={value ?? ''} onValueChange={(nextValue) => onChange(nextValue === '__clear' ? undefined : nextValue || undefined)}>
      <SelectTrigger className="h-10 rounded-xl border-[#c7ddb5] bg-white shadow-sm dark:border-[#2f4a32] dark:bg-[#132018]">
        <span className={value ? 'text-[#102315] dark:text-[#edf7ee]' : 'text-[#64745F] dark:text-[#9fb49b]'}>
          {value ? (options.find((option) => option.value === value)?.label ?? value) : placeholder}
        </span>
      </SelectTrigger>
      <SelectContent>
        {value ? <SelectItem value="__clear">{placeholder}</SelectItem> : null}
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
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <FilterSelect placeholder="All clients" value={filters.clientId} onChange={(value) => set('clientId', value)} options={clients.map((client) => ({ value: client.clientId, label: client.name }))} />
      <FilterSelect placeholder="Type" value={filters.siteType} onChange={(value) => set('siteType', value)} options={SITE_TYPES.map((type) => ({ value: type, label: capitalize(type) }))} />
      <FilterSelect placeholder="Platform" value={filters.platform} onChange={(value) => set('platform', value)} options={PLATFORMS.map((platform) => ({ value: platform, label: capitalize(platform) }))} />
      <FilterSelect
        placeholder="Website status"
        value={filters.websiteStatus}
        onChange={(value) => set('websiteStatus', value)}
        options={WEBSITE_STATUSES.map((status) => ({ value: status, label: status }))}
      />
      <FilterSelect
        placeholder="Maintenance"
        value={filters.maintenanceStatus}
        onChange={(value) => set('maintenanceStatus', value)}
        options={MAINTENANCE_STATUSES.map((status) => ({ value: status, label: status }))}
      />
      <Button variant="link" size="sm" className="h-10 px-1 text-emerald-700" onClick={() => onChange({ search: filters.search })}>
        Clear all
      </Button>
    </div>
  )
}
