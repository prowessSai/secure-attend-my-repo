import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Button, Chip, CircularProgress } from "@mui/material";
import { Shield, Add, Edit, Delete, Computer, Smartphone, People, Check } from "@mui/icons-material";
import AddRoleModal from "../../components/RolesAndPermissions/AddRoleModal";
import EditRoleModal from "../../components/RolesAndPermissions/EditRoleModal";
import { IRoleCountsDTO, IRoleDTO } from "../../interfaces/Roles";
import { getRolesCounts, getRolesList } from "../../services/Roles";

const StatCard = ({ icon: Icon, value, label, color }: any) => (
  <Card sx={{ borderRadius: 2 }}>
    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon sx={{ fontSize: 20, color: `${color}.main` }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 600 }}>{value}</Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{label}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const getAccessTypeIcon = (type:string) => {
  if (type === "WEB") return <Computer sx={{ fontSize: 16 }} />;
  if (type === "MOBILE_APP") return <Smartphone sx={{ fontSize: 16 }} />;
  return (
    <>
      <Computer sx={{ fontSize: 14 }} />
      <Smartphone sx={{ fontSize: 14 }} />
    </>
  );
};

const getAccessTypeColor = (type:string) => {
  if (type === "WEB") return { bgcolor: "#E3F2FD", color: "#1976D2" };
  if (type === "MOBILE_APP") return { bgcolor: "#E8F5E9", color: "#388E3C" };
  return { bgcolor: "#F3E5F5", color: "#7B1FA2" };
};

const getAccessTypeLabel = (type: string) => {
  if (type === "WEB") return "Web Only";
  if (type === "MOBILE_APP") return "Mobile Only";
  return "Web & Mobile";
};

export function RolesAndPermissions() {
   const [openAddRoleModal, setOpenAddRoleModal] = useState(false);
   const [openEditRoleModal,setOpenEditRoleModal] = useState(false);
   const [rolesCounts, setRolesCounts] = useState<IRoleCountsDTO | null>(null);
  const [roles, setRoles] = useState<Array<IRoleDTO>>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRoleDTO | null>(null);

  useEffect(() => {
    const fetchRolesCounts = async () => {
      setLoading(true);
      try {
        const data = await getRolesCounts();
        setRolesCounts(data);
      } catch (err) {
        console.error("Error fetching roles summary:", err);
        setRolesCounts(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRolesCounts();
  }, []);
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const roleRes = await getRolesList();
      setRoles(Array.isArray(roleRes) ? roleRes : []);
    } catch (error) {
      setRoles([]);
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
  fetchRoles();
}, []);
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: "1.875rem", fontWeight: 600, mb: 0.5 }}>Roles & Permissions</Typography>
          <Typography sx={{ color: "text.secondary" }}>Define roles and assign them to users - each role determines web/mobile access</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0D3D66" } }} onClick={() => setOpenAddRoleModal(true)}>Create New Role</Button>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" }, gap: 2, mb: 2 }}>
        <StatCard icon={Shield} value={rolesCounts?.totalRoles??0} label="Total Roles" color="secondary" />
        <StatCard icon={Computer} value={rolesCounts?.webAccessUsers??0} label="Web Access" color="primary" />
        <StatCard icon={Smartphone} value={rolesCounts?.mobileAccessUsers??0} label="Mobile Access" color="success" />
        <StatCard icon={People} value={rolesCounts?.totalUsers??0} label="Total Users" color="warning" />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" }, gap: 2 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, p: 2, borderBottom: 1, borderColor: "divider" }}>All Roles ({roles.length??0})</Typography>
            <Box sx={{ maxHeight: 600, overflow: "auto" }}>
            {loading ? (
                <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={28} />
                </Box>
              ) : roles.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">No roles found</Typography>
                </Box>
              ) : (
              roles.map((role) => (
                <Box key={role.id} onClick={() => setSelectedRole(role)} sx={{ p: 2, cursor: "pointer", borderBottom: 1, borderColor: "divider", bgcolor: selectedRole?.id === role.id ? "#EBF5FF" : "transparent", "&:hover": { bgcolor: "#F5F5F5" } }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 600 }}>{role.name}</Typography>
                        {role.platformType === "WEB" && <Chip label="System" size="small" sx={{ height: 20, fontSize: "0.7rem" }} />}
                      </Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{role.description}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5 }}>
                    <Chip icon={getAccessTypeIcon(role.platformType)} label={getAccessTypeLabel(role.platformType)} size="small" sx={{ ...getAccessTypeColor(role.platformType), fontWeight: 500 }} />
                    <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{role.userCount || 0} {role.userCount === 1 ? "user" : "users"}</Typography>
                  </Box>
                </Box>
              ))
            )}
            </Box>
          </CardContent>
        </Card>

        {selectedRole ? (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb:2}}>
                <Box>
                  <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>{selectedRole.name}</Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mt: 0.5 }}>{selectedRole.description}</Typography>
                </Box>
                {selectedRole.name !== "SUPER ADMIN" && selectedRole.name !== "BRANCH ADMIN" && selectedRole.name !== "EMPLOYEE" && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="outlined" size="small" startIcon={<Edit />}  onClick={() => setOpenEditRoleModal(true)} sx={{ color:"#000",height: 32,textTransform:"none" }}>Edit</Button>
                  <Button variant="outlined" size="small" startIcon={<Delete />} sx={{ textTransform:"none",color: "error.main", borderColor: "error.main", height: 32 }}>Delete</Button>
                </Box>
                )}
              </Box>

              <Box sx={{ mb:2}}>
                <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Access Type</Typography>
                <Chip icon={getAccessTypeIcon(selectedRole.platformType)} label={getAccessTypeLabel(selectedRole.platformType)} sx={{ ...getAccessTypeColor(selectedRole.platformType), fontWeight: 500, px: 2, py: 2}} />
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mt: 1 }}>
                  {selectedRole.platformType === "WEB" && "Users with this role can only access the web admin portal"}
                  {selectedRole.platformType === "MOBILE_APP" && "Users with this role can only access the mobile employee app"}
                  {selectedRole.platformType === "MOBILE_AND_WEB" && "Users with this role can access both web portal and mobile app"}
                </Typography>
              </Box>

              <Box sx={{ mb:2}}>
                <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Permissions & Features</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {selectedRole.permissions?.map((permission) => (
                  <Box key={permission.id} sx={{ display: "flex", alignItems: "flex-start", gap: 1, p: 1, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Check sx={{ fontSize: 16, color: "success.main", mt: 0.25 }} />
                    <Typography sx={{ fontSize: "0.875rem" }}>
                      {permission.permissionName}
                    </Typography>
                  </Box>
                ))}
                </Box>
              </Box>

              <Box sx={{ pt: 2, borderTop: 1, borderColor: "divider", mb: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Role Information</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                  <Box sx={{ p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 0.5 }}>Assigned Users</Typography>
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>{selectedRole.userCount}</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 0.5 }}>Role Type</Typography>
                    {/* <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>{selectedRole.platformType === "WEB" ? "System Role" : "Custom Role"}</Typography> */}
                    <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>{selectedRole.name}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ bgcolor: "#E3F2FD", border: 1, borderColor: "#90CAF9", borderRadius: 1, p: 2 }}>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Shield sx={{ fontSize: 20, color: "#1976D2", mt: 0.25 }} />
                  <Box>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#0D47A1", mb: 0.5 }}>How to assign this role:</Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: "#0D47A1" }}>Go to <strong>Employee Management</strong> and select this role when adding or editing an employee. The role will automatically grant the appropriate access level.</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 12, textAlign: "center" }}>
              <Shield sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, mb: 1 }}>Select a Role</Typography>
              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Choose a role from the list to view its details and permissions</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
      <AddRoleModal
        open={openAddRoleModal}
        onClose={() => setOpenAddRoleModal(false)}
        onCreate={() =>{setSelectedRole(null);fetchRoles()}}
      />
      <EditRoleModal open={openEditRoleModal}  role={selectedRole}  onClose={()=>setOpenEditRoleModal(false)} onSave={() =>{setSelectedRole(null);fetchRoles()}}/>
    </Box>
  );
}

export default RolesAndPermissions;
