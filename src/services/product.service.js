import $api from "@/lib/axios";

const BASE_URL = "/products";

export const ProductService = {
    async featuredProducts() {
        const { data } = await $api.get(`${BASE_URL}/featured`);
        return data;
    },
};
