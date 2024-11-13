// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';  // uses AppRoutes to handle all route definitions

function App() {
  return (
    <Router>
      <AppRoutes />  {/* Use the AppRoutes component here */}
    </Router>
  );
}

export default App;
