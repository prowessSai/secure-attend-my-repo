import React, { useState } from "react";
import { Box, Button, Modal, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";
import { acknowledgeViolation } from "../../services/Alerts";

type Props = {
  open: boolean;
  onClose: () => void;
  violationId: number | null;
  refresh: () => void;
};

const AcknowledgeModal: React.FC<Props> = ({ open, onClose, violationId, refresh }) => {
  const [msg, setMsg] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (violationId === null) return;
    setLoading(true);
    try {
      const res = await acknowledgeViolation(violationId);
      console.log("Res:",res)
      if (res) {
        setOpenSuccess(true);
        setMsg("Successfully acknowledged.");
        refresh();
        onClose();
      } else {
        setOpenError(true);
        setMsg("Error while acknowledge.");
      }
    } catch (error) {
      setOpenError(true);
      setMsg("Exception while unassigning.");
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
          backgroundColor: "white",
          padding: 2,
          borderRadius: 2,
          width: "25%",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Are you sure you want to Acknowledge?
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          It confirms you've seen the issue. Notifies others you're aware and may take action.
        </Typography>
       
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button sx={{ borderRadius: 20 }} color="error" variant="outlined" onClick={onClose} disabled={loading}>
            No
          </Button>
          {loading && (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
          <Button
            sx={{ borderRadius: 20,bgcolor: "#0F4C81",  "&:hover": { bgcolor: "#0a3a61" } }}
            variant="contained"
            onClick={handleConfirm}
            disabled={loading}
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

export default AcknowledgeModal;
