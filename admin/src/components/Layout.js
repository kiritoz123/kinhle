import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import ArticleIcon from '@mui/icons-material/Article';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

export default function Layout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const menu = [
    { label: 'Dashboard', to: '/', icon: <DashboardIcon /> },
    { label: 'Festivals', to: '/festivals', icon: <EventIcon /> },
    { label: 'Blogs', to: '/blogs', icon: <ArticleIcon /> },
    { label: 'Prayers', to: '/prayers', icon: <MenuBookIcon /> },
    { label: 'Templates', to: '/templates', icon: <MenuBookIcon /> },
    { label: 'Banners', to: '/banners', icon: <PhotoLibraryIcon /> },
    { label: 'Masters', to: '/masters', icon: <PeopleIcon /> },
    { label: 'Practices', to: '/practices', icon: <ChecklistIcon /> },
    { label: 'Items', to: '/items', icon: <ShoppingBasketIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Worship Admin</Typography>
          <IconButton color="inherit" onClick={logout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: 220, [`& .MuiDrawer-paper`]: { width: 220, mt: '64px' } }}>
        <List>
          {menu.map((m) => (
            <ListItemButton key={m.to} component={Link} to={m.to}>
              <ListItemIcon>{m.icon}</ListItemIcon>
              <ListItemText primary={m.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '80px', width: 'calc(100% - 220px)', ml: '220px' }}>
        <Outlet />
      </Box>
    </Box>
  );
}