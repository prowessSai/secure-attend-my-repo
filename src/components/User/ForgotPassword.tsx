import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Link,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import {ArrowBack,Email,CheckCircle,Shield,Lock,VpnKey,Warning,Visibility,VisibilityOff,} from "@mui/icons-material";
import LeftSection from "../../components/LeftSection";
import {sendOTP,validateOTP,resendOTP,resetPassword} from "../../services/User";
import { IResetPasswordDTO } from "../../interfaces/User";

type Step = "email" | "otp" | "password" | "success";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [passwordError, setPasswordError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [msg, setMsg] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendEmailOTP = async () => {
    setIsSubmitting(true);
    try{
      const response = await sendOTP(email);
      if(response && response.status === "success"){
        setMsg(response?.rawResponse?.data?.message || "OTP sent to email.");
        setOpenSuccess(true);
        setCurrentStep("otp");
        setCountdown(60);
      }else{
        setMsg(response?.rawResponse?.data?.message || "Failed to send OTP." || "Failed to send OTP." );
        setOpenError(true);
      }
    }catch (err){
      console.error(err);
      setMsg("Exception sending OTP to mobile.");
        setOpenError(true);
    } finally{
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    const enteredOtp = otp.join('');
    setIsSubmitting(true);
    try{
      const response = await validateOTP(email,enteredOtp);
      if (response && response.status === "success") {
        setMsg(response?.rawResponse?.data?.message || "OTP verified successfully.");
        setOpenSuccess(true);
        setCurrentStep("password");
    }else{
        setMsg(response?.rawResponse?.data?.message || "Invalid OTP entered." || "Invalid OTP entered.");
        setOpenError(true);
    }
  }catch (err){
      console.error(err);
      setMsg("Exception validating OTP.");
      setOpenError(true);
    }finally{
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try{
      const response = await resendOTP(email);
      if(response && response.status === "success"){
        setMsg(response?.rawResponse?.data?.message || "OTP sent to email again.");
        setOpenSuccess(true);
      }else{
        setMsg(response?.rawResponse?.data?.message || "Failed to send OTP." || "Failed to send OTP." );
        setOpenError(true);
      }
    }catch (err){
      console.error(err);
      setMsg("Exception sending OTP to mobile.");
        setOpenError(true);
    } 
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    }, 1000);
  };

  const handlePasswordSubmit = async () => {
    setPasswordError("");
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      const dto: IResetPasswordDTO = {
        password : newPassword,
        confirmPassword : confirmPassword
      };
      const response = await resetPassword(dto);
  
      if (response && response.status === "success") {
        setMsg(response?.rawResponse?.data?.message || "Password reset successful.");
        setOpenSuccess(true);
        setCurrentStep("success");
      } else {
        setMsg(response?.rawResponse?.data?.message || "Failed to reset password.");
        setOpenError(true);
      }
    } catch (error) {
      console.error(error);
      setMsg("Exception resetting password.");
      setOpenError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");
  const handleClose = () => {
    setOpenError(false);
    setOpenSuccess(false);
    setMsg('');
    setPasswordError("");
  };
  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, minHeight: "100vh", bgcolor: "white" }}>
      <LeftSection />
      <Box sx={{ width: { xs: "100%", sm: "50%" }, display: "flex", alignItems: "center", justifyContent: "center", p: { xs:2, md:4} }}>
        <Dialog open={currentStep === "success"} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <Box sx={{ width: 64, height: 64, bgcolor: "#e8f5e9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <CheckCircle sx={{ fontSize: 32, color: "#4caf50" }} />
          </Box>
          <Typography variant="h5" fontWeight={600} mb={1}>Password Reset Successful</Typography>
          <Typography color="text.secondary" mb={1}>Your password has been successfully reset!</Typography>
          <Alert severity="success" sx={{ mb:1}}>You can now sign in with your new password.</Alert>
          <Typography variant="body2" color="text.secondary">For security reasons, please sign in again to access the admin dashboard.</Typography>
        </DialogContent>
        <DialogActions sx={{ p:2, pt: 0 }}>
          <Button variant="contained" fullWidth onClick={() => navigate("/login")} sx={{ bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0a3a61" } }}>Go to Login</Button>
        </DialogActions>
        </Dialog>

        <Box sx={{ width: "100%", maxWidth: 480 }}>
        <Box sx={{ textAlign: "center", mb:0.5}}>
          <Box sx={{ width: 60, height: 60, bgcolor: "#0F4C81", borderRadius: 2, mx: "auto", mb:1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield sx={{ fontSize: 32, color: "white" }} />
          </Box>
          <Typography variant="h4" fontWeight={600} mb={0.5}>Reset Password</Typography>
          <Typography color="text.secondary">
            {currentStep === "email" && "Enter your email to receive verification code"}
            {currentStep === "otp" && "Enter the 6-digit code sent to your email"}
            {currentStep === "password" && "Create a new secure password"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb:2}}>
          <Box sx={{ width: currentStep === "email" ? 32 : 8, height: 8, borderRadius: 4, bgcolor: currentStep === "email" ? "#0F4C81" : "#e0e0e0", transition: "all 0.3s" }} />
          <Box sx={{ width: currentStep === "otp" ? 32 : 8, height: 8, borderRadius: 4, bgcolor: currentStep === "otp" ? "#0F4C81" : "#e0e0e0", transition: "all 0.3s" }} />
          <Box sx={{ width: currentStep === "password" ? 32 : 8, height: 8, borderRadius: 4, bgcolor: currentStep === "password" ? "#0F4C81" : "#e0e0e0", transition: "all 0.3s" }} />
        </Box>

        <Card>
          <CardContent sx={{ p:1}}>
            <Typography variant="h6" fontWeight={600} mb={0.5}>
              {currentStep === "email" && "Verify Your Email"}
              {currentStep === "otp" && "Enter Verification Code"}
              {currentStep === "password" && "Set New Password"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {currentStep === "email" && "We'll send a 6-digit verification code to your email"}
              {currentStep === "otp" && `Code sent to ${email}`}
              {currentStep === "password" && "Your new password must be secure and unique"}
            </Typography>

            {currentStep === "email" && (
              <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSendEmailOTP(); }}>
                <Typography variant="body2" fontWeight={500} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email sx={{ fontSize: 16 }} /> Email Address
                </Typography>
                <TextField fullWidth placeholder="admin@company.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} sx={{ mb: 2 }} />
                <Alert severity="info" sx={{ mb:1}}>
                  <strong>Security Notice:</strong> Only registered admin accounts can reset passwords via OTP verification.
                </Alert>
                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting || !email} sx={{ mb: 2, bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0a3a61" } }}>
                  {isSubmitting ? <><CircularProgress size={20} sx={{ mr: 1, color: "white" }} /> Sending OTP...</> : <><Email sx={{ mr: 1 }} /> Send Verification Code</>}
                </Button>
                <Button variant="outlined" fullWidth onClick={() => navigate("/login")} disabled={isSubmitting}>
                  <ArrowBack sx={{ mr: 1 }} /> Back to Login
                </Button>
              </Box>
            )}

            {currentStep === "otp" && (
              <Box component="form" onSubmit={(e) => { e.preventDefault(); handleOtpSubmit(); }}>
                <Typography variant="body2" fontWeight={500} mb={1} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <VpnKey sx={{ fontSize: 16 }} /> Verification Code
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb:1}}>
                  {otp.map((digit, index) => (
                    <TextField key={index} inputRef={(el) => (otpRefs.current[index] = el)} type="text" inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: 20, fontWeight: 600 } }} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} disabled={isSubmitting} sx={{ flex: 1 }} />
                  ))}
                </Box>
                <Alert severity="warning" icon={<Warning />} sx={{ mb:1}}>The verification code will expire in 5 minutes</Alert>
                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting || !isOtpComplete} sx={{ mb:1, bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0a3a61" } }}>
                  {isSubmitting ? <><CircularProgress size={20} sx={{ mr: 1, color: "white" }} /> Verifying...</> : "Verify Code"}
                </Button>
                <Box sx={{ textAlign: "center", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Didn't receive the code? {countdown > 0 ? (
                      <>Resend code in <Box component="span" sx={{ fontWeight: 600, color: "#0F4C81" }}>{countdown}s</Box></>
                    ) : (
                      <Link component="button" type="button" onClick={handleResendOtp} disabled={isSubmitting} sx={{ color: "#0F4C81", cursor: "pointer" }}>Resend Code</Link>
                    )}
                  </Typography>
                </Box>
                <Button variant="outlined" fullWidth onClick={() => { setCurrentStep("email"); setOtp(["", "", "", "", "", ""]); }} disabled={isSubmitting}>
                  <ArrowBack sx={{ mr: 1 }} /> Change Email
                </Button>
              </Box>
            )}

            {currentStep === "password" && (
              <Box component="form" onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }}>
                <Typography variant="body2" fontWeight={500} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                  sx={{ mb:1}} 
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
                <Typography variant="body2" fontWeight={500} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Lock sx={{ fontSize: 16 }} /> Confirm Password
                </Typography>
                <TextField fullWidth type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isSubmitting} sx={{ mb:1}} />
                {passwordError && <Alert severity="error" icon={<Warning />}>{passwordError}</Alert>}
                <Alert severity="info">
                  <Typography variant="body2" fontWeight={500}>Password Requirements:</Typography>
                  <Box component="ul" sx={{ m: 0, pl:2, fontSize: 12 }}>
                    <li>At least 8 characters long</li>
                    <li>Use a strong, unique password</li>
                  </Box>
                </Alert>
                <Button type="submit" variant="contained" fullWidth disabled={isSubmitting || !newPassword || !confirmPassword} sx={{ bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0a3a61" } }}>
                  {isSubmitting ? <><CircularProgress size={20} sx={{ mr: 1, color: "white" }} /> Resetting Password...</> : <><CheckCircle sx={{ mr: 1 }} /> Reset Password</>}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Box sx={{ mt:1, textAlign: "left" }}>
          <Typography variant="body2" color="text.secondary">
            Remember your password? <Link component="button" onClick={() => navigate("/login")} sx={{ color: "#0F4C81", cursor: "pointer", fontWeight: 500 }}>Sign in here</Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Need help? <Link component="button" sx={{ color: "#0F4C81", cursor: "pointer", fontWeight: 500 }}>Contact System Administrator</Link>
          </Typography>
        </Box>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openError}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSuccess}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
