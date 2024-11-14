// src/App.js
import React from 'react';

import './App.css';
import 'primeicons/primeicons.css'; // Assuming you will use PrimeIcons for icons 
import 'primeflex/primeflex.css'; // Assuming you will use PrimeFlex for layout
import 'primereact/resources/primereact.min.css';   // Core CSS
import 'primereact/resources/themes/saga-blue/theme.css';  // Theme CSS (choose your theme)

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';  // uses AppRoutes to handle all route definitions

function App() {
  return (
    <Router>
        <AppRoutes />  
    </Router>
  );
}

export default App;
