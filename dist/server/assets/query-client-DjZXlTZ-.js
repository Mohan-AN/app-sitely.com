import { QueryClient } from "@tanstack/react-query";
//#region src/lib/query-client.ts
var DATA_STALE_TIME = 60 * 1e3;
var queryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: DATA_STALE_TIME,
	refetchOnWindowFocus: false,
	retry: false
} } });
//#endregion
export { queryClient as n, DATA_STALE_TIME as t };
