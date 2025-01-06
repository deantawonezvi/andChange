'use client'
import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Cookies from 'js-cookie';
import {TOKEN_COOKIE_NAME, TOKEN_EXPIRY_DAYS,} from '@/app/lib/constants';
import {AuthTokens} from "@/app/lib/api/types";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuth = useCallback(() => {
        const token = Cookies.get(TOKEN_COOKIE_NAME);
        setIsAuthenticated(!!(token));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);


    const login = (authResponse: AuthTokens) => {
        Cookies.set(TOKEN_COOKIE_NAME, authResponse.accessToken, { expires: TOKEN_EXPIRY_DAYS });
        setIsAuthenticated(true);
    };

    const logout = () => {
        Cookies.remove(TOKEN_COOKIE_NAME);
        setIsAuthenticated(false);
        router.push('/login');
    };

    return { isAuthenticated, isLoading, login, logout };
};