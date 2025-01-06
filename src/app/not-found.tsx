'use client';
import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
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
        hidden: { opacity: 0, y: 20 },
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
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '4rem', md: '6rem' },
                            fontWeight: 700,
                            mb: 2,
                            background: 'linear-gradient(45deg, #1a1f2c, #e85d45)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                        }}
                    >
                        404
                    </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 2,
                            color: 'primary.main',
                        }}
                    >
                        Page Not Found
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
                        The page you are looking for might have been removed, had its name changed,
                        or is temporarily unavailable.
                    </Typography>
                </motion.div>

                <Box
                    component={motion.div}
                    variants={itemVariants}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="contained"
                            startIcon={<Home size={20} />}
                            sx={{
                                borderRadius: 1,
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                            }}
                        >
                            Go to Home
                        </Button>
                    </Link>
                    <Link href="/dashboard" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="outlined"
                            startIcon={<Search size={20} />}
                            sx={{
                                borderRadius: 1,
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                            }}
                        >
                            Go to Dashboard
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}