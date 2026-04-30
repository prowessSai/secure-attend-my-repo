import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress } from "@mui/material";
import { Warning, AccessTime, LocationOn } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { formatDateTime, formatMinutesToHrMin,} from "../../util/Util";
import { IActiveAlertsListDTO, IHistoricalAlertsListDTO, IViolationsStatsDTO } from "../../interfaces/Alerts";
import { getActiveViolations, getHistoricalViolations, getViolationsStats } from "../../services/Alerts";
import AcknowledgeModal from "./AcknowledgeModal";

const Alerts = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [counts,setCounts] = useState<IViolationsStatsDTO | null>(null);
  const [violations, setViolations] = useState<IActiveAlertsListDTO[]>([]);
  const [histViolations,setHistViolations] = useState<IHistoricalAlertsListDTO[]>([]);
  const [selectedViolationId, setSelectedViolationId] = useState<number | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);


    const fetchCounts = async () => {
      // setLoading(true);
      try {
        const data = await getViolationsStats();
        setCounts(data);
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
        setCounts(null);
      } finally {
        // setLoading(false);
      }
    };
  const fetchAllViolations = async () => {
    try {
      setLoading(true);
      const violationRes = await getActiveViolations();
      setViolations(Array.isArray(violationRes) ? violationRes : []);
    } catch {
      setViolations([]);
    }finally{
      setLoading(false);
    }
  };
  const fetchHistViolations = async () => {
    try {
      setLoading(true);
      const histViolationRes = await getHistoricalViolations();
      setHistViolations(Array.isArray(histViolationRes) ? histViolationRes : []);
    } catch {
      setHistViolations([]);
    }finally{
      setLoading(false);
    }
  };
  useEffect(() => {
    if (activeTab === 0) {
      fetchCounts();
      fetchAllViolations(); 
    } else if (activeTab === 1) {
      fetchHistViolations();    
    }
  }, [activeTab]);
  
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb:2}}>
        <Typography sx={{ fontSize: "1.875rem", fontWeight: 600}}>Alerts & Notifications</Typography>
        <Typography sx={{ color: "text.secondary" }}>Monitor geo-fence violations and attendance issues</Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2, mb:2}}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p:2}}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 0.5 }}>Active Alerts</Typography>
                <Typography sx={{ fontSize: "1.875rem", fontWeight: 600 }}>{counts?.activeAlertsCount??0}</Typography>
              </Box>
              <Box sx={{ width: 48, height: 48, bgcolor: "#FEE2E2", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Warning sx={{ fontSize: 24, color: "#DC2626" }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p:2}}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 0.5 }}>Geo-fence Breaches</Typography>
                <Typography sx={{ fontSize: "1.875rem", fontWeight: 600 }}>{counts?.totalGeofenceBreaches??0}</Typography>
              </Box>
              <Box sx={{ width: 48, height: 48, bgcolor: "#FEF3C7", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LocationOn sx={{ fontSize: 24, color: "#D97706" }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p:2}}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 0.5 }}>Avg. Outside Time</Typography>
                <Typography sx={{ fontSize: "1.875rem", fontWeight: 600 }}>{formatMinutesToHrMin(counts?.averageOutsideTimeMinutes??0)}</Typography>
              </Box>
              <Box sx={{ width: 48, height: 48, bgcolor: "#DBEAFE", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AccessTime sx={{ fontSize: 24, color: "#0F4C81" }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Box sx={{ display: "inline-flex", bgcolor: "#F3F4F6", borderRadius: 3, p: 0.5, mb:1, gap: 0.5 }}>
          <Button onClick={() => setActiveTab(0)} sx={{ textTransform: "none", borderRadius: 2.5, px: 2, py: 1, minWidth: 150, bgcolor: activeTab === 0 ? "#fff" : "transparent", color: activeTab === 0 ? "#000" : "#6B7280", boxShadow: activeTab === 0 ? "0 1px 2px rgba(0,0,0,0.05)" : "none", "&:hover": { bgcolor: activeTab === 0 ? "#fff" : "rgba(0,0,0,0.04)" } }}>
            Active Alerts ({violations.length??""})
          </Button>
          <Button onClick={() => setActiveTab(1)} sx={{ textTransform: "none", borderRadius: 2.5, px: 2, py: 1, minWidth: 150, bgcolor: activeTab === 1 ? "#fff" : "transparent", color: activeTab === 1 ? "#000" : "#6B7280", boxShadow: activeTab === 1 ? "0 1px 2px rgba(0,0,0,0.05)" : "none", "&:hover": { bgcolor: activeTab === 1 ? "#fff" : "rgba(0,0,0,0.04)" } }}>
            Alert History
          </Button>
        </Box>

        {activeTab === 0 && (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p:1}}>
              <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, mb:1}}>Active Geo-fence Violations</Typography>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
                  <CircularProgress />
                </Box>
              ) : violations.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 12 }}>
                  <Box sx={{ width: 64, height: 64, bgcolor: "#D1FAE5", borderRadius: "50%", mx: "auto", mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Warning sx={{ fontSize: 32, color: "#059669" }} />
                  </Box>
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, mb: 1 }}>No Active Alerts</Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>All employees are within their geo-fence boundaries</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Exit Time</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Duration Outside</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {violations.map((alert) => (
                        <TableRow key={alert.id} sx={{ "&:hover": { bgcolor: "#F9FAFB" } }}>
                          <TableCell>
                            <Box>
                              <Typography sx={{ fontWeight: 500 }}>{alert.employeeName??""}</Typography>
                              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{alert.employeeId??""}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{alert.branchName}</TableCell>
                          <TableCell sx={{ fontSize: "0.875rem" }}>{formatDateTime(alert.exitTime)}</TableCell>
                          <TableCell>
                            <Typography sx={{ color: "#D97706", fontWeight: 500 }}> {formatMinutesToHrMin(alert.outsideDurationMinutes)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "inline-block", px: 2, py: 0.5, bgcolor: "#FEF3C7", color: "#D97706", borderRadius: 1, fontSize: "0.875rem", fontWeight: 500 }}>
                            {alert.status??""}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="contained" 
                              size="small" 
                              onClick={() => {
                                setSelectedViolationId(alert.id);
                                setOpenConfirmModal(true);
                              }}
                              sx={{ 
                                textTransform: "none",bgcolor: "#0F4C8199",  "&:hover": { bgcolor: "#0a3a61" },
                                fontSize: "0.75rem",
                                px: 2
                              }}
                            >
                              Acknowledge
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p:1}}>
              <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, mb:1}}>Alert History</Typography>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
                  <CircularProgress />
                </Box>
              ) : histViolations.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 12 }}>
                  <Box sx={{ width: 64, height: 64, bgcolor: "#F3F4F6", borderRadius: "50%", mx: "auto", mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AccessTime sx={{ fontSize: 32, color: "#6B7280" }} />
                  </Box>
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 600, mb: 1 }}>No Historical Alerts</Typography>
                  <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Past alerts will appear here</Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Branch</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Exit Time</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Return Time</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Duration Outside</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Resolved By</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {histViolations.map((alert) => (
                        <TableRow key={alert.employeeId??""} sx={{ "&:hover": { bgcolor: "#F9FAFB" } }}>
                          <TableCell>
                            <Box>
                              <Typography sx={{ fontWeight: 500 }}>{alert.employeeName??""}</Typography>
                              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{alert.employeeId??""}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{alert.branchName??""}</TableCell>
                          <TableCell sx={{ fontSize: "0.875rem" }}>{alert.exitTime? formatDateTime(alert.exitTime):"-"}</TableCell>
                          <TableCell sx={{ fontSize: "0.875rem" }}>{alert.violationEndedTime? formatDateTime(alert.violationEndedTime):"-"}</TableCell>
                          <TableCell>
                            <Typography sx={{ color: "#D97706", fontWeight: 500 }}> {alert.durationOutsideMinutes? formatMinutesToHrMin(alert.durationOutsideMinutes):"-"}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography sx={{ fontWeight: 500 }}>{alert.resolvedByName??""}</Typography>
                              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{alert.resolvedByempId??""}</Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
      <AcknowledgeModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        violationId={selectedViolationId}
        refresh={()=>{fetchAllViolations();fetchCounts()}}
      />
    </Box>
  );
};

export default Alerts;
