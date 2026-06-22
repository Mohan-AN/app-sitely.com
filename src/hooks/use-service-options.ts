import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createServiceOption, listServiceOptions, updateServiceOption } from '#/lib/service-options-api'
import type { ServiceOptionCategory } from '#/lib/service-options-api'
import { QUERY_KEYS } from '#/lib/constants/queryKeys'

export function useServiceOptions(category?: ServiceOptionCategory) {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE_OPTIONS, category ?? 'all'],
    queryFn: () => listServiceOptions(category),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateServiceOption() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ category, name }: { category: ServiceOptionCategory; name: string }) =>
      createServiceOption(category, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_OPTIONS] })
    },
  })
}

export function useUpdateServiceOption() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ option_id, ...input }: { option_id: string; name?: string; is_active?: boolean }) =>
      updateServiceOption(option_id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_OPTIONS] })
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update option.'),
  })
}
