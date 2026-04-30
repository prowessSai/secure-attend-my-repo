import { useState,} from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Menu, MenuItem, Typography, Avatar, Divider } from "@mui/material";
import { Person, Logout, KeyboardArrowDown } from "@mui/icons-material";
import { useAuth } from "../auth/AuthProvider";


const getRoleDisplayName = (role: string) => {
  if (role === "SUPER ADMIN" || role === "ADMIN") return "Super Administrator";
  if (role === "BRANCH ADMIN") return "Branch Admin";
  if (role === "EMPLOYEE") return "Employee";
  return "Viewer";
};

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

export function ProfileDropdown() {
  const { getLoginUserInfo } = useAuth();
  const loggedInUser = getLoginUserInfo();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const user = loggedInUser ?? {
    name: "",
    email: "",
    roleName: ""
  };
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/login");
    handleClose();
  };

  return (
    <Box>
      <Button onClick={handleClick} sx={{ display: "flex", alignItems: "center", gap: 1, textTransform: "none", color: "text.primary" }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "#0F4C81", fontSize: "0.875rem"}}>{getInitials(user.name)}</Avatar>
        <Box sx={{ display: { xs: "none", lg: "flex" }, flexDirection: "column", alignItems: "flex-start" }}>
          <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.2,fontWeight:600  }}>{user.name}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", lineHeight: 1.2,fontWeight:600 }}>{getRoleDisplayName(user.roleName)}</Typography>
        </Box>
        <KeyboardArrowDown sx={{ fontSize: 16,fontWeight:600, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { width: 256, mt: 1 } }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: "#0F4C81" }}>{getInitials(user.name)}</Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{user.name}</Typography>
              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</Typography>
            </Box>
          </Box>
        </Box>

        <MenuItem onClick={() => { navigate("/profile"); handleClose(); }} sx={{ py: 1.5 }}>
          <Person sx={{ fontSize: 18, mr: 1.5 }} />
          My Profile
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: "error.main" }}>
          <Logout sx={{ fontSize: 18, mr: 1.5 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default ProfileDropdown;
