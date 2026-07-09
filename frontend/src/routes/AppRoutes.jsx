import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import MyBooking from "@/pages/Booking/MyBooking";
import Cars from "@/pages/CarListing/Cars";
import CarDetail from "@/pages/CarDetail/CarDetail";
import Home from "@/pages/Home/Home";
import Profile from "@/pages/Account/Profile";
import Invoices from "@/pages/Account/Invoices";
import Bookings from "@/pages/Account/Bookings";

import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import Booking from "@/pages/Booking/Booking";
import BookingConfirmation from "@/pages/Booking/BookingConfirmation";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publically Accessible Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:slug" element={<CarDetail />} />
        </Route>

        {/* Guest Only Routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Private Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="/booking/:carId" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBooking />} />
            <Route
              path="/booking/:bookingId/confirmation"
              element={<BookingConfirmation />}
            />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="bookings" element={<Bookings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes