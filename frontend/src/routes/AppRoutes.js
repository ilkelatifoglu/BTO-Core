import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardPage from "../pages/DashboardPage";
import PuantajPage from "../pages/PuantajPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate replace to="/home" />} />
      <Route path="/puantaj-page" element={<PuantajPage />} />
    </Routes>
  );
};

export default AppRoutes;
