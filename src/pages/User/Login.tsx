import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, InputAdornment, IconButton, Divider, CircularProgress, Snackbar, Alert } from "@mui/material";
import { Shield, Lock, Mail, Eye, EyeOff } from "lucide-react";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LeftSection from "../../components/LeftSection";
import { mediumSize, smallSize } from "../../assets/css/constants";
import { useAuth } from "../../auth/AuthProvider";
import { getUserDetails, logIn } from "../../services/User";
import { hasPermission } from "../../util/Util";
import { ILoginUserDetails } from "../../interfaces/User";


const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, setLoginUser} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [openError, setOpenError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin =async() => {
    if (!email || !password) return;
    setLoading(true);
    try{
      const response = await logIn(email,password);    
      console.log("LoginRes",response)
      if(response && (response.status === "success" || response.status === "OK")
      ){
      const info = response.rawResponse?.data;
      console.log("Signin response : ", info);
      if (info) {
        login(info.accessToken as string);

        const userDetailsRepsonse = await getUserDetails();
        if (userDetailsRepsonse && userDetailsRepsonse.userId) {
          setLoginUser(JSON.stringify(userDetailsRepsonse));
          const user = userDetailsRepsonse as ILoginUserDetails;
          if (hasPermission("ACCESS DASHBOARD", user)) {
            console.log("Has permission");
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }
      }
    }else if (response && response.status === "error"){
      const errMsg = response.errorResponse?.response?.data || response.errorResponse?.message || "Login Failed.";
      setErrMsg(errMsg);
      setOpenError(true);
    }else{
      setOpenError(true);
      setErrMsg("Login Failed");
    }
    }catch(error){
      console.log("Error while login: ", error);
      setErrMsg("Network error. Please check your connection and try again.");
      setOpenError(true);
    }finally{
      setLoading(false);
    }
  };
  const handleClose = () => {
    if (openError) {
      setOpenError(false);
    }
    setErrMsg("");
  };
  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, minHeight: "100vh", bgcolor: "white" }}>
      <LeftSection />
      <Box sx={{ width: { xs: "100%", sm: "50%" }, display: "flex", alignItems: "flex-start", justifyContent: "center", p: { xs: 3, md: 6 }, pt: { xs: 6, md: 8 } }}>
        <Box sx={{ width: "100%", maxWidth: 450 }}>
          <Box sx={{ textAlign: "left", mb:2}}>
            <Box sx={{ width: 64, height: 64, bgcolor: "#0F4C81", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Shield size={32} color="#fff" />
            </Box>
            <Typography variant="h4" fontWeight={600}>Welcome Back</Typography>
            <Typography color="text.secondary">Sign in to your admin portal</Typography>
          </Box>

          <Paper elevation={0} component="form" onSubmit={(e) => {e.preventDefault();handleLogin();}}>
            <Box sx={{ display: "flex", flexDirection: "column", gap:2}}>
              <Box>
                <Typography sx={{fontSize: mediumSize, fontWeight: 500}}>Email Address</Typography>
                <TextField placeholder="admin@company.com" type="email" fullWidth 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={20} /></InputAdornment> }} />
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",}}>
                  <Typography sx={{fontSize: mediumSize, fontWeight: 500}}>Password</Typography>
                  <Button size="small" variant="text" onClick={() => navigate("/forgot-password")} sx={{ minWidth: "auto", p: 0, fontSize:smallSize,color: "#005eff", textTransform: "none" }}>Forgot Password?</Button>
                </Box>
                <TextField placeholder="Enter your password" 
                type={showPassword ? "text" : "password"} 
                fullWidth value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock size={20} /></InputAdornment>, 
                endAdornment: <InputAdornment position="end"><IconButton edge="end" 
                onClick={() => setShowPassword(!showPassword)} sx={{ mr: 0.5 }}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</IconButton></InputAdornment> }} />
              </Box>
              {!loading && (
              <Button type="submit" variant="contained" fullWidth disabled={!email || !password} 
               sx={{ height: 48, bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0a3a61" } }}>
                Sign In
                </Button>
              )}
              {loading && (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  margin: "auto",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            )}
              <Divider />

              <Box>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb:1}}>Secured by:</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25}}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <TaskAltIcon sx={{ fontSize: 16, color: "#16a34a" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Bank-grade encryption (AES-256)</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <TaskAltIcon sx={{ fontSize: 16, color: "#16a34a" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>Two-factor authentication ready</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <TaskAltIcon sx={{ fontSize: 16, color: "#16a34a" }} />
                    <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>SOC 2 Type II compliant</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
       {/** Snackbar alerts */}
       <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openError}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {errMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLogin;
