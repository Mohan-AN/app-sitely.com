import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { listClientOptions } from '#/lib/clients-api'
import { DATA_STALE_TIME } from '#/lib/query-client'
import { createWebsite, deleteWebsite, getWebsite, getWebsiteActivity, getWebsiteStats, listWebsites, updateWebsite } from '#/lib/websites-api'
import { QUERY_KEYS } from '#/lib/constants/queryKeys'
import type { CreateWebsiteInput, UpdateWebsiteInput, WebsitesFilters } from '#/components/websites/types'

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
