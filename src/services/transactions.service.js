
import $api from "@/lib/axios";

const BASE_URL = "/transactions";

export const TransactionService = {
    async verifyTransaction(params = {}) {
        const { data } = await $api.get(`${BASE_URL}/verify`, { params });
        return data;
    },
};