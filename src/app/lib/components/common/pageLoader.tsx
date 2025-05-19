import React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    LinearProgress,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

export const FullPageLoader = () => {
    const theme = useTheme();

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                zIndex: 9999,
                backdropFilter: 'blur(4px)'
            }}
        >
            <Box sx={{ position: 'relative', mb: 4 }}>
                {/* This could be your logo or a custom brand animation */}
                <Box
                    component={motion.div}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                    sx={{
                        width: 80,
                        height: 80,
                        bgcolor: theme.palette.secondary.main,
                        borderRadius: 2,
                        transform: 'rotate(45deg)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '200%',
                            height: '100%',
                            background: `linear-gradient(to right, 
                transparent 0%, 
                ${alpha(theme.palette.background.paper, 0.4)} 50%, 
                transparent 100%)`,
                            animation: 'shimmer 2s infinite',
                        },
                        '@keyframes shimmer': {
                            '0%': {
                                transform: 'translateX(-100%)',
                            },
                            '100%': {
                                transform: 'translateX(100%)',
                            },
                        },
                    }}
                />
            </Box>

            <Typography
                variant="h5"
                component={motion.h5}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                sx={{ mb: 3, fontWeight: 500 }}
            >
                Loading andChange Dashboard
            </Typography>

            <Box sx={{ width: '40%', maxWidth: 300 }}>
                <LinearProgress
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: theme.palette.secondary.main,
                        }
                    }}
                />
            </Box>
        </Box>
    );
};

// Smart table loader that accepts column structure to create a realistic skeleton
export interface TableColumn {
    name: string;
    width: string | number;
}

export const TableLoader: React.FC<{
    columns: TableColumn[];
    rowCount?: number;
    rowHeight?: number;
    density?: 'compact' | 'standard' | 'comfortable';
}> = ({ columns, rowCount = 5, rowHeight = 53, density = 'standard' }) => {
    const theme = useTheme();
    const paddingY = density === 'compact' ? 1 : density === 'comfortable' ? 2 : 1.5;

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme.palette.divider,
            }}
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell
                                    key={index}
                                    sx={{
                                        width: column.width,
                                        py: paddingY,
                                        fontWeight: 600,
                                        borderBottom: `2px solid ${theme.palette.primary.light}`
                                    }}
                                >
                                    {column.name}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.from({ length: rowCount }).map((_, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                sx={{
                                    height: rowHeight,
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                }}
                            >
                                {columns.map((column, colIndex) => (
                                    <TableCell key={colIndex} sx={{ py: paddingY }}>
                                        <Skeleton
                                            animation="wave"
                                            height={24}
                                            width={colIndex === 0 ? '70%' : colIndex === columns.length - 1 ? '40%' : '60%'}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

// Form loader that mirrors the actual form structure
export const FormLoader: React.FC<{
    fieldCount?: number;
    includeTitle?: boolean;
    includeSubmitButton?: boolean;
}> = ({ fieldCount = 4, includeTitle = true, includeSubmitButton = true }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            {includeTitle && (
                <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" width="60%" height={40} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
                </Box>
            )}

            {Array.from({ length: fieldCount }).map((_, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                    <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" height={56} width="100%" sx={{ borderRadius: 1 }} />
                    {/* Add field helper text skeleton for some fields */}
                    {Math.random() > 0.7 && (
                        <Skeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} />
                    )}
                </Box>
            ))}

            {includeSubmitButton && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
                </Box>
            )}
        </Paper>
    );
};

// Card list loader that mimics the actual cards
export const CardListLoader: React.FC<{
    cardCount?: number;
    cardHeight?: number;
    columns?: number;
}> = ({ cardCount = 6, cardHeight = 220, columns = 3 }) => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: columns > 1 ? 'repeat(2, 1fr)' : '1fr',
                    md: `repeat(${Math.min(columns, 4)}, 1fr)`,
                },
                gap: 3,
            }}
        >
            {Array.from({ length: cardCount }).map((_, index) => (
                <Card
                    key={index}
                    sx={{
                        height: cardHeight,
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                        },
                    }}
                >
                    <CardHeader
                        title={<Skeleton animation="wave" height={24} width="80%" />}
                        subheader={<Skeleton animation="wave" height={20} width="40%" />}
                        avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Skeleton animation="wave" height={18} sx={{ mb: 1 }} />
                        <Skeleton animation="wave" height={18} width="90%" sx={{ mb: 1 }} />
                        <Skeleton animation="wave" height={18} width="60%" sx={{ mb: 2 }} />

                        <Skeleton animation="wave" variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                            <Skeleton animation="wave" width={60} height={24} />
                            <Skeleton animation="wave" width={40} height={24} />
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

// Inline loaders for specific components
export const InlineLoader: React.FC<{
    type?: 'text' | 'button' | 'icon';
    size?: 'small' | 'medium' | 'large';
}> = ({ type = 'text', size = 'medium' }) => {
    const theme = useTheme();

    // Size mappings
    const sizeMap = {
        small: { icon: 16, circle: 20, text: { width: 80, height: 16 } },
        medium: { icon: 24, circle: 28, text: { width: 120, height: 20 } },
        large: { icon: 32, circle: 36, text: { width: 200, height: 24 } },
    };

    if (type === 'button') {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                    size={sizeMap[size].circle}
                    thickness={4}
                    sx={{ color: theme.palette.secondary.main }}
                />
            </Box>
        );
    }

    if (type === 'icon') {
        return (
            <Box
                sx={{
                    width: sizeMap[size].icon,
                    height: sizeMap[size].icon,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <CircularProgress
                    size={sizeMap[size].icon * 0.8}
                    thickness={4}
                    sx={{ color: theme.palette.secondary.main }}
                />
            </Box>
        );
    }

    // Default text loader
    return (
        <Skeleton
            animation="wave"
            width={sizeMap[size].text.width}
            height={sizeMap[size].text.height}
        />
    );
};

export const SectionLoader: React.FC<{
    message?: string;
    height?: string | number;
}> = ({ message = 'Loading content...', height = 400 }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                height,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
                borderRadius: 2,
                border: '1px dashed',
                borderColor: theme.palette.divider,
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
            }}
        >
            <Box
                component={motion.div}
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    position: 'relative',
                    mb: 3,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '12px',
                        border: '3px solid transparent',
                        borderTopColor: theme.palette.secondary.main,
                        borderRightColor: theme.palette.secondary.main,
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 8,
                        borderRadius: '8px',
                        backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                    }
                }}
            />

            <Typography
                variant="body1"
                component={motion.p}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                sx={{ color: theme.palette.text.secondary }}
            >
                {message}
            </Typography>
        </Box>
    );
};

// Chart placeholder loader
export const ChartLoader: React.FC<{
    type?: 'bar' | 'line' | 'pie' | 'scatter';
    height?: number | string;
}> = ({ type = 'bar', height = 300 }) => {
    const theme = useTheme();

    // Different placeholder visualizations based on chart type
    const renderPlaceholder = () => {
        switch (type) {
            case 'line':
                return (
                    <Box sx={{ height: '70%', display: 'flex', alignItems: 'flex-end', mx: 2 }}>
                        <Box
                            component={motion.div}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: `
                    linear-gradient(transparent 50%, ${alpha(theme.palette.divider, 0.3)} 0) 0 0 / 20px 20px,
                    linear-gradient(90deg, transparent 50%, ${alpha(theme.palette.divider, 0.3)} 0) 0 0 / 20px 20px
                  `,
                                }
                            }}
                        >
                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <motion.path
                                    d="M0,50 C20,30 40,90 60,40 S80,10 100,50"
                                    fill="none"
                                    stroke={theme.palette.secondary.main}
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 2 }}
                                />
                            </svg>
                        </Box>
                    </Box>
                );

            case 'pie':
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }}
                    >
                        <Box
                            component={motion.div}
                            animate={{
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            sx={{
                                width: 150,
                                height: 150,
                                borderRadius: '50%',
                                background: `conic-gradient(
                  ${theme.palette.primary.main} 0% 25%, 
                  ${theme.palette.secondary.main} 25% 55%, 
                  ${theme.palette.success.main} 55% 80%, 
                  ${theme.palette.warning.main} 80% 100%
                )`,
                                opacity: 0.7,
                            }}
                        />
                    </Box>
                );

            case 'scatter':
                return (
                    <Box
                        sx={{
                            position: 'relative',
                            height: '70%',
                            mx: 2,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: '100%',
                                height: '100%',
                                background: `
                  linear-gradient(transparent 50%, ${alpha(theme.palette.divider, 0.3)} 0) 0 0 / 20px 20px,
                  linear-gradient(90deg, transparent 50%, ${alpha(theme.palette.divider, 0.3)} 0) 0 0 / 20px 20px
                `,
                            }
                        }}
                    >
                        {Array.from({ length: 15 }).map((_, i) => {
                            const size = Math.random() * 10 + 5;
                            return (
                                <Box
                                    key={i}
                                    component={motion.div}
                                    initial={{
                                        x: Math.random() * 100 + '%',
                                        y: Math.random() * 100 + '%',
                                        opacity: 0.5
                                    }}
                                    animate={{
                                        opacity: [0.5, 0.8, 0.5],
                                    }}
                                    transition={{
                                        duration: 1 + Math.random() * 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        width: size,
                                        height: size,
                                        borderRadius: '50%',
                                        backgroundColor: i % 3 === 0 ? theme.palette.primary.main :
                                            i % 3 === 1 ? theme.palette.secondary.main :
                                                theme.palette.success.main,
                                    }}
                                />
                            );
                        })}
                    </Box>
                );

            // Default bar chart
            default:
                return (
                    <Box sx={{ height: '70%', display: 'flex', alignItems: 'flex-end', mx: 2, gap: 2 }}>
                        {Array.from({ length: 8 }).map((_, i) => {
                            const height = 30 + Math.random() * 70;
                            return (
                                <Box
                                    key={i}
                                    component={motion.div}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{
                                        duration: 1,
                                        delay: i * 0.1,
                                        ease: "easeOut"
                                    }}
                                    sx={{
                                        flex: 1,
                                        backgroundColor: i % 3 === 0 ? theme.palette.primary.main :
                                            i % 3 === 1 ? theme.palette.secondary.main :
                                                alpha(theme.palette.primary.main, 0.7),
                                        opacity: 0.7,
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4,
                                    }}
                                />
                            );
                        })}
                    </Box>
                );
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height,
                borderRadius: 2,
                border: '1px solid',
                borderColor: theme.palette.divider,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Skeleton variant="text" width="50%" height={28} />
                <Skeleton variant="text" width="30%" height={20} sx={{ mt: 0.5 }} />
            </Box>

            {renderPlaceholder()}

            <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="20%" height={20} />
                <Skeleton variant="text" width="15%" height={20} />
            </Box>
        </Paper>
    );
};

// For Nprogress-like top loading bar
export const TopProgressBar: React.FC<{
    isAnimating?: boolean;
}> = ({ isAnimating = true }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                zIndex: 9999,
                backgroundColor: 'transparent',
            }}
        >
            {isAnimating && (
                <Box
                    component={motion.div}
                    initial={{ width: '0%', opacity: 1 }}
                    animate={{
                        width: ['0%', '30%', '50%', '70%', '90%', '95%'],
                        opacity: 1
                    }}
                    transition={{
                        duration: 3,
                        ease: "easeInOut",
                    }}
                    sx={{
                        height: '100%',
                        backgroundColor: theme.palette.secondary.main,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                />
            )}
        </Box>
    );
};
