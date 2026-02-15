import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services/admin.service';
import { QUERY_KEYS } from '@/utils/queries.keys';

export const useDashboardStats = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.admin.dashboard(),
        queryFn: async () => {
            const response = await AdminService.getDashboardStats();
            return response;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
        ...options,
    });
};