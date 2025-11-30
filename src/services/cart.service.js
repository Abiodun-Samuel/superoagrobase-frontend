import $api from "@/lib/axios";

const BASE_URL = "/cart";

export const CartService = {
    async getCart({ sessionId, userId }) {
        const { data } = await $api.get(BASE_URL, {
            params: {
                session_id: sessionId, ...(userId && { user_id: userId })
            }
        });
        return data;
    },

    async addToCart(payload) {
        const { data } = await $api.post(`${BASE_URL}/items`, payload);
        return data;
    },

    async updateCartItem(cartItemId, payload) {
        const { data } = await $api.put(`${BASE_URL}/items/${cartItemId}`, payload);
        return data;
    },

    async removeCartItem(cartItemId, sessionId) {
        const { data } = await $api.delete(`${BASE_URL}/items/${cartItemId}`, {
            params: { session_id: sessionId }
        });
        return data;
    },

    async clearCart(sessionId) {
        const { data } = await $api.post(`${BASE_URL}/clear`, {
            session_id: sessionId
        });
        return data;
    },
};