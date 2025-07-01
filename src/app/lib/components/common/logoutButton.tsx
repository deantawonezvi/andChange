import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/app/lib/api/auth';
import { useAuth } from '@/app/lib/hooks/useAuth';
import AuthLoader from '@/app/lib/components/common/authLoader';

interface LogoutButtonProps {
    variant?: 'text' | 'outlined' | 'contained';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
                                                       variant = 'contained',
                                                       size = 'medium',
                                                       fullWidth = false
                                                   }) => {
    const router = useRouter();
    const { logout: authLogout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);

            setTimeout(() => {
                if (loading) setShowLoader(true);
            }, 500);

            await AuthService.getInstance().logout();

            authLogout();

            await new Promise(resolve => setTimeout(resolve, 1000));

            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setLoading(false);
            setShowLoader(false);
        }
    };

    if (showLoader) {
        return <AuthLoader action="logout" message="Logging out..." />;
    }

    return (
        <Button
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            onClick={handleLogout}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LogOut size={20} />}
            disabled={loading}
            color="error"
        >
            {loading ? 'Logging out...' : 'Logout'}
        </Button>
    );
};

export default LogoutButton;