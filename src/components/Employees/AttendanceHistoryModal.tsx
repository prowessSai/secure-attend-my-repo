import {
  Modal,
  Paper,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { Close, CalendarMonth } from "@mui/icons-material";
import { formatDuration, formatTimeAMPM } from "../../util/Util";
import { useEffect, useState } from "react";
import { IEmployeeHistoryDTO, IEmployeeListDTO } from "../../interfaces/User";
import { getEmployeeHistory } from "../../services/User";

interface AttendanceHistoryModalProps {
  open: boolean;
  onClose: () => void;
  employee: IEmployeeListDTO | null;
}


const AttendanceHistoryModal = ({ open, onClose,employee }: AttendanceHistoryModalProps) => {
  const [empHistory,setEmpHistory] = useState<Array<IEmployeeHistoryDTO>>([]);
  const employeeId = employee?.empId;


  useEffect(() => {
    const fetchEmpHistory = async () => {
      if (!employeeId) return;
      try {
        const branchesRes = await getEmployeeHistory(employeeId);
        setEmpHistory(Array.isArray(branchesRes) ? branchesRes : []);
      } catch {
        setEmpHistory([]);
      }
    };
    fetchEmpHistory();
  }, [employeeId]);
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT": return "success";
      case "absent": return "error";
      case "on-leave": return "warning";
      default: return "warning";
    }
  };

  const getStatusLabel = (status: string) => {
    return status === "on-leave" ? "On Leave" : status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          bgcolor: "#fff",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
          overflow: "hidden",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1}
          sx={{
            backgroundColor: "#0F4C8199",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Box>
            <Typography fontWeight={600} color="#fff">Attendance History</Typography>
            {employee && (
              <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                {employee.name} ({employee.empId})
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
          {empHistory.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CalendarMonth sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography sx={{ color: "text.secondary" }}>No attendance records found</Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Check In</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Check Out</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Working Hours</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Outside Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {empHistory.map((record) => (
                      <TableRow key={record.date}>
                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          {formatDate(record.date)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(record.status)}
                            color={getStatusColor(record.status)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                        {record.checkIn ? formatTimeAMPM(record.checkIn) : "-"}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem" }}>
                        {record.checkOut ? formatTimeAMPM(record.checkOut) : "-"}
                        </TableCell>
                        <TableCell>
                          {record.workingHours ? formatDuration(record.workingHours) : "-"}
                        </TableCell>
                        <TableCell>
                          {record.outside && record.outside > 0 ? (
                            <Typography sx={{ fontSize: "0.875rem", color: "warning.main" }}>
                              {formatDuration(record.outside)}
                            </Typography>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.875rem", maxWidth: 300 }}>
                          {record.remarks ? (
                            <Box>
                              {/* {record.leaveType && ( */}
                                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", display: "block" }}>
                                  {record.remarks.charAt(0).toUpperCase() + record.remarks.slice(1)} Leave
                                </Typography>
                              {/* )} */}
                              {record.remarks}
                            </Box>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default AttendanceHistoryModal;
