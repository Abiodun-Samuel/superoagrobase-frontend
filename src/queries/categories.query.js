import { useQuery } from '@tanstack/react-query';
import { CategoryService } from '@/services/categories.service';
import { QUERY_KEYS } from '@/utils/queries.keys';

export const useCategories = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.categories.lists(),
        queryFn: async () => {
            const { data } = await CategoryService.getCategories();
            return data;
        },
        ...options,
    });
};
