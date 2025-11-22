import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';
import { QUERY_KEYS } from '@/utils/queryKeys';

export const useFeaturedProducts = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.Products.FeaturedProducts,
        queryFn: async () => {
            const { data } = await ProductService.featuredProducts();
            return data;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000,
        ...options,
    });
};
