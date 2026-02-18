import $api from "@/lib/axios";

const BASE_URL = "/blogs";
const ADMIN_BASE_URL = "/admin/blogs";

export const BlogService = {
    // Public endpoints
    async getPublishedBlogs(params = {}) {
        const { data } = await $api.get(`${BASE_URL}/published`, { params });
        return data;
    },

    async getFeaturedBlogs() {
        const { data } = await $api.get(`${BASE_URL}/featured`);
        return data;
    },

    async getBlog(slug) {
        const { data } = await $api.get(`${BASE_URL}/${slug}`);
        return data;
    },

    // Admin endpoints
    async getBlogs(params = {}) {
        const { data } = await $api.get(ADMIN_BASE_URL, { params });
        return data;
    },

    async createBlog(payload) {
        const { data } = await $api.post(ADMIN_BASE_URL, payload);
        return data;
    },

    async updateBlog(slug, payload) {
        const { data } = await $api.put(`${ADMIN_BASE_URL}/${slug}`, payload);
        return data;
    },

    async deleteBlog(slug) {
        const { data } = await $api.delete(`${ADMIN_BASE_URL}/${slug}`);
        return data;
    },
};