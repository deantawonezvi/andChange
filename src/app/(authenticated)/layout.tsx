'use client';
import React, { Suspense } from 'react';
import { Box, Toolbar } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar, { menuItems } from "@/app/lib/components/common/sideBar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/lib/theme";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/hooks/useAuth";
import PageHeader from "@/app/lib/components/common/pageHeader";
import AuthLoader from "@/app/lib/components/common/authLoader";
import { Toast } from "@/app/lib/components/common/toast";

interface AuthenticatedLayoutProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            retry: 1,
        },
    },
});


const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({children}) => {
    const {isAuthenticated, isLoading} = useAuth();
    const router = useRouter();


    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <AuthLoader action="login" message="Verifying your session..." />;
    }

    if (!isAuthenticated) {
        return <AuthLoader action="login" message="Redirecting to login..." />;
    }

    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <Suspense>
                    <QueryClientProvider client={queryClient}>
                                <Box sx={{display: 'flex'}}>
                                    <Sidebar/>
                                    <Box component="main"
                                         sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${240}px)`}}}>
                                        <Toolbar/>
                                        <PageHeader menuItems={menuItems} />
                                        {children}
                                    </Box>
                                    <Toast />
                                </Box>
                    </QueryClientProvider>
                </Suspense>
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
};

export default AuthenticatedLayout;