// import axios from "axios";
// import { store } from "../Store";
// import { getItemFromAsyncStorage, setItemInAsyncStorage } from "../app/common/utils/asyncStorage/AsyncStorageUtils";
// export const domainUrl = 'http://10.0.2.2:3000'
// // export const domainUrl = 'https://trend-rush-backend.vercel.app'
// // export const domainUrl = 'http://10.237.226.145:3000'

// export const Api = {
//     sendOtp: `${domainUrl}/user/auth/initiate`,
//     validateOtp: `${domainUrl}/user/auth/verify`,
//     register: `${domainUrl}/register`,
//     getUserDetails: `${domainUrl}/user/profile`,
//     address: `${domainUrl}/address`,
//     refressToken: `${domainUrl}/user/auth/session/refresh` 
// }

// const axiosInstance = axios.create({
//   baseURL: domainUrl,
// });


// axiosInstance.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const token = state.user.accessToken;
//     // console.log("first token", token);
//     if (token && !config.headers?.Authorization) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// );

// let isRefreshing = false;
// let refreshSubscribers: ((token: string) => void)[] = [];

// const onTokenRefreshed = (token: string) => {
//   refreshSubscribers.forEach((callback) => callback(token));
// };

// const addSubscriber = (callback: (token: string) => void) => {
//   refreshSubscribers.push(callback);
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve) => {
//           addSubscriber((token) => {
//             originalRequest.headers['Authorization'] = `Bearer ${token}`;
//             resolve(axios(originalRequest));
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshToken = await getItemFromAsyncStorage('refreshToken');
//         const accessToken = await getItemFromAsyncStorage('accessToken');
//         const { data } = await axios.post(Api.refressToken, { refreshToken }, { headers: { Authorization: `bearer ${accessToken}`}});
//         const newAccessToken = data.accessToken;

//         await setItemInAsyncStorage('accessToken', newAccessToken);
//         axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

//         onTokenRefreshed(newAccessToken);
//         refreshSubscribers = [];
//         return axios(originalRequest);
//       } catch (e) {
//         refreshSubscribers = [];
//         return Promise.reject(e);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );


// export default axiosInstance;




import axios from 'axios';
import { store } from "../Store";
import {
  getItemFromAsyncStorage,
  setItemInAsyncStorage,
  removeItemFromAsyncStorage,
} from "../app/common/utils/asyncStorage/AsyncStorageUtils";

export const domainUrl = 'http://10.0.2.2:3000';
// export const domainUrl = 'http://10.237.226.145:3000';

export const Api = {
  sendOtp: `${domainUrl}/user/auth/initiate`,
  validateOtp: `${domainUrl}/user/auth/verify`,
  register: `${domainUrl}/register`,
  getUserDetails: `${domainUrl}/user/profile`,
  address: `${domainUrl}/address`,
  refressToken: `${domainUrl}/user/auth/session/refresh`, // note: keep your existing name
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

// Request interceptor: attach latest accessToken (reads from storage)
axiosInstance.interceptors.request.use(
  async (config) => {
    // don't attach token to the refresh endpoint itself
    const url = config.url || '';
    if (url.includes('/user/auth/session/refresh')) return config;

    try {
      // Prefer reading from async storage so we always have the freshest token (after refresh)
      const token = await getItemFromAsyncStorage('accessToken');
      if (token) {
        config.headers = config.headers || {};
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      // if storage read fails, fall back to redux store token (best-effort)
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
        // swallow
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: attempt refresh only if refreshToken exists
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error?.response?.status;

    // Only attempt refresh for 401, and only once per request
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Get refresh token from AsyncStorage (if not present, do not call refresh)
      const refreshToken = await getItemFromAsyncStorage('refreshToken');
      if (!refreshToken) {
        // No refresh token available — do not call refresh endpoint.
        return Promise.reject(error);
      }

      // If a refresh is already in progress, queue this request to retry after refresh completes
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

      // Start refresh flow
      isRefreshing = true;
      try {
        // Use axiosPublic to call refresh endpoint (so refresh call doesn't trigger interceptors again)
        const resp = await axiosPublic.post(Api.refressToken, { refreshToken });

        // Server expected to return new tokens (adjust field names per your API)
        const newAccessToken = resp.data?.accessToken || resp.data?.token || null;
        const newRefreshToken = resp.data?.refreshToken || resp.data?.refresh_token || null;

        if (!newAccessToken) {
          // refresh failed — cleanup tokens and reject
          await removeItemFromAsyncStorage('accessToken');
          await removeItemFromAsyncStorage('refreshToken');
          isRefreshing = false;
          return Promise.reject(error);
        }

        // persist new tokens
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
