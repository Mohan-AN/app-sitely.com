import { SearchX } from 'lucide-react'
import { Button } from '#/components/ui/button'

interface NoResultsProps {
  message?: string
  onClear?: () => void
}

export function NoResults({ message = 'No results found.', onClear }: NoResultsProps) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-center text-[#64745F]">
      <div className="flex size-12 items-center justify-center rounded-xl border border-[#c7ddb5] bg-[#ddead1]/45 text-[#658354]">
        <SearchX className="size-5" />
      </div>
      <p className="text-sm font-semibold">{message}</p>
      {onClear ? (
        <Button type="button" variant="outline" size="sm" className="border-[#c7ddb5]" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </div>
  )
}
