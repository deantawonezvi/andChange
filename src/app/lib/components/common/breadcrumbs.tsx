'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { alpha, Box, Breadcrumbs as MuiBreadcrumbs, Chip, Typography, useTheme } from '@mui/material';
import { ChevronRight, FileText, Home, Layers, Settings, Users } from 'lucide-react';
import { menuItems } from '@/app/lib/components/common/sideBar';

interface BreadcrumbsProps {
    extraCrumbs?: {
        title: string;
        href?: string;
        icon?: React.ReactNode;
    }[];
    showHome?: boolean;
}

type PathSegment = {
    title: string;
    href: string;
    icon: React.ReactNode;
};

// Create mapping from menuItems + additional paths
const pathToTitleMapping: Record<string, { title: string; icon: React.ReactNode }> = {
    '': { title: 'Home', icon: <Home size={16} /> },
    // Additional paths not in menuItems
    'best-practises': { title: 'Best Practices', icon: <FileText size={16} /> },
    'model-calibration': { title: 'Model Calibration', icon: <Settings size={16} /> },
    'impacted-groups': { title: 'Impacted Groups', icon: <Users size={16} /> },
    'timeline': { title: 'Timeline', icon: <Layers size={16} /> },
};

menuItems.forEach(item => {
    const pathSegment = item.path.split('/').filter(Boolean)[0];
    if (pathSegment) {
        pathToTitleMapping[pathSegment] = {
            title: item.text,
            icon: React.cloneElement(item.icon as React.ReactElement, { size: 16 })
        };
    }
});

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
                                                            extraCrumbs,
                                                            showHome = true
                                                        }) => {
    const pathname = usePathname();
    const theme = useTheme();

    const breadcrumbs = useMemo(() => {
        const pathSegments = pathname.split('/').filter(Boolean);

        // Initialize result array with home if showHome is true
        const result: PathSegment[] = showHome
            ? [{ title: 'Home', href: '/projects', icon: <Home size={16} /> }]
            : [];

        // Build up breadcrumbs path
        let currentPath = '';

        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;

            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            // Check for numeric IDs or UUIDs
            const isDynamicSegment = segment.match(/^\d+$/) !== null ||
                uuidPattern.test(segment) ||
                // Additional check for other potential dynamic segments that don't have a mapping
                (index > 0 && !pathToTitleMapping[segment]);

            if (isDynamicSegment && index > 0) {
                // For dynamic segments, use the previous segment's title with "Details" appended
                const prevSegment = pathSegments[index - 1];
                const prevTitle = pathToTitleMapping[prevSegment]?.title || prevSegment;
                const icon = pathToTitleMapping[prevSegment]?.icon || <FileText size={16} />;

                result.push({
                    title: `${prevTitle} Details`,
                    href: currentPath,
                    icon
                });
            } else {
                // For static segments, use the mapping or the segment itself
                const info = pathToTitleMapping[segment] || {
                    title: segment.charAt(0).toUpperCase() + segment.slice(1),
                    icon: <FileText size={16} />
                };

                result.push({
                    title: info.title,
                    href: currentPath,
                    icon: info.icon
                });
            }
        });

        // Add any extra crumbs
        if (extraCrumbs) {
            extraCrumbs.forEach(crumb => {
                result.push({
                    title: crumb.title,
                    href: crumb.href || '',
                    icon: crumb.icon || <FileText size={16} />
                });
            });
        }

        return result;
    }, [pathname, extraCrumbs, showHome]);

    // Don't render if it's just the home breadcrumb
    if (breadcrumbs.length <= 1) {
        return null;
    }

    return (
        <Box
            sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <MuiBreadcrumbs
                separator={<ChevronRight size={16} color={theme.palette.text.secondary} />}
                aria-label="breadcrumb"
                sx={{
                    '& .MuiBreadcrumbs-ol': {
                        alignItems: 'center',
                    }
                }}
            >
                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    // Render current page as non-link Typography
                    if (isLast) {
                        return (
                            <Chip
                                key={crumb.href}
                                icon={
                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5 }}>
                                        {crumb.icon}
                                    </Box>
                                }
                                label={crumb.title}
                                size="small"
                                sx={{
                                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                    color: theme.palette.secondary.main,
                                    fontWeight: 500,
                                    '& .MuiChip-icon': {
                                        color: theme.palette.secondary.main,
                                    }
                                }}
                            />
                        );
                    }

                    // Render links for all but the current page
                    return (
                        <Link
                            key={crumb.href}
                            href={crumb.href}
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                color: theme.palette.text.secondary,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                    }
                                }}
                            >
                                <Box sx={{ mr: 0.5, display: 'flex' }}>
                                    {crumb.icon}
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        }
                                    }}
                                >
                                    {crumb.title}
                                </Typography>
                            </Box>
                        </Link>
                    );
                })}
            </MuiBreadcrumbs>
        </Box>
    );
};

export default Breadcrumbs;