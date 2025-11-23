import { ssrQuery } from '@/lib/ssrQuery';

export async function SSRWrapper({
    service,
    queryKey,
    params = [],
    children,
    fallback,
    errorFallback,
}) {
    try {
        return await ssrQuery({
            queryKey,
            queryFn: async () => {
                try {
                    const { data } = await service(...params);
                    return data;
                } catch (error) { return null }
            },
            children,
        });
    } catch (error) {
        if (errorFallback) {
            return errorFallback;
        }
        return fallback || children;
    }
}