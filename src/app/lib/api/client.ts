import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {TOKEN_COOKIE_NAME} from '@/app/lib/constants';
import Cookies from 'js-cookie';

const createAxiosClient = (baseURL?: string, enableDebug: boolean = false): AxiosInstance => {
    const axiosClient: AxiosInstance = axios.create({
        baseURL: process.env.NODE_ENV === 'development'
            ? ''
            : (baseURL || process.env.NEXT_PUBLIC_API_BASE_URL),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/hal+json'
        }
    });

    axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = Cookies.get(TOKEN_COOKIE_NAME);
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }

        if (enableDebug) {
            console.log('Request Config:', {
                url: config.url,
                method: config.method,
                headers: config.headers,
                data: config.data
            });
        }

        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    axiosClient.interceptors.response.use(
        (response: AxiosResponse) => {
            if (enableDebug) {
                console.log('Response:', {
                    status: response.status,
                    headers: response.headers,
                    data: response.data
                });
            }
            return response;
        },
        async (error: AxiosError) => {
            if (enableDebug) {
                console.error('API Error:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
            }

            if (error.response?.status === 401) {
                return Promise.reject(new Error('Session expired. Please log in again.'));
            }

            return Promise.reject(error);
        }
    );

    return axiosClient;
};

export default createAxiosClient;