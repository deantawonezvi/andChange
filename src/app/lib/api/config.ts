import {AuthConfig} from "@/app/lib/api/types";

export const getAuthConfig = (): AuthConfig => {
    const requiredEnvVars = [
        'NEXT_PUBLIC_AUTH_URL',
        'NEXT_PUBLIC_BASE_API_URL',
        'NEXT_PUBLIC_TOKEN_URL',
        'NEXT_PUBLIC_CLIENT_ID',
        'NEXT_PUBLIC_CLIENT_SECRET',
        'NEXT_PUBLIC_AUTH_SCOPE'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    return {
        authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
        tokenUrl: process.env.NEXT_PUBLIC_TOKEN_URL,
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        scope: process.env.NEXT_PUBLIC_AUTH_SCOPE
    };
};
