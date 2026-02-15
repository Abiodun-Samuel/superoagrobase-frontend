import $api from "@/lib/axios";

const BASE_URL = "/admin";

export const AdminService = {
    async getDashboardStats() {
        const { data } = await $api.get(`${BASE_URL}/dashboard`);
        return data;
    },
};