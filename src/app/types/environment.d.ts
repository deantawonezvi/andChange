declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_AUTH_URL: string;
            NEXT_PUBLIC_TOKEN_URL: string;
            NEXT_PUBLIC_CLIENT_ID: string;
            NEXT_PUBLIC_CLIENT_SECRET: string;
            NEXT_PUBLIC_AUTH_SCOPE: string;
            NEXT_PUBLIC_BASE_API_URL: string;

            // Development environment variables
            NEXT_PUBLIC_DEV_EMAIL?: string;
            NEXT_PUBLIC_DEV_PASSWORD?: string;
            NEXT_PUBLIC_DEV_AUTO_LOGIN?: string;

            NODE_ENV: 'development' | 'production' | 'test';
        }
    }
}

export {};