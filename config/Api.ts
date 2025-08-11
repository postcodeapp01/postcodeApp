import axios from "axios";
import { store } from "../Store";
import { getItemFromAsyncStorage, setItemInAsyncStorage } from "../app/common/utils/asyncStorage/AsyncStorageUtils";
export const domainUrl = 'http://10.0.2.2:3000'
// export const domainUrl = 'http://localhost:3000'

export const Api = {
    sendOtp: `${domainUrl}/user/auth/initiate`,
    validateOtp: `${domainUrl}/user/auth/verify`,
    register: `${domainUrl}/register`,
    getUserDetails: `${domainUrl}/user/profile`,
    address: `${domainUrl}/address`,
    refressToken: `${domainUrl}/user/auth/session/refresh` 
}

const axiosInstance = axios.create({
  baseURL: domainUrl,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user.accessToken;
    if (token && !config.headers?.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
};

const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getItemFromAsyncStorage('refreshToken');
        const accessToken = await getItemFromAsyncStorage('accessToken');
        const { data } = await axios.post(Api.refressToken, { refreshToken }, { headers: { Authorization: `bearer ${accessToken}`}});
        const newAccessToken = data.accessToken;

        await setItemInAsyncStorage('accessToken', newAccessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        onTokenRefreshed(newAccessToken);
        refreshSubscribers = [];
        return axios(originalRequest);
      } catch (e) {
        refreshSubscribers = [];
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
