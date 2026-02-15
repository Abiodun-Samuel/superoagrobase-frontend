import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from '@/lib/toastify';
import { formatErrorMessage } from '@/utils/helper';
import { SubcategoryService } from '@/services/subcategories.service';
import { invalidationPatterns, QUERY_KEYS } from '@/utils/queries.keys';


// ============================================
// ADMIN QUERIES
// ============================================
export const useAdminSubcategories = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.subcategories.admin(filters),
        queryFn: async () => {
            const { data } = await SubcategoryService.getAllSubcategories(filters);
            return data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
};

export const useAdminSubcategory = (id, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.subcategories.adminDetail(id),
        queryFn: () => SubcategoryService.getSubcategoryById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
};

// ============================================
// MUTATIONS
// ============================================
export const useCreateSubcategory = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (subcategoryData) => SubcategoryService.createSubcategory(subcategoryData),
        onSuccess: (response) => {
            invalidationPatterns.subcategories(queryClient);
            invalidationPatterns.categories(queryClient); // Also invalidate categories as they include subcategories
            Toast.success(response?.message || 'Subcategory created successfully');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to create subcategory');
            options.onError?.(error);
        },
    });
};

export const useUpdateSubcategory = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ slug, data }) => SubcategoryService.updateSubcategory(slug, data),
        onSuccess: (response, variables) => {
            invalidationPatterns.subcategories(queryClient);
            invalidationPatterns.subcategory(queryClient, variables.slug);
            invalidationPatterns.categories(queryClient); // Also invalidate categories
            Toast.success(response?.message || 'Subcategory updated successfully');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to update subcategory');
            options.onError?.(error);
        },
    });
};

export const useDeleteSubcategory = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => SubcategoryService.deleteSubcategory(id),
        onSuccess: (response) => {
            invalidationPatterns.subcategories(queryClient);
            invalidationPatterns.categories(queryClient); // Also invalidate categories
            Toast.success(response?.message || 'Subcategory deleted successfully');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to delete subcategory');
            options.onError?.(error);
        },
    });
};