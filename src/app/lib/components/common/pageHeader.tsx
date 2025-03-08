// src/app/lib/components/common/pageHeader.tsx
import React from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MenuItems } from '@/app/lib/components/common/sideBar';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/app/lib/components/common/breadcrumbs';
import { PlusCircle } from 'lucide-react';

interface PageHeaderProps {
    menuItems: MenuItems;
    title?: string;
    showBreadcrumbs?: boolean;
    actionButton?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
}

const PageHeader: React.FC<PageHeaderProps> = ({
                                                   menuItems,
                                                   title,
                                                   showBreadcrumbs = true,
                                                   actionButton
                                               }) => {
    const theme = useTheme();
    const pathname = usePathname();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const excludedPaths = ['/dashboard'];
    const currentMenuItem = menuItems.find(item =>
        pathname.startsWith(item.path) && !excludedPaths.includes(item.path)
    );

    // Use either the custom title or the menu item title
    const headerTitle = title || (currentMenuItem?.text || '');

    return (
        <>
            {currentMenuItem && (
                <Box sx={{ mb: 4 }}>


                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pb: 2,
                        borderBottom: `3px solid ${theme.palette.secondary.main}`,
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <Box
                                sx={{
                                    mr: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: theme.palette.primary.main
                                }}
                            >
                                {React.cloneElement(currentMenuItem.icon as React.ReactElement, { size: 32 })}
                            </Box>
                            <Typography variant="h4" component="h1" fontWeight={500}>
                                {headerTitle}
                            </Typography>
                        </Box>

                        {/* Breadcrumbs component */}
                        {showBreadcrumbs && <Breadcrumbs />}

                        {/* Action button (if provided) */}
                        {actionButton && (
                            <Button
                                variant="contained"
                                startIcon={actionButton.icon || <PlusCircle size={20} />}
                                onClick={actionButton.onClick}
                                sx={{
                                    px: isMobile ? 2 : 3,
                                    py: isMobile ? 0.75 : 1,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {actionButton.label}
                            </Button>
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};

export default PageHeader;