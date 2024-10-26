import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import NotFound from "../pages/NotFound";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardPage from "../pages/DashboardPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
