import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { cache } from 'react';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 0,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient;

export const getQueryClient = cache(() => {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
})
