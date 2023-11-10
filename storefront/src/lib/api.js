import axios from 'axios';
import { BASE_URL } from '../constants'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    includeCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token  = JSON.parse(window.localStorage.getItem('token')) || null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    }, async(error) => {
        const originalConfig = error.config;
        if (originalConfig.url !== `${BASE_URL}auth/login/` && error.response) {
            if (error.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const response = await axiosInstance.post(`auth/token/refresh/`, {
                        refresh: JSON.parse(window.localStorage.getItem('refresh')),
                    }) 

                    const {access} = response.data;
                    window.localStorage.setItem('token', JSON.stringify(access));
                    return axiosInstance(originalConfig);
                } catch (error) {
                    return Promise.reject(error);
                }
            }
        }
    })

export default axiosInstance;
