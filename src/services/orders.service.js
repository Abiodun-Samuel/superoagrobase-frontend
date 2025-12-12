import $api from "@/lib/axios";

const BASE_URL = "/orders";

export const OrderService = {
    async createOrder(payload) {
        const { data } = await $api.post(`${BASE_URL}/complete`, payload);
        return data;
    },
    async getOrderByReference(params = {}) {
        const { data } = await $api.get(`${BASE_URL}/${params.reference}`);
        return data;
    },
};