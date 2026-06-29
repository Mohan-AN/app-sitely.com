import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { listClientOptions } from '#/lib/clients-api'
import { DATA_STALE_TIME } from '#/lib/query-client'
import { confirmImport, createWebsite, deleteWebsite, getWebsite, getWebsiteActivity, getWebsiteProfit, getWebsiteStats, getWebsiteTimeline, listWebsites, previewImport, updateWebsite } from '#/lib/websites-api'
import { QUERY_KEYS } from '#/lib/constants/queryKeys'
import type { CreateWebsiteInput, UpdateWebsiteInput, WebsitesFilters } from '#/components/websites/types'
import type { ImportPayload } from '#/lib/websites-api'

export function useWebsites(filters: WebsitesFilters, page: number, limit = 10) {
  return useQuery({
    queryKey: [QUERY_KEYS.WEBSITES_LIST, { page, limit, ...filters }],
    queryFn: () => listWebsites(filters, page, limit),
    placeholderData: (prev) => prev,
    staleTime: DATA_STALE_TIME,
  })
}

export function useWebsiteStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.WEBSITES_STATS],
    queryFn: getWebsiteStats,
    staleTime: DATA_STALE_TIME,
  })
}

export function useClientOptions(search?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CLIENTS_OPTIONS, { search }],
    queryFn: () => listClientOptions(search),
    staleTime: DATA_STALE_TIME,
  })
}

export function useCreateWebsite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateWebsiteInput) => createWebsite(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] })
      toast.success('Website created successfully.')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to create website.'),
  })
}

export function useWebsite(websiteId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId],
    queryFn: () => getWebsite(websiteId),
    staleTime: DATA_STALE_TIME,
  })
}

export function useWebsiteActivity(websiteId: string, page: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.WEBSITE_ACTIVITY, websiteId, { page }],
    queryFn: () => getWebsiteActivity(websiteId, page),
    staleTime: DATA_STALE_TIME,
  })
}

// Fires GET /websites/:id/timeline?year=YYYY
// One call returns everything for the timeline: year range, months, billing per month, all events
export function useWebsiteTimeline(websiteId: string, year: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.WEBSITE_TIMELINE, websiteId, year],
    queryFn: () => getWebsiteTimeline(websiteId, year),
    staleTime: DATA_STALE_TIME,
    enabled: !!websiteId,
  })
}

// Returns the billing_id of the current unpaid/overdue billing period (or null if none).
// Uses the same cache key as useWebsiteTimeline so no extra network call if the timeline
// is already loaded by WebsiteDetail on the same page.
export function useCurrentBilling(websiteId: string) {
  const year = new Date().getFullYear()
  return useQuery({
    queryKey: [QUERY_KEYS.WEBSITE_TIMELINE, websiteId, year],
    queryFn: () => getWebsiteTimeline(websiteId, year),
    staleTime: DATA_STALE_TIME,
    enabled: !!websiteId,
    select: (data) => {
      const period = data.periods.find(
        (p) => p.billing && (p.billing.status === 'pending' || p.billing.status === 'overdue'),
      )
      if (!period?.billing) return null
      return {
        billingId:        period.billing.billing_id,
        invoiceFileUrl:   period.billing.invoice_file_url ?? null,
        invoiceFileName:  period.billing.invoice_file_name ?? null,
        periodLabel:      period.period_label,
      }
    },
  })
}

/** @deprecated use useCurrentBilling */
export function useCurrentBillingId(websiteId: string) {
  const billing = useCurrentBilling(websiteId)
  return { ...billing, data: billing.data?.billingId ?? null }
}

/** Returns all non-paid billing periods from hosted year to current year, sorted oldest first. */
export function useUnpaidBillingPeriods(websiteId: string, hostedDate: string | null) {
  const currentYear = new Date().getFullYear()
  const hostedYear = hostedDate ? new Date(hostedDate).getFullYear() : currentYear
  const years = Array.from({ length: currentYear - hostedYear + 1 }, (_, i) => hostedYear + i)

  const queries = useQueries({
    queries: years.map((year) => ({
      queryKey: [QUERY_KEYS.WEBSITE_TIMELINE, websiteId, year],
      queryFn: () => getWebsiteTimeline(websiteId, year),
      staleTime: DATA_STALE_TIME,
      enabled: !!websiteId && !!hostedDate,
    })),
  })

  const allPeriods = queries
    .flatMap((q) => q.data?.periods ?? [])
    .filter((p) => p.billing && p.billing.status !== 'paid' && p.billing.status !== 'upcoming')
    .sort((a, b) => a.period_start.localeCompare(b.period_start))

  return {
    periods: allPeriods,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  }
}

// Fires GET /websites/:id/profit?year=YYYY
// Returns the annual profit tiles: maintenance collected, paid features, costs, net profit
export function useWebsiteProfit(websiteId: string, year: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.WEBSITE_PROFIT, websiteId, year],
    queryFn: () => getWebsiteProfit(websiteId, year),
    staleTime: DATA_STALE_TIME,
    enabled: !!websiteId,
  })
}

export function useDeleteWebsite(websiteId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteWebsite(websiteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] })
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] })
      toast.success('Website deleted.')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to delete website.'),
  })
}

export function useImportPreview() {
  return useMutation({
    mutationFn: (payload: ImportPayload | FormData) => previewImport(payload),
    onError: (err: Error) => toast.error(err.message ?? 'Preview failed.'),
  })
}

export function useImportConfirm() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ImportPayload | FormData) => confirmImport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] })
    },
    onError: (err: Error) => toast.error(err.message ?? 'Import failed.'),
  })
}

export function useRenewDomain(websiteId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: {
      domainRenewalDate: string
      domainCost?: string | null
      domainLastVerified: string
      domainHandledBy?: 'our_side' | 'client_side'
      domainRemarks?: string
    }) => updateWebsite(websiteId, {
      domainRenewalDate: input.domainRenewalDate,
      domainCost: input.domainCost,
      domainLastVerified: input.domainLastVerified,
      domainHandledBy: input.domainHandledBy,
      domainRemarks: input.domainRemarks,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] })
      toast.success('Domain renewed.')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to renew domain.'),
  })
}

export function useUpdateWebsite(websiteId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateWebsiteInput) => updateWebsite(websiteId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_ACTIVITY, websiteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] })
      toast.success('Website updated successfully.')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update website.'),
  })
}
