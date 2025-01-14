import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Avatar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useTheme,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Calendar as CalendarIcon, FolderKanban, LayoutGrid, LogOut, Settings, User } from 'lucide-react';
import { AuthService } from "@/app/lib/api/auth";
import { useRouter } from 'next/navigation';
interface CognitoAttribute {
    Name?: string;
    Value?: string;
}

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

interface UserAttributes {
    email?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    [key: string]: string | undefined;
}

const drawerWidth = 300;

export const menuItems: MenuItem[] = [
    { text: 'Projects', icon: <FolderKanban />, path: '/projects' },
    { text: 'Best Practises', icon: <BookOpen />, path: '/best-practises' },
    { text: 'Portfolio', icon: <LayoutGrid />, path: '/portfolio' },
    { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' },
];

const Sidebar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userAttributes, setUserAttributes] = useState<UserAttributes>({});
    const pathname = usePathname();
    const theme = useTheme();
    const router = useRouter();
    const authService = AuthService.getInstance();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await authService.getCurrentUser();
                if (userData?.UserAttributes) {
                    const attributes: UserAttributes = {};
                    userData.UserAttributes.forEach((attr: CognitoAttribute) => {
                        if (attr.Name) {
                            attributes[attr.Name] = attr.Value || undefined;
                        }
                    });
                    setUserAttributes(attributes);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const isActive = (path: string) => pathname === path;

    const getUserInitials = () => {
        const firstName = userAttributes.given_name || '';
        const lastName = userAttributes.family_name || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

            <Box sx={{ p: 2 }}>
                <Box
                    onClick={handleProfileClick}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: theme.palette.secondary.main,
                            color: 'white',
                            width: 40,
                            height: 40,
                        }}
                    >
                        {getUserInitials()}
                    </Avatar>
                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 500 }}>
                            {userAttributes.given_name} {userAttributes.family_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {userAttributes.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <User size={20} />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <Settings size={20} />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <LogOut size={20} color={theme.palette.error.main} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
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