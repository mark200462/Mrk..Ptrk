import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import {useNavigate} from "react-router-dom"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const drawerWidth = 240;

let menuPoints = [
    {
        Title: "Értesítések",
        AdminLevel: 0,
        Icon: <NotificationsActiveIcon />,
        Path: "./notifications"
    },
    {
        Title: "Naptár",
        AdminLevel: 0,
        Icon: <CalendarMonthIcon />,
        Path: "./calendar"
    },
    {
        Title: "Feladatkezelő",
        AdminLevel: 1,
        Icon: <AssignmentIcon />,
        Path: "./tasks"
    },
    {
        Title: "Jogosultság kezelő",
        AdminLevel: 2,
        Icon: <LocalPoliceIcon />,
        Path: "./permissions"   
    },
    {
        Title: "Kijelentkezés",
        AdminLevel: 0,
        Icon: <ExitToAppIcon />,
        Path: "logout"       
    }
    

]

export default function Dashboard() {
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    useEffect(() => {
        fetch('http://127.0.0.1:6969/api/v1/users/userData', {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
            }).then((response) => response.json()).then((sdata) => {
                if(sdata.payload === undefined){
                    navigate("/login/login")
                    return false
                }
                menuPoints = menuPoints.filter(element => element.AdminLevel <= sdata.payload.AdminLevel)
        })
    }, [navigate])

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
        setMobileOpen(!mobileOpen);
        }
    };

    const handleMenuButtons = (Path) => {
        if(Path === "logout"){
            fetch('http://127.0.0.1:6969/api/v1/users/logout', {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json'
                },
            }).then((response) => response.json()).then((data) => {
                if(data.message === "Success"){
                    navigate("/login/login")
                }
            })
            return true
        }
        navigate(Path)
    }

    const drawer = (
        <div>
        <Toolbar />
        <List>
            {menuPoints.map((element, index) => (
                <ListItem key={element.Title} disablePadding onClick={() => handleMenuButtons(element.Path)}>
                    <ListItemButton>
                    <ListItemIcon>
                        {element.Icon}
                    </ListItemIcon>
                    <ListItemText primary={element.Title} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        </div>
    );

  return (
    <React.Fragment>
        <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
            position="fixed"
            sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            }}
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
            <Typography variant="h6" noWrap component="div">
                OfficeCalendar
            </Typography>
            </Toolbar>
        </AppBar>
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            >
            {drawer}
            </Drawer>
            <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
            >
            {drawer}
            </Drawer>
        </Box>
        <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
            <Toolbar />
            <Outlet />
        </Box>
        </Box>
        </React.Fragment>
    )
}