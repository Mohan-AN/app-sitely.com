import { useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  AlertCircle, ArrowLeft, Check, CheckCircle2, ChevronRight,
  CloudUpload, Download, Info, Loader2, MoreHorizontal, Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import { useImportConfirm, useImportPreview } from '#/hooks/use-websites'
import type { ImportConfirmResult, ImportPreviewItem, ImportValidationFailure } from '#/lib/websites-api'
import { IMPORT_COLUMNS, IMPORT_TYPE_META, downloadTemplate } from './import-config'
import type { ImportType } from './import-config'

type Step = 'upload' | 'preview'

// Backend JSON schema requires camelCase keys (clientName, projectName…).
// errors[].row echoes the raw CSV which uses snake_case, so we must convert
// before sending re-validate or confirm JSON payloads.
function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}
function convertRow(row: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(row).map(([k, v]) => [toCamel(k), v]))
}

// ── CSV parser ────────────────────────────────────────────────────────────────
function splitCsvLine(line: string): string[] {
  const result: string[] = []
  let cur = ''; let inQ = false
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ }
    else if (ch === ',' && !inQ) { result.push(cur); cur = '' }
    else { cur += ch }
  }
  result.push(cur)
  return result
}
function parseCsvText(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = splitCsvLine(lines[0]).map((h) => h.trim())
  return lines.slice(1).filter((l) => l.trim()).map((line) => {
    const vals = splitCsvLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = vals[i]?.trim() ?? '' })
    return row
  })
}

function isValidationFailure(data: unknown): data is ImportValidationFailure {
  return (
    typeof data === 'object' && data !== null &&
    'errors' in data && Array.isArray((data as ImportValidationFailure).errors)
  )
}

// ─── Small cell helpers ───────────────────────────────────────────────────────

function Dash() {
  return <span className="text-[#D1D5DB]">—</span>
}

function RawPill({ val }: { val?: string }) {
  if (!val) return <Dash />
  return <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-medium text-[#374151]">{val}</span>
}

// ─── Type tab ─────────────────────────────────────────────────────────────────

function TypeTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border-b-2 px-5 py-3 text-[13px] font-semibold transition',
        active ? 'border-[#4F5DF5] text-[#4F5DF5]' : 'border-transparent text-[#6B7280] hover:text-[#374151]',
      )}
    >
      {label}
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function ImportPage() {
  const navigate = useNavigate()
  const fileRef  = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const [step,       setStep]       = useState<Step>('upload')
  const [importType, setImportType] = useState<ImportType>('websites')

  // Pending file — selected but not yet submitted
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  // Preview / error state
  const [backendRows,   setBackendRows]   = useState<Record<string, string>[]>([])
  const [backendErrors, setBackendErrors] = useState<Record<number, Record<string, string>>>({})
  const [totalCount,    setTotalCount]    = useState(0)
  const [failedCount,   setFailedCount]   = useState(0)
  const [previewItems,  setPreviewItems]  = useState<ImportPreviewItem[]>([])
  const [, setDoneResult] = useState<ImportConfirmResult | null>(null)
  const [skipDuplicates, setSkipDuplicates] = useState(false)
  const [editingCell,    setEditingCell]    = useState<{ row: number; key: string } | null>(null)
  // camelCase rows to send on confirm after a successful re-validate
  const [fixedRows, setFixedRows] = useState<Record<string, string>[] | null>(null)
  // raw CSV rows parsed client-side — used to show full details in success preview
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([])

  const previewMutation = useImportPreview()
  const confirmMutation = useImportConfirm()
  const columns = IMPORT_COLUMNS[importType]

  // ── Switch import type — reset everything ─────────────────────────────────
  function switchType(t: ImportType) {
    setImportType(t)
    setStep('upload')
    setPendingFile(null)
    setBackendRows([])
    setBackendErrors({})
    setPreviewItems([])
    setTotalCount(0)
    setFailedCount(0)
    setFixedRows(null)
    setParsedRows([])
    previewMutation.reset()
    confirmMutation.reset()
  }

  // ── File selected — just store it, don't submit yet ───────────────────────
  function handleFile(f: File) {
    setPendingFile(f)
    previewMutation.reset()
  }

  // ── Preview Data clicked — submit to backend then go to preview ───────────
  async function handlePreviewData() {
    if (!pendingFile) return
    const fd = new FormData()
    const fieldName = importType === 'paymentHistory' ? 'paymentHistory'
      : importType === 'rateHistory' ? 'rateHistory'
      : 'websites'
    fd.append(fieldName, pendingFile)
    // Parse CSV client-side for full-detail display in the success preview
    try { const text = await pendingFile.text(); setParsedRows(parseCsvText(text)) } catch { /* non-fatal */ }
    try {
      const data = await previewMutation.mutateAsync(fd)
      applyPreviewResponse(data)
    } catch {
      // error shown inline
    }
  }

  // ── Process backend response ──────────────────────────────────────────────
  function applyPreviewResponse(data: unknown) {
    if (isValidationFailure(data)) {
      setBackendRows(data.errors.map((e) => e.row))
      const errMap: Record<number, Record<string, string>> = {}
      data.errors.forEach((e, idx) => { errMap[idx] = e.errors })
      setBackendErrors(errMap)
      setTotalCount(data.total)
      setFailedCount(data.failed)
      setPreviewItems([])
      setStep('preview')
    } else if (Array.isArray(data)) {
      setPreviewItems(data as ImportPreviewItem[])
      setBackendRows([])
      setBackendErrors({})
      setTotalCount(data.length)
      setFailedCount(0)
      setStep('preview')
    } else {
      toast.error('Unexpected response from server.')
    }
  }

  // ── Inline edit ───────────────────────────────────────────────────────────
  function handleCellChange(rowIdx: number, key: string, value: string) {
    setBackendRows((prev) => { const next = [...prev]; next[rowIdx] = { ...next[rowIdx], [key]: value }; return next })
    setBackendErrors((prev) => {
      const rowErrs = { ...(prev[rowIdx] ?? {}) }
      delete rowErrs[key]
      return { ...prev, [rowIdx]: rowErrs }
    })
  }

  // ── Re-validate ───────────────────────────────────────────────────────────
  async function handleRevalidate() {
    // Backend JSON schema requires camelCase — convert from the snake_case we received
    const camelRows = backendRows.map(convertRow)
    const payload = importType === 'paymentHistory' ? { paymentHistory: camelRows }
      : importType === 'rateHistory' ? { rateHistory: camelRows }
      : { websites: camelRows }
    try {
      const data = await previewMutation.mutateAsync(payload)
      // If re-validate succeeds (no errors), store these camelCase rows for confirm
      if (!isValidationFailure(data)) setFixedRows(camelRows)
      else setFixedRows(null)
      applyPreviewResponse(data)
    } catch { /* error shown inline */ }
  }

  // ── Confirm import ────────────────────────────────────────────────────────
  async function handleConfirm() {
    const fieldName = importType === 'paymentHistory' ? 'paymentHistory'
      : importType === 'rateHistory' ? 'rateHistory'
      : 'websites'

    let payload: import('#/lib/websites-api').ImportPayload | FormData

    if (fixedRows && fixedRows.length > 0) {
      // User fixed errors inline → re-validate passed → send those camelCase rows
      payload = { [fieldName]: fixedRows, skipDuplicates }
    } else if (backendRows.length > 0) {
      // Errors still showing (user cleared all cell errors locally) → convert to camelCase
      payload = { [fieldName]: backendRows.map(convertRow), skipDuplicates }
    } else if (pendingFile) {
      // Original file had no errors (success path) → re-upload the file as FormData
      const fd = new FormData()
      fd.append(fieldName, pendingFile)
      if (skipDuplicates) fd.append('skipDuplicates', 'true')
      payload = fd
    } else {
      toast.error('No data to import.')
      return
    }

    try {
      const result = await confirmMutation.mutateAsync(payload)
      setDoneResult(result)
      const parts = [
        result.clients_created   && `${result.clients_created} client${result.clients_created !== 1 ? 's' : ''}`,
        result.websites_created  && `${result.websites_created} website${result.websites_created !== 1 ? 's' : ''}`,
        result.billing_imported  && `${result.billing_imported} billing record${result.billing_imported !== 1 ? 's' : ''}`,
        result.rate_history_imported && `${result.rate_history_imported} rate entr${result.rate_history_imported !== 1 ? 'ies' : 'y'}`,
      ].filter(Boolean).join(', ')
      toast.success(`Import complete — ${parts || 'no new records'} imported.`)
      navigate({ to: '/', search: { page: 1, limit: 15, showFilters: false } })
    } catch { /* error shown inline */ }
  }

  const hasErrors  = Object.values(backendErrors).some((e) => Object.keys(e).length > 0)
  const validCount = totalCount - failedCount

  // ══════════════════════════════════════════════════════════════════════════
  // DONE
  // ══════════════════════════════════════════════════════════════════════════


  // ══════════════════════════════════════════════════════════════════════════
  // UPLOAD
  // ══════════════════════════════════════════════════════════════════════════

  if (step === 'upload') {
    return (
      <main className="flex h-full flex-col overflow-hidden bg-[#F4F5F8]">

        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white px-6">
          <div className="flex items-center gap-2 text-[13px]">
            <Link to="/" search={{ page: 1, limit: 15, showFilters: false }} className="text-[#6B7280] transition hover:text-[#374151]">
              Websites
            </Link>
            <ChevronRight className="size-3.5 text-[#D1D5DB]" />
            <span className="font-bold text-[#111827]">Import Data</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadTemplate(importType)}
              className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-[#4F5DF5] px-4 text-[12.5px] font-semibold text-[#4F5DF5] transition hover:bg-[#EEEFFE]"
            >
              <Download className="size-3.5" /> Download Template
            </button>
            <button type="button" className="inline-flex size-9 items-center justify-center rounded-[9px] border border-[#E5E7EB] text-[#6B7280] transition hover:bg-[#F9FAFB]">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex shrink-0 border-b border-[#E5E7EB] bg-white px-6">
          {(Object.keys(IMPORT_TYPE_META) as ImportType[]).map((t) => (
            <TypeTab key={t} label={IMPORT_TYPE_META[t].label} active={importType === t} onClick={() => switchType(t)} />
          ))}
        </div>

        {/* Page title */}
        <div className="shrink-0 px-6 pt-4 pb-3">
          <h1 className="text-[20px] font-bold text-[#111827]">
            {importType === 'websites' ? 'Import Websites' : importType === 'paymentHistory' ? 'Import Payment History' : 'Import Rate History'}
          </h1>
          <p className="mt-0.5 text-[12.5px] text-[#6B7280]">{IMPORT_TYPE_META[importType].description}</p>
        </div>

        {/* Two-column body */}
        <div className="flex min-h-0 flex-1 gap-5 overflow-hidden px-6 pb-4">

          {/* Left — instructions card */}
          <div className="flex w-[360px] shrink-0 flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white">

            {/* Step 1 */}
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#4F5DF5] text-[12px] font-bold text-white">1</span>
                <div className="flex-1">
                  <p className="text-[13.5px] font-bold text-[#111827]">Download Template</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[#6B7280]">Download our CSV template and fill in your data.</p>
                  <button
                    type="button"
                    onClick={() => downloadTemplate(importType)}
                    className="mt-2.5 inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-[#4F5DF5] px-3.5 text-[12px] font-semibold text-[#4F5DF5] transition hover:bg-[#EEEFFE]"
                  >
                    <Download className="size-3.5" /> Download CSV Template
                  </button>
                </div>
              </div>
            </div>

            <div className="mx-5 border-t border-[#F0F1F3]" />

            {/* Step 2 */}
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#4F5DF5] text-[12px] font-bold text-white">2</span>
                <div className="flex-1">
                  <p className="text-[13.5px] font-bold text-[#111827]">Required Fields</p>
                  <p className="mt-0.5 mb-2.5 text-[12px] leading-relaxed text-[#6B7280]">These fields are mandatory in your CSV file.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {columns.filter((c) => c.required).map((c) => (
                      <span key={c.key} className="rounded-[6px] bg-[#FEF2F2] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#DC2626]">{c.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="mx-5 mb-4 mt-1 rounded-[10px] bg-[#EFF6FF] p-3.5">
              <div className="flex items-start gap-2.5">
                <Info className="mt-0.5 size-4 shrink-0 text-[#3B82F6]" />
                <div>
                  <p className="text-[13px] font-bold text-[#3B82F6]">How it works</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-[#374151]">
                    Upload your CSV file. We'll validate the data and show you a preview before importing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — upload zone */}
          <div className="flex min-h-0 flex-1 flex-col">
            <div
              className={cn(
                'flex flex-1 flex-col items-center justify-center rounded-[14px] border-[1.5px] border-dashed bg-white transition',
                dragOver ? 'border-[#4F5DF5] bg-[#F5F6FF]' : 'border-[#D1D5DB]',
              )}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            >
              <div className="flex flex-col items-center gap-4 p-10 text-center">
                <div className="flex size-[60px] items-center justify-center rounded-full bg-[#F3F4F6]">
                  <CloudUpload className="size-7 text-[#9CA3AF]" />
                </div>
                <div>
                  <p className="text-[17px] font-bold text-[#111827]">Upload CSV File</p>
                  <p className="mt-1.5 text-[13px] text-[#6B7280]">
                    Drag and drop your CSV file here<br />or click the button below to browse
                  </p>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
                />

                {pendingFile ? (
                  <div className="flex items-center gap-3 rounded-[10px] border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-[#16A34A]" />
                    <div className="min-w-0 text-left">
                      <p className="truncate text-[13px] font-semibold text-[#14532D]">{pendingFile.name}</p>
                      <p className="text-[11.5px] text-[#16A34A]">Ready to preview</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setPendingFile(null); setTimeout(() => fileRef.current?.click(), 0) }}
                      className="ml-2 text-[11px] font-semibold text-[#6B7280] underline hover:text-[#374151]"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#4F5DF5] px-8 text-[13.5px] font-semibold text-white transition hover:bg-[#3F4DE0]"
                    >
                      <Upload className="size-4" /> Choose CSV File
                    </button>
                    <p className="text-[12px] text-[#C4C9D4]">.csv files only</p>
                  </>
                )}

                {previewMutation.isError && (
                  <p className="text-[12px] font-semibold text-[#DC2626]">{(previewMutation.error as Error).message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom info bar */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#E5E7EB] bg-white px-6 py-3">
          <div className="flex items-center gap-2.5">
            <Info className="size-4 shrink-0 text-[#4F5DF5]" />
            <p className="text-[13px] text-[#6B7280]">You will be able to review and confirm the data before it's imported.</p>
          </div>
          <button
            type="button"
            disabled={!pendingFile || previewMutation.isPending}
            onClick={handlePreviewData}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-[9px] px-4 text-[12.5px] font-semibold transition',
              pendingFile && !previewMutation.isPending
                ? 'bg-[#4F5DF5] text-white hover:bg-[#3F4DE0]'
                : 'cursor-not-allowed bg-[#E5E7EB] text-[#9CA3AF]',
            )}
          >
            {previewMutation.isPending ? (
              <><Loader2 className="size-3.5 animate-spin" /> Validating…</>
            ) : (
              <>Preview Data <ChevronRight className="size-3.5" /></>
            )}
          </button>
        </div>
      </main>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PREVIEW — success (no errors)
  // ══════════════════════════════════════════════════════════════════════════

  if (step === 'preview' && previewItems.length > 0) {
    return (
      <div className="flex h-full flex-col bg-[#F4F5F8]">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setStep('upload')} className="flex size-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]">
              <ArrowLeft className="size-4" />
            </button>
            <div>
              <h1 className="text-[15px] font-semibold text-[#11141A]">Preview — {IMPORT_TYPE_META[importType].label}</h1>
              <p className="text-[12px] text-[#6B7280]">{pendingFile?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-[#6B7280]">
              <input type="checkbox" checked={skipDuplicates} onChange={(e) => setSkipDuplicates(e.target.checked)} className="accent-[#4F5DF5]" />
              Skip duplicates
            </label>
            <Button onClick={handleConfirm} disabled={confirmMutation.isPending} className="gap-1.5">
              <Check className="size-3.5" />
              {confirmMutation.isPending ? 'Importing…' : 'Confirm Import'}
            </Button>
          </div>
        </div>
        <div className="m-6 rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-3 text-[13px] text-[#166534]">
          <span className="font-semibold">{previewItems.length} row{previewItems.length !== 1 ? 's' : ''}</span> validated successfully. Review below before confirming.
        </div>
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="overflow-auto rounded-xl border border-[#E5E7EB] bg-white">
            <table className="min-w-max text-[12px]">
              <thead className="bg-[#F7F8FA]">
                <tr>
                  <th className="sticky left-0 z-10 bg-[#F7F8FA] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">#</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Import Status</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Project</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Client</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Client Type</th>
                  {importType === 'websites' && <>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">URL</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Site Type</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Platform</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Website Status</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Maint. Status</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Maint. Amount</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Billing Cycle</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Domain</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Domain By</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Domain Provider</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Domain Renewal</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Domain Cost</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Hosting Provider</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Hosting Cost</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Hosting Renewal</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Build Type</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Build Cost</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Start Date</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Hosted Date</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Remarks</th>
                  </>}
                  {importType === 'paymentHistory' && <>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Period</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Amount</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Due Date</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Pay Status</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Payment Date</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Mode</th>
                  </>}
                  {importType === 'rateHistory' && <>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Old Rate</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">New Rate</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Effective Date</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Remarks</th>
                  </>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {previewItems.map((item, i) => {
                  const raw = parsedRows[i] ?? {}
                  const isDupe = !!item.duplicate_website
                  return (
                    <tr key={i} className={cn('hover:bg-[#F7F8FA]', isDupe && 'bg-[#FFFCF4]')}>
                      <td className="sticky left-0 bg-inherit px-3 py-2 text-[#A0A5AF]">{i + 1}</td>
                      <td className="px-3 py-2">
                        {isDupe
                          ? <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-medium text-[#92400E]">Duplicate</span>
                          : <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[11px] font-medium text-[#166534]">New</span>}
                      </td>
                      <td className="px-3 py-2 font-medium text-[#11141A] whitespace-nowrap">{item.project_name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-[#374151]">{item.client.name}</td>
                      <td className="px-3 py-2">
                        {item.client.mode === 'create'
                          ? <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-medium text-[#3B82F6]">New Client</span>
                          : <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-medium text-[#6B7280]">Existing</span>}
                      </td>
                      {importType === 'websites' && <>
                        <td className="px-3 py-2 text-[#374151] max-w-[160px] truncate">{raw.url || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.site_type || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.platform || <Dash />}</td>
                        <td className="px-3 py-2 whitespace-nowrap"><RawPill val={raw.website_status} /></td>
                        <td className="px-3 py-2 whitespace-nowrap"><RawPill val={raw.maintenance_status} /></td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.maintenance_amount ? `₹${raw.maintenance_amount}` : <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] capitalize whitespace-nowrap">{raw.billing_cycle || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.domain_name || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.domain_handled_by ? raw.domain_handled_by.replace('_', ' ') : <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.domain_provider || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.domain_renewal_date || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.domain_cost ? `₹${raw.domain_cost}` : <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.hosting_provider || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.hosting_cost ? `₹${raw.hosting_cost}` : <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.hosting_renewal_date || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.build_type || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.build_cost ? `₹${raw.build_cost}` : <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.start_date || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.hosted_date || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] max-w-[160px] truncate">{raw.remarks || <Dash />}</td>
                      </>}
                      {importType === 'paymentHistory' && <>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.period_label || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.amount ? `₹${raw.amount}` : <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.due_date || <Dash />}</td>
                        <td className="px-3 py-2 whitespace-nowrap"><RawPill val={raw.status} /></td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.payment_received_date || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.payment_mode || <Dash />}</td>
                      </>}
                      {importType === 'rateHistory' && <>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.old_rate ? `₹${raw.old_rate}` : <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.new_rate ? `₹${raw.new_rate}` : <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] whitespace-nowrap">{raw.effective_date || <Dash />}</td>
                        <td className="px-3 py-2 text-[#374151] max-w-[160px] truncate">{raw.remarks || <Dash />}</td>
                      </>}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PREVIEW — validation errors (edit + re-validate)
  // ══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex h-full flex-col bg-[#F4F5F8]">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setStep('upload')} className="flex size-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]">
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-[15px] font-semibold text-[#11141A]">Fix Errors — {IMPORT_TYPE_META[importType].label}</h1>
            <p className="text-[12px] text-[#6B7280]">{pendingFile?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasErrors ? (
            <Button variant="outline" size="sm" onClick={handleRevalidate} disabled={previewMutation.isPending}>
              {previewMutation.isPending ? 'Validating…' : 'Re-validate'}
            </Button>
          ) : (
            <>
              <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-[#6B7280]">
                <input type="checkbox" checked={skipDuplicates} onChange={(e) => setSkipDuplicates(e.target.checked)} className="accent-[#4F5DF5]" />
                Skip duplicates
              </label>
              <Button onClick={handleConfirm} disabled={confirmMutation.isPending} className="gap-1.5">
                <Check className="size-3.5" />
                {confirmMutation.isPending ? 'Importing…' : 'Confirm Import'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mx-6 mt-4 flex items-start gap-3 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] px-4 py-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-[#DC2626]" />
        <p className="text-[12.5px] text-[#7F1D1D]">
          <span className="font-semibold">{failedCount} row{failedCount !== 1 ? 's' : ''} failed validation</span>
          {validCount > 0 && <span className="ml-2 font-medium text-[#166534]">· {validCount} valid</span>}
          <span className="ml-2 text-[#6B7280]">· {totalCount} total</span>
          <span className="ml-2">Fix the highlighted cells then click Re-validate.</span>
        </p>
      </div>

      <div className="flex-1 overflow-auto p-6 pt-4">
        <div className="overflow-auto rounded-xl border border-[#E5E7EB] bg-white">
          <table className="min-w-max text-[12px]">
            <thead className="bg-[#F7F8FA]">
              <tr>
                <th className="sticky left-0 z-10 bg-[#F7F8FA] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">#</th>
                {columns.map((col) => (
                  <th key={col.key} style={{ minWidth: col.width }} className="whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                    {col.label}{col.required && <span className="ml-0.5 text-[#DC2626]">*</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {backendRows.map((row, rowIdx) => {
                const rowErrors = backendErrors[rowIdx] ?? {}
                const rowHasErr = Object.keys(rowErrors).length > 0
                return (
                  <tr key={rowIdx} className={cn(rowHasErr ? 'bg-[#FFF8F8]' : 'hover:bg-[#F7F8FA]')}>
                    <td className="sticky left-0 z-10 bg-inherit px-3 py-2 text-[#A0A5AF]">{rowIdx + 1}</td>
                    {columns.map((col) => {
                      const val    = row[col.key] ?? ''
                      const err    = rowErrors[col.key]
                      const isEdit = editingCell?.row === rowIdx && editingCell.key === col.key
                      return (
                        <td key={col.key} className={cn('px-2 py-1', err ? 'bg-[#FEE2E2]' : '')}>
                          {isEdit ? (
                            <input
                              autoFocus
                              type="text"
                              defaultValue={val}
                              onBlur={(e) => { handleCellChange(rowIdx, col.key, e.target.value); setEditingCell(null) }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') { handleCellChange(rowIdx, col.key, e.currentTarget.value); setEditingCell(null) }
                                else if (e.key === 'Escape') setEditingCell(null)
                              }}
                              className="w-full min-w-[80px] rounded border border-[#4F5DF5] bg-white px-1.5 py-0.5 text-[12px] outline-none"
                            />
                          ) : (
                            <div>
                              <button
                                type="button"
                                onClick={() => setEditingCell({ row: rowIdx, key: col.key })}
                                className={cn('block w-full rounded px-1.5 py-0.5 text-left hover:bg-[#F0F1FF]', err ? 'text-[#DC2626]' : val ? 'text-[#374151]' : 'text-[#C5C8CF]')}
                              >
                                {err ? <span className="flex items-center gap-1"><AlertCircle className="size-3 shrink-0" /><span>{val || 'empty'}</span></span> : val || '—'}
                              </button>
                              {err && <p className="mt-0.5 px-1.5 text-[10.5px] text-[#DC2626]">{err}</p>}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
