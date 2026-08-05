import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Components/layout/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Vendors from "./admin/pages/Vendors";
import VendorLayout from "./vendor/pages/VendorLayout";
import VendorDashboard from "./vendor/pages/VendorDashboard"
import VendorServices from "./vendor/pages/VendorServices";
import VendorAvailability from "./vendor/pages/VendorAvailability";
import VendorBookings from "./vendor/pages/VendorBookings";
import VendorProfile from "./vendor/pages/VendorProfile";
import VendorServiceForm from "./vendor/pages/VendorServiceForm";
import Services from "./pages/Services";
import ServiceDetail from "./pages/Servicedetail";
import MyBookings from "./pages/Mybookings";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/vendor") || location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/vendors" element={<Vendors/>}/>

        <Route path="/vendor" element={<VendorLayout/>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VendorDashboard/>}/>
          <Route path="services" element={<VendorServices/>}/>
          <Route path="services/new" element={<VendorServiceForm />} />
          <Route path="availability" element={<VendorAvailability/>}/>
          <Route path="bookings" element={<VendorBookings/>}/>
          <Route path="profile" element={<VendorProfile/>}/>
        </Route>
      </Routes>
    </>
  );
}
export default App;