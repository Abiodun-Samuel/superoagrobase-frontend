import { useQuery } from '@tanstack/react-query';
import { TransactionService } from '@/services/transactions.service';
import { QUERY_KEYS } from '@/utils/queries.keys';
import Toast from '@/lib/toastify';

export const useVerifyTransaction = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.transaction.detail(params),
        queryFn: async () => {
            try {
                const response = await TransactionService.verifyTransaction(params);
                console.log(response)
                Toast.success(response.message || 'Payment verified successfully!');
                return response;
            } catch (error) {
                const message = formatErrorMessage(error);
                Toast.error(message || 'Failed to verify transaction.');
                throw error;
            }
        },
        retry: 0, // Retry once on failure
        staleTime: 0, // Always fetch fresh data
        gcTime: 5 * 60 * 1000, // Cache for 5 minutes (formerly cacheTime)
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // Don't refetch on mount if data exists
        ...options,
    });
};