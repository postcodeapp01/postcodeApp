



import axios from 'axios';
import { store } from "../Store";
import {
  getItemFromAsyncStorage,
  setItemInAsyncStorage,
  removeItemFromAsyncStorage,
} from "../app/common/utils/asyncStorage/AsyncStorageUtils";

// export const domainUrl = 'https://trend-rush-backend.vercel.app';
export const domainUrl = 'http://10.0.2.2:3000';
// export const domainUrl = 'http://192.168.0.100:3000';

export const Api = {
  sendOtp: `${domainUrl}/user/auth/initiate`,
  validateOtp: `${domainUrl}/user/auth/verify`,
  register: `${domainUrl}/register`,
  getUserDetails: `${domainUrl}/user/profile`,
  address: `${domainUrl}/address`,
  refressToken: `${domainUrl}/user/auth/session/refresh`, 
};


export const axiosPublic = axios.create({
  baseURL: domainUrl,
  headers: { 'Content-Type': 'application/json' },
});


const axiosInstance = axios.create({
  baseURL: domainUrl,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const url = config.url || '';
    if (url.includes('/user/auth/session/refresh')) return config;

    try {
      const token = await getItemFromAsyncStorage('accessToken');
      if (token) {
        config.headers = config.headers || {};
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      try {
        const state = store.getState();
        const token = state?.user?.accessToken;
        if (token) {
          config.headers = config.headers || {};
          if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (e) {
        console.log("Error in the  token",e);
        
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await getItemFromAsyncStorage('refreshToken');
      if (!refreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber(async (token: string) => {
            try {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            } catch (e) {
              reject(e);
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const resp = await axiosPublic.post(Api.refressToken, { refreshToken });

        const newAccessToken = resp.data?.accessToken || resp.data?.token || null;
        const newRefreshToken = resp.data?.refreshToken || resp.data?.refresh_token || null;

        if (!newAccessToken) {
          await removeItemFromAsyncStorage('accessToken');
          await removeItemFromAsyncStorage('refreshToken');
          isRefreshing = false;
          return Promise.reject(error);
        }

        await setItemInAsyncStorage('accessToken', newAccessToken);
        if (newRefreshToken) {
          await setItemInAsyncStorage('refreshToken', newRefreshToken);
        }
        onTokenRefreshed(newAccessToken);
        isRefreshing = false;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        await removeItemFromAsyncStorage('accessToken');
        await removeItemFromAsyncStorage('refreshToken');
        isRefreshing = false;
        refreshSubscribers = [];
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
