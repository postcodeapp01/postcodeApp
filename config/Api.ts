import axios from "axios";
import { store } from "../Store";
export const domainUrl = 'http://10.0.2.2:3000'

export const Api = {
    sendOtp: `${domainUrl}/user/auth/initiate`,
    validateOtp: `${domainUrl}/user/auth/verify`,
    register: `${domainUrl}/register`,
    getUserDetails: `${domainUrl}/user/profile`,
    address: `${domainUrl}/address`
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
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
    (error) => {
        return Promise.reject(error?.response);
      }
);

export default axiosInstance;
