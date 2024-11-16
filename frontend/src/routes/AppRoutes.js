import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingsPage";
import ResetPassword from "../pages/ResetPassword";
import EmailVerification from "../pages/OtpVerification";
import GuideInfoPage from "../pages/GuideInfoPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate replace to="/home" />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<EmailVerification />} />
      <Route path="/guideInfo" element={<GuideInfoPage />} />
    </Routes>
  );
};

export default AppRoutes;
