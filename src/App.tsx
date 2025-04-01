
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { QueryProvider } from './providers/QueryProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ui/use-toast-primitive';
import { clearToasts, useToast } from './hooks/use-toast';

/**
 * RouteChangeHandler component to clear toasts on route changes
 */
const RouteChangeHandler = () => {
  const location = useLocation();
  const { dismiss } = useToast();
  
  useEffect(() => {
    // Clear toasts when the route changes
    dismiss();
    console.log('Route changed, toasts cleared');
  }, [location, dismiss]);
  
  return null;
};

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

// The BrowserRouter contents
const AppContent = () => (
  <>
    <RouteChangeHandler />
    <AppRoutes />
    <Toaster />
  </>
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
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <Suspense fallback={<LoadingFallback />}>
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </Suspense>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;
