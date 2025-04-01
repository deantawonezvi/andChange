"use client"
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { QueryClient } from "@tanstack/query-core";
import theme from "@/app/lib/theme";
import { QueryClientProvider } from "@tanstack/react-query";
import Script from "next/script";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <Script
                id="feedbucket-script"
                strategy="afterInteractive"
                type="module"
                async
                src="https://cdn.feedbucket.app/assets/feedbucket.js"
                data-feedbucket="o2hjs0xFC3HDwDzqWf3b"
            />
        </head>
        <body>
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={new QueryClient()}>
                    {children}
                </QueryClientProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}