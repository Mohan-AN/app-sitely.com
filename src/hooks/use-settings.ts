import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getSettings, updateRenewalWindowDays } from '#/lib/settings-api'
import { QUERY_KEYS } from '#/lib/constants/queryKeys'

export function useSettings() {
  return useQuery({
    queryKey: [QUERY_KEYS.SETTINGS],
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateRenewalWindowDays() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateRenewalWindowDays,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_STATS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEBSITES_LIST] })
      toast.success('Due Soon window updated.')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update setting.'),
  })
}
