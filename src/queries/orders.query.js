import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from '@/lib/toastify';
import { formatErrorMessage } from '@/utils/helper';
import { OrderService } from '@/services/orders.service';
import { QUERY_KEYS } from '@/utils/queries.keys';
import useAuth from '@/hooks/useAuth';

export const useCreateOrder = (options = {}) => {
    const queryClient = useQueryClient();
    const { sessionId } = useAuth();

    return useMutation({
        mutationFn: (payload) => OrderService.createOrder(payload),
        onSuccess: async (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart.details(sessionId) })
            window.location.href = response?.data?.redirectUrl;
            Toast.success(response.message || 'Order has been created successfully.');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to create order.');
            options.onError?.(error);
        },
    });
};

export const useGetOrderByReference = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.order.detail(params),
        queryFn: async () => {
            const { data } = await OrderService.getOrderByReference(params);
            return data;
        },
        retry: false,
        staleTime: 0,
        ...options,
    });
};