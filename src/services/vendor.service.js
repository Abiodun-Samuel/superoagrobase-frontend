import $api from "@/lib/axios";

const ENDPOINTS = {
    PUBLIC: "/vendor-requests",
    ADMIN: "/admin/vendor-requests",
    VENDOR_PRODUCTS: "/vendor/products",
    ALL_PRODUCTS: "/vendor/products/add",
};

export const VendorService = {
    // vendor request  
    submitRequest: async (requestData) => {
        const { data } = await $api.post(ENDPOINTS.PUBLIC, requestData);
        return data;
    },

    getRequestByEmail: async (email) => {
        const { data } = await $api.get('/vendor-requests', {
            params: { email }
        });
        return data;
    },

    getRequests: async (params = {}) => {
        const { data } = await $api.get(ENDPOINTS.ADMIN, { params });
        return data;
    },

    getRequest: async (id) => {
        const { data } = await $api.get(`${ENDPOINTS.ADMIN}/${id}`);
        return data;
    },

    approveRequest: async (id) => {
        const { data } = await $api.post(`${ENDPOINTS.ADMIN}/${id}/approve`);
        return data;
    },

    rejectRequest: async ({ id, rejection_reason }) => {
        const { data } = await $api.post(`${ENDPOINTS.ADMIN}/${id}/reject`, {
            status: "rejected",
            rejection_reason,
        });
        return data;
    },

    // vendor products 
    getVendorProducts: async (params = {}) => {
        const { data } = await $api.get(ENDPOINTS.VENDOR_PRODUCTS, { params });
        return data;
    },

    // Get single vendor product
    getVendorProduct: async (id) => {
        const { data } = await $api.get(`${ENDPOINTS.VENDOR_PRODUCTS}/${id}`);
        return data;
    },

    // Add products (single or multiple)
    addProducts: async (products) => {
        const payload = Array.isArray(products) ? { products } : { products: [products] };
        const { data } = await $api.post(ENDPOINTS.VENDOR_PRODUCTS, payload);
        return data;
    },

    // Update products (single or multiple)
    updateProducts: async (products) => {
        const payload = Array.isArray(products) ? { products } : { products: [products] };
        const { data } = await $api.put(ENDPOINTS.VENDOR_PRODUCTS, payload);
        return data;
    },

    // Delete products (single or multiple)
    deleteProducts: async (ids) => {
        const payload = Array.isArray(ids) ? { ids } : { ids: [ids] };
        const { data } = await $api.delete(ENDPOINTS.VENDOR_PRODUCTS, { data: payload });
        return data;
    },
};