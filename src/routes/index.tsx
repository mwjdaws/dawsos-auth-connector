
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

// Pages
import { NotFound, Index } from '@/pages';
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MarkdownViewerPage = lazy(() => import('@/pages/MarkdownViewerPage'));

export function AppRoutes() {
  const { isLoading } = useAuth();

  // Show nothing while checking authentication status
  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Add MarkdownViewer page */}
      <Route 
        path="/markdown-viewer" 
        element={
          <ProtectedRoute>
            <MarkdownViewerPage />
          </ProtectedRoute>
        }
      />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
