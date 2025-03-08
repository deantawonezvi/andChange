import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useToast } from '@/app/lib/hooks/useToast';

export const Toast: React.FC = () => {
    const { message, type, open, hideToast } = useToast();

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={hideToast}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={hideToast}
                severity={type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};