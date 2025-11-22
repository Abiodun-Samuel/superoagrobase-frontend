import $api from "@/lib/axios";

const BASE_URL = "/categories";

export const CategoryService = {
    async list() {
        const { data } = await $api.get(BASE_URL);
        return data;
    },
};
