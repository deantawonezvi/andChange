import React from 'react';
import {
    Box,
    Paper,
    Skeleton,
    useTheme,
    Typography,
} from '@mui/material';

interface LoaderProps {
    message?: string;
    showLogo?: boolean;
}

export const PageLoader: React.FC<LoaderProps> = ({
                                                      message = 'Loading content...',
                                                      showLogo = true
                                                  }) => {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                p: 3,
                backgroundColor: 'background.default',
            }}
        >
            {showLogo && (
                <Box
                    sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        mb: 4,
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        '@keyframes pulse': {
                            '0%, 100%': {
                                opacity: 1,
                            },
                            '50%': {
                                opacity: 0.5,
                            },
                        },
                    }}
                >
                    <img src="" alt='logo'
                         style={{objectFit: 'contain', width: '75px'}}/>
                </Box>
            )}

            <Box
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ width: '100%', mb: 2 }}>
                    <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
                    <Skeleton variant="rectangular" width="30%" height={40} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width="70%" height={40} sx={{ borderRadius: 1 }} />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
                    <Skeleton variant="rectangular" width="60%" height={40} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width="40%" height={40} sx={{ borderRadius: 1 }} />
                </Box>
            </Box>

            <Typography
                variant="h6"
                sx={{
                    mt: 4,
                    color: 'text.secondary',
                    textAlign: 'center',
                    animation: 'fadeInOut 2s ease-in-out infinite',
                    '@keyframes fadeInOut': {
                        '0%, 100%': {
                            opacity: 0.5,
                        },
                        '50%': {
                            opacity: 1,
                        },
                    },
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export const SectionLoader: React.FC<LoaderProps & {
    rows?: number;
    type?: 'table' | 'cards' | 'form';
}> = ({
          message = 'Loading...',
          showLogo = false,
          rows = 3,
          type = 'form'
      }) => {

    const renderTableLoader = () => (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {[30, 25, 25, 20].map((width, i) => (
                    <Skeleton
                        key={i}
                        variant="rectangular"
                        width={`${width}%`}
                        height={40}
                        sx={{ borderRadius: 1 }}
                    />
                ))}
            </Box>

            {Array.from({ length: rows }).map((_, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    {[30, 25, 25, 20].map((width, j) => (
                        <Skeleton
                            key={j}
                            variant="rectangular"
                            width={`${width}%`}
                            height={30}
                            sx={{ borderRadius: 1 }}
                        />
                    ))}
                </Box>
            ))}
        </Box>
    );

    const renderCardLoader = () => (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
            {Array.from({ length: rows }).map((_, i) => (
                <Paper key={i} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                        <Skeleton variant="text" width="70%" />
                    </Box>
                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="30%" />
                    </Box>
                </Paper>
            ))}
        </Box>
    );

    const renderFormLoader = () => (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            {Array.from({ length: rows }).map((_, i) => (
                <Box key={i} sx={{ mb: 3 }}>
                    <Skeleton variant="text" width="30%" sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                </Box>
            ))}
            <Skeleton variant="rectangular" width="30%" height={40} sx={{ borderRadius: 1, mt: 2 }} />
        </Box>
    );

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                backgroundColor: 'transparent',
                position: 'relative',
                minHeight: 200,
            }}
        >
            {showLogo && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{ position: 'relative', width: 60, height: 60 }}>
                        <img src="" alt='logo'
                             style={{objectFit: 'contain', width: '75px'}}/>
                    </Box>
                </Box>
            )}

            {type === 'table' && renderTableLoader()}
            {type === 'cards' && renderCardLoader()}
            {type === 'form' && renderFormLoader()}

            {message && (
                <Typography
                    variant="body2"
                    sx={{
                        mt: 2,
                        textAlign: 'center',
                        color: 'text.secondary',
                        animation: 'fade 1.5s ease-in-out infinite',
                        '@keyframes fade': {
                            '0%, 100%': { opacity: 0.6 },
                            '50%': { opacity: 1 },
                        },
                    }}
                >
                    {message}
                </Typography>
            )}
        </Paper>
    );
};