import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, CircularProgress} from "@mui/material";
import { ArrowBack, TrendingUp, People, Schedule, Warning, CheckCircle,LocationOn, Cancel } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getBranchAnalticAttendenceRecords, getBranchAnalticAttendenceRecordsByDate, getbranchAnalyticsBarChart, getbranchAnalyticsEmpStats, getbranchAnalyticsLineChart, getbranchAnalyticsWorkStats,getBranchById } from "../../services/Branches";
import { IBranchAnalyticsBarDTO, IBranchAnalyticsEmpStatsDTO, IBranchAnalyticsLineDTO, IBranchAnalyticsWorkStatsDTO, IBranchCreateDTO, IBrnachEmployeeAttendanceRecordDTO} from "../../interfaces/Branches";
import { formatDuration, formatTimeAMPM} from "../../util/Util";


const BranchAnalytics = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState<any>(dayjs());
  const [branch, setBranch] = useState<IBranchCreateDTO | null>(null);
  const [branchEmpStats, setBranchEmpStats] = useState<IBranchAnalyticsEmpStatsDTO | null>(null);
  const [branchWorkStats, setBranchWorkStats] = useState<IBranchAnalyticsWorkStatsDTO | null>(null);
  const [branchAnalyticsLine, setBranchAnalyticsLine] = useState<IBranchAnalyticsLineDTO | null>(null);
  const [branchAnalyticsBar, setBranchAnalyticsBar] = useState<IBranchAnalyticsBarDTO| null>(null);
  const [loading, setLoading] = useState(false);
  const [brancheAttendence, setBranchAttendence] = useState<Array<IBrnachEmployeeAttendanceRecordDTO>>([]);

  useEffect(() => {
    const fetchBranch = async () => {
      if (branchId) {
        try {
          const data = await getBranchById(Number(branchId));
          setBranch(data);
        } catch {
          setBranch(null);
        }
      }
    };
    fetchBranch();
  }, [branchId]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!branchId) return;
      const id = Number(branchId);

      const empStats = await getbranchAnalyticsEmpStats(id).catch(() => null);
      const workStats = await getbranchAnalyticsWorkStats(id).catch(() => null);
      const lineData = await getbranchAnalyticsLineChart(id).catch(() => null);
      const barData = await getbranchAnalyticsBarChart(id).catch(() => null);

      setBranchEmpStats(empStats);
      setBranchWorkStats(workStats);
      setBranchAnalyticsLine(lineData);
      setBranchAnalyticsBar(barData);
    };
    fetchAnalytics();
  }, [branchId]);
  const fetchBrachAttendence = async () => {
    if (!branchId) return;
    const id = Number(branchId);
    try {
      setLoading(true);
      let branchesRes;
      if (selectedDate) {
        const formattedDate = selectedDate.format('YYYY-MM-DD');
        branchesRes = await getBranchAnalticAttendenceRecordsByDate(id, formattedDate);
      } else {
        branchesRes = await getBranchAnalticAttendenceRecords(id);
      }
      setBranchAttendence(Array.isArray(branchesRes) ? branchesRes : []);
    } catch {
      setBranchAttendence([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === 1 && selectedDate) {
      fetchBrachAttendence();
    }
  }, [activeTab, selectedDate]);
  if (!branch) {
    return (
      <Box sx={{ p: 4 }}>
        <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center" }}>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 1 }}>Branch Not Found</Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>The branch you're looking for doesn't exist.</Typography>
          <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/branches")} sx={{ bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0D3D66" } }}>
            Back to Branches
          </Button>
        </Box>
      </Box>
    );
  }

  const totalEmployees = branchEmpStats?.totalEmployees ?? 0;
  const presentToday = branchEmpStats?.presentToday ?? 0;
  const avgWorkingHours =branchWorkStats?.averageWorkingHoursPerDay ?? 0;
  const lateArrivals =branchWorkStats?.lateArrivalsThisWeek ?? 0;

  const attendanceTrendData = Array.isArray(branchAnalyticsLine)
    ? branchAnalyticsLine.map((item) => ({
        date: item.date,
        present: item.presentCount,
        leave: item.onLeaveCount,
      }))
    : [];

  const workingHoursData = branchAnalyticsBar
    ? [
        { range: "< 6h", count: branchAnalyticsBar.lessThan6Hours },
        { range: "6-7h", count: branchAnalyticsBar.between6And7Hours },
        { range: "7-8h", count: branchAnalyticsBar.between7And8Hours },
        { range: "8-9h", count: branchAnalyticsBar.between8And9Hours },
        { range: "> 9h", count: branchAnalyticsBar.greaterThan9Hours },
      ]
    : [];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb:2}}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button variant="outlined" size="small" startIcon={<ArrowBack />} onClick={() => navigate("/branches")} sx={{ color: "#000", borderColor: "#E0E0E0",textTransform:"none" }}>
            Back
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 48, height: 48, bgcolor: "#D1FAE5", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp sx={{ fontSize: 25, color: "#059669" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 600 }}>{branch.branchName} - Analytics</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", fontSize: "0.875rem", mt: 0.5 }}>
                <LocationOn sx={{ fontSize:25 }} />
                {branch.branchAddress??""}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2, mb:2}}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Total Employees</Typography>
              <People sx={{ fontSize: 16, color: "text.secondary" }} />
            </Box>
            <Typography sx={{ fontSize: "1.75rem", fontWeight: 600 }}>{totalEmployees}</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>Assigned to this branch</Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Present Today</Typography>
              <CheckCircle sx={{ fontSize: 16, color: "#059669" }} />
            </Box>
            <Typography sx={{ fontSize: "1.75rem", fontWeight: 600, color: "#059669" }}>{presentToday}</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>
              {((presentToday / totalEmployees) * 100).toFixed(1)}% attendance rate
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Avg. Working Hours</Typography>
              <Schedule sx={{ fontSize: 16, color: "text.secondary" }} />
            </Box>
            <Typography sx={{ fontSize: "1.75rem", fontWeight: 600 }}>{formatDuration(avgWorkingHours)}</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>Per employee per day</Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Late Arrivals</Typography>
              <Warning sx={{ fontSize: 16, color: "#D97706" }} />
            </Box>
            <Typography sx={{ fontSize: "1.75rem", fontWeight: 600, color: "#D97706" }}>{lateArrivals}</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>After 9:30 AM this week</Typography>
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Box  sx={{ 
          display: "inline-flex", 
          bgcolor: "#F3F4F6", 
          borderRadius: 3, 
          p: 0.5, 
          mb:1,
          gap: 0.5
        }}>
          <Button size="small"
            onClick={() => setActiveTab(0)}
            sx={{
              textTransform: "none",
              borderRadius: 2.5,
              px: 2,
              py: 1,
              minWidth: 100,
              bgcolor: activeTab === 0 ? "#fff" : "transparent",
              color: activeTab === 0 ? "#000" : "#6B7280",
              boxShadow: activeTab === 0 ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              "&:hover": {
                bgcolor: activeTab === 0 ? "#fff" : "rgba(0,0,0,0.04)"
              }
            }}
          >
            Trends
          </Button>
          <Button size="small"
            onClick={() => setActiveTab(1)}
            sx={{
              textTransform: "none",
              borderRadius: 2.5,
              px: 2,
              py: 1,
              minWidth: 100,
              bgcolor: activeTab === 1 ? "#fff" : "transparent",
              color: activeTab === 1 ? "#000" : "#6B7280",
              boxShadow: activeTab === 1 ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
              "&:hover": {
                bgcolor: activeTab === 1 ? "#fff" : "rgba(0,0,0,0.04)"
              }
            }}
          >
            Records
          </Button>
        </Box>

        {activeTab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p:2}}>
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, mb: 2 }}>Attendance Trend (Last 7 Days)</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={attendanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="present" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="leave" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p:2}}>
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, mb: 2 }}>Working Hours Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workingHoursData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0F4C81" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        )}

        {activeTab === 1 && (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: "1.125rem", fontWeight: 600 }}>Recent Attendance Records</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    maxDate={dayjs()}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "Select date",
                        sx: { width: 200 }
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
              <>
                <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr", gap: 2, p: 1, bgcolor: "#F9FAFB", borderRadius: 2, mb: 2 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Employee</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Status</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Check In</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Check Out</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Working Hours</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>Outside Time</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {brancheAttendence.map((record) => (
                    <Box
                      key={record.employeeId}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr",
                        gap: 2,p:0.5,
                        alignItems: "center",
                        border: "1px solid #E5E7EB",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#F9FAFB" }
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width:32, height:32, bgcolor: "#F3F4F6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                            {record.employeeName?.split(' ').map(n => n[0]).join('') || ''}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 500, fontSize: "0.875rem" }}>{record.employeeName || ''}</Typography>
                          <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{record.employeeId || ''}</Typography>
                        </Box>
                      </Box>

                      <Box>
                        {record.status === "INSIDE_OFFICE" && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#059669" }}>
                            <CheckCircle sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: "0.875rem" }}>Inside Office</Typography>
                          </Box>
                        )}
                        {record.status === "OUTSIDE_OFFICE" && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#D97706" }}>
                            <Warning sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: "0.875rem" }}>Outside Office</Typography>
                          </Box>
                        )}
                        {record.status === "OFFLINE" && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#6B7280" }}>
                            <Cancel sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: "0.875rem" }}>Offline</Typography>
                          </Box>
                        )}
                        {record.status === "MARKED_PRESENT" && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#10b981" }}>
                            <CheckCircle sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: "0.875rem" }}>Marked Present</Typography>
                          </Box>
                        )}
                        {record.status === "LOGGED_OUT" && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#DC2626" }}>
                            <Cancel sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: "0.875rem" }}>Logged Out</Typography>
                          </Box>
                        )}
                        {record.status === "NOT_MARKED" && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#9CA3AF" }}>
                            <Cancel sx={{ fontSize: 16 }} />
                            <Typography sx={{ fontSize: "0.875rem" }}>Not Marked</Typography>
                          </Box>
                        )}
                        {![
                        "INSIDE_OFFICE",
                        "OUTSIDE_OFFICE",
                        "OFFLINE",
                        "MARKED_PRESENT",
                        "LOGGED_OUT",
                        "NOT_MARKED",
                      ].includes(record.status) && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#DC2626" }}>
                          <Cancel sx={{ fontSize: 16 }} />
                          <Typography sx={{ fontSize: "0.875rem" }}>
                            {record.status}
                          </Typography>
                        </Box>
                      )}
                      </Box>

                      <Typography sx={{ fontSize: "0.875rem" }}>{record.checkInTime? formatTimeAMPM(record.checkInTime):"-"}</Typography>
                      <Typography sx={{ fontSize: "0.875rem" }}>{record.checkOutTime? formatTimeAMPM(record.checkOutTime):"-"}</Typography>
                      <Typography sx={{ fontSize: "0.875rem" }}>{record.totalWorkingHours? formatDuration(record.totalWorkingHours):'-'}</Typography>
                      <Typography sx={{ fontSize: "0.875rem" }}>{record.outsideTime? formatDuration(record.outsideTime):'-'}</Typography>
                    </Box>
                  ))}
                </Box>
              </>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default BranchAnalytics;
