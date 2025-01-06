'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {AuthService} from "@/app/lib/api/auth";

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>();

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const authService = AuthService.getInstance();

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);

        try {
            await authService.login({
                email: data.email,
                password: data.password
            });
            router.push('/dashboard'); // Redirect after successful login
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '100vh',
                    pt: 4
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: '10px',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{
                            mb: 3,
                            fontWeight: 600
                        }}
                    >
                        Sign in to andChange
                    </Typography>

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
                        />

                        {error && (
                            <Alert
                                severity="error"
                                sx={{ mt: 2 }}
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
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontSize: '1rem'
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;