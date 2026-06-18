import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient, deleteClient, getClient, listClients, updateClient } from '#/lib/clients-api'
import { DATA_STALE_TIME } from '#/lib/query-client'
import { QUERY_KEYS } from '#/lib/constants/queryKeys'
import type { ClientInput, ClientsFilters } from '#/components/clients/types'

export function useClients(filters: ClientsFilters, page: number, limit = 20, options?: { keepPrevious?: boolean }) {
  return useQuery({
    queryKey: [QUERY_KEYS.CLIENTS_LIST, { page, limit, ...filters }],
    queryFn: () => listClients(filters, page, limit),
    staleTime: DATA_STALE_TIME,
    placeholderData: options?.keepPrevious ? keepPreviousData : undefined,
  })
}

export function useClient(clientId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.CLIENT_DETAIL, clientId],
    queryFn: () => getClient(clientId),
    staleTime: DATA_STALE_TIME,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ClientInput) => createClient(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENTS_LIST] })
      toast.success('Client created successfully.')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to create client.'),
  })
}

export function useUpdateClient(clientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ClientInput) => updateClient(clientId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENTS_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENT_DETAIL, clientId] })
      toast.success('Client updated successfully.')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to update client.'),
  })
}

export function useDeleteClient(clientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLIENTS_LIST] })
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.CLIENT_DETAIL, clientId] })
      toast.success('Client deleted.')
    },
    onError: (err: Error) => toast.error(err.message ?? 'Failed to delete client.'),
  })
}
