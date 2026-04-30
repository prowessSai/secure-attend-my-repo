import {
  Modal,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { IRoleMInDTO } from "../../interfaces/Roles";
import { IBranchesMinDTO } from "../../interfaces/Branches";
import { getRolesMin } from "../../services/Roles";
import { getBranchesMin } from "../../services/Branches";
import { ISendInvitationsDTO } from "../../interfaces/User";
import { sendInvitation } from "../../services/User";

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const AddEmployeeModal = ({ open, onClose, onCreate }: AddEmployeeModalProps) => {
  const [formData, setFormData] = useState({name: "",
    employeeId: "",email: "",mobile: "",
    branchId: 0,
    roleId: 0,
  });  
  const[roles,setRoles] = useState<Array<IRoleMInDTO>>([]);
  const [branches,setBranches] = useState<Array<IBranchesMinDTO>>([]);
  const [msg, setMsg] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllRoles = async () => {
      if (open) {
        try {
          const rolesRes = await getRolesMin();
          setRoles(Array.isArray(rolesRes) ? rolesRes : []);
        } catch (error) {
          setRoles([]);
        }
      }
    };
    const fetchAllBranches = async () => {
      try {
        const branchesRes = await getBranchesMin();
        setBranches(Array.isArray(branchesRes) ? branchesRes : []);
      } catch {
        setBranches([]);
      }
    };
    
    fetchAllRoles();
    fetchAllBranches();
  }, [open]);
  const handleSend =  async() => {
    // if (!validate()) return;
    
    setLoading(true); 
    try {
      const post = {} as ISendInvitationsDTO;
      post.name = formData.name;
      post.empId = formData.employeeId;
      post.email = formData.email;
      post.mobile = formData.mobile;
      post.branchId = formData.branchId;
      post.roleId = formData.roleId
      
      const response = await sendInvitation(post);
      console.log("response", response);
      if(response && response.status === "success"){
        setOpenSuccess(true);
        setMsg("Invitation send Successfully.");
        onClose();
        onCreate();
      }else{
        setOpenError(true);
        setMsg("Error inviting employee.");
      }
    }catch(error) {
      setOpenError(true);
      setMsg("Error exception modifying saving role.");
    }finally{
      setLoading(false);
    }
  };
  
  const handleSnackbarClose = () => {
    setOpenError(false);
    setOpenSuccess(false);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      employeeId: "",
      email: "",
      mobile: "",
      branchId: 0,
      roleId: 0,
    });
    onClose();
  };
  return (
    <>
      <Modal open={open} onClose={handleClose}>
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
            <Typography fontWeight={600} color="#fff">Invite New Employee</Typography>
            <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
            <Typography fontWeight={600}>Full Name <span style={{ color: 'red' }}>*</span></Typography>
            <TextField
              fullWidth
              placeholder="John Doe"
              size="small"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2, mt: 0.5 }}
            />

            <Typography fontWeight={600}>Employee ID <span style={{ color: 'red' }}>*</span></Typography>
            <TextField
              fullWidth
              placeholder="EMP007"
              size="small"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              sx={{ mb: 2, mt: 0.5 }}
            />

            <Typography fontWeight={600}>Email <span style={{ color: 'red' }}>*</span></Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="john.doe@bank.com"
              size="small"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2, mt: 0.5 }}
            />

            <Typography fontWeight={600}>Mobile Number <span style={{ color: 'red' }}>*</span></Typography>
            <TextField
              fullWidth
              placeholder="+91 9984673645"
              size="small"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              sx={{ mb: 2, mt: 0.5 }}
            />

            <Typography fontWeight={600}>Assign Branch <span style={{ color: 'red' }}>*</span></Typography>
            <FormControl fullWidth size="small" sx={{ mt: 0.5, mb: 2 }}>
              <Select
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                displayEmpty
                sx={{ color: formData.branchId === 0 ? "text.secondary" : "inherit" }}
                MenuProps={{PaperProps: {style: {maxHeight: 150,},},}}
                > 
                <MenuItem value={0} disabled>Select Branch</MenuItem>
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography fontWeight={600}>Assign Role <span style={{ color: 'red' }}>*</span></Typography>
            <FormControl fullWidth size="small" sx={{ mt: 0.5, mb: 1 }}>
              <Select
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                displayEmpty
                sx={{ color: formData.roleId === 0 ? "text.secondary" : "inherit" }}
                MenuProps={{PaperProps: {style: {maxHeight: 150,},},}}>
                <MenuItem value={0} disabled>Select Role</MenuItem>
                 {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
              Role determines access permissions. Manage roles in <span style={{ fontWeight: 500 }}>Roles & Permissions</span>.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 1,
              px: 2,
              borderTop: "1px solid #E0E0E0",
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
            }}
          >
            <Button variant="outlined" onClick={handleClose} sx={{ borderRadius: 20 }}>
              Cancel
            </Button>
            <Button variant="contained" disabled={loading} onClick={handleSend} sx={{ borderRadius: 20, bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0D3D66" } }}>
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#0F4C81" }} />
            ) : (
              "Send Invitation"
            )}
            </Button>
          </Box>
        </Paper>
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openError}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSuccess}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddEmployeeModal;
