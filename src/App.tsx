
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import Navigation from "@/components/Navigation";
import { AppRoutes } from "@/routes";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingFallback = () => (
  <div className="min-h-screen p-4">
    <div className="max-w-7xl mx-auto">
      <Skeleton className="h-16 w-full mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthProvider>
        <Router>
          <Navigation />
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
