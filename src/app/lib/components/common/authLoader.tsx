import React from 'react';
import {alpha, Box, CircularProgress, Container, Paper, Typography, useTheme} from '@mui/material';
import {LogIn, LogOut} from 'lucide-react';
import {motion} from 'framer-motion';

interface AuthLoaderProps {
    action: 'login' | 'logout';
    message?: string;
}

const AuthLoader = ({
                        action,
                        message = action === 'login' ? 'Signing you in...' : 'Signing you out...'
                    }: AuthLoaderProps) => {
    const theme = useTheme();
    const Icon = action === 'login' ? LogIn : LogOut;

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'background.default'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            position: 'relative',
                            p: 4,
                            width: '100%',
                            textAlign: 'center',
                            backgroundImage: `linear-gradient(145deg, 
                ${alpha(theme.palette.primary.main, 0.05)}, 
                ${alpha(theme.palette.background.paper, 0.7)})`,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            backdropFilter: 'blur(8px)',
                            boxShadow: `0 4px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                            overflow: 'hidden'
                        }}
                    >
                        {/* Background Gradient Animation */}
                        <Box
                            component={motion.div}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 3,
                                background: `linear-gradient(90deg, 
                  ${theme.palette.primary.main}, 
                  ${theme.palette.secondary.main}, 
                  ${theme.palette.primary.main})`
                            }}
                            animate={{
                                x: ['-100%', '100%']
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                        />

                        {/* Icon and Loader Container */}
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mb: 3,
                                width: 76,
                                height: 76,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, 
                  ${alpha(theme.palette.primary.main, 0.1)} 0%, 
                  ${alpha(theme.palette.primary.main, 0)} 70%)`
                            }}
                        >
                            {/* Outer Progress */}
                            <CircularProgress
                                size={60}
                                thickness={3}
                                sx={{
                                    position: 'absolute',
                                    color: alpha(theme.palette.primary.main, 0.3)
                                }}
                            />

                            {/* Inner Progress */}
                            <CircularProgress
                                size={60}
                                thickness={3}
                                sx={{
                                    position: 'absolute',
                                    color: theme.palette.primary.main,
                                    animation: 'spin 1s linear infinite',
                                    '@keyframes spin': {
                                        '0%': {
                                            strokeDasharray: '30 180'
                                        },
                                        '50%': {
                                            strokeDasharray: '120 180'
                                        },
                                        '100%': {
                                            strokeDasharray: '30 180'
                                        }
                                    }
                                }}
                            />

                            {/* Centered Icon */}
                            <Box
                                component={motion.div}
                                animate={{
                                    scale: [1, 0.9, 1],
                                    opacity: [1, 0.6, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                sx={{
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Icon size={24} color={theme.palette.primary.main} />
                            </Box>
                        </Box>

                        {/* Message */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.primary',
                                fontWeight: 500,
                                fontSize: '1rem',
                                lineHeight: 1.5,
                                letterSpacing: '0.0075em',
                                mb: 1
                            }}
                        >
                            {message}
                        </Typography>

                        {/* Animated Dots */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: '50%',
                                        backgroundColor: theme.palette.primary.main
                                    }}
                                    animate={{
                                        y: ['0%', '-50%', '0%'],
                                        opacity: [0.3, 1, 0.3]
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.2
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </motion.div>
            </Box>
        </Container>
    );
};

export default AuthLoader;