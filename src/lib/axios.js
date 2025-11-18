import axios from 'axios';
import { getSession } from './session';

const baseURL = process.env.NODE_ENV == 'development'? process.env.NEXT_PUBLIC_API_DEV : process.env.NEXT_PUBLIC_API_LIVE;

const $api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

$api.interceptors.request.use(
  async (config) => {
    const token = await getSession();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error?.response)
);

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error?.response);
  }
);

export default $api;
