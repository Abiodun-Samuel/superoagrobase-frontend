import $api from "@/lib/axios";

const BASE_URL = "/newsletter";

export const NewsletterService = {
    async subscribe(payload) {
        const { data } = await $api.post(`${BASE_URL}/subscribe`, payload);
        return data;
    },
};
