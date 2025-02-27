import {
    AuthFlowType,
    ChangePasswordCommand,
    CognitoIdentityProviderClient,
    ConfirmForgotPasswordCommand,
    ForgotPasswordCommand,
    GetUserCommand,
    GlobalSignOutCommand,
    InitiateAuthCommand,
    InitiateAuthCommandInput
} from "@aws-sdk/client-cognito-identity-provider";
import Cookies from 'js-cookie';
import {AuthTokens, LoginCredentials} from "@/app/lib/api/types";
import crypto from 'crypto';

export const TOKEN_COOKIE_NAME = 'andChange_auth_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'andChange_refresh_token';

export class AuthService {
    private static instance: AuthService;
    private cognitoClient: CognitoIdentityProviderClient;

    private constructor() {
        this.cognitoClient = new CognitoIdentityProviderClient({
            region: 'eu-west-2'
        });
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private calculateSecretHash(username: string): string {
        const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
        const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET!;

        const message = username + clientId;
        const hmac = crypto.createHmac('SHA256', clientSecret);
        hmac.update(message);
        return hmac.digest('base64');
    }

    async login(credentials: LoginCredentials): Promise<AuthTokens> {
        try {
            const params: InitiateAuthCommandInput = {
                AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
                ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
                AuthParameters: {
                    USERNAME: credentials.email,
                    PASSWORD: credentials.password,
                    SECRET_HASH: this.calculateSecretHash(credentials.email)
                }
            };

            const command = new InitiateAuthCommand(params);
            const response = await this.cognitoClient.send(command);

            if (!response.AuthenticationResult) {
                throw new Error('No authentication result received');
            }

            const tokens: AuthTokens = {
                accessToken: response.AuthenticationResult.AccessToken!,
                idToken: response.AuthenticationResult.IdToken!,
                refreshToken: response.AuthenticationResult.RefreshToken || ''
            };

            this.storeTokens(tokens);
            return tokens;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    async isAuthenticated(): Promise<boolean> {
        const token = Cookies.get(TOKEN_COOKIE_NAME);
        if (!token) return false;

        try {
            const command = new GetUserCommand({
                AccessToken: token
            });
            await this.cognitoClient.send(command);
            return true;
        } catch {
            return false;
        }
    }

    async getCurrentUser() {
        const token = Cookies.get(TOKEN_COOKIE_NAME);
        if (!token) return null;

        try {
            const command = new GetUserCommand({
                AccessToken: token
            });
            return await this.cognitoClient.send(command);
        } catch {
            return null;
        }
    }

    private storeTokens(tokens: AuthTokens): void {
        const secureCookieOptions = {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            path: '/'
        };

        Cookies.set(TOKEN_COOKIE_NAME, tokens.accessToken, secureCookieOptions);
        if (tokens.refreshToken) {
            Cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, secureCookieOptions);
        }
    }

    async refreshSession(): Promise<AuthTokens> {
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const params: InitiateAuthCommandInput = {
                AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
                ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
                AuthParameters: {
                    REFRESH_TOKEN: refreshToken,
                    SECRET_HASH: this.calculateSecretHash(refreshToken)
                }
            };

            const command = new InitiateAuthCommand(params);
            const response = await this.cognitoClient.send(command);

            if (!response.AuthenticationResult) {
                throw new Error('No authentication result received');
            }

            const tokens: AuthTokens = {
                accessToken: response.AuthenticationResult.AccessToken!,
                idToken: response.AuthenticationResult.IdToken!,
                refreshToken: response.AuthenticationResult.RefreshToken || refreshToken
            };

            this.storeTokens(tokens);
            return tokens;
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    async logout(): Promise<void> {
        const token = Cookies.get(TOKEN_COOKIE_NAME);
        if (token) {
            try {
                const command = new GlobalSignOutCommand({
                    AccessToken: token
                });
                await this.cognitoClient.send(command);
            } catch (error) {
                console.log('Error during logout:', error);
            }
        }

        Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
        Cookies.remove(REFRESH_TOKEN_COOKIE_NAME, { path: '/' });
    }

    private handleAuthError(error: unknown): Error {
        if (error instanceof Error) {
            switch (error.name) {
                case 'UserNotFoundException':
                    return new Error('User not found');
                case 'NotAuthorizedException':
                    return new Error('Incorrect username or password');
                case 'UserNotConfirmedException':
                    return new Error('Please verify your email address');
                case 'PasswordResetRequiredException':
                    return new Error('Password reset required');
                default:
                    return new Error(error.message);
            }
        }
        return new Error('An unknown authentication error occurred');
    }

    async forgotPassword(username: string): Promise<void> {
        try {
            const command = new ForgotPasswordCommand({
                ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
                Username: username,
                SecretHash: this.calculateSecretHash(username)
            });
            await this.cognitoClient.send(command);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    async resetPassword(username: string, code: string, newPassword: string): Promise<void> {
        try {
            const command = new ConfirmForgotPasswordCommand({
                ClientId: process.env.NEXT_PUBLIC_CLIENT_ID,
                Username: username,
                ConfirmationCode: code,
                Password: newPassword,
                SecretHash: this.calculateSecretHash(username)
            });
            await this.cognitoClient.send(command);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        const token = Cookies.get(TOKEN_COOKIE_NAME);
        if (!token) {
            throw new Error('Not authenticated');
        }

        try {
            const command = new ChangePasswordCommand({
                AccessToken: token,
                PreviousPassword: oldPassword,
                ProposedPassword: newPassword
            });
            await this.cognitoClient.send(command);
        } catch (error) {
            throw this.handleAuthError(error);
        }
    }
}