import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { attachBillingInvoice, listPayments, recordPayment } from '#/lib/billing-api'
import { QUERY_KEYS } from '#/lib/constants/queryKeys'
import { DATA_STALE_TIME } from '#/lib/query-client'
import type { RecordPaymentInput } from '#/lib/billing-api'

export function usePayments(websiteId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [QUERY_KEYS.WEBSITE_BILLING, websiteId, { page, limit }],
    queryFn: () => listPayments(websiteId, page, limit),
    staleTime: DATA_STALE_TIME,
    enabled: !!websiteId,
  })
}

export function useAttachInvoice(websiteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ billingId, file }: { billingId: string; file: File }) =>
      attachBillingInvoice(websiteId, billingId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_TIMELINE, websiteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_BILLING, websiteId] })
      toast.success('Invoice attached.')
    },
  })
}

export function useRecordPayment(websiteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RecordPaymentInput) => recordPayment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_BILLING, websiteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_TIMELINE, websiteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_DETAIL, websiteId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] })
      toast.success('Payment recorded.')
    },
  })
}
