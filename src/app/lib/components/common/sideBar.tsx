// src/app/lib/components/common/sideBar.tsx
import React, { useState } from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Calendar as CalendarIcon, FolderKanban, LayoutGrid } from 'lucide-react';
import { AuthService } from "@/app/lib/api/auth";
import LogoutButton from './logoutButton';

export interface SubMenuItem {
    text: string;
    path: string;
}

export interface MenuItem {
    text: string;
    icon: React.ReactNode;
    path: string;
    subItems?: SubMenuItem[];
}

export type MenuItems = MenuItem[];

const drawerWidth = 300;

export const menuItems: MenuItem[] = [
    { text: 'Projects', icon: <FolderKanban />, path: '/projects' },
    { text: 'Organisations', icon: <BookOpen />, path: '/organisations' },
    { text: 'Portfolio', icon: <LayoutGrid />, path: '/portfolio' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
];

const Sidebar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const theme = useTheme();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isActive = (path: string) => {
        if (path === '/projects') {
            return pathname === path || pathname.startsWith(`${path}/`);
        }
        return pathname === path;
    };

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar>
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '1rem', md: '1.4rem' },
                        fontWeight: 500,
                        mb: 2,
                        background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                    }}
                >
                    andChange
                </Typography>
            </Toolbar>
            <List sx={{ flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        component={Link}
                        href={item.path}
                        sx={{
                            borderLeft: isActive(item.path) ? '4px solid #e85d45' : '',
                            borderRight: isActive(item.path) ? '4px solid #e85d45' : '',
                            backgroundColor: isActive(item.path) ? 'rgba(235,168,123,0.1)' : 'transparent',
                        }}
                    >
                        <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} sx={{ color: 'secondary.50' }} />
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', my: 2 }} />
            <ListItem>
                <LogoutButton
                    variant="text"
                    fullWidth
                />
            </ListItem>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
                elevation={0}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: 'primary.main',
                            color: 'white',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            backgroundColor: 'primary.main',
                            color: 'white',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
};

export default Sidebar;