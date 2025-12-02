import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // or your router
import { QUERY_KEYS } from '@/utils/queries.keys';
import Toast from '@/lib/toastify';
import useAuth from '@/hooks/useAuth';
import { formatErrorMessage } from '@/utils/helper';
import { OrderService } from '@/services/orders.service';

export const useCreateOrder = (options = {}) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { sessionId, user } = useAuth();

    return useMutation({
        mutationFn: (payload) => OrderService.createOrder(payload),
        onSuccess: (response) => {
            // Invalidate orders query
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.order.detail()
            });

            // Clear cart from cache
            queryClient.setQueryData(
                QUERY_KEYS.cart.detail(sessionId, user?.id),
                null
            );

            // Invalidate cart to trigger refetch
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId, user?.id)
            });

            Toast.success(response.message || 'Order has been created successfully.');

            router.push('/');

            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to create order.');
            options.onError?.(error);
        },
    });
};