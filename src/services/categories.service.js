import $api from "@/lib/axios";

const BASE_URL = "/categories";
const ADMIN_BASE_URL = "/admin/categories";

export const CategoryService = {
    async getCategories() {
        const { data } = await $api.get(BASE_URL);
        return data;
    },
    //admin
    async getAllCategories(params = {}) {
        const { data } = await $api.get(ADMIN_BASE_URL, { params });
        return data;
    },

    async getCategoryById(id) {
        const { data } = await $api.get(`${ADMIN_BASE_URL}/${id}`);
        return data;
    },

    async createCategory(categoryData) {
        const { data } = await $api.post(ADMIN_BASE_URL, categoryData);
        return data;
    },

    async updateCategory(id, categoryData) {
        const { data } = await $api.put(`${ADMIN_BASE_URL}/${id}`, categoryData);
        return data;
    },

    async deleteCategory(id) {
        const { data } = await $api.delete(`${ADMIN_BASE_URL}/${id}`);
        return data;
    },
};
