import $api from "@/lib/axios";

const BASE_URL = "/contact";

export const ContactService = {
    async submitContactForm(payload) {
        const { data } = await $api.post(`${BASE_URL}/submit`, payload);
        return data;
    },
};