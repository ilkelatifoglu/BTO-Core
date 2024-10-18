import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage"; // Ensure LoginPage is exported correctly
import DashboardPage from "../pages/DashboardPage"; // Ensure DashboardPage is exported correctly
import NotFound from "../pages/NotFound"; // Ensure NotFound is exported correctly
import ForgotPassword from "../pages/ForgotPassword"; // Import ForgotPassword page
import Dashboard from "../components/dashboard/Dashboard";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
      {/* New route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; // Ensure it's default exported
