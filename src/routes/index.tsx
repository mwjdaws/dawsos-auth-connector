
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from "@/components/ui/skeleton";

const PageFallback = () => (
  <div className="container mx-auto p-4">
    <Skeleton className="h-8 w-64 mb-4" />
    <Skeleton className="h-32 w-full mb-4" />
    <Skeleton className="h-32 w-full" />
  </div>
);

// Pages
import { NotFound, Index } from '@/pages';
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MarkdownViewerPage = lazy(() => import('@/pages/MarkdownViewerPage'));

export function AppRoutes() {
  const { isLoading } = useAuth();

  // Show nothing while checking authentication status
  if (isLoading) {
    return <PageFallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route 
        path="/auth" 
        element={
          <Suspense fallback={<PageFallback />}>
            <Auth />
          </Suspense>
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageFallback />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />
      
      {/* Add MarkdownViewer page */}
      <Route 
        path="/markdown-viewer" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageFallback />}>
              <MarkdownViewerPage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
