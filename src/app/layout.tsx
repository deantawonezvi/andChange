"use client"
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { QueryClient } from "@tanstack/query-core";
import theme from "@/app/lib/theme";
import { QueryClientProvider } from "@tanstack/react-query";
import { metadata } from "@/app/metadata";


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
      <html lang="en">
      <head>
        <title>{(metadata.title as string) ?? " "}</title>
        <meta name="description" content={(metadata.description as string) ?? " "}/>
      </head>
      <body>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <Suspense>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
          </Suspense>
        </ThemeProvider>
      </AppRouterCacheProvider>
      </body>
      </html>
  );
}
