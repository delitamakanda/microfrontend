import axios from 'axios';
import { API_URL } from '../constants.js'
import { shouldRefresh } from './refreshPolicy.js';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = JSON.parse(window.localStorage.getItem('token')) || null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// One refresh at a time: concurrent 401s share the same request.
let refreshing = null;
const refreshToken = () => {
    if (!refreshing) {
        refreshing = axiosInstance
            .post('auth/token/refresh/', {
                refresh: JSON.parse(window.localStorage.getItem('refresh')),
            })
            .then((response) => {
                const { access } = response.data;
                window.localStorage.setItem('token', JSON.stringify(access));
                return access;
            })
            .finally(() => {
                refreshing = null;
            });
    }
    return refreshing;
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalConfig = error.config;
        if (originalConfig && shouldRefresh({
            status: error.response?.status,
            url: originalConfig.url,
            retried: originalConfig._retry,
        })) {
            originalConfig._retry = true;
            // If the refresh fails, its error is rejected as is.
            await refreshToken();
            return axiosInstance(originalConfig);
        }
        return Promise.reject(error);
    })

export default axiosInstance;
