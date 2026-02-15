import $api from "@/lib/axios";

const BASE_URL = "/admin/users";

const ROLE_HIERARCHY = {
    user: ['user'],
    vendor: ['vendor', 'user'],
    admin: ['admin', 'vendor', 'user'],
    super_admin: ['super_admin', 'admin', 'vendor', 'user'],
};

export const getRolesForAssignment = (role) => {
    return ROLE_HIERARCHY[role] || ['user'];
};

export const UserService = {
    async getUsers(params = {}) {
        const { data } = await $api.get(BASE_URL, { params });
        return data;
    },

    async getUser(userId) {
        const { data } = await $api.get(`${BASE_URL}/${userId}`);
        return data;
    },

    async deleteUser(userId) {
        const { data } = await $api.delete(`${BASE_URL}/${userId}`);
        return data;
    },

    async updateUser(userId, status) {
        const { data } = await $api.put(`${BASE_URL}/${userId}`, { status });
        return data;
    },

    async assignRole(userId, role) {
        const roles = getRolesForAssignment(role);
        const { data } = await $api.post(`${BASE_URL}/${userId}/assign-role`, { role, roles });
        return data;
    },
};