// queries/vendor.query.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { VendorService } from '@/services/vendor.service';
import { QUERY_KEYS } from '@/utils/queries.keys';
import { handleError, handleSuccess } from '@/utils/helper';
/**
 * Get vendor's products
 */
export const useVendorProducts = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.vendorProducts.lists(),
        queryFn: () => VendorService.getVendorProducts(filters),
        staleTime: 30000,
        ...options,
    });
};

/**
 * Get single vendor product
 */
export const useVendorProduct = (id, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.vendorProducts.detail(id),
        queryFn: () => VendorService.getVendorProduct(id),
        enabled: !!id,
        staleTime: 60000,
        ...options,
    });
};

/**
 * Add products to vendor catalog (handles single or bulk)
 */
export const useAddVendorProducts = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: VendorService.addProducts,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vendorProducts.lists() });
            handleSuccess(response, null, options.onSuccess);
        },
        onError: (error) => handleError(error, options.onError),
        ...options,
    });
};

/**
 * Update vendor products (handles single or bulk)
 */
export const useUpdateVendorProducts = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: VendorService.updateProducts,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vendorProducts.lists() });
            handleSuccess(response, null, options.onSuccess);
        },
        onError: (error) => handleError(error, options.onError),
        ...options,
    });
};

/**
 * Delete vendor products (handles single or bulk)
 */
export const useDeleteVendorProducts = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: VendorService.deleteProducts,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vendorProducts.lists() });
            handleSuccess(response, null, options.onSuccess);
        },
        onError: (error) => handleError(error, options.onError),
        ...options,
    });
};

export const useSubmitVendorRequest = (options = {}) => {
    return useMutation({
        mutationFn: VendorService.submitRequest,
        onSuccess: (response) =>
            handleSuccess(response, 'Vendor request submitted successfully!', options.onSuccess),
        onError: (error) =>
            handleError(error, options.onError),
        ...options,
    });
};

export const useVendorRequests = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.vendorRequests.lists(filters),
        queryFn: () => VendorService.getRequests(filters),
        staleTime: 30000,
        ...options,
    });
};

export const useVendorRequestByEmail = (email, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.vendorRequests.byEmail(email),
        queryFn: () => VendorService.getRequestByEmail(email),
        enabled: !!email,
        retry: false,
        ...options,
    });
};

export const useVendorRequest = (id, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.vendorRequests.detail(id),
        queryFn: () => VendorService.getRequest(id),
        enabled: !!id,
        ...options,
    });
};

export const useApproveVendorRequest = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: VendorService.approveRequest,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vendorRequests.all });
            handleSuccess(response, 'Vendor request approved successfully!', options.onSuccess);
        },
        onError: (error) =>
            handleError(error, options.onError),
        ...options,
    });
};

export const useRejectVendorRequest = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: VendorService.rejectRequest,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vendorRequests.all });
            handleSuccess(response, 'Vendor request rejected', options.onSuccess);
        },
        onError: (error) =>
            handleError(error, options.onError),
        ...options,
    });
};