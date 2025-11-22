import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/services/category.service';
import { QUERY_KEYS } from '@/utils/queryKeys';

export const useCategories = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.Categories.List,
        queryFn: async () => {
            const { data } = await CategoryService.list();
            return data;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000,
        ...options,
    });
};
