import {AuthConfig} from "@/app/lib/api/types";

export const getAuthConfig = (): AuthConfig => {
    return {
        authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
        tokenUrl: process.env.NEXT_PUBLIC_TOKEN_URL,
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        scope: process.env.NEXT_PUBLIC_AUTH_SCOPE
    };
};
