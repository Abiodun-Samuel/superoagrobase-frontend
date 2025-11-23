// import axios from 'axios';
// import { getAuth } from '../server/auth.action';

// const baseURL = process.env.NODE_ENV == 'development' ? process.env.NEXT_PUBLIC_API_DEV : process.env.NEXT_PUBLIC_API_LIVE;

// const $api = axios.create({
//   baseURL,
//   timeout: 60000,
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
// });

// $api.interceptors.request.use(
//   async (config) => {
//     const { token } = await getAuth();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error?.response)
// );

// $api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error?.response?.status == 401 && typeof window !== 'undefined') {
//       window.dispatchEvent(new CustomEvent('auth:unauthorized'));
//     }
//     return Promise.reject(error?.response);
//   }
// );

// export default $api;

const baseURL = process.env.NODE_ENV == 'development'
  ? process.env.NEXT_PUBLIC_API_DEV
  : process.env.NEXT_PUBLIC_API_LIVE;

class FetchAPI {
  constructor(config = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 60000;
    this.defaultHeaders = config.headers || {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  interceptors = {
    request: {
      use: (onFulfilled, onRejected) => {
        this.requestInterceptors.push({ onFulfilled, onRejected });
        return this.requestInterceptors.length - 1;
      },
    },
    response: {
      use: (onFulfilled, onRejected) => {
        this.responseInterceptors.push({ onFulfilled, onRejected });
        return this.responseInterceptors.length - 1;
      },
    },
  };

  async request(config) {
    try {
      // Apply request interceptors
      let modifiedConfig = { ...config };
      for (const interceptor of this.requestInterceptors) {
        if (interceptor.onFulfilled) {
          modifiedConfig = await interceptor.onFulfilled(modifiedConfig);
        }
      }

      const { url, method = 'GET', data, headers = {}, params, ...options } = modifiedConfig;

      // Build URL with query params
      const fullURL = new URL(url.startsWith('http') ? url : `${this.baseURL}${url}`);
      if (params) {
        Object.keys(params).forEach(key =>
          fullURL.searchParams.append(key, params[key])
        );
      }

      // Merge headers
      const mergedHeaders = { ...this.defaultHeaders, ...headers };

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      // Make fetch request
      const response = await fetch(fullURL.toString(), {
        method: method.toUpperCase(),
        headers: mergedHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      // Parse response
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Create axios-like response object
      const axiosLikeResponse = {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: modifiedConfig,
        request: response,
      };

      // Handle non-2xx responses
      if (!response.ok) {
        const error = new Error(`Request failed with status ${response.status}`);
        error.response = axiosLikeResponse;
        throw error;
      }

      // Apply response interceptors
      let finalResponse = axiosLikeResponse;
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onFulfilled) {
          finalResponse = await interceptor.onFulfilled(finalResponse);
        }
      }

      return finalResponse;

    } catch (error) {
      // Apply error interceptors
      let finalError = error;
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onRejected) {
          try {
            return await interceptor.onRejected(finalError);
          } catch (err) {
            finalError = err;
          }
        }
      }

      // Apply request error interceptors
      for (const interceptor of this.requestInterceptors) {
        if (interceptor.onRejected) {
          try {
            return await interceptor.onRejected(finalError);
          } catch (err) {
            finalError = err;
          }
        }
      }

      throw finalError;
    }
  }

  get(url, config = {}) {
    return this.request({ ...config, url, method: 'GET' });
  }

  post(url, data, config = {}) {
    return this.request({ ...config, url, method: 'POST', data });
  }

  put(url, data, config = {}) {
    return this.request({ ...config, url, method: 'PUT', data });
  }

  patch(url, data, config = {}) {
    return this.request({ ...config, url, method: 'PATCH', data });
  }

  delete(url, config = {}) {
    return this.request({ ...config, url, method: 'DELETE' });
  }
}

const $api = new FetchAPI({
  baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

$api.interceptors.request.use(
  async (config) => {
    const { getAuth } = await import('@/server/auth.action');
    const { token } = await getAuth();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error?.response)
);

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status == 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error?.response);
  }
);

export default $api;
