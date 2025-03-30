
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Configure QueryClient with proper error handling
 * 
 * This creates a client with appropriate default settings for:
 * - Retry limits for failed requests
 * - Window focus refetching behavior
 * - Standard error handling via metadata
 */
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

/**
 * Loading fallback component displayed during suspense states
 */
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2">Loading application...</h2>
      <p className="text-muted-foreground">Please wait while we set things up</p>
    </div>
  </div>
);

/**
 * Error fallback component for top-level error boundary
 */
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

/**
 * Root App component
 * 
 * Provides global context providers and error boundaries
 * Keeps this component minimal to avoid potential issues at the root level
 */
function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary fallback={<ErrorFallback error={new Error("Application failed to load")} resetErrorBoundary={() => window.location.reload()} />}>
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
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
