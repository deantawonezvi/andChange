'use client';
import React from 'react';
import {Box, Button, Container, Typography} from '@mui/material';
import {motion} from 'framer-motion';
import {AlertTriangle, Home, RefreshCw} from 'lucide-react';
import Link from 'next/link';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const containerVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    };


    return (
        <Container maxWidth="md">
            <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 8,
                }}
            >
                <motion.div variants={itemVariants}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <AlertTriangle size={40} color="error"/>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: {xs: '4rem', md: '6rem'},
                                fontWeight: 700,
                                color: 'error.main',
                            }}
                        >
                            500
                        </Typography>
                    </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            color: 'error.main',
                        }}
                    >
                        Something went wrong!
                    </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 4,
                            color: 'text.secondary',
                            maxWidth: '600px',
                        }}
                    >
                        We apologize for the inconvenience. An unexpected error occurred while processing your request.
                        Please try again later or contact support if the problem persists.
                    </Typography>
                </motion.div>

                <Box
                    component={motion.div}
                    variants={itemVariants}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: {xs: 'column', sm: 'row'},
                    }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        onClick={reset}
                        startIcon={<RefreshCw size={20}/>}
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                        }}
                    >
                        Try Again
                    </Button>
                    <Link href="/dashboard" passHref>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Home size={20}/>}
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                            }}
                        >
                            Go to Home
                        </Button>
                    </Link>
                </Box>

                {error.digest && (
                    <motion.div variants={itemVariants}>
                        <Typography
                            variant="caption"
                            sx={{
                                mt: 4,
                                color: 'text.secondary',
                            }}
                        >
                            Error digest: {error.digest}
                        </Typography>
                    </motion.div>
                )}
            </Box>
        </Container>
    );
}