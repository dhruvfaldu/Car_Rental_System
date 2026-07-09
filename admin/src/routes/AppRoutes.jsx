import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import Brand from "@/pages/Brand";
import Login from "@/features/auth/pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes under DashboardLayout */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/brand" element={<Brand />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;