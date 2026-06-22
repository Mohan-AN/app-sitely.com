import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createRequest, listRequests, updateRequest } from '#/lib/requests-api'
import { QUERY_KEYS } from '#/lib/constants/queryKeys'
import { DATA_STALE_TIME } from '#/lib/query-client'
import type { CreateRequestInput, UpdateRequestInput } from '#/lib/requests-api'

export function useRequests(websiteId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: [QUERY_KEYS.WEBSITE_REQUESTS, websiteId, { page, limit }],
    queryFn: () => listRequests(websiteId, page, limit),
    staleTime: DATA_STALE_TIME,
    enabled: !!websiteId,
  })
}

export function useCreateRequest(websiteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRequestInput) => createRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_REQUESTS, websiteId] })
      toast.success('Request submitted.')
    },
  })
}

export function useUpdateRequest(websiteId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, input }: { requestId: string; input: UpdateRequestInput }) =>
      updateRequest(websiteId, requestId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITE_REQUESTS, websiteId] })
      toast.success('Request updated.')
    },
  })
}
