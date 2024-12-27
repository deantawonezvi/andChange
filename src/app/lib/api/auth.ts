import axios from 'axios';
import Cookies from 'js-cookie';
import {AuthConfig, AuthTokens, LoginCredentials} from "@/app/lib/api/types";
import { getAuthConfig } from './config';

export const TOKEN_COOKIE_NAME = 'andChange_auth_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'andChange_refresh_token';

export class AuthService {
    private static instance: AuthService;
    private authConfig: AuthConfig;

    private constructor() {
        this.authConfig = getAuthConfig();
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(credentials: LoginCredentials): Promise<AuthTokens> {
        try {
            const authCode = await this.getAuthorizationCode(credentials);

            const tokens = await this.exchangeCodeForTokens(authCode);

            this.storeTokens(tokens);

            return tokens;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    private async getAuthorizationCode(credentials: LoginCredentials): Promise<string> {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.authConfig.clientId,
            scope: this.authConfig.scope,
            redirect_uri: window.location.origin,
            username: credentials.email,
            password: credentials.password
        });

        try {
            const response = await axios.post(this.authConfig.authUrl, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            return response.data.code || new URLSearchParams(window.location.search).get('code') || '';
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    private async exchangeCodeForTokens(code: string): Promise<AuthTokens> {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: this.authConfig.clientId,
            client_secret: this.authConfig.clientSecret,
            code,
            redirect_uri: window.location.origin
        });

        try {
            const response = await axios.post(this.authConfig.tokenUrl, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            return {
                accessToken: response.data.access_token,
                idToken: response.data.id_token,
                refreshToken: response.data.refresh_token
            };
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    private storeTokens(tokens: AuthTokens): void {
        const secureCookieOptions = {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            path: '/'
        };

        Cookies.set(TOKEN_COOKIE_NAME, tokens.idToken, secureCookieOptions);
        Cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, secureCookieOptions);
    }

    async refreshTokens(): Promise<AuthTokens> {
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: this.authConfig.clientId,
            client_secret: this.authConfig.clientSecret,
            refresh_token: refreshToken
        });

        try {
            const response = await axios.post(this.authConfig.tokenUrl, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const tokens: AuthTokens = {
                accessToken: response.data.access_token,
                idToken: response.data.id_token,
                refreshToken: response.data.refresh_token || refreshToken
            };

            this.storeTokens(tokens);
            return tokens;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    logout(): void {
        Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
        Cookies.remove(REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
    }

    private handleAuthError(error: unknown): Error {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || error.message;
            const status = error.response?.status;
            return new Error(`Authentication failed: ${message} (${status})`);
        }
        if (error instanceof Error) {
            return error;
        }
        return new Error('An unknown authentication error occurred');
    }
}