import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from './queryClient';

export async function ssrQuery({ queryKey, queryFn, children }) {
    const client = getQueryClient();

    await client.prefetchQuery({
        queryKey,
        queryFn,
    });

    return (
        <HydrationBoundary state={dehydrate(client)}>
            {children}
        </HydrationBoundary>
    );
}