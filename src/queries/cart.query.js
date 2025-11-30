import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/queries.keys';
import { CartService } from '@/services/cart.service';
import Toast from '@/lib/toastify';
import useAuth from '@/hooks/useAuth';
import { formatErrorMessage } from '@/utils/helper';

export const useCart = (options = {}) => {
    const { sessionId, user } = useAuth();

    return useQuery({
        queryKey: QUERY_KEYS.cart.detail(sessionId, user?.id),
        queryFn: async () => {
            const { data } = await CartService.getCart({ sessionId, userId: user?.id });
            return data;
        },
        enabled: !!sessionId,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
        ...options,
    });
};

export const useAddToCart = (options = {}) => {
    const queryClient = useQueryClient();
    const { sessionId } = useAuth();

    return useMutation({
        mutationFn: (payload) => CartService.addToCart(payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });
            Toast.success(response.message || 'Item added to cart');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error)
            Toast.error(message || 'Failed to add item to cart');
            options.onError?.(error);
        },
    });
};

export const useUpdateCartItem = (options = {}) => {
    const queryClient = useQueryClient();
    const { sessionId } = useAuth();

    return useMutation({
        mutationFn: ({ cartItemId, quantity, product_id }) =>
            CartService.updateCartItem(cartItemId, {
                quantity,
                product_id,
                session_id: sessionId
            }),
        onMutate: async ({ cartItemId, quantity }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });

            // Snapshot previous value
            const previousCart = queryClient.getQueryData(
                QUERY_KEYS.cart.detail(sessionId)
            );

            // Optimistically update
            queryClient.setQueryData(
                QUERY_KEYS.cart.detail(sessionId),
                (old) => {
                    if (!old?.data) return old;

                    return {
                        ...old,
                        data: {
                            ...old.data,
                            items: old.data.items.map((item) =>
                                item.id === cartItemId
                                    ? { ...item, quantity }
                                    : item
                            ),
                        },
                    };
                }
            );

            return { previousCart };
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousCart) {
                queryClient.setQueryData(
                    QUERY_KEYS.cart.detail(sessionId),
                    context.previousCart
                );
            }

            const message = formatErrorMessage(error)
            Toast.error(message || 'Failed to add item to cart');

            options.onError?.(error);
        },
        onSuccess: (response) => {
            // Refetch to ensure data consistency
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });

            Toast.success(response.message || 'Cart updated successfully');
            options.onSuccess?.(response);
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });
        },
    });
};

export const useRemoveCartItem = (options = {}) => {
    const queryClient = useQueryClient();
    const { sessionId } = useAuth();

    return useMutation({
        mutationFn: (cartItemId) => CartService.removeCartItem(cartItemId, sessionId),
        onMutate: async (cartItemId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });

            // Snapshot previous value
            const previousCart = queryClient.getQueryData(
                QUERY_KEYS.cart.detail(sessionId)
            );

            // Optimistically remove item
            queryClient.setQueryData(
                QUERY_KEYS.cart.detail(sessionId),
                (old) => {
                    if (!old?.data) return old;

                    return {
                        ...old,
                        data: {
                            ...old.data,
                            items: old.data.items.filter(
                                (item) => item.id !== cartItemId
                            ),
                        },
                    };
                }
            );

            return { previousCart };
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousCart) {
                queryClient.setQueryData(
                    QUERY_KEYS.cart.detail(sessionId),
                    context.previousCart
                );
            }

            const message = formatErrorMessage(error)
            Toast.error(message || 'Failed to add item to cart');

            options.onError?.(error);
        },
        onSuccess: (response) => {
            // Refetch to ensure data consistency
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });

            Toast.success(response.message || 'Item removed from cart');
            options.onSuccess?.(response);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });
        },
    });
};

export const useClearCart = (options = {}) => {
    const queryClient = useQueryClient();
    const { sessionId } = useAuth();

    return useMutation({
        mutationFn: () => CartService.clearCart(sessionId),
        onMutate: async () => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });

            // Snapshot previous value
            const previousCart = queryClient.getQueryData(
                QUERY_KEYS.cart.detail(sessionId)
            );

            // Optimistically clear cart
            queryClient.setQueryData(
                QUERY_KEYS.cart.detail(sessionId),
                (old) => ({
                    ...old,
                    data: {
                        items: [],
                        total: 0
                    }
                })
            );

            return { previousCart };
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousCart) {
                queryClient.setQueryData(
                    QUERY_KEYS.cart.detail(sessionId),
                    context.previousCart
                );
            }

            const message = formatErrorMessage(error)
            Toast.error(message || 'Failed to add item to cart');

            options.onError?.(error);
        },
        onSuccess: (response) => {
            // Refetch to ensure data consistency
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });

            Toast.success(response.message || 'Cart cleared successfully');
            options.onSuccess?.(response);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.cart.detail(sessionId)
            });
        },
    });
};
