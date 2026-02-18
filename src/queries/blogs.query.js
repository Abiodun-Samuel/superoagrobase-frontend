import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/queries.keys';
import { BlogService } from '@/services/blogs.service';
import Toast from '@/lib/toastify';
import { formatErrorMessage } from '@/utils/helper';

// ============================================
// QUERY HOOKS
// ============================================

/**
 * Get all blogs (Admin only - with filters)
 */
export const useBlogs = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.blogs.admin(filters),
        queryFn: async () => {
            const { data } = await BlogService.getBlogs(filters);
            return data;
        },
        refetchOnMount: true,
        staleTime: 1000 * 60 * 5,
        ...options,
    });
};

/**
 * Get published blogs (Public - for blog page)
 */
export const usePublishedBlogs = (filters = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.blogs.published(filters),
        queryFn: async () => {
            const { data } = await BlogService.getPublishedBlogs(filters);
            return data;
        },
        staleTime: 1000 * 60 * 5,
        ...options,
    });
};

/**
 * Get featured blogs (Public - for landing page)
 */
export const useFeaturedBlogs = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.blogs.featured(),
        queryFn: async () => {
            const { data } = await BlogService.getFeaturedBlogs();
            return data;
        },
        staleTime: 1000 * 60 * 10,
        ...options,
    });
};

/**
 * Get single blog by slug
 */
export const useBlog = (slug, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.blogs.detail(slug),
        queryFn: async () => {
            const { data } = await BlogService.getBlog(slug);
            return data;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
        ...options,
    });
};

// ============================================
// MUTATION HOOKS
// ============================================

/**
 * Create a new blog (Admin only)
 */
export const useCreateBlog = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => BlogService.createBlog(payload),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blogs.all });

            Toast.success(response.message || 'Blog created successfully');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to create blog');
            options.onError?.(error);
        },
    });
};

/**
 * Update an existing blog (Admin only)
 */
export const useUpdateBlog = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ slug, payload }) => BlogService.updateBlog(slug, payload),
        onSuccess: (response, variables) => {
            // Invalidate all blog queries
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blogs.all });
            // // Invalidate specific blog detail
            // queryClient.invalidateQueries({
            //     queryKey: QUERY_KEYS.blogs.detail(variables.slug)
            // });

            Toast.success(response.message || 'Blog updated successfully');
            options.onSuccess?.(response);
        },
        onError: (error) => {
            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to update blog');
            options.onError?.(error);
        },
    });
};

/**
 * Delete a blog (Admin only)
 */
export const useDeleteBlog = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug) => BlogService.deleteBlog(slug),
        onMutate: async (slug) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: QUERY_KEYS.blogs.all
            });

            // Snapshot previous value
            const previousBlogs = queryClient.getQueryData(
                QUERY_KEYS.blogs.all
            );

            return { previousBlogs };
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousBlogs) {
                queryClient.setQueryData(
                    QUERY_KEYS.blogs.all,
                    context.previousBlogs
                );
            }

            const message = formatErrorMessage(error);
            Toast.error(message || 'Failed to delete blog');
            options.onError?.(error);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blogs.all });

            Toast.success(response.message || 'Blog deleted successfully');
            options.onSuccess?.(response);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blogs.all });
        },
    });
};