import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Select, MenuItem, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, InputAdornment, CircularProgress } from "@mui/material";
import { Search,Visibility, History, PersonAdd, Edit } from "@mui/icons-material";
import AddEmployeeModal from "../../components/Employees/AddEmployeeModal";
import ViewEmployeeDetailsModal from "../../components/Employees/ViewEmployeeDetailsModal";
import AttendanceHistoryModal from "../../components/Employees/AttendanceHistoryModal";
import { IBranchesMinDTO } from "../../interfaces/Branches";
import { getBranchesMin } from "../../services/Branches";
import { IEmployeeListDTO } from "../../interfaces/User";
import { filterEmployeeByBranch, getEmployeesList, searchEmployee } from "../../services/User";
import EditEmployeeModal from "../../components/Employees/EditEmployeeModal";

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [branches,setBranches] = useState<Array<IBranchesMinDTO>>([]);
  const [employees, setEmployees] = useState<Array<IEmployeeListDTO>>([]);
  const [loading, setLoading] = useState(false);
  const [openAddEmployeeModal, setOpenAddEmployeeModal] = useState(false);
  const [openEditEmployeeModal, setOpenEditEmployeeModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployeeListDTO | null>(null);

  useEffect(() => {
  const fetchAllBranches = async () => {
    try {
      const branchesRes = await getBranchesMin();
      const branchList = Array.isArray(branchesRes) ? branchesRes : [];
      setBranches(branchList);
      if (branchList.length === 1) {
        setFilterBranch(String(branchList[0].id));
      }
    } catch {
      setBranches([]);
    }
  };

  fetchAllBranches();
  }, []);
    const fetchEmployees = async () => {
      try {
        setLoading(true);
  
        const search = searchQuery.trim();
  
        // 1️⃣ No search + no branch → ALL employees
        if (!search && !filterBranch) {
          const res = await getEmployeesList();
          setEmployees(Array.isArray(res) ? res : []);
          return;
        }
  
        // 2️⃣ Only branch filter
        if (!search && filterBranch) {
          const res = await filterEmployeeByBranch(Number(filterBranch));
          setEmployees(Array.isArray(res) ? res : []);
          return;
        }
  
        // 3️⃣ Only search
        if (search && !filterBranch) {
          const res = await searchEmployee(search);
          setEmployees(Array.isArray(res) ? res : []);
          return;
        }
  
        // 4️⃣ BOTH search + branch  ⭐ (frontend filtering after branch API)
        if (search && filterBranch) {
          const branchEmployees = await filterEmployeeByBranch(Number(filterBranch));
  
          const filtered = Array.isArray(branchEmployees)
            ? branchEmployees.filter((emp: IEmployeeListDTO) =>
                emp.name?.toLowerCase().includes(search.toLowerCase()) ||
                emp.empId?.toLowerCase().includes(search.toLowerCase())
              )
            : [];
  
          setEmployees(filtered);
        }
  
      } catch (err) {
        console.error("Employee filtering failed", err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
  
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEmployees();
    }, 500);
  
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, filterBranch]);
  
  const handleViewDetails = (employee: IEmployeeListDTO) => {
    setSelectedEmployee(employee);
    setOpenDetailsModal(true);
  };
  const handleEditEmployee = (employee: IEmployeeListDTO) => {
    setSelectedEmployee(employee);
    setOpenEditEmployeeModal(true);
  };
  const handleViewHistory = (employee:IEmployeeListDTO) => {
    setSelectedEmployee(employee);
    setOpenHistoryModal(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: "1.875rem", fontWeight: 600, mb: 0.5 }}>Employee Management</Typography>
          <Typography sx={{ color: "text.secondary" }}>Manage employee accounts and assignments</Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setOpenAddEmployeeModal(true)} sx={{ bgcolor: "#0F4C81", "&:hover": { bgcolor: "#0D3D66" } }}>
          Add Employee
        </Button>
      </Box>

      <Card sx={{ borderRadius: 2, mb: 2 }}>
        <CardContent sx={{ pt: 2 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
            <TextField size="small" placeholder="Search by name or employee ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: "text.secondary" }} /></InputAdornment> }} />
            <FormControl size="small">
              <Select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} displayEmpty sx={{ color: filterBranch === "" ? "text.secondary" : "inherit" }}
                MenuProps={{PaperProps: {style: {maxHeight: 150,},},}}>
                {branches.length > 1 && <MenuItem value="">All Branches</MenuItem>}
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>{branch.branchName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Typography sx={{ fontSize: "1.25rem", fontWeight: 600, p:1, borderBottom: 1, borderColor: "divider" }}>Employees ({employees.length??0})</Typography>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer sx={{ minWidth: "1200px" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell  sx={{ fontWeight: 600, py: 0.5 }}>Employee</TableCell>
                  <TableCell  sx={{ fontWeight: 600, py: 0.5 }}>Contact</TableCell>
                  <TableCell  sx={{ fontWeight: 600, py: 0.5 }}>Branch</TableCell>
                  <TableCell  sx={{ fontWeight: 600, py: 0.5 }}>Role</TableCell>
                  <TableCell  sx={{ fontWeight: 600, py: 0.5 }}>Status</TableCell>
                  <TableCell  sx={{ fontWeight: 600, py: 0.5, textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No employees found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                  <TableRow key={employee.empId}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, cursor: "pointer", "&:hover": { textDecoration: "underline", color: "primary.main" } }}onClick={() => handleViewDetails(employee)}>{employee.name??""}</Typography>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", cursor: "pointer", "&:hover": { textDecoration: "underline", color: "primary.main" } }}onClick={() => handleViewDetails(employee)}>{employee.empId??""}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "0.875rem" }}>{employee.email??""}</Typography>
                      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{employee.mobile??""}</Typography>
                    </TableCell>
                    <TableCell>{employee.branchName??""}</TableCell>
                    <TableCell>{employee.role??""}</TableCell>
                    <TableCell>
                      <Chip label={employee.status} color={employee.status === "ACTIVE" ? "success" : "error"} size="small" sx={{ fontWeight: 500 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <Button variant="outlined" size="small" startIcon={<Edit />} onClick={() => handleEditEmployee(employee)} sx={{ color:"#000",textTransform: "none", height: 32 }}>Edit</Button>
                        <Button variant="outlined" size="small" startIcon={<History />} onClick={() => handleViewHistory(employee)} sx={{ color:"#000",textTransform: "none", height: 32 }}>History</Button>
                        <Button variant="outlined" size="small" startIcon={<Visibility />} onClick={() => handleViewDetails(employee)} sx={{ color:"#000",textTransform: "none", height: 32 }}>Details</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        </CardContent>
      </Card>

      <AddEmployeeModal open={openAddEmployeeModal} onClose={() => setOpenAddEmployeeModal(false)} onCreate={fetchEmployees} />
      <EditEmployeeModal open={openEditEmployeeModal} onClose={() => setOpenEditEmployeeModal(false)} employee={selectedEmployee} onSave={fetchEmployees} />
      <ViewEmployeeDetailsModal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} onSave={fetchEmployees} employee={selectedEmployee} onViewHistory={handleViewHistory} />
      <AttendanceHistoryModal open={openHistoryModal} onClose={() => setOpenHistoryModal(false)} employee={selectedEmployee} />
    </Box>
  );
}

export default Employees;
