
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages';
import { Navbar } from './components';
import { AuthProvider } from '../src/context/AuthContext';
import { Toaster } from "../src/components/ui/toaster";

/**
 * Main App component for the DAWSOS web application
 */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes as needed */}
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
