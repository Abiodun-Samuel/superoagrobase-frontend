import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryService } from '@/services/categories.service';
import { invalidationPatterns, QUERY_KEYS } from '@/utils/queries.keys';
import Toast from '@/lib/toastify';
import { formatErrorMessage } from '@/utils/helper';

export const useCategories = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.categories.lists(),
        queryFn: async () => {
            const { data } = await CategoryService.getCategories();
            return data;
        },
        ...options,
    });
};

export const useAdminCategories = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.categories.admin(filters),
        queryFn: () => CategoryService.getAllCategories(filters),
        staleTime: 1000 * 60 * 2,
        ...options,
    });
};

export const useAdminCategory = (id, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.categories.adminDetail(id),
        queryFn: () => CategoryService.getCategoryById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
};

export const useCreateCategory = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryData) => CategoryService.createCategory(categoryData),
        onSuccess: (response) => {
            invalidationPatterns.categories(queryClient);
            Toast.success(response?.message || 'Category created successfully');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to create category');
            options.onError?.(error);
        },
    });
};

export const useUpdateCategory = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ slug, data }) => CategoryService.updateCategory(slug, data),
        onSuccess: (response, variables) => {
            invalidationPatterns.categories(queryClient);
            invalidationPatterns.category(queryClient, variables.slug);
            Toast.success(response?.message || 'Category updated successfully');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to update category');
            options.onError?.(error);
        },
    });
};

export const useDeleteCategory = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug) => CategoryService.deleteCategory(slug),
        onSuccess: (response) => {
            invalidationPatterns.categories(queryClient);
            Toast.success(response?.message || 'Category deleted successfully');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to delete category');
            options.onError?.(error);
        },
    });
};