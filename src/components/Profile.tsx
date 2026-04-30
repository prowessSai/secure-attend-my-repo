import { Box, Card, CardContent, Typography, Button, Chip, Avatar } from "@mui/material";
import { 
  Email, 
  Phone, 
  Shield, 
  CalendarMonth, 
  AccessTime,
  CheckCircle,
  Business
} from "@mui/icons-material";
import { useState } from "react";
import ChangePassword from "./User/ChangePassword";
import { useAuth } from "../auth/AuthProvider";


const getInitials = (name: string) => {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getRoleDisplayName = (role: string) => {
  const roleMap: Record<string, string> = {
    super_admin: "Super Administrator",
    admin: "Administrator",
    manager: "Manager",
  };
  return roleMap[role] || role;
};

export default function Profile() {
  const {getLoginUserInfo} = useAuth();
  const loggedInUser = getLoginUserInfo();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  return (
    <Box sx={{ p:2, maxWidth: 1400, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb:2}}>
        <Box>
          <Typography variant="h4" fontWeight={600}>My Profile</Typography>
          <Typography color="text.secondary">Manage your account information and settings</Typography>
        </Box>
        {/* <Button variant="outlined" sx={{ bgcolor:"#fff",textTransform: "none", borderRadius: 1.5, px: 2, py: 0.25, fontSize: "0.875rem", fontWeight: 500, border: "1px solid #E5E7EB", color: "#374151", "&:hover": { bgcolor: "#F3F4F6", border: "1px solid #E5E7EB" } }}>Edit Profile</Button> */}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" }, gap:2}}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p:2}}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", mb:2}}>
              <Avatar sx={{ width: 96, height: 96, bgcolor: "#0F4C81", fontSize: "2rem", mb: 2 }}>
                {getInitials(loggedInUser?.name || "")}
              </Avatar>
              <Typography variant="h5" fontWeight={600}>{loggedInUser?.name??""}</Typography>
              <Typography fontSize="0.875rem" color="text.secondary" mb={1.5}>
                {getRoleDisplayName(loggedInUser?.roleName??"")}
              </Typography>
              <Chip 
                label={loggedInUser?.status === "ACTIVE" ? "Active" : "Inactive"} 
                size="small"
                sx={{ 
                  bgcolor: "#D1FAE5",
                  color: "#059669",
                  fontWeight: 500
                }}
              />
            </Box>

            <Box sx={{ pt:2, borderTop: "1px solid #E0E0E0", display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Email sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontSize="0.875rem" color="text.secondary">Email</Typography>
                  <Typography fontSize="0.875rem" sx={{ wordBreak: "break-word" }}>{loggedInUser?.email??""}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Phone sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography fontSize="0.875rem" color="text.secondary">Phone</Typography>
                  <Typography fontSize="0.875rem">{loggedInUser?.mobileNum??""}</Typography>
                </Box>
              </Box>
              {loggedInUser?.branchId && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Business sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontSize="0.875rem" color="text.secondary">Assigned Branch</Typography>
                    <Typography fontSize="0.875rem">{loggedInUser.branchName??""}</Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ pt:2, mt:2, borderTop: "1px solid #E0E0E0", display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <CalendarMonth sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography fontSize="0.875rem" color="text.secondary">Member Since</Typography>
                  <Typography fontSize="0.875rem">{formatDate(loggedInUser?.activatedAt??"") || '-'}</Typography>
                </Box>
              </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <AccessTime sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography fontSize="0.875rem" color="text.secondary">Last Login</Typography>
                    <Typography fontSize="0.875rem">{formatDateTime(loggedInUser?.lastLogin??"") || '-'}</Typography>
                  </Box>
                </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p:2}}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb:2}}>
                <Shield sx={{ fontSize: 20 }} />
                <Typography variant="h6" fontWeight={600}>Role & Permissions</Typography>
              </Box>
              <Box sx={{ mb:1}}>
                <Typography fontSize="0.875rem" color="text.secondary" mb={1}>Current Role</Typography>
                <Chip 
                  icon={<Shield sx={{ fontSize: 16 }} />}
                  label={getRoleDisplayName(loggedInUser?.roleName??"")}
                  sx={{ bgcolor: "#EBF5FF", color: "#0F4C81", fontWeight: 500 }}
                />
              </Box>
              <Box>
                <Typography fontSize="0.875rem" color="text.secondary" mb={1}>Access Permissions</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                  {loggedInUser?.permissions.map((permission) => (
                    <Box key={permission.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 16, color: "#10b981" }} />
                      <Typography fontSize="0.875rem">
                        {permission.permissionName.split(".").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p:2}}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb:1}}>
                <Shield sx={{ fontSize: 20 }} />
                <Typography variant="h6" fontWeight={600}>Security</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, bgcolor: "#F9FAFB", borderRadius: 1 }}>
                  <Box>
                    <Typography fontWeight={500} fontSize="0.875rem">Password</Typography>
                    <Typography fontSize="0.75rem" color="text.secondary">Last changed 45 days ago</Typography>
                  </Box>
                  <Button variant="outlined" size="small" onClick={() => setShowPasswordDialog(true)} sx={{ bgcolor:"#fff",textTransform: "none", borderRadius: 1.5, px: 2, py: 0.25, fontSize: "0.875rem", fontWeight: 500, border: "1px solid #E5E7EB", color: "#374151", "&:hover": { bgcolor: "#F3F4F6", border: "1px solid #E5E7EB" } }}>Change Password</Button>
                </Box>
                {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, bgcolor: "#F9FAFB", borderRadius: 1 }}>
                  <Box>
                    <Typography fontWeight={500} fontSize="0.875rem">Two-Factor Authentication</Typography>
                    <Typography fontSize="0.75rem" color="text.secondary">Add an extra layer of security</Typography>
                  </Box>
                  <Button variant="outlined" size="small" sx={{bgcolor:"#fff", textTransform: "none", borderRadius: 1.5, px: 2, py: 0.25, fontSize: "0.875rem", fontWeight: 500, border: "1px solid #E5E7EB", color: "#374151", "&:hover": { bgcolor: "#F3F4F6", border: "1px solid #E5E7EB" } }}>Enable</Button>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, bgcolor: "#F9FAFB", borderRadius: 1 }}>
                  <Box>
                    <Typography fontWeight={500} fontSize="0.875rem">Active Sessions</Typography>
                    <Typography fontSize="0.75rem" color="text.secondary">1 active session (current device)</Typography>
                  </Box>
                  <Button variant="outlined" size="small" sx={{bgcolor:"#fff", textTransform: "none", borderRadius: 1.5, px: 2, py: 0.25, fontSize: "0.875rem", fontWeight: 500, border: "1px solid #E5E7EB", color: "#374151", "&:hover": { bgcolor: "#F3F4F6", border: "1px solid #E5E7EB" } }}>View All</Button>
                </Box> */}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <ChangePassword open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} />
    </Box>
  );
}
