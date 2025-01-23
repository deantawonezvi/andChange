import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import {AuthService, TOKEN_COOKIE_NAME} from './auth';
import { ApiError } from './types';
import Cookies from "js-cookie";

export class ApiClient {
    private static instance: ApiClient;
    private axiosInstance: AxiosInstance;
    private authService: AuthService;

    private constructor(baseURL: string, debug: boolean = false) {
        this.authService = AuthService.getInstance();
        this.axiosInstance = this.createAxiosInstance(baseURL, debug);
    }

    public static getInstance(baseURL?: string, debug: boolean = false): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient(
                baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || '',
                debug
            );
        }
        return ApiClient.instance;
    }

    private createAxiosInstance(baseURL: string, debug: boolean): AxiosInstance {
        const instance = axios.create({ baseURL });

        // Request interceptor
        instance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                const token = Cookies.get(TOKEN_COOKIE_NAME);
                if (token) {
                    config.headers.set('Authorization', `Bearer ${token}`);
                }
                if (debug) this.logRequest(config);
                return config;
            },
            (error) => Promise.reject(this.handleApiError(error))
        );

        // Response interceptor
        instance.interceptors.response.use(
            (response: AxiosResponse) => {
                if (debug) this.logResponse(response);
                return response;
            },
            async (error: AxiosError) => {
                if (debug) this.logError(error);


                return Promise.reject(this.handleApiError(error));
            }
        );

        return instance;
    }


    private handleApiError(error:any): ApiError {
        if (axios.isAxiosError(error)) {
            return {
                message: error.response?.data?.message || error.message,
                code: error.code,
                status: error.response?.status
            };
        }
        return { message: error.message || 'An unknown error occurred' };
    }

    private logRequest(config: InternalAxiosRequestConfig): void {
        console.log('%cAPI Request:', 'color: blue; font-weight: bold;', {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: config.headers,
            data: config.data
        });
    }

    private logResponse(response: AxiosResponse): void {
        console.log('%cAPI Response:', 'color: green; font-weight: bold;', {
            status: response.status,
            data: response.data
        });
    }

    private logError(error: AxiosError): void {
        console.log('%cAPI Error:', 'color: red; font-weight: bold;', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }

    // Public API methods
    async get<T>(url: string): Promise<T> {
        const response = await this.axiosInstance.get<T>(url);
        return response.data;
    }

    async post<T, D = unknown>(url: string, data: D): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, data);
        return response.data;
    }

    async put<T, D = unknown>(url: string, data: D): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, data);
        return response.data;
    }

    async delete<T>(url: string): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url);
        return response.data;
    }
}
