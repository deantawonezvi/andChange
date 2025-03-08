import { Control, FieldErrors } from "react-hook-form";
import { ModelAnagraphicDataDTO } from "./services/modelService";

export interface AuthConfig {
    authUrl: string;
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    scope: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    idToken: string;
    refreshToken: string;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}
