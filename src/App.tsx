import React, { Suspense } from 'react';
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

// Simple fallback for loading states
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2">Loading application...</h2>
      <p className="text-muted-foreground">Please wait while we set things up</p>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="max-w-md p-6 bg-destructive/10 rounded-lg">
      <h2 className="text-xl font-semibold text-destructive mb-2">Something went wrong</h2>
      <p className="mb-4 text-muted-foreground">
        {error.message || "An unknown error occurred while loading the application"}
      </p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

// Keep App.tsx as minimal as possible to avoid potential issues
function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <BrowserRouter>
              <AppRoutes />
              <Toaster />
            </BrowserRouter>
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
