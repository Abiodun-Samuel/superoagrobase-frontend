import $api from "@/lib/axios";

export const AuthService = {
  async getMe() {
    const { data } = await $api.get('/auth/me');
    return data;
  },
  async login(payload) {
    const { data } = await $api.post('/auth/login', payload);
    return data;
  },
  async register(payload) {
    const { data } = await $api.post('/auth/register', payload);
    return data;
  },
  async logout() {
    const { data } = await $api.post('/auth/logout');
    return data;
  },
};
