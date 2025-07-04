import { createTheme } from "@mui/material";
import { Noto_Sans } from 'next/font/google';

const workSans = Noto_Sans({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

declare module '@mui/material/styles' {
    interface Theme {
        andChangeComponents: {
            gradientText: {
                background: string;
                backgroundClip: string;
                WebkitBackgroundClip: string;
                color: string;
            };
            backdropCard: {
                background: string;
                backdropFilter: string;
                borderRadius: string;
                border: string;
            };

            table: {
                header: {
                    background: string;
                    textColor: string;
                    borderColor: string;
                    fontSize: string;
                };
                row: {
                    hoverColor: string;
                    selectedColor: string;
                    stripeColor: string;
                };
                statusColors: {
                    success: string;
                    warning: string;
                    error: string;
                    info: string;
                    default: string;
                };
                cellPadding: string;
                borderRadius: string;
                shadow: string;
            };
        };
        customShadows: {
            card: string;
            button: string;
            hover: string;

            tableRow: string;
            tableHeader: string;
        };
    }

    interface ThemeOptions {
        andChangeComponents?: {
            gradientText?: {
                background: string;
                backgroundClip: string;
                WebkitBackgroundClip: string;
                color: string;
            };
            backdropCard?: {
                background: string;
                backdropFilter: string;
                borderRadius: string;
                border: string;
            };

            table?: {
                header?: {
                    background: string;
                    textColor: string;
                    borderColor: string;
                    fontSize: string;
                };
                row?: {
                    hoverColor: string;
                    selectedColor: string;
                    stripeColor: string;
                };
                statusColors?: {
                    success: string;
                    warning: string;
                    error: string;
                    info: string;
                    default: string;
                };
                cellPadding?: string;
                borderRadius?: string;
                shadow?: string;
            };
        };
        customShadows?: {
            card: string;
            button: string;
            hover: string;
            tableRow?: string;
            tableHeader?: string;
        };
    }
}

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
        warning: {
            main: '#ffc107',
        },
        info: {
            main: '#17a2b8',
        },
    },
    typography: {
        fontFamily: workSans.style.fontFamily,
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            '@media (min-width:600px)': {
                fontSize: '3.5rem',
            },
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            '@media (min-width:600px)': {
                fontSize: '2.5rem',
            },
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '1rem',
        },
    },

    andChangeComponents: {
        gradientText: {
            background: 'linear-gradient(45deg, #1a1f2c, #e85d45)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
        },
        backdropCard: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
        },

        table: {
            header: {
                background: '#f5f7fa',
                textColor: '#1a1f2c',
                borderColor: '#e85d45',
                fontSize: '0.875rem',
            },
            row: {
                hoverColor: 'rgba(232, 93, 69, 0.08)',
                selectedColor: 'rgba(232, 93, 69, 0.16)',
                stripeColor: 'rgba(0, 0, 0, 0.02)',
            },
            statusColors: {
                success: '#28a745',
                warning: '#ffc107',
                error: '#dc3545',
                info: '#17a2b8',
                default: '#6c757d',
            },
            cellPadding: '12px 16px',
            borderRadius: '12px',
            shadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
    },
    customShadows: {
        card: '0 4px 20px rgba(0, 0, 0, 0.1)',
        button: 'none',
        hover: '0 8px 25px rgba(0, 0, 0, 0.15)',

        tableRow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        tableHeader: '0 3px 10px rgba(0, 0, 0, 0.08)',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        transition: 'transform 0.2s ease-in-out',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'border-color 0.2s ease-in-out',
                        '&:hover': {
                            borderColor: 'rgba(0, 0, 0, 0.3)',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: '16px',
                },
            },
        },

        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    overflow: 'hidden',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#f5f7fa',
                    '& .MuiTableCell-head': {
                        fontWeight: 600,
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        backgroundColor: 'rgba(232, 93, 69, 0.08)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(232, 93, 69, 0.16)',
                        '&:hover': {
                            backgroundColor: 'rgba(232, 93, 69, 0.24)',
                        },
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                },
                head: {
                    color: '#1a1f2c',
                    fontWeight: 600,
                    borderBottom: '2px solid #e85d45',
                },
            },
        },
        MuiTablePagination: {
            styleOverrides: {
                root: {
                    '& .MuiToolbar-root': {
                        paddingLeft: 16,
                        paddingRight: 16,
                    },
                    '& .MuiTablePagination-select': {
                        paddingLeft: 8,
                        paddingRight: 24,
                    },
                },
            },
        },
    },
});

export default theme;