import React from 'react';
import {Box, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {MenuItems} from '@/app/lib/components/common/sideBar';
import {usePathname} from 'next/navigation';

interface PageHeaderProps {
    menuItems: MenuItems;
}

const PageHeader: React.FC<PageHeaderProps> = ({ menuItems }) => {
    const theme = useTheme();
    const pathname = usePathname();

    const excludedPaths = ['/dashboard'];
    const currentMenuItem = menuItems.find(item => pathname.startsWith(item.path) && !excludedPaths.includes(item.path));



    return (
        <>
            {currentMenuItem && (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 4,
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
                            {currentMenuItem.text}
                        </Typography>
                    </Box>

                </Box>
            )}
        </>
    );
};

export default PageHeader;