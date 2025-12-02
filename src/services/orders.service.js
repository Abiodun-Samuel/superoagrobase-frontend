import $api from "@/lib/axios";

const BASE_URL = "/orders";

export const OrderService = {
    async createOrder(payload) {
        const { data } = await $api.post(`${BASE_URL}/complete`, payload);
        return data;
    },
};