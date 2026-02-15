import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { ProductService } from '@/services/products.service';
import { QUERY_KEYS } from '@/utils/queries.keys';
import Toast from '@/lib/toastify';

export const useProducts = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.products.lists(filters),
        queryFn: async () => {
            const data = await ProductService.getProducts(filters);
            return data;
        },
        refetchOnMount: true,
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

// Admin 
export const useAdminProducts = (filters = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.products.admin(filters),
        queryFn: () => ProductService.getAdminProducts(filters),
        staleTime: 1000 * 60 * 2, // 2 minutes
        keepPreviousData: true,
        refetchOnMount: true,
    });
};

export const useAdminProduct = (productId) => {
    return useQuery({
        queryKey: QUERY_KEYS.products.detail(productId),
        queryFn: async () => {
            const { data } = await ProductService.getAdminProduct(productId);
            return data;
        },
        enabled: !!productId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productData) => ProductService.createProduct(productData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
            Toast.success(response?.message || 'Product created successfully');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to create product';
            const errors = error?.response?.data?.errors;

            if (errors) {
                // Show first validation error
                const firstError = Object.values(errors)[0];
                Toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                Toast.error(message);
            }
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productSlug, productData }) =>
            ProductService.updateProduct(productSlug, productData),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
            Toast.success(response?.message || 'Product updated successfully');
        },
        onError: (error) => {

            const message = error?.response?.data?.message || 'Failed to update product';
            const errors = error?.response?.data?.errors;

            if (errors) {
                const firstError = Object.values(errors)[0];
                Toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                Toast.error(message);
            }
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId) => ProductService.deleteProduct(productId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
            Toast.success(response?.message || 'Product deleted successfully');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to delete product';
            Toast.error(message);
        },
    });
};

export const useBulkUpdateFeaturedProducts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productData) => ProductService.bulkUpdateFeaturedProducts(productData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
            Toast.success(response?.message || `Product(s) updated successfully`);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to delete products';
            Toast.error(message);
        },
    });
};