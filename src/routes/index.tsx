
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const AuthPage = lazy(() => import("@/pages/Auth"));
const IndexPage = lazy(() => import("@/pages/Index"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const MarkdownViewerPage = lazy(() => import("@/pages/MarkdownViewerPage"));
const CreateKnowledgePage = lazy(() => import("@/pages/CreateKnowledgePage"));

// Loading fallback for Suspense
const PageLoader = () => (
  <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/viewer/:id" 
          element={
            <ProtectedRoute>
              <MarkdownViewerPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <CreateKnowledgePage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
