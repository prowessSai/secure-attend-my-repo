import '../assets/css/leftSection.css';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const LeftSection = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: { xs: "100%", sm: "50%" }, columnGap: 1, padding: { xs: 5, md: 8 }, justifyContent: "center", pb: 15 }} className="left-section-background">
      <Stack spacing={{ xs: 1, sm: 2, md: 3 }}>
        <Typography variant="h1" color="white" sx={{ fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.2rem" }, fontWeight: 600 }}>Enterprise Workforce Management</Typography>
        <Typography sx={{ color: "#F4F4F4", fontSize: { xs: "0.8rem", sm: "1rem", md: "1.1rem" }, fontWeight: 400 }}>Powerful tools to manage your team's attendance, track locations in real-time, and generate comprehensive reports with bank-grade security.</Typography>
      </Stack>

      <Stack rowGap={2.5} sx={{ mt: { xs: 4, md: 6 } }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <TaskAltIcon sx={{ fontSize: 24, color: "white" }} />
          </Box>
          <Stack>
            <Typography color="white" sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, fontWeight: 600 }}>Real-Time Tracking</Typography>
            <Typography sx={{ color: "#F4F4F4", fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" }, fontWeight: 400 }}>Monitor employee locations and attendance instantly</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <TaskAltIcon sx={{ fontSize: 24, color: "white" }} />
          </Box>
          <Stack>
            <Typography color="white" sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, fontWeight: 600 }}>Geo-Fence Management</Typography>
            <Typography sx={{ color: "#F4F4F4", fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" }, fontWeight: 400 }}>Define and monitor office boundaries with precision</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <TaskAltIcon sx={{ fontSize: 24, color: "white" }} />
          </Box>
          <Stack>
            <Typography color="white" sx={{ fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, fontWeight: 600 }}>Advanced Analytics</Typography>
            <Typography sx={{ color: "#F4F4F4", fontSize: { xs: "0.7rem", sm: "0.85rem", md: "1rem" }, fontWeight: 400 }}>Generate detailed reports and insights</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LeftSection;