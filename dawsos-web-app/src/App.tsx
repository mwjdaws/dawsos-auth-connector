
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages';
import { Navbar } from './components';
import { AuthProvider } from '../src/context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../src/components/ui/toaster";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
