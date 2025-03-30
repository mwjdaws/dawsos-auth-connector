import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client with properly configured error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Use meta for error handling instead of onError
      meta: {
        handleError: true
      }
    },
    mutations: {
      // Use meta for error handling instead of onError
      meta: {
        handleError: true
      }
    }
  },
});

// Keep App.tsx as minimal as possible to avoid potential issues
function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
