import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/queries.keys';
import { ReviewService } from '@/services/reviews.service';

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
