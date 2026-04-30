import { Box, Card, CardContent, Typography, Button, CircularProgress} from "@mui/material";
import { Business, LocationOn, People, BarChart, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AddBranchModal from "../../components/Branches/AddBranchModal";
import EditBranchModal from "../../components/Branches/EditBranchModal";
import { IBranchListDTO } from "../../interfaces/Branches";
import { getBranchesList } from "../../services/Branches";
import { useAuth } from "../../auth/AuthProvider";

const Branches = ()=> {
  const { getLoginUserInfo } = useAuth();
  const loggedInUser = getLoginUserInfo();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Array<IBranchListDTO>>([]);
  const [loading, setLoading] = useState(false);
  const [openAddBranchModal, setOpenAddBranchModal] = useState(false);
  const[openEditBranchModal,setOpenEditBranchModal] = useState(false);
  const [selecetedBranchId,setSelectedBranchId] = useState<number | null>(null);
 
    const fetchAllBranches = async () => {
      try {
        setLoading(true);
        const branchesRes = await getBranchesList();
        setBranches(Array.isArray(branchesRes) ? branchesRes : []);
      } catch {
        setBranches([]);
      }finally{
        setLoading(false);
      }
    };
    useEffect(() => {
    fetchAllBranches();
    }, []);
  const handleViewAnalytics = (branch:IBranchListDTO) => {
    navigate(`/branch-analytics/${branch.branchId}`);
  };
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: "1.875rem", fontWeight: 600, mb: 0.5 }}>Branch Management</Typography>
          <Typography sx={{ color: "text.secondary" }}>Manage office locations and geo-fencing</Typography>
        </Box>
        {loggedInUser?.roleName === "SUPER ADMIN" && (
          <Button variant="contained" startIcon={<Add />} 
           onClick={() => setOpenAddBranchModal(true)}sx={{ bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0D3D66" } }}>
            Add Branch
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : branches.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">No branches found</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }, gap:2 }}>
          {branches.map((branch) => {
            return (
              <Card key={branch.branchId} sx={{ borderRadius: 2, transition: "box-shadow 0.3s", "&:hover": { boxShadow: 6 }, display: "flex", flexDirection: "column", height: "100%" }}>
                  <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                      <Box sx={{ width: 48, height: 48, bgcolor: "#E3F2FD", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Business sx={{ fontSize: 24, color: "#0F4C81" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: "1.125rem", fontWeight: 600 }}>{branch.branchName}</Typography>
                        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mt: 0.5 }}>{branch.address??""}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <People sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Assigned Employees:</Typography>
                        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{branch.employeeCount??""}</Typography>
                      </Box>

                      {branch.coordinates && (() => {
                        try {
                          let coords;
                          // Try parsing as space-separated string first
                          if (typeof branch.coordinates === 'string' && branch.coordinates.includes(' ')) {
                            coords = branch.coordinates.split(' ').map(Number);
                          } else {
                            // Fallback to JSON parsing
                            coords = JSON.parse(branch.coordinates);
                          }
                          
                          if (coords && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]) && (coords[0] !== 0 || coords[1] !== 0)) {
                            return (
                              <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                  <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
                                  <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Coordinates:</Typography>
                                </Box>
                                <Box sx={{ pl: 3, fontSize: "0.875rem" }}>
                                  <Typography sx={{ fontSize: "0.875rem" }}>Lat: {coords[1].toFixed(6)}</Typography>
                                  <Typography sx={{ fontSize: "0.875rem" }}>Lng: {coords[0].toFixed(6)}</Typography>
                                </Box>
                              </Box>
                            );
                          }
                          return (
                            <Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
                                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Coordinates:</Typography>
                              </Box>
                              <Box sx={{ pl: 3, fontSize: "0.875rem" }}>
                                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>N/A</Typography>
                              </Box>
                            </Box>
                          );
                        } catch {
                          return (
                            <Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
                                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Coordinates:</Typography>
                              </Box>
                              <Box sx={{ pl: 3, fontSize: "0.875rem" }}>
                                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>N/A</Typography>
                              </Box>
                            </Box>
                          );
                        }
                      })()}

                      <Box sx={{ mt: "auto", pt: 1.5, borderTop: "1px solid #E0E0E0", display: "flex", justifyContent: "space-between", alignItems: "center", mb:1}}>
                        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Geo-fence Radius:</Typography>
                        <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>{branch.geofenceRadius ? branch.geofenceRadius - 50 : 0} m</Typography>
                      </Box>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="outlined" fullWidth size="small" onClick={() => {setOpenEditBranchModal(true);setSelectedBranchId(branch.branchId)}} sx={{ textTransform: "none", color: "#000", borderColor: "#E0E0E0" }}>
                          Edit
                        </Button>
                        <Button variant="outlined" fullWidth size="small" startIcon={<BarChart />} onClick={() => handleViewAnalytics(branch)} sx={{ textTransform: "none", color: "#000", borderColor: "#E0E0E0" }}>
                          Analytics
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
            );
          })}
        </Box>
      )}
      <AddBranchModal
        open={openAddBranchModal}
        onClose={() => setOpenAddBranchModal(false)}
        refreshData={fetchAllBranches}
      />
      <EditBranchModal open={openEditBranchModal} onClose={() => setOpenEditBranchModal(false)} branchId={selecetedBranchId}  onSave={fetchAllBranches}/>
    </Box>
  );
}

export default Branches;
