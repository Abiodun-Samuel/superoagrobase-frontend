import $api from "@/lib/axios";

export const AuthService = {
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
  async sendResetLink(payload) {
    const { data } = await $api.post('/auth/forgot-password', payload);
    return data;
  },
  async resetPassword(payload) {
    const { data } = await $api.post('/auth/reset-password', payload);
    return data;
  },
  async verifyEmail(payload) {
    const { data } = await $api.post('/auth/verify-email', payload);
    return data;
  },
  async resendVerification(payload) {
    const { data } = await $api.post('/auth/resend-verification', payload);
    return data;
  },
  async verifyToken(payload) {
    const { data } = await $api.post('/auth/verify-token', payload);
    return data;
  },
};