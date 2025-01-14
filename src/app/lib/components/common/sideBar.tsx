import React, {ReactNode, useState} from 'react';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import {Menu as MenuIcon} from '@mui/icons-material';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import Image from 'next/image';
import {BookOpen, Calendar as CalendarIcon, FolderKanban, LayoutGrid,} from 'lucide-react';

export interface SubMenuItem {
    text: string;
    path: string;
}

export interface MenuItem {
    text: string;
    icon: ReactNode;
    path: string;
    subItems?: SubMenuItem[];
}

export type MenuItems = MenuItem[];

const drawerWidth = 300;

export const menuItems: MenuItem[] = [
    { text: 'Projects', icon: <FolderKanban />, path: '/projects' },
    { text: 'Best Practices', icon: <BookOpen />, path: '/best-practices' },
    { text: 'Portfolio', icon: <LayoutGrid />, path: '/portfolio' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
];

const Sidebar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isActive = (path: string) => {
        return pathname === path;
    };

    const drawer = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar>
                <Image src="/next.svg" alt="Logo" width={40} height={40} />
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