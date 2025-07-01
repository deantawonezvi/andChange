import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/v1/people/mop/',
                destination: 'http://35.177.78.241:9000/api/v1/people/mop/',
                basePath: false,
            },
            {
                source: '/api/:path*',
                destination: 'http://35.177.78.241:9000/api/:path*',
                basePath: false
            }
        ];
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
                    { key: "Access-Control-Max-Age", value: "86400" }
                ]
            }
        ];
    }
};

export default nextConfig;
