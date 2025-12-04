import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // or your router
import { QUERY_KEYS } from '@/utils/queries.keys';
import Toast from '@/lib/toastify';
import useAuth from '@/hooks/useAuth';
import { formatErrorMessage } from '@/utils/helper';
import { OrderService } from '@/services/orders.service';
import { useClearCart } from './cart.query';

export const useCreateOrder = (options = {}) => {
    const router = useRouter();
    const { mutate } = useClearCart()

    return useMutation({
        mutationFn: (payload) => OrderService.createOrder(payload),
        onSuccess: (response) => {
            mutate()
            Toast.success(response.message || 'Order has been created successfully.');

            router.push('/dashboard/orders');

            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to create order.');
            options.onError?.(error);
        },
    });
};