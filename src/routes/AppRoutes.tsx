import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import NavigationBar from "../components/NavigationBar";
import RolesAndPermissions from "../pages/Roles&Permissions/RolesAndPermissions";
import Employees from "../pages/Employees/Employees";
import Branches from "../pages/Branches/Branches";
import BranchAnalytics from "../components/Branches/BranchAnalytics";
import Alerts from "../pages/Alerts/Alerts";
import LiveTracking from "../pages/LiveTracking/LiveTracking";
import Profile from "../components/Profile";
import LiveStatusPage from "../pages/Dashboard/LiveStatusPage";

const LogIn = lazy(() => import("../pages/User/Login"));
const ForgotPassword = lazy(() => import("../components/User/ForgotPassword"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/dashboard" element={<NavigationBar><Dashboard /></NavigationBar>} />
        <Route path="/live-status" element={<NavigationBar><LiveStatusPage /></NavigationBar>} />
        <Route path="/roles-permissions" element={<NavigationBar><RolesAndPermissions/></NavigationBar>} />
        <Route path="/employees" element={<NavigationBar><Employees/></NavigationBar>} />
        <Route path="/branches" element={<NavigationBar><Branches/></NavigationBar>} />
        <Route path="/branch-analytics/:branchId" element={<NavigationBar><BranchAnalytics/></NavigationBar>} />
        <Route path="/alerts" element={<NavigationBar><Alerts/></NavigationBar>} />
        <Route path="/live-tracking" element={<NavigationBar><LiveTracking/></NavigationBar>} />
        <Route path="/profile" element={<NavigationBar><Profile/></NavigationBar>} />
      </Routes>
    </Suspense>
  );
}
