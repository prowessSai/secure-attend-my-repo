import  { useEffect, useState } from "react";
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
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { createRole, getAccessTypes, getPermissionsList } from "../../services/Roles";
import { IPermissionMinDTO, IRoleDTO } from "../../interfaces/Roles";
import { getAccessTypeLabel } from "../../util/Util";

interface FormErrors {
  [key: string]: string;
}
interface AddRoleModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}

// const ALL_PERMISSIONS = [
//   "View Dashboard",
//   "Manage Employees",
//   "Manage Branches",
//   "View Live Tracking",
//   "Manage Alerts",
//   "Manage Roles & Permissions",
//   "Manage System Settings",
// ];

const AddRoleModal = ({ open, onClose, onCreate }: AddRoleModalProps) => {
  const [roleName, setRoleName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [description, setDescription] = useState("");
  const [accessTypes, setAccessTypes] = useState<string[]>([]);
  const [selectedAccessType, setSelectedAccessType] = useState<string>("");
  const [allPermissions, setAllPermisssions] = useState<Array<IPermissionMinDTO>>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [msg, setMsg] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchAllPerms = async () => {
    if (open) {
      try {
        const permsRes = await getPermissionsList();
        setAllPermisssions(Array.isArray(permsRes) ? permsRes : []);
      } catch (error) {
        setAllPermisssions([]);
      }
    }
  };
  const fetchAccessTypes = async () => {
    if (open) {
    try {
      const accessTypesRes = await getAccessTypes();
      setAccessTypes(accessTypesRes || []);
    } catch {
      setAccessTypes([]);
    }
  }
  };
  
  fetchAllPerms();
  fetchAccessTypes();
}, [open]);

const togglePermission = (permId: number, permName: string) => {
  if (permName === "ACCESS ALL") {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions([permId]);
    }
  } else {
    const accessAllPerm = allPermissions.find(p => p.permissionName === "ACCESS ALL");
    setSelectedPermissions((prev) => {
      const newPerms = prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId];
      
      if (accessAllPerm && newPerms.includes(accessAllPerm.id)) {
        return newPerms.filter(p => p !== accessAllPerm.id);
      }
      return newPerms;
    });
  }
};
const validate = () => {
  const newErrors: FormErrors = {};

  if (!roleName.trim()) newErrors.roleName = "Role name is required";
  if (!description.trim()) newErrors.description = "Role description is required";

  if (!selectedAccessType)
    newErrors.accessType = "Access type is required.";

  if (selectedPermissions.length === 0)
    newErrors.permissions = "At least one permission has to be selected.";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleCreate =  async() => {
    if (!validate()) return;
    
    setLoading(true); 
    try {
      const post = {} as IRoleDTO;
      post.name = roleName;
      post.description = description;
      post.platformType = selectedAccessType;
      post.permissionIds = selectedPermissions;
      
      const response = await createRole(post);
      console.log("response", response);
      if(response && response.status === 200){
        setOpenSuccess(true);
        setMsg("New role created Successfully.");
        resetForm();
        onClose();
        onCreate();
      }else{
        setOpenError(true);
        setMsg("Error adding role.");
      }
    }catch(error) {
      setOpenError(true);
      setMsg("Error exception modifying saving role.");
    }finally{
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRoleName("");
    setDescription("");
    setSelectedPermissions([]);
    setSelectedAccessType("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  const handleSnackbarClose = () => {
    setOpenError(false);
    setOpenSuccess(false);
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
          {/* Header */}
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
            <Typography fontWeight={600} color="#fff">Create New Role</Typography>
            <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
              <Close />
            </IconButton>
          </Box>

          {/* Scrollable Body */}
          <Box sx={{ p:1, flexGrow: 1, overflowY: "auto" }}>
            <Typography fontWeight={600}>Role Name <span style={{ color: 'red' }}>*</span></Typography>
            <TextField
              fullWidth
              placeholder="e.g., Regional Manager"
              size="small"
              value={roleName}
              onChange={(e) => {
                setRoleName(e.target.value);
                if (errors.roleName) setErrors({ ...errors, roleName: "" });
              }}
              error={!!errors.roleName}
              helperText={errors.roleName}
              sx={{mb: 2}}
            />

            <Typography fontWeight={600}>Description <span style={{ color: 'red' }}>*</span></Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Describe what this role is for and who should have it"
              value={description}
              onChange={(e) =>{ setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              error={!!errors.description}
              helperText={errors.description}
              sx={{mb: 2}}
            />

            <Typography fontWeight={600}>Access Type <span style={{ color: 'red' }}>*</span></Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }} error={!!errors.accessType}>
              <Select 
                value={selectedAccessType} 
                onChange={(e) => {
                  setSelectedAccessType(e.target.value);
                  if (errors.accessType) setErrors({ ...errors, accessType: "" });
                }}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 120,
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>Select Access Type</MenuItem>
                {accessTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {getAccessTypeLabel(type)}
                  </MenuItem>
                ))}
              </Select>
              {errors.accessType && (
                <Typography fontSize="0.75rem" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.accessType}
                </Typography>
              )}
            </FormControl>

            <Typography fontWeight={600} mb={0.5}>
              Permissions & Features <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Box
              sx={{
                border: `1px solid ${errors.permissions ? "#d32f2f" : "#E0E0E0"}`,
                borderRadius: 2,
                p:1,
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              {allPermissions.map((perm) => {
                const isAccessAll = perm.permissionName === "ACCESS ALL";
                const accessAllPerm = allPermissions.find(p => p.permissionName === "ACCESS ALL");
                const isChecked = isAccessAll 
                  ? selectedPermissions.includes(perm.id)
                  : accessAllPerm && selectedPermissions.includes(accessAllPerm.id) 
                    ? true 
                    : selectedPermissions.includes(perm.id);
                
                return (
                  <FormControlLabel
                    key={perm.id}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => {
                          togglePermission(perm.id, perm.permissionName);
                          if (errors.permissions) setErrors({ ...errors, permissions: "" });
                        }}
                      />
                    }
                    label={perm.permissionName}
                    sx={{ display: "flex", alignItems: "center"}}
                  />
                );
              })}
            </Box>
            {errors.permissions && (
              <Typography fontSize="0.75rem" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.permissions}
              </Typography>
            )}
          </Box>

          {/* Sticky Footer */}
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
           
            <Button variant="contained" disabled={loading} onClick={handleCreate} sx={{ borderRadius: 20, bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0D3D66" } }}>
            {loading ? (
              <CircularProgress size={22} sx={{ color: "white" }} />
            ) : (
              "Create Role"
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

export default AddRoleModal;
