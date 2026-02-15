import $api from "@/lib/axios";

const ADMIN_BASE_URL = "/admin/subcategories";

export const SubcategoryService = {
    // Admin endpoints
    async getAllSubcategories(params = {}) {
        const { data } = await $api.get(ADMIN_BASE_URL, { params });
        return data;
    },

    async getSubcategoryById(id) {
        const { data } = await $api.get(`${ADMIN_BASE_URL}/${id}`);
        return data;
    },

    async createSubcategory(subcategoryData) {
        const { data } = await $api.post(ADMIN_BASE_URL, subcategoryData);
        return data;
    },

    async updateSubcategory(id, subcategoryData) {
        const { data } = await $api.put(`${ADMIN_BASE_URL}/${id}`, subcategoryData);
        return data;
    },

    async deleteSubcategory(id) {
        const { data } = await $api.delete(`${ADMIN_BASE_URL}/${id}`);
        return data;
    },
};