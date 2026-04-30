import { Alert, Box, Button, CircularProgress, Modal, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import { IEmployeeListDTO } from "../../interfaces/User";
import { activateEmployee, deActivateEmployee } from "../../services/User";

interface ActivateMemberModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employee:IEmployeeListDTO | null;
}

const ActivateDeactivateEmployeeModal = ({ open, onClose, onConfirm,employee }: ActivateMemberModalProps) => {

  const isActive = employee?.status==="ACTIVE"; 
  const [msg, setMsg] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!employee) return;
  
    setLoading(true);
    try {
      let res;
      if (isActive) {
        res = await deActivateEmployee(employee.empId, false);
      } else {
        res = await activateEmployee(employee.empId, true);
      }
      if (res && res.status === "success") {
        setOpenSuccess(true);
        setMsg(
          isActive
            ? "Successfully marked as Inactive."
            : "Successfully marked as Active."
        );
        onConfirm();
        onClose();
      } else {
        setOpenError(true);
        setMsg("Failed to update employee status.");
      }
    } catch (error) {
      setOpenError(true);
      setMsg("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    if (openSuccess) {
      setOpenSuccess(false);
    } else if (openError) {
      setOpenError(false);
    }
    setMsg("");
  };
  return (
    <>
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: 24,
          width: 300,
          p:1,
          textAlign: "center",
        }}
      >

        {/* Title with only action word colored */}
        <Typography  sx={{ fontWeight: 700,fontSize:18, mb:1}}>
          Are you sure you want to{" "}
          <span style={{ color: isActive ? "#D32F2F" : "#2E7D32" }}>
            {isActive ? "Deactivate" : "Activate"}  
          </span>{" "}
          <span style={{ color: isActive ? "#D32F2F" : "#2E7D32" }}>
          {employee?.name??""}?
          </span>{" "}
          
        </Typography>

        {/* Description */}
        <Typography variant="body2" sx={{ color: "#555", mb:2}}>
          {isActive
            ? "Member will no longer have access until reactivated."
            : "Member will regain access to the platform."}
        </Typography>
        {loading && (
            <Box display="flex" justifyContent="center" >
              <CircularProgress />
            </Box>
          )}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
            sx={{ borderRadius: 20, textTransform: "none", width: "45%" }}
          >
            No
          </Button>
          
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              borderRadius: 20,
              textTransform: "none",
              width: "45%",
            }}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </Modal>
     {/** Snackbar alerts */}
     <Snackbar
     anchorOrigin={{ vertical: "top", horizontal: "right" }}
     open={openError}
     autoHideDuration={5000}
     onClose={handleClose}
   >
     <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
       {msg}
     </Alert>
   </Snackbar>

   <Snackbar
     anchorOrigin={{ vertical: "top", horizontal: "right" }}
     open={openSuccess}
     autoHideDuration={5000}
     onClose={handleClose}
   >
     <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
       {msg}
     </Alert>
   </Snackbar>
   </>
  );
};

export default ActivateDeactivateEmployeeModal;
