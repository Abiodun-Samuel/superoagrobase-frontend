import $api from "@/lib/axios";

const BASE_URL = "/orders";
const ADMIN_BASE_URL = "/admin/orders";

export const OrderService = {
    //user
    async completeOrder(orderData) {
        const { data } = await $api.post(`${BASE_URL}/complete`, orderData);
        return data;
    },
    async getMyOrders(params = {}) {
        const { data } = await $api.get(BASE_URL, { params });
        return data;
    },
    async getMyOrder(reference) {
        const { data } = await $api.get(`${BASE_URL}/${reference}`);
        return data;
    },
    async cancelOrder(reference) {
        const { data } = await $api.patch(`${BASE_URL}/${reference}/status`, { status: 'cancelled' });
        return data;
    },

    // admin
    async getAllOrders(params = {}) {
        const { data } = await $api.get(ADMIN_BASE_URL, { params });
        return data;
    },
    async getOrder(reference) {
        const { data } = await $api.get(`${ADMIN_BASE_URL}/${reference}`);
        return data;
    },
    async updateOrder(reference, updateData) {
        const { data } = await $api.put(`${ADMIN_BASE_URL}/${reference}`, updateData);
        return data;
    },
    async updateOrderStatus(reference, status) {
        const { data } = await $api.patch(`${ADMIN_BASE_URL}/${reference}/status`, { status });
        return data;
    },
    async deleteOrder(reference) {
        const { data } = await $api.delete(`${ADMIN_BASE_URL}/${reference}`);
        return data;
    },
}