import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import BrandsPage from "@/features/brands/pages/BrandsPage";
import CategoriesPage from "@/features/categories/pages/CategoriesPage";
import FeaturesPage from "@/features/features/pages/FeaturesPage";
import CarsPage from "@/features/cars/pages/CarsPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes under DashboardLayout */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/brands" element={<BrandsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/features" element={<FeaturesPage />} />
                        <Route path="/cars" element={<CarsPage />} />
                        
                        {/* Catch-all fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;