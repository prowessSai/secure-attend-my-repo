import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Select, MenuItem, FormControl, Chip, CircularProgress } from "@mui/material";
import { Phone, Email } from "@mui/icons-material";
import LiveTrackingMap from "../../components/LiveTrackingMap";
import { formatDuration } from "../../util/Util";
import { IBranchesMinDTO, ILiveEmployeeDetailsDTO, IMonitoringResponseDTO } from "../../interfaces/Branches";
import { getBranchesMin, getliveEmployeeDetails, liveTrackingAllBranches, liveTrackingByBranchId } from "../../services/Branches";

const LiveTracking = () => {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches,setBranches] = useState<Array<IBranchesMinDTO>>([]);
  const [monitoringData, setMonitoringData] = useState<IMonitoringResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<ILiveEmployeeDetailsDTO | null>(null);
  const employees = monitoringData?.employees ?? [];
  const branchesMonitoring = monitoringData?.branches ?? [];

  const insideCount = employees.filter(e => e.currentStatus === "INSIDE_OFFICE").length;
  const outsideCount = employees.filter(e => e.currentStatus !== "INSIDE_OFFICE").length;
  const totalBranches = branchesMonitoring.length;
  const totalEmployees = employees.length;

  useEffect(() => {
    const fetchAllBranches = async () => {
      try {
        const branchesRes = await getBranchesMin();
        const branchList = Array.isArray(branchesRes) ? branchesRes : [];
        setBranches(branchList);
        if (branchList.length === 1) {
          setSelectedBranch(String(branchList[0].id));
        }
      } catch {
        setBranches([]);
      }
    };
    fetchAllBranches();
  }, []);
  const fetchMonitoringDashboard = async () => {
    try {
      setLoading(true);
      let res;
      if (selectedBranch) {
        res = await liveTrackingByBranchId(Number(selectedBranch));
      } else {
        res = await liveTrackingAllBranches();
      }
      setMonitoringData(res ?? null);
    } catch (error) {
      console.error("Error fetching monitoring dashboard:", error);
      setMonitoringData(null);
    }finally{
      setLoading(false);
    }
  };  
  useEffect(() => {
    fetchMonitoringDashboard();
  }, [selectedBranch]);

  const handleEmployeeClick = async (empId: string) => {
    try {
      const data = await getliveEmployeeDetails(empId);
      setSelectedEmployee(data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedEmployee(null);
  };
    
  return (
    <Box sx={{ p:2}}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb:1}}>
        <Box>
          <Typography variant="h4" fontWeight={600} mb={0.5}>Live Geo-fence Monitoring</Typography>
          <Typography color="text.secondary">Track employee locations in real-time</Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 250 }}>
        <Select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} displayEmpty sx={{ color: selectedBranch === "" ? "text.secondary" : "inherit",bgcolor:"#fff" }}
          MenuProps={{PaperProps: {style: {maxHeight: 150,},},}}>
         {branches.length > 1 && <MenuItem value="">All Branches</MenuItem>}
          {branches.length > 0 ? (
            branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.id}>{branch.branchName}</MenuItem>
            ))
          ) : (
            <MenuItem value="">No branches available</MenuItem>
          )}
        </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap:2}}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 1, height: "100%" }}>
            <Box sx={{ height: "100%", border: "1px solid #E0E0E0", borderRadius: 1, overflow: "hidden", position: "relative" }}>
            <LiveTrackingMap
              branches={monitoringData?.branches ?? []}
              employees={monitoringData?.employees ?? []}
              onEmployeeClick={handleEmployeeClick}
              selectedEmployee={selectedEmployee}
              onInfoWindowClose={handleInfoWindowClose}
            />

              <Box sx={{ position: "absolute", top: 10, right: 10, bgcolor: "white", borderRadius: 2, boxShadow: 3, p: 1, zIndex: 1000, minWidth: 180 }}>
                <Box sx={{ display: "flex", flexDirection: "column"}}>
                  {totalBranches > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography fontSize="0.75rem" color="text.secondary">Branches Tracking</Typography>
                      <Typography fontSize="0.875rem" fontWeight={700} color="#0F4C81">{totalBranches}</Typography>
                    </Box>
                  )}
                  {totalEmployees > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography fontSize="0.75rem" color="text.secondary">Employees Tracking</Typography>
                      <Typography fontSize="0.875rem" fontWeight={700} color="#0F4C81">{totalEmployees}</Typography>
                    </Box>
                  )}
                  {(insideCount > 0 || outsideCount > 0) && <Box sx={{ height: "1px", bgcolor: "#E0E0E0", my: 0.5 }} />}
                  {insideCount > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
                        <Typography fontSize="0.75rem" color="#059669" fontWeight={500}>Inside Fence</Typography>
                      </Box>
                      <Typography fontSize="0.875rem" fontWeight={700} color="#059669">{insideCount}</Typography>
                    </Box>
                  )}
                  {outsideCount > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#ef4444" }} />
                        <Typography fontSize="0.75rem" color="#DC2626" fontWeight={500}>Outside Fence</Typography>
                      </Box>
                      <Typography fontSize="0.875rem" fontWeight={700} color="#DC2626">{outsideCount}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p:1}}>
            <Typography fontWeight={600} mb={1}>Active Employees</Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : employees.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography color="text.secondary">No active employees</Typography>
              </Box>
            ) : (
            <Box sx={{ maxHeight: 600, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
              {employees.map((emp) => (
                <Box key={emp.empId??""} sx={{ p: 2, border: "1px solid #E0E0E0", borderRadius: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1.5 }}>
                    <Box>
                      <Typography fontWeight={500} fontSize="0.875rem">{emp.name??""}</Typography>
                      <Typography fontSize="0.75rem" color="text.secondary">{emp.empId??""}</Typography>
                    </Box>
                    <Chip 
                      label={emp.currentStatus === "INSIDE_OFFICE" ? "Inside" : "Outside"} 
                      size="small"
                      sx={{ 
                        bgcolor: emp.currentStatus === "INSIDE_OFFICE" ? "#D1FAE5" : "#FEE2E2",
                        color: emp.currentStatus === "INSIDE_OFFICE" ? "#059669" : "#DC2626",
                        fontWeight: 500,
                        fontSize: "0.75rem"
                      }}
                    />
                  </Box>
                  <Box sx={{ fontSize: "0.75rem", mb: 1.5 }}>
                    <Typography fontSize="0.75rem" color="text.secondary">
                      In office: <Box component="span" sx={{ color: "text.primary", fontWeight: 500 }}>{formatDuration(emp.totalWorkHours)}</Box>
                    </Typography>
                    {emp.outsideFenceTime && (
                      <>
                        <Typography fontSize="0.75rem" color="#D97706" fontWeight={500}>
                          Outside: {formatDuration(emp.outsideFenceTime)}
                        </Typography>
                        {emp.exitedTime && (
                          <Typography fontSize="0.75rem" color="text.secondary">
                            Exited: {new Date(emp.exitedTime).toLocaleTimeString()}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                  {emp.currentStatus === "OUTSIDE_OFFICE" && (
                    <Box sx={{ pt: 1.5, borderTop: "1px solid #E0E0E0" }}>
                      <Typography fontSize="0.75rem" fontWeight={500} color="text.secondary" mb={1}>Contact Details:</Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Phone sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography fontSize="0.75rem">{emp.phoneNumber??""}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Email sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography fontSize="0.75rem" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>{emp.email}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Box
                          component="a"
                          href={`tel:${emp.phoneNumber??""}`}
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                            py: 0.75,
                            fontSize: "0.75rem",
                            border: "1px solid #E0E0E0",
                            borderRadius: 1,
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": { bgcolor: "#F3F4F6" }
                          }}
                        >
                          <Phone sx={{ fontSize: 12 }} />
                          Call
                        </Box>
                        <Box
                          component="a"
                          href={`mailto:${emp.email}`}
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                            py: 0.75,
                            fontSize: "0.75rem",
                            border: "1px solid #E0E0E0",
                            borderRadius: 1,
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": { bgcolor: "#F3F4F6" }
                          }}
                        >
                          <Email sx={{ fontSize: 12 }} />
                          Email
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
            )}
          </CardContent>
        </Card>
      </Box>


    </Box>
  );
};
export default LiveTracking;
