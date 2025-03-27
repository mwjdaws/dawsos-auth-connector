
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const AuthPage = lazy(() => import("@/pages/Auth"));
const IndexPage = lazy(() => import("@/pages/Index"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const MarkdownViewerPage = lazy(() => import("@/pages/MarkdownViewerPage"));
const CreateKnowledgePage = lazy(() => import("@/pages/CreateKnowledgePage"));

export function AppRoutes() {
  return (
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
  );
}
