import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from '@/lib/toastify';
import { formatErrorMessage } from '@/utils/helper';
import { OrderService } from '@/services/orders.service';
import { invalidationPatterns, QUERY_KEYS } from '@/utils/queries.keys';
import useAuth from '@/hooks/useAuth';


export const useCompleteOrder = (options = {}) => {
    const queryClient = useQueryClient();
    const { sessionId } = useAuth();

    return useMutation({
        mutationFn: (payload) => OrderService.completeOrder(payload),
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


export const useMyOrders = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.myOrders.list(filters),
        queryFn: async () => {
            const { data } = await OrderService.getMyOrders(filters)
            return data
        },
        staleTime: 1000 * 60 * 5,
        ...options,
    });
};


// // //

export const useMyOrder = (reference, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.myOrders.detail(reference),
        queryFn: () => OrderService.getMyOrder(reference),
        enabled: !!reference,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reference) => OrderService.cancelOrder(reference),
        onSuccess: (data) => {
            invalidationPatterns.myOrders(queryClient);
            Toast.success('Order cancelled successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to cancel order';
            Toast.error(message);
        },
    });
};

export const useAllOrders = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.orders.list(filters),
        queryFn: () => OrderService.getAllOrders(filters),
        staleTime: 1000 * 60 * 2,
        ...options,
    });
};

export const useOrder = (reference, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.orders.detail(reference),
        queryFn: () => OrderService.getOrder(reference),
        enabled: !!reference,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reference, status }) =>
            OrderService.updateOrderStatus(reference, status),
        onSuccess: (data, variables) => {
            invalidationPatterns.orders(queryClient);
            invalidationPatterns.order(queryClient, variables.reference);
            Toast.success('Order status updated successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to update order status';
            Toast.error(message);
        },
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reference, data }) =>
            OrderService.updateOrder(reference, data),
        onSuccess: (data, variables) => {
            invalidationPatterns.orders(queryClient);
            invalidationPatterns.order(queryClient, variables.reference);
            Toast.success('Order updated successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to update order';
            Toast.error(message);
        },
    });
};

export const useBulkUpdateStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ references, status }) =>
            OrderService.bulkUpdateStatus(references, status),
        onSuccess: (data) => {
            invalidationPatterns.orders(queryClient);
            const successCount = data.data?.success_count || 0;
            Toast.success(`${successCount} orders updated successfully`);
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to update orders';
            Toast.error(message);
        },
    });
};

export const useDeleteOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reference) => OrderService.deleteOrder(reference),
        onSuccess: () => {
            invalidationPatterns.orders(queryClient);
            Toast.success('Order deleted successfully');
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Failed to delete order';
            Toast.error(message);
        },
    });
}