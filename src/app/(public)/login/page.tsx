'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Alert,
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { ArrowLeft, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthService } from "@/app/lib/api/auth";
import AuthLoader from "@/app/lib/components/common/authLoader";

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<LoginFormData>();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const theme = useTheme();
    const authService = AuthService.getInstance();

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const devEmail = process.env.NEXT_PUBLIC_DEV_EMAIL;
            const devPassword = process.env.NEXT_PUBLIC_DEV_PASSWORD;

            if (devEmail) {
                setValue('email', devEmail);
            }

            if (devPassword) {
                setValue('password', devPassword);
            }

            if (devEmail && devPassword && process.env.NEXT_PUBLIC_DEV_AUTO_LOGIN === 'true') {
                handleSubmit(onSubmit)();
            }
        }
    }, [setValue]);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2,
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);

        try {
            await authService.login({
                email: data.email,
                password: data.password
            });
            router.push('/projects');
        } catch (err) {
            console.log(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <AuthLoader action="login" message="Signing you in..." />
    }

    return (
        <Container component="main" maxWidth="sm">
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
                    py: 8
                }}
            >
                {/* Back to Home Link */}
                <Link href="/" style={{ textDecoration: 'none', marginBottom: '2rem' }}>
                    <Button
                        startIcon={<ArrowLeft />}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: 'primary.main'
                            }
                        }}
                    >
                        Back to Home
                    </Button>
                </Link>

                <Paper
                    component={motion.div}
                    variants={formVariants}
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 6 },
                        width: '100%',
                        borderRadius: '16px',
                        border: `1px solid ${theme.palette.divider}`,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 1,
                                fontWeight: 700,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent'
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Sign in to access your dashboard
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px'
                                }
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters'
                                }
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px'
                                }
                            }}
                        />

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mt: 2,
                                    borderRadius: '12px'
                                }}
                                onClose={() => setError(null)}
                            >
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            Sign In
                        </Button>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Don&#39;t have an account?{' '}
                                <Link
                                    href="/register"
                                    style={{
                                        color: theme.palette.primary.main,
                                        textDecoration: 'none',
                                        fontWeight: 500
                                    }}
                                >
                                    Create one
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;