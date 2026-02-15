import $api from "@/lib/axios";

const BASE_URL = "/reviews";

export const ReviewService = {
    async getReviews(params = {}) {
        const { data } = await $api.get(BASE_URL, { params });
        return data;
    },

    async getReviewById(reviewId) {
        const { data } = await $api.get(`${BASE_URL}/${reviewId}`);
        return data;
    },

    async createReview(reviewData) {
        const { data } = await $api.post(`${BASE_URL}`, reviewData);
        return data;
    },

    async updateReview(reviewId, reviewData) {
        const { data } = await $api.put(`${BASE_URL}/${reviewId}`, reviewData);
        return data;
    },

    async deleteReview(reviewId) {
        const { data } = await $api.delete(`${BASE_URL}/${reviewId}`);
        return data;
    },
};