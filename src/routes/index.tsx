
import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage, AuthPage, NotFoundPage } from "@/pages";
import ProtectedRoute from "@/components/ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/" 
        element={<HomePage />} 
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
