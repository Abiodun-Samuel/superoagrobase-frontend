import $api from "@/lib/axios";

const BASE_URL = "/products";

export const ProductService = {
    async getFeaturedProducts() {
        const { data } = await $api.get(`${BASE_URL}/featured`);
        return data;
    },
    async getTrendingProducts() {
        const { data } = await $api.get(`${BASE_URL}/trending`);
        return data;
    },
    async getAllProducts() {
        const { data } = await $api.get(`${BASE_URL}`);
        return data;
    },
    async getProductBySlug(slug, options = {}) {
        const { incrementView = false } = options;
        const params = new URLSearchParams();
        if (incrementView) params.append('increment_view', 'true');

        const url = `${BASE_URL}/${slug}${params.toString() ? `?${params}` : ''}`;
        const { data } = await $api.get(url);
        return data;
    },
};
