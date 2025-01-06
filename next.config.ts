import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    env: {
        NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
        NEXT_PUBLIC_TOKEN_URL: process.env.NEXT_PUBLIC_TOKEN_URL,
        NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
        NEXT_PUBLIC_CLIENT_SECRET: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        NEXT_PUBLIC_AUTH_SCOPE: process.env.NEXT_PUBLIC_AUTH_SCOPE,
        NEXT_PUBLIC_BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL,
    },
};

export default nextConfig;
