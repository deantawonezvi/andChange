import axios from 'axios';
import Cookies from 'js-cookie';
import {AuthConfig, AuthTokens, LoginCredentials} from "@/app/lib/api/types";
import { getAuthConfig } from './config';
import {REFRESH_TOKEN_COOKIE_NAME, TOKEN_COOKIE_NAME} from '../constants';

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
            //const authCode = await this.getAuthorizationCode(credentials);

            const tokens = await this.authenticateUser(credentials);

            this.storeTokens(tokens);

            return tokens;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    private async getAuthorizationCode(credentials: LoginCredentials): Promise<string> {
        try {
            const response = await axios.post(
                this.authConfig.tokenUrl,
                new URLSearchParams({
                    grant_type: 'password',
                    client_id: this.authConfig.clientId,
                    client_secret: this.authConfig.clientSecret,
                    username: credentials.email,
                    password: credentials.password,
                    scope: this.authConfig.scope
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            console.log(response.data);

            // The response should directly contain the tokens
            return '';
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    private async authenticateUser(credentials: LoginCredentials): Promise<AuthTokens> {
        try {
            const response = await axios.post(
                `${this.authConfig.authUrl.replace('/oauth2/authorize', '/login')}`,
                {
                    AuthParameters: {
                        USERNAME: credentials.email,
                        PASSWORD: credentials.password
                    },
                    AuthFlow: 'USER_PASSWORD_AUTH',
                    ClientId: this.authConfig.clientId
                },
                {
                    headers: {
                        'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
                        'Content-Type': 'application/x-amz-json-1.1'
                    }
                }
            );

            return {
                accessToken: response.data.AuthenticationResult.AccessToken,
                idToken: response.data.AuthenticationResult.IdToken,
                refreshToken: response.data.AuthenticationResult.RefreshToken
            };
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    public getCodeFromCallback(): string {
        return new URLSearchParams(window.location.search).get('code') || '';
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