import { useMutation } from '@tanstack/react-query';
import { NewsletterService } from '@/services/newsletter.service';
import Toast from '@/lib/toastify';
import { formatErrorMessage } from '@/utils/helper';

export const useNewsletterSubscribe = (options = {}) => {
    return useMutation({
        mutationFn: (payload) => NewsletterService.subscribe(payload),

        onSuccess: (data, variables, context) => {
            Toast.success(data?.message || 'Subscribed successfully');
            options?.onSuccess?.(data, variables, context);
        },

        onError: (error, variables, context) => {
            const message = formatErrorMessage(error)
            Toast.error(message);
            options?.onError?.(error, variables, context);
        },
    });
};
