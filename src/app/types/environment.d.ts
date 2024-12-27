declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_AUTH_URL: string;
            NEXT_PUBLIC_TOKEN_URL: string;
            NEXT_PUBLIC_CLIENT_ID: string;
            NEXT_PUBLIC_CLIENT_SECRET: string;
            NEXT_PUBLIC_AUTH_SCOPE: string;
            NEXT_PUBLIC_BASE_API_URL: string;
            NODE_ENV: 'development' | 'production' | 'test';
        }
    }
}

export {};