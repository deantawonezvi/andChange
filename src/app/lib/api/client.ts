import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TOKEN_COOKIE_NAME } from '@/app/lib/constants';
import Cookies from 'js-cookie';


const handleSessionExpired = () => {
    
    Cookies.remove(TOKEN_COOKIE_NAME);

    
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        sessionStorage.clear();
    }

    
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

const createAxiosClient = (baseURL?: string, enableDebug: boolean = false): AxiosInstance => {
    const axiosClient: AxiosInstance = axios.create({
        baseURL: process.env.NODE_ENV === 'development'
            ? ''
            : (baseURL || process.env.NEXT_PUBLIC_API_BASE_URL),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/hal+json'
        },
        maxRedirects: 0,
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
                console.log('Response Error:', {
                    status: error.response?.status,
                    message: error.message,
                    data: error.response?.data
                });
            }

            
            if (error.response?.status === 401) {
                
                const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

                if (currentPath !== '/login' && currentPath !== '/') {
                    console.warn('Session expired, redirecting to login...');
                    handleSessionExpired();
                }

                return Promise.reject(new Error('Session expired. Please log in again.'));
            }

            
            if (error.response?.status === 403) {
                return Promise.reject(new Error('Access denied. You do not have permission to access this resource.'));
            }

            
            if (!error.response) {
                return Promise.reject(new Error('Network error. Please check your connection and try again.'));
            }

            
            if (error.response.status >= 500) {
                return Promise.reject(new Error('Server error. Please try again later.'));
            }

            return Promise.reject(error);
        }
    );

    return axiosClient;
};

export default createAxiosClient;