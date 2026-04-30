import { useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, AppBar, Toolbar, Typography, Badge } from "@mui/material";
import {Business,Logout, Menu, Close} from "@mui/icons-material";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ProfileDropdown from "./ProfileDropdown";
import useNotifications from "../hooks/useNotification";
import { readAllNotification } from "../interfaces/Notification";

const NavigationBar = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notificationCount, resetCount,refreshCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", path: "/dashboard", icon: DashboardOutlinedIcon},
    { name: "Employees", path: "/employees", icon: PeopleOutlinedIcon },
    { name: "Branches", path: "/branches", icon: Business },
    { name: "Live Tracking", path: "/live-tracking", icon: LocationOnOutlinedIcon },
    { name: "Alerts", path: "/alerts", icon: NotificationsOutlinedIcon },
    // { name: "Reports", path: "/reports", icon: Description },
    { name: "Roles & Permissions", path: "/roles-permissions", icon: ShieldOutlinedIcon },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAlertsClick = async () => {
    if (notificationCount > 0) {
      await readAllNotification();
      resetCount();
      refreshCount();
    }
    navigate("/alerts");
    setSidebarOpen(false);
  };

  const renderDrawerContent = () => (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider", display: { xs: "none", lg: "block" } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, bgcolor: "#0F4C81", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: "white", fontSize: "1.125rem", fontWeight: 600 }}>SA</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600,fontSize:20 }}>SecureAttend</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>Admin Portal</Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ flex: 1, p: 1, overflow: "auto" }}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton key={item.path} selected={isActive}  onClick={() => { 
              if (item.name === "Alerts") {
                handleAlertsClick();
              } else {
                navigate(item.path); 
                setSidebarOpen(false);
              }
            }} sx={{ borderRadius: 1, mb: 0.5, "&.Mui-selected": { bgcolor: "#EBF5FF", color: "#0F4C81", "&:hover": { bgcolor: "#EBF5FF" } } }}>
              <ListItemIcon sx={{ minWidth: 40, color: isActive ? "#0F4C81" : "inherit" }}>
                {item.name === "Alerts" && notificationCount > 0 ? (
                  <Badge badgeContent={notificationCount} color="error" max={99}>
                    <Icon />
                  </Badge>
                ) : (
                  <Icon />
                )}
              </ListItemIcon>
              <ListItemText primary={item.name} slotProps={{ primary: { fontWeight: 600,fontSize:14 } }} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1, color: "#dc2626", "&:hover": { bgcolor: "#fef2f2" } }}>
          <ListItemIcon sx={{ minWidth: 40, color: "#dc2626" }}><Logout /></ListItemIcon>
          <ListItemText primary="Logout" slotProps={{ primary: { fontWeight: 600 } }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", m: 0, p: 0 }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: "white", color: "text.primary", borderBottom: 1, borderColor: "divider", display: { lg: "none" } }}>
        <Toolbar>
          <Typography sx={{ flex: 1, fontSize: "1.125rem" }}>SecureAttend Admin</Typography>
          <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <Close /> : <Menu />}</IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: 256 }, flexShrink: 0 }}>
        <Drawer variant="temporary" open={sidebarOpen} onClose={() => setSidebarOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", lg: "none" }, "& .MuiDrawer-paper": { width: 256, boxSizing: "border-box" } }}>{renderDrawerContent()}</Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: "none", lg: "block" }, "& .MuiDrawer-paper": { width: 256, boxSizing: "border-box", position: "relative", height: "100vh", borderRight: 1, borderColor: "divider", overflow: "hidden" } }} open>{renderDrawerContent()}</Drawer>
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "#f9fafb", minWidth: 0, width: { xs: "100%", lg: "calc(100vw - 256px)" } }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary", borderBottom: 1, borderColor: "divider", display: { xs: "none", lg: "block" }, width: "100%" }}>
          <Toolbar sx={{ justifyContent:"flex-end" }}>
            <ProfileDropdown />
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, overflow: "auto", width: "100%", maxWidth: "100%" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default NavigationBar;
