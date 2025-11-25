import $api from "@/lib/axios";

const BASE_URL = "/reviews";

export const ReviewService = {
    async getReviews(params = {}) {
        const { data } = await $api.get(BASE_URL, { params });
        return data;
    },
};