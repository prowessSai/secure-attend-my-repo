import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import {
  Lock,
  Warning,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Close,
} from "@mui/icons-material";
import { IChangePasswordDTO } from "../../interfaces/User";
import { changePassword } from "../../services/User";

type PasswordStep = "current" | "new" | "success";

interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
}

const ChangePassword = ({ open, onClose }: ChangePasswordProps) => {
  const [passwordStep, setPasswordStep] = useState<PasswordStep>("current");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) {
      setPasswordStep("current");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setShowPassword(false);
    }
  }, [open]);

  const handleCurrentPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setPasswordStep("new");
    } catch (error: any) {
      setPasswordError("Current password is incorrect");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
  
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
  
    const dto: IChangePasswordDTO = {
      currentPassword,
      newPassword,
      confirmPassword,
    };
  
    try {
      setIsSubmitting(true);
      const res = await changePassword(dto);
      if (res && res.status === "success") {
        setPasswordStep("success");
      } else if (res && res.status === "error") {
        setPasswordError(res.errorResponse.data.message || "Failed to change password");
        setOpenError(true);
      } else {
        setPasswordError("Failed to change password");
        setOpenError(true);
      }
    } catch (error: any) {
      setPasswordError(error?.response?.data?.message || "Failed to change password");
      setOpenError(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    if (openError) {
      setOpenError(false);
    }
    setPasswordError("");
  };
  return (
    <>
    <Modal open={open} onClose={onClose}>
      <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "40%", maxWidth: 600, borderRadius: 2, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={2}
          py={1.5}
          sx={{
            backgroundColor: "#0F4C8199",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Lock sx={{ color: "#fff" }} />
            <Typography fontWeight={600} color="#fff">Change Password</Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 3, overflow: "auto", flex: 1 }}>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {passwordStep === "current" && "Enter your current password to verify your identity"}
          {passwordStep === "new" && "Create a new secure password for your account"}
          {passwordStep === "success" && "Your password has been changed successfully"}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3 }}>
          <Box sx={{ width: passwordStep === "current" ? 32 : 8, height: 8, borderRadius: 4, bgcolor: passwordStep === "current" ? "#0F4C81" : "#e0e0e0", transition: "all 0.3s" }} />
          <Box sx={{ width: passwordStep === "new" ? 32 : 8, height: 8, borderRadius: 4, bgcolor: passwordStep === "new" ? "#0F4C81" : "#e0e0e0", transition: "all 0.3s" }} />
        </Box>

        {passwordStep === "current" && (
          <Box component="form" onSubmit={handleCurrentPasswordSubmit}>
            <Typography variant="body2" fontWeight={500} mb={1} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Lock sx={{ fontSize: 16 }} /> Current Password
            </Typography>
            <TextField fullWidth type="password" placeholder="Enter your current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required disabled={isSubmitting} sx={{ mb: 2 }} />
            {passwordError && <Alert severity="error" icon={<Warning />} sx={{ mb: 2 }}>{passwordError}</Alert>}
          </Box>
        )}

        {passwordStep === "new" && (
          <Box component="form" onSubmit={handleNewPasswordSubmit}>
            <Typography variant="body2" fontWeight={500} mb={1} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Lock sx={{ fontSize: 16 }} /> New Password
            </Typography>
            <TextField 
              fullWidth 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter new password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              disabled={isSubmitting} 
              sx={{ mb: 2 }} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Typography variant="body2" fontWeight={500} mb={1} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Lock sx={{ fontSize: 16 }} /> Confirm Password
            </Typography>
            <TextField fullWidth type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isSubmitting} sx={{ mb: 2 }} />
            {passwordError && <Alert severity="error" icon={<Warning />} sx={{ mb: 2 }}>{passwordError}</Alert>}
            <Alert severity="info">
              <Typography variant="body2" fontWeight={500} mb={1}>Password Requirements:</Typography>
              <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 12 }}>
                <li>At least 8 characters long</li>
                <li>Use a strong, unique password</li>
              </Box>
            </Alert>
          </Box>
        )}

        {passwordStep === "success" && (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Box sx={{ width: 64, height: 64, bgcolor: "#e8f5e9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
              <CheckCircle sx={{ fontSize: 32, color: "#4caf50" }} />
            </Box>
            <Typography variant="h6" fontWeight={600} mb={1}>Password Changed Successfully</Typography>
            <Alert severity="success" sx={{ mb: 2 }}>Your account is now secured with the new password.</Alert>
            <Typography variant="body2" color="text.secondary">Please use your new password for future logins.</Typography>
          </Box>
        )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", p:1,px:2, borderTop: "1px solid #E0E0E0", backgroundColor: "#fff" }}>
        {passwordStep === "current" && (
          <>
            <Button variant="outlined" color="error" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button variant="contained" onClick={handleCurrentPasswordSubmit} disabled={isSubmitting || !currentPassword} sx={{ bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0a3a61" } }}>
              {isSubmitting ? <><CircularProgress size={20} sx={{ mr: 1, color: "white" }} /> Verifying...</> : "Continue"}
            </Button>
          </>
        )}
        {passwordStep === "new" && (
          <Button variant="contained" fullWidth onClick={handleNewPasswordSubmit} disabled={isSubmitting || !newPassword || !confirmPassword} sx={{ bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0a3a61" } }}>
            {isSubmitting ? <><CircularProgress size={20} sx={{ mr: 1, color: "white" }} /> Changing...</> : <><CheckCircle sx={{ mr: 1 }} /> Change Password</>}
          </Button>
        )}
        {passwordStep === "success" && (
          <Button variant="contained" fullWidth onClick={onClose} sx={{ bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0a3a61" } }}>Got it</Button>
        )}
        </Box>
      </Paper>
    </Modal>
     {/** Snackbar alerts */}
     <Snackbar
     anchorOrigin={{ vertical: "top", horizontal: "right" }}
     open={openError}
     autoHideDuration={5000}
     onClose={handleClose}
   >
     <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
       {passwordError}
     </Alert>
   </Snackbar>
   </>
  );
};

export default ChangePassword;
