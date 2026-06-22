import { QueryClient } from '@tanstack/react-query'

export const DATA_STALE_TIME = 60 * 1000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DATA_STALE_TIME,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})
