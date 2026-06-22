import { i as ApiError } from "./utils-C3dXA-e9.js";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/lib/query-client.ts
var DATA_STALE_TIME = 3e4;
var queryClient = new QueryClient({ defaultOptions: {
	queries: {
		staleTime: DATA_STALE_TIME,
		refetchOnWindowFocus: false,
		retry: (failureCount, error) => {
			if (error instanceof ApiError && error.status && error.status < 500) return false;
			return failureCount < 2;
		}
	},
	mutations: {
		retry: false,
		onError: (error) => {
			if (error instanceof ApiError) toast.error(error.message ?? "Something went wrong. Please try again.");
			else if (error instanceof TypeError) toast.error("Could not reach the server. Check your connection.");
			else {
				toast.error("Something went wrong. Please try again.");
				console.error(error);
			}
		}
	}
} });
//#endregion
export { queryClient as n, DATA_STALE_TIME as t };
