import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material";
import { People, AccessTime, ArrowBack, Refresh, Search } from "@mui/icons-material";
import { formatDuration, formatTimeAMPM, getStatusConfig } from "../../util/Util";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IBranchesMinDTO } from "../../interfaces/Branches";
import { getBranchesMin } from "../../services/Branches";
import { IBranchDailyStatsDTO,IDashboardListDTO, IDashboardStatsDTO } from "../../interfaces/User";
import { getDashboardBranchLiveStats, getDashboardLiveListAll, getDashboardLiveListAllByBranch, getDashboardLiveListAllBySearch, getDashboardLiveListAllByStatus, getDashboardLiveListAllByStatusAndBranch, getDashboardStats,} from "../../services/User";


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

const LiveStatusPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [counts, setCounts] = useState<IDashboardStatsDTO | null>(null);
  const [branches,setBranches] = useState<Array<IBranchesMinDTO>>([]);
  const [liveEmployees, setLiveEmployees] = useState<Array<IDashboardListDTO>>([]);
  const [branchesStats, setBranchesStats] = useState<Array<IBranchDailyStatsDTO>>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBranch, setFilterBranch] = useState("");

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
  useEffect(() => {
  const fetchAllBranches = async () => {
    try {
      const branchesRes = await getBranchesMin();
      setBranches(Array.isArray(branchesRes) ? branchesRes : []);
    } catch {
      setBranches([]);
    }
  };
  const fetchBrancheLiveStats = async() => {
    try {
      const branchRes = await getDashboardBranchLiveStats();
      setBranchesStats(Array.isArray(branchRes) ? branchRes : []);
    } catch {
      setBranchesStats([]);
    }
  };
  fetchBrancheLiveStats();
  fetchAllBranches();
}, []);
useEffect(() => {
  const timer = setTimeout(async () => {
    try {
      setLoading(true);
      let liveRes;
      if (searchTerm) {
        liveRes = await getDashboardLiveListAllBySearch(searchTerm);
      } else if (filterStatus !== "all" && filterBranch) {
        liveRes = await getDashboardLiveListAllByStatusAndBranch(filterStatus, Number(filterBranch));
      } else if (filterStatus !== "all") {
        liveRes = await getDashboardLiveListAllByStatus(filterStatus);
      } else if (filterBranch) {
        liveRes = await getDashboardLiveListAllByBranch(Number(filterBranch));
      } else {
        liveRes = await getDashboardLiveListAll();
      }
      setLiveEmployees(Array.isArray(liveRes) ? liveRes : []);
    } catch {
      setLiveEmployees([]);
    } finally {
      setLoading(false);
    }
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm, filterStatus, filterBranch]);

const handleRefresh = async () => {
  try {
    setLoading(true);
    const liveRes = await getDashboardLiveListAll();
    setLiveEmployees(Array.isArray(liveRes) ? liveRes : []);
    setSearchTerm("");
    setFilterStatus("all");
    setFilterBranch("");
  } catch {
    setLiveEmployees([]);
  } finally {
    setLoading(false);
  }
};
  const filteredData = liveEmployees;
  const totalCount = counts?.totalEmployees??0;
  const insideCount = counts?.presentInOffice??0;
  const outsideCount = counts?.outsideGeofence??0;
  const offlineCount = counts?.notMarked??0;

  return (
    <Box sx={{ p:2}}>
      <Box sx={{ mb:1}}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/dashboard")} sx={{textTransform: "none", color: "#000" }}>
          Back to Dashboard
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 40, height: 40, bgcolor: "#0F4C81", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <People sx={{ color: "white" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.875rem", fontWeight: 600 }}>Live Employee Status</Typography>
              <Typography sx={{ color: "text.secondary" }}>Real-time monitoring of all active employees</Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "success.main" }}>
            <Box sx={{ width: 8, height: 8, bgcolor: "success.main", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            <Typography sx={{ fontSize: "0.875rem" }}>Live Updates</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2, mb: 2 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>Total Employees</Typography>
            <Typography sx={{ fontSize: "1.75rem", fontWeight: 600, color: "#0F4C81" }}>{totalCount}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>Inside Office</Typography>
            <Typography sx={{ fontSize: "1.75rem", fontWeight: 600, color: "success.main" }}>{insideCount}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>Outside Office</Typography>
            <Typography sx={{ fontSize: "1.75rem", fontWeight: 600, color: "warning.main" }}>{outsideCount}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 1 }}>Offline</Typography>
            <Typography sx={{ fontSize: "1.75rem", fontWeight: 600, color: "text.secondary" }}>{offlineCount}</Typography>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              placeholder="Search by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 250 }}
              InputProps={{ startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} /> }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Status" MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}>
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="INSIDE_OFFICE">Inside Office</MenuItem>
                <MenuItem value="OUTSIDE_OFFICE">Outside Office</MenuItem>
                <MenuItem value="OFFLINE">Offline</MenuItem>
                <MenuItem value="MARKED_PRESENT">Marked Present</MenuItem>
                <MenuItem value="LOGGED_OUT">Logged Out</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} displayEmpty MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}>
              <MenuItem value="">All Branches</MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>{branch.branchName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<Refresh />} onClick={handleRefresh} sx={{ color: "#000" }}>
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{mb:2, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>Employee Status Details</Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
              Showing <strong>{filteredData.length}</strong> of <strong>{liveEmployees.length}</strong> employees
            </Typography>
          </Box>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Time in Office</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Outside Duration</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                        <Typography sx={{ color: "text.secondary" }}>No employees found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((emp, index) => (
                      <TableRow key={emp.empId}>
                        <TableCell sx={{ color: "text.secondary" }}>{index + 1}</TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>{emp.employeeName ?? ""}</Typography>
                          <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{emp.empId ?? ""}</Typography>
                        </TableCell>
                        <TableCell>{emp.branchName ?? ""}</TableCell>
                        <TableCell><StatusChip status={emp.currentStatus ?? ""} /></TableCell>
                        <TableCell>
                          {emp.timeInOffice > 0 ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <AccessTime sx={{ fontSize: 16, color: "text.secondary" }} />
                              {formatDuration(emp.timeInOffice ?? "")}
                            </Box>
                          ) : "-"}
                        </TableCell>
                        <TableCell sx={{ color: emp.outsideDuration > 0 ? "warning.main" : "text.secondary" }}>
                          {emp.outsideDuration > 0 ? formatDuration(emp.outsideDuration) : "-"}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary", fontSize: "0.875rem" }}>{formatTimeAMPM(emp.lastUpdate ?? "")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, mb:1}}>Branch-wise Status Overview</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
            {branchesStats.map((branch) => {
              const total = branch.totalEmployees || 0;
              const inside = branch.insideCount || 0;
              const outside = branch.outsideCount || 0;
              const notMarked = branch.notMarked || 0;

              return (
                <Box key={branch.branchName} sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600 }}>{branch.branchName}</Typography>
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{total} total</Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <Typography sx={{ color: "#059669" }}>Inside</Typography>
                      <Typography sx={{ fontWeight: 600, color: "#059669" }}>{inside}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <Typography sx={{ color: "#D97706" }}>Outside</Typography>
                      <Typography sx={{ fontWeight: 600, color: "#D97706" }}>{outside}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <Typography sx={{ color: "#6B7280" }}>Not Marked</Typography>
                      <Typography sx={{ fontWeight: 600, color: "#6B7280" }}>{notMarked}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ width: "100%", height: 8, bgcolor: "#E5E7EB", borderRadius: 1, overflow: "hidden", display: "flex" }}>
                    {total > 0 && (
                      <>
                        <Box sx={{ width: `${(inside / total) * 100}%`, bgcolor: "#059669" }} />
                        <Box sx={{ width: `${(outside / total) * 100}%`, bgcolor: "#D97706" }} />
                        <Box sx={{ width: `${(notMarked / total) * 100}%`, bgcolor: "#6B7280" }} />
                      </>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LiveStatusPage;
