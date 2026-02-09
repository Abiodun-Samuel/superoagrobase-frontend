import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/products.service';
import { QUERY_KEYS } from '@/utils/queries.keys';

export const useProducts = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.products.lists(filters),
        queryFn: async () => {
            const data = await ProductService.getProducts(filters);
            return data;
        },
        staleTime: 60000,
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
