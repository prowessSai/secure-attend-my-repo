import {
  Modal,
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import { Close, Person, Badge, Email, Phone, Business, CheckCircle,History } from "@mui/icons-material";
import { IEmployeeListDTO } from "../../interfaces/User";
import { useState } from "react";
import ActivateDeactivateEmployeeModal from "./ActivateDeactivateEmployeeModal";

interface ViewEmployeeDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave:()=>void;
  employee: IEmployeeListDTO | null;
  onViewHistory: (employee: IEmployeeListDTO) => void;
}

const ViewEmployeeDetailsModal = ({ open, onClose,onSave, employee, onViewHistory }:ViewEmployeeDetailsModalProps) => {
  const [openActDeAct,setOpenActDeAct] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployeeListDTO | null>(null);

  return (
    <>
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40%",
          bgcolor: "#fff",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
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
          <Typography fontWeight={600} color="#fff">Employee Details</Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
          {!employee ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Person sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography sx={{ color: "text.secondary" }}>No employee details found</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap:2}}>
              {/* Status Action Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button size="small"
                  variant="contained"
                  sx={{
                    bgcolor: employee.status === "ACTIVE" ? "#EF4444" : "#22C55E",
                    "&:hover": { bgcolor: employee.status === "ACTIVE" ? "#DC2626" : "#16A34A" },
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                  onClick={() => {setOpenActDeAct(true);setSelectedEmployee(employee);}}
                >
                  {employee.status === "ACTIVE" ? "Mark Inactive" : "Activate"}
                </Button>
              </Box>

              {/* Personal Information */}
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: "1.125rem",mt:0.5}}>Personal Information</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                  <Box sx={{ display: "flex", gap: 1.5, p: 1.5, border: "1px solid #E0E0E0", borderRadius: 2 }}>
                    <Person sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Full Name</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{employee.name}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1.5, p: 1.5, border: "1px solid #E0E0E0", borderRadius: 2 }}>
                    <Badge sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Employee ID</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{employee.empId}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Contact Information */}
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: "1.125rem", mb:0.5}}>Contact Information</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                  <Box sx={{ display: "flex", gap: 1.5, p: 1.5, border: "1px solid #E0E0E0", borderRadius: 2 }}>
                    <Email sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Email</Typography>
                      <Typography sx={{ fontWeight: 500, wordBreak: "break-all" }}>{employee.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1.5, p: 1.5, border: "1px solid #E0E0E0", borderRadius: 2 }}>
                    <Phone sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Mobile Number</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{employee.mobile}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Work Information */}
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: "1.125rem", mb:0.5}}>Work Information</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                  <Box sx={{ display: "flex", gap: 1.5, p: 1.5, border: "1px solid #E0E0E0", borderRadius: 2 }}>
                    <Business sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Assigned Branch</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{employee.branchName??""}</Typography>
                      {employee && (
                        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.5 }}>{employee.branchAddress??""}</Typography>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1.5, p: 1.5, border: "1px solid #E0E0E0", borderRadius: 2 }}>
                    <CheckCircle sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Account Status</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip label={employee.status} color={employee.status === "ACTIVE" ? "success" : "default"} size="small" sx={{ fontWeight: 500 }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* App Status */}
              {/* <Box>
                <Typography sx={{ fontWeight: 600, fontSize: "1.125rem", mb:1}}>Mobile App Status</Typography>
                <Box sx={{ display: "flex", gap: 1.5, p: 1.5, border: "1px solid #E0E0E0", borderRadius: 2 }}>
                  <Smartphone sx={{ fontSize: 20, color: "text.secondary", mt: 0.5 }} />
                  <Box>
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>App Installation Status</Typography>
                    <Box sx={{ mt: 1 }}>
                      {employee.appInstalled ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "success.main" }}>
                          <CheckCircle sx={{ fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 500 }}>App Installed & Active</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.disabled" }}>
                          <Cancel sx={{ fontSize: 20 }} />
                          <Typography sx={{ fontWeight: 500 }}>App Not Installed</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box> */}

              {/* Action Button */}
              <Box sx={{ pt: 2, borderTop: "1px solid #E0E0E0" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<History />}
                  onClick={() => {
                    onClose();
                    onViewHistory(employee);
                  }}
                  sx={{ textTransform: "none",borderColor:'#E0E0E0',color:"#000" }}
                >
                  View Attendance History
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Modal>
    <ActivateDeactivateEmployeeModal
    open={openActDeAct}
    onClose={() => setOpenActDeAct(false)}
    onConfirm={() => {onClose();onSave();}}
    employee={selectedEmployee}
  />
  </>
  );
};

export default ViewEmployeeDetailsModal;
