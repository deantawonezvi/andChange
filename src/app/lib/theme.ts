import { createTheme } from "@mui/material";
import { Noto_Sans } from 'next/font/google';

const workSans = Noto_Sans({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1a1f2c',
            light: '#2a3040',
            dark: '#111419',
        },
        secondary: {
            main: '#e85d45',
            light: '#ff8f6f',
            dark: '#b12d1f',
        },
        background: {
            default: '#ffffff',
            paper: '#f8f9fa',
        },
        text: {
            primary: '#1a1f2c',
            secondary: '#6c757d',
        },
        error: {
            main: '#dc3545',
        },
        success: {
            main: '#28a745',
        },
    },
    typography: {
        fontFamily: workSans.style.fontFamily,
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    padding: '8px 16px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                    },
                },
            },
        },
    },
});

export default theme;