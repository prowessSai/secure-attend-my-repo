import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress, CircularProgress, Button } from "@mui/material";
import { People, CheckCircle, LocationOn, EventBusy, AccessTime, OpenInFull } from "@mui/icons-material";
import { formatDuration, formatTimeAMPM, getStatusConfig } from "../../util/Util";
import { useEffect, useState } from "react";
import { IDashboardBranchesDTO, IDashboardListDTO, IDashboardStatsDTO } from "../../interfaces/User";
import { getDashboardLiveList, getDashboardStats, getDashoardBranchStats } from "../../services/User";
import { useNavigate } from "react-router-dom";


const KPICard = ({ title, value, icon: Icon, color }: any) => (
  <Card sx={{ height: "100%", borderRadius: 2 }}>
    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{title}</Typography>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon sx={{ fontSize: 18, color: `${color}.main` }} />
        </Box>
      </Box>
      <Typography sx={{ fontSize: "1.75rem", fontWeight: 600 }}>{value}</Typography>
    </CardContent>
  </Card>
);

const StatusChip = ({ status }: { status: string }) => {
  const { label, dot } = getStatusConfig(status);
  
  return (
    <Chip
      label={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {label}
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: dot }} />
        </Box>
      }
      sx={{ bgcolor: "#F4F4F4", border: "1px solid #E0E0E0", fontWeight: 500 }}
      size="small"
    />
  );
};
  
const  Dashboard =() =>{
  const navigate = useNavigate();
  const [counts, setCounts] = useState<IDashboardStatsDTO | null>(null);
  const [liveEmployees, setLiveEmployees] = useState<Array<IDashboardListDTO>>([]);
  const [branchesStats, setBranchesStats] = useState<Array<IDashboardBranchesDTO>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCardsCounts = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        setCounts(data);
      } catch (err) {
        console.error("Error fetching roles summary:", err);
        setCounts(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCardsCounts();
  }, []);
  const fetchAllLiveEmployees = async () => {
    try {
      setLoading(true);
      const liveRes = await getDashboardLiveList();
      setLiveEmployees(Array.isArray(liveRes) ? liveRes : []);
    } catch {
      setLiveEmployees([]);
    }finally{
      setLoading(false);
    }
  };
  const fetchBranchesStats = async() => {
    try {
      const branchRes = await getDashoardBranchStats();
      setBranchesStats(Array.isArray(branchRes) ? branchRes : []);
    } catch {
      setBranchesStats([]);
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranchesStats();
  fetchAllLiveEmployees();
  }, []);
  return (
    <Box sx={{ p:2}}>
      <Box sx={{ mb:2}}>
        <Typography sx={{ fontSize: "1.875rem", fontWeight: 600, mb: 0.5 }}>Dashboard</Typography>
        <Typography sx={{ color: "text.secondary" }}>Real-time workforce attendance monitoring</Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2, mb:2}}>
        <KPICard title="Total Employees" value={counts?.totalEmployees??0} icon={People} color="primary" />
        <KPICard title="Present in Office" value={counts?.presentInOffice??0} icon={CheckCircle} color="success" />
        <KPICard title="Outside Geo-fence" value={counts?.outsideGeofence??0} icon={LocationOn} color="warning" />
        <KPICard title="Not Marked" value={counts?.notMarked??0} icon={EventBusy} color="error" />
      </Box>

      <Card sx={{ mb:2, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb:1}}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>Live Employee Status</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "success.main" }}>
                <Box sx={{ width: 8, height: 8, bgcolor: "success.main", borderRadius: "50%", animation: "pulse 2s infinite" }} />
                <Typography sx={{ fontSize: "0.875rem" }}>Live Updates</Typography>
              </Box>
            </Box>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<OpenInFull />} 
                onClick={() => navigate("/live-status")} 
                sx={{ 
                  textTransform: "none", 
                  color: "#000", fontWeight:600,
                  borderColor: "#E0E0E0",
                  "&:hover": {
                    borderColor: "#E0E0E0",
                    bgcolor: "#E0E0E0"
                  }
                }}
              >
                View All
              </Button>
          </Box>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer sx={{ minWidth: "1000px" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, py: 0.5 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 0.5 }}>Branch</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 0.5 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 0.5 }}>Time in Office</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 0.5 }}>Outside Duration</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 0.5 }}>Last Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : liveEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 4 }}>
                      <Typography sx={{ color: "text.secondary" }}>No employees found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  liveEmployees.slice(0, 5).map((emp) => (
                    <TableRow key={emp.empId}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500 }}>{emp.employeeName??""}</Typography>
                        <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{emp.empId??""}</Typography>
                      </TableCell>
                      <TableCell>{emp.branchName??""}</TableCell>
                      <TableCell><StatusChip status={emp.currentStatus??""} /></TableCell>
                      <TableCell>
                        {emp.timeInOffice > 0 ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
                            {formatDuration(emp.timeInOffice??"")}
                          </Box>
                        ) : "-"}
                      </TableCell>
                      <TableCell sx={{ color: emp.outsideDuration > 0 ? "warning.main" : "text.secondary" }}>
                        {emp.outsideDuration > 0 ? formatDuration(emp.outsideDuration) : "-"}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>{formatTimeAMPM(emp.lastUpdate??"")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
          {liveEmployees.length > 5 && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button 
                variant="text" 
                onClick={() => navigate("/live-status")} 
                sx={{ 
                  color: "#000",
                  "&:hover": {
                    bgcolor: "#E0E0E0"
                  }
                }}
              >
                View {liveEmployees.length - 5} more employees
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" }, gap: 2 }}>
        {branchesStats.map((branch) => {
          const percentage = (branch.employeesPresent / branch.totalStaff) * 100;
          return (
            <Card key={branch.branchName} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, mb: 2 }}>{branch.branchName??0}</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Total Staff</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{branch.totalStaff??0}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Present Today</Typography>
                    <Typography sx={{ fontWeight: 600, color: "success.main" }}>{branch.employeesPresent??0}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={percentage} sx={{ height: 8, borderRadius: 1, bgcolor: "grey.200", "& .MuiLinearProgress-bar": { bgcolor: "success.main" } }} />
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}

export default Dashboard;
