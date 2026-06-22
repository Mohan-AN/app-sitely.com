import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Code2, ExternalLink, MoreHorizontal } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { cn } from '#/lib/utils'
import { formatDate } from '#/lib/format'
import type { ClientWebsiteSummary } from './types'

const PAGE_SIZE = 5

const STATUS_COLORS: Record<string, { dot: string; text: string }> = {
  Live:         { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
  Active:       { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
  'In Progress':{ dot: 'bg-amber-400',   text: 'text-amber-700 dark:text-amber-400' },
  Expired:      { dot: 'bg-red-500',     text: 'text-red-600 dark:text-red-400' },
  Paused:       { dot: 'bg-gray-400',    text: 'text-gray-500 dark:text-gray-400' },
  Inactive:     { dot: 'bg-gray-400',    text: 'text-gray-500 dark:text-gray-400' },
  'On Hold':    { dot: 'bg-gray-400',    text: 'text-gray-500 dark:text-gray-400' },
  Completed:    { dot: 'bg-blue-500',    text: 'text-blue-600 dark:text-blue-400' },
  Discontinued: { dot: 'bg-gray-400',    text: 'text-gray-500 dark:text-gray-400' },
  Cancelled:    { dot: 'bg-gray-400',    text: 'text-gray-500 dark:text-gray-400' },
  'Not Started':{ dot: 'bg-gray-400',    text: 'text-gray-500 dark:text-gray-400' },
}

const PLATFORM_STYLES: Record<string, string> = {
  wpx:     'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  netlify: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
}

function StatusDot({ label }: { label: string }) {
  const s = STATUS_COLORS[label] ?? { dot: 'bg-gray-400', text: 'text-gray-500' }
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', s.text)}>
      <span className={cn('size-2 shrink-0 rounded-full', s.dot)} />
      {label}
    </span>
  )
}

function PlatformBadge({ platform }: { platform?: string }) {
  if (!platform) return <span className="text-xs text-[#9fb49b]">—</span>
  const label = platform === 'wpx' ? 'WPX' : platform === 'netlify' ? 'Netlify' : platform
  return (
    <span className={cn('rounded-md px-2 py-0.5 text-xs font-bold', PLATFORM_STYLES[platform] ?? 'bg-gray-100 text-gray-600')}>
      {label}
    </span>
  )
}

function SiteTypeCell({ siteType }: { siteType?: string }) {
  if (!siteType) return <span className="text-xs text-[#9fb49b]">—</span>
  if (siteType === 'wordpress') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#334155] dark:text-[#d6e8cf]">
        <span className="flex size-4 items-center justify-center rounded-sm bg-[#21759b] text-[9px] font-black text-white">W</span>
        WordPress
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#334155] dark:text-[#d6e8cf]">
      <Code2 className="size-4 text-[#64745F] dark:text-[#9fb49b]" />
      Static
    </span>
  )
}

const gridCols = 'grid-cols-[2fr_0.75fr_0.85fr_0.7fr_0.7fr_0.7fr_0.85fr_44px]'

export function ClientWebsitesTable({ websites }: { websites: ClientWebsiteSummary[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(websites.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const slice = websites.slice(start, start + PAGE_SIZE)
  const showing = websites.length === 0 ? 0 : start + slice.length

  if (websites.length === 0) {
    return (
      <div className="flex h-28 items-center justify-center rounded-xl border border-[#e5ebe2] text-sm text-[#64745F] dark:border-[#2f4a32] dark:text-[#9fb49b]">
        No websites for this client yet.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#e5ebe2] dark:border-[#2f4a32]">
        {/* Header */}
        <div className={cn('grid border-b border-[#e5ebe2] bg-[#f5f9f2] dark:border-[#2f4a32] dark:bg-[#17251b]', gridCols)}>
          {['Website', 'Website ID', 'Type', 'Platform', 'Status', 'Maintenance', 'Renewal Date', ''].map((h) => (
            <div key={h} className="px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#3F6F39] dark:text-[#b6d7a8]">
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {slice.map((w, i) => {
          const cleanUrl = w.url ? w.url.replace(/^https?:\/\//, '') : null
          return (
            <div
              key={w.id}
              className={cn(
                'grid min-h-[56px] items-center border-b border-[#e5ebe2]/60 text-[13px] hover:bg-[#f5f9f2] dark:border-[#2f4a32]/40 dark:hover:bg-[#17251b]',
                gridCols,
                i % 2 === 1 && 'bg-[#fafcf8] dark:bg-[#111a13]',
              )}
            >
              {/* Website name + URL */}
              <div className="min-w-0 px-3 py-2">
                <Link
                  to="/websites/$websiteId"
                  params={{ websiteId: String(w.id) }}
                  className="block truncate font-bold text-[#102315] hover:underline dark:text-[#edf7ee]"
                >
                  {w.project_name}
                </Link>
                {cleanUrl ? (
                  <a
                    href={w.url!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 truncate text-xs text-[#658354] hover:underline dark:text-[#85e0a3]"
                  >
                    {cleanUrl}
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                ) : null}
              </div>

              {/* Website ID */}
              <div className="px-3 py-2">
                <span className="rounded-md bg-[#e8f0e4] px-1.5 py-0.5 text-[11px] font-bold text-[#64745F] dark:bg-[#203423] dark:text-[#9fb49b]">
                  {w.website_id}
                </span>
              </div>

              {/* Type */}
              <div className="px-3 py-2">
                <SiteTypeCell siteType={w.site_type} />
              </div>

              {/* Platform */}
              <div className="px-3 py-2">
                <PlatformBadge platform={w.platform} />
              </div>

              {/* Status */}
              <div className="px-3 py-2">
                <StatusDot label={w.website_status} />
              </div>

              {/* Maintenance */}
              <div className="px-3 py-2">
                <StatusDot label={w.maintenance_status} />
              </div>

              {/* Renewal Date */}
              <div className="px-3 py-2 text-xs text-[#64745F] dark:text-[#9fb49b]">
                {w.current_billing_due_date ? formatDate(w.current_billing_due_date) : <span className="text-[#9fb49b]">—</span>}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" aria-label="Actions" className="border-[#dde5d8] dark:border-[#2f4a32]" />}>
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem render={<Link to="/websites/$websiteId" params={{ websiteId: String(w.id) }} />}>
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem render={<Link to="/websites/$websiteId/edit" params={{ websiteId: String(w.id) }} />}>
                      Edit website
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {websites.length > PAGE_SIZE ? (
        <div className="flex items-center justify-between text-sm text-[#64745F] dark:text-[#9fb49b]">
          <span>Showing {start + 1} to {showing} of {websites.length} websites</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-lg" disabled={page <= 1} onClick={() => setPage(p => p - 1)} aria-label="Previous">
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Button
                key={n}
                variant={n === page ? 'default' : 'ghost'}
                size="icon-lg"
                className={cn(n === page && 'bg-[#ddead1] text-[#658354] hover:bg-[#c7ddb5]')}
                onClick={() => setPage(n)}
              >
                {n}
              </Button>
            ))}
            <Button variant="outline" size="icon-lg" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} aria-label="Next">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#64745F] dark:text-[#9fb49b]">
          Showing 1 to {websites.length} of {websites.length} website{websites.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
