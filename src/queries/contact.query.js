import Toast from "@/lib/toastify";
import { ContactService } from "@/services/contact.service";
import { formatErrorMessage } from "@/utils/helper";
import { useMutation } from "@tanstack/react-query";

export const useContactForm = () => {
    return useMutation({
        mutationFn: (contactData) => ContactService.submitContactForm(contactData),
        onSuccess: (data) => {
            Toast.success(data?.message);
        },
        onError: (error) => {
            const message = formatErrorMessage(error)
            Toast.error(message || 'Failed to submit form');
        },
    });
};