import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/products.service';
import { QUERY_KEYS } from '@/utils/queries.keys';

export const useProducts = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.products.lists(),
        queryFn: async () => {
            const { data } = await ProductService.getProducts();
            return data;
        },
        ...options,
    });
};
export const useFeaturedProducts = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.products.featured(),
        queryFn: async () => {
            const { data } = await ProductService.getFeaturedProducts();
            return data;
        },
        ...options,
    });
};
export const useTrendingProducts = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.products.trending(),
        queryFn: async () => {
            const { data } = await ProductService.getTrendingProducts();
            return data;
        },
        ...options,
    });
};
