import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '#/lib/api'

export const DATA_STALE_TIME = 30_000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DATA_STALE_TIME,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status && error.status < 500) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
      onError: (error) => {
        if (error instanceof ApiError) {
          toast.error(error.message ?? 'Something went wrong. Please try again.')
        } else if (error instanceof TypeError) {
          toast.error('Could not reach the server. Check your connection.')
        } else {
          toast.error('Something went wrong. Please try again.')
          console.error(error)
        }
      },
    },
  },
})
