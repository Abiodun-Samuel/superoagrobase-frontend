import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/queries.keys';
import { ReviewService } from '@/services/reviews.service';
import Toast from '@/lib/toastify';

export const useReviews = (params = {}, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.reviews.lists(params),
        queryFn: async () => {
            const data = await ReviewService.getReviews(params);
            return data;
        },
        ...options,
    });
};

export const useReviewById = (reviewId, options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.reviews.detail(reviewId),
        queryFn: async () => {
            const { data } = await ReviewService.getReviewById(reviewId);
            return data;
        },
        enabled: !!reviewId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewData) => ReviewService.createReview(reviewData),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews.all });
            Toast.success(response?.message || 'Review submitted successfully');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to submit review';
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

export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, reviewData }) =>
            ReviewService.updateReview(reviewId, reviewData),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews.all });
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.reviews.detail(variables.reviewId)
            });
            Toast.success(response?.message || 'Review updated successfully');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to update review';
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

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId) => ReviewService.deleteReview(reviewId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews.all });
            Toast.success(response?.message || 'Review deleted successfully');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to delete review';
            Toast.error(message);
        },
    });
};