import $api from "@/lib/axios";

export const AuthService = {
  async login(payload) {
    const { data } = await $api.post('/auth/login', payload);
    return data;
  },
};
