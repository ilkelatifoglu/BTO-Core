import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';  // Ensure LoginPage is exported correctly
import DashboardPage from '../pages/DashboardPage';  // Ensure DashboardPage is exported correctly
import NotFound from '../pages/NotFound';  // Ensure NotFound is exported correctly

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;  // Ensure it's default exported
