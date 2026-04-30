import { Close } from '@mui/icons-material';
import {
  Modal, Paper, Box, Typography, IconButton,
  TextField, Radio, Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from 'react';
import FenceMap from './FenceMap';
import { createBranch } from '../../services/Branches';

interface Props {
  open: boolean;
  onClose: () => void;
  refreshData: () => void;
}

const AddBranchModal = ({ open, onClose, refreshData }:Props) => {
  const [fenceName, setFenceName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [radius, setRadius] = useState("");
  const [centerLat, setCenterLat] = useState("");
  const [centerLng, setCenterLng] = useState("");

  const [shape, setShape] = useState<"circle" | "rectangle" | "polygon">("circle");
  const [tab, setTab] = useState<"draw" | "manual">("draw");
  const [points, setPoints] = useState<{ lat: string; lng: string }[]>([]);
  const [selectedPointIdx, setSelectedPointIdx] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShapeChange = (value: typeof shape) => setShape(value);


  useEffect(() => {
    if (shape === "rectangle") {
      setPoints(Array.from({ length: 4 }, () => ({ lat: "", lng: "" })));
      setSelectedPointIdx(0);
    } else if (shape === "polygon") {
      setPoints([{ lat: "", lng: "" }, { lat: "", lng: "" }, { lat: "", lng: "" }]);
      setSelectedPointIdx(0);
    } else {
      setPoints([]);
      setSelectedPointIdx(null);
    }
  }, [shape]);

  const handleAdd = async () => {
    if (!fenceName.trim()){
     setMsg("Branch name required");
     setOpenError(true);
     return 
    }
    if (!branchAddress.trim()) {
      setMsg("Branch address required");
      setOpenError(true);
      return 
    }
    const dto: any = {
      branchName: fenceName,
      branchAddress: branchAddress,
      description: "",
      fenceType: shape.toUpperCase(),
    };
  
    // 🔵 CIRCLE
    if (shape === "circle") {
      if (!centerLat || !centerLng || !radius)
        return alert("Enter center & radius");
  
      dto.centerLatitude = parseFloat(centerLat);
      dto.centerLongitude = parseFloat(centerLng);
      dto.radiusMeters = parseFloat(radius);
    }
  
    // 🟩 RECTANGLE / POLYGON → WKT
    if ((shape === "rectangle" || shape === "polygon")) {
      const validPoints = points.filter(p => p.lat && p.lng);
  
      if (validPoints.length < 3)
        return alert("Please fill all points");
  
      // WKT expects: lng lat
      const coords = validPoints
        .map(p => `${p.lng} ${p.lat}`)
        .join(", ");
  
      const first = `${validPoints[0].lng} ${validPoints[0].lat}`;
  
      dto.coordinates = `POLYGON((${coords}, ${first}))`;
    }
  
    try {
      setLoading(true);
      const res = await createBranch(dto);
  
      if (res?.status === 201 || res?.status === 200) {
        setOpenSuccess(true);
        setMsg("Branch created successfully");
        onClose();
        refreshData();
      } else {
        setOpenError(true);
        setMsg("Failed to create branch");
      }
    } catch (err) {
      setOpenError(true);
      setMsg("Error creating branch");
    }finally{
      setLoading(false);
    }
  };  
  const handleSnackbarClose = () => {
    setOpenError(false);
    setOpenSuccess(false);
  };

  const handleClose = () => {
    setFenceName("");
    setBranchAddress("");
    setRadius("");
    setCenterLat("");
    setCenterLng("");
    setShape("circle");
    setTab("draw");
    setPoints([]);
    setSelectedPointIdx(null);
    onClose();
  };
  return (
    <>
    <Modal open={open} onClose={handleClose}>
      <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "60%", maxWidth: 1000, borderRadius: 2, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ bgcolor: "#0F4C8199", px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "8px 8px 0 0" }}>
          <Typography fontWeight={600} color='#fff'>Add New Branch</Typography>
          <IconButton size="small" sx={{ color: "#fff" }} onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, overflow: "auto", flex: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight={500} mb={0.5}>
             Branch Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              value={fenceName}
              onChange={(e) => setFenceName(e.target.value)}
              placeholder="Enter Name"
              size="small"
              fullWidth
              InputProps={{ sx: { backgroundColor: '#F4F4F4', border: 'none', '& fieldset': { border: 'none' } } }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography fontWeight={500} mb={0.5}>Branch Address <span style={{ color: 'red' }}>*</span></Typography>
            <TextField
              value={branchAddress}
              onChange={(e) => setBranchAddress(e.target.value)}
              placeholder="Enter full address"
              size="small"
              fullWidth
              InputProps={{ sx: { backgroundColor: '#F4F4F4', border: 'none', '& fieldset': { border: 'none' } } }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Radio checked={shape === "circle"} onChange={() => handleShapeChange("circle")} />
              <Typography>Circle</Typography>
            </Box>
            {/* <Box sx={{ display: "flex", alignItems: "center" }}>
              <Radio checked={shape === "rectangle"} onChange={() => handleShapeChange("rectangle")} />
              <Typography>Rectangle</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Radio checked={shape === "polygon"} onChange={() => handleShapeChange("polygon")} />
              <Typography>Polygon</Typography>
            </Box> */}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
            <Box sx={{ display: "inline-flex", bgcolor: "#F3F4F6", borderRadius: 3, p: 0.5, gap: 0.5 }}>
              <Button
                onClick={() => setTab("draw")}
                sx={{
                  textTransform: "none",
                  borderRadius: 2.5,
                  px: 2,
                  py: 1,
                  minWidth: 100,
                  bgcolor: tab === "draw" ? "#fff" : "transparent",
                  color: tab === "draw" ? "#000" : "#6B7280",
                  boxShadow: tab === "draw" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                  "&:hover": {
                    bgcolor: tab === "draw" ? "#fff" : "rgba(0,0,0,0.04)"
                  }
                }}
              >
                Draw on Map
              </Button>
              <Button
                onClick={() => setTab("manual")}
                sx={{
                  textTransform: "none",
                  borderRadius: 2.5,
                  px: 2,
                  py: 1,
                  minWidth: 100,
                  bgcolor: tab === "manual" ? "#fff" : "transparent",
                  color: tab === "manual" ? "#000" : "#6B7280",
                  boxShadow: tab === "manual" ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                  "&:hover": {
                    bgcolor: tab === "manual" ? "#fff" : "rgba(0,0,0,0.04)"
                  }
                }}
              >
                Enter Manually
              </Button>
            </Box>
            {(shape === "rectangle" || shape === "polygon") && (
              <Box sx={{ flex: 1, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                {points.map((_, idx) => (
                  <Box key={idx} sx={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                    <Button
                      size="small"
                      variant={selectedPointIdx === idx ? "contained" : "text"}
                      onClick={() => setSelectedPointIdx(idx)}
                      sx={{ minWidth: 36, borderRadius: "50%" }}
                    >
                      {`A${idx + 1}`}
                    </Button>
                    {shape === "polygon" && idx >= 3 && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          const updated = points.filter((_, i) => i !== idx);
                          setPoints(updated);
                          setSelectedPointIdx((prev) => prev === idx ? 0 : prev && prev > idx ? prev - 1 : prev);
                        }}
                        sx={{ position: "absolute", top: -6, right: -6, backgroundColor: "white", border: "1px solid #ccc", padding: 0.2, width: 18, height: 18 }}
                      >
                        <Close sx={{ fontSize: 14 }} />
                      </IconButton>
                    )}
                  </Box>
                ))}
                {shape === "polygon" && (
                  <Button
                    size="small"
                    onClick={() => setPoints([...points, { lat: "", lng: "" }])}
                    sx={{ minWidth: 36, borderRadius: "50%" }}
                  >
                    +
                  </Button>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 2, height: 400, border: "1px solid #ccc", borderRadius: 1, bgcolor: "#f9f9f9" }}>
              <FenceMap
                  shape={shape}
                  points={points}
                  center={shape === "circle" ? { lat: centerLat, lng: centerLng, radius } : undefined}
                  editable={tab === "draw"}
                  onPointsChange={setPoints}
                  onCenterChange={(c) => {
                    setCenterLat(c.lat);
                    setCenterLng(c.lng);
                    if (c.radius) setRadius(c.radius);
                  }}
                  height="100%"
                  open={open}
                  tab={tab}
                />
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              {shape === "circle" ? (
                <>
                  <Box>
                    <Typography fontSize={14} fontWeight={500} mb={0.5}>Latitude</Typography>
                    <TextField
                      value={centerLat}
                      onChange={(e) => setCenterLat(e.target.value)}
                      placeholder="Enter latitude"
                      size="small"
                      fullWidth
                      InputProps={{ sx: { backgroundColor: '#F4F4F4', border: 'none', '& fieldset': { border: 'none' } } }}
                    />
                  </Box>
                  <Box>
                    <Typography fontSize={14} fontWeight={500} mb={0.5}>Longitude</Typography>
                    <TextField
                      value={centerLng}
                      onChange={(e) => setCenterLng(e.target.value)}
                      placeholder="Enter longitude"
                      size="small"
                      fullWidth
                      InputProps={{ sx: { backgroundColor: '#F4F4F4', border: 'none', '& fieldset': { border: 'none' } } }}
                    />
                  </Box>
                  <Box>
                    <Typography fontSize={14} fontWeight={500} mb={0.5}>Radius (meters)</Typography>
                    <TextField
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      placeholder="500"
                      size="small"
                      fullWidth
                      InputProps={{ sx: { backgroundColor: '#F4F4F4', border: 'none', '& fieldset': { border: 'none' } } }}
                    />
                  </Box>
                </>
              ) : selectedPointIdx !== null && points[selectedPointIdx] && (
                <>
                  <Box>
                    <Typography fontSize={14} fontWeight={500} mb={0.5}>Latitude (A{selectedPointIdx + 1})</Typography>
                    <TextField
                      size="small"
                      fullWidth
                      value={points[selectedPointIdx].lat}
                      onChange={(e) => {
                        const updated = [...points];
                        updated[selectedPointIdx].lat = e.target.value;
                        setPoints(updated);
                      }}
                      InputProps={{ sx: { backgroundColor: '#F4F4F4', border: 'none', '& fieldset': { border: 'none' } } }}
                    />
                  </Box>
                  <Box>
                    <Typography fontSize={14} fontWeight={500} mb={0.5}>Longitude (A{selectedPointIdx + 1})</Typography>
                    <TextField
                      size="small"
                      fullWidth
                      value={points[selectedPointIdx].lng}
                      onChange={(e) => {
                        const updated = [...points];
                        updated[selectedPointIdx].lng = e.target.value;
                        setPoints(updated);
                      }}
                      InputProps={{ sx: { backgroundColor: '#F4F4F4', border: 'none', '& fieldset': { border: 'none' } } }}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Box>

        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, borderTop: "1px solid #E0E0E0" }}>
          <Button onClick={handleClose} variant="outlined" sx={{ textTransform: "none", borderRadius: 20, px: 4 }}>Cancel</Button>
          <Button onClick={handleAdd} disabled={loading} variant="contained" sx={{ textTransform: "none", borderRadius: 20,bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0D3D66" },px: 4 }}>
          {loading ? (
              <CircularProgress size={22} sx={{ color: "#0F4C81" }} />
            ) : (
              "Create"
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

export default AddBranchModal;
