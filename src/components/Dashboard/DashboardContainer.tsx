
import { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import DebugPanel from "@/components/DebugPanel";
import { DashboardUserInfo } from "@/components/Dashboard/DashboardUserInfo";

interface DashboardContainerProps {
  user: any;
  showDebug: boolean;
  setShowDebug: (value: boolean) => void;
  children: ReactNode;
}

export function DashboardContainer({ 
  user, 
  showDebug, 
  setShowDebug, 
  children 
}: DashboardContainerProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardUserInfo 
          user={user} 
          showDebug={showDebug} 
          setShowDebug={setShowDebug} 
        />
      </div>
      
      {showDebug && (
        <div className="mb-8">
          <DebugPanel />
        </div>
      )}
      
      <ErrorBoundary fallback={
        <div className="p-6 border border-red-300 bg-red-50 rounded-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Dashboard Error</h2>
          <p className="mb-4 text-red-700">There was an error loading the dashboard components.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md"
          >
            Reload Page
          </button>
        </div>
      }>
        {children}
      </ErrorBoundary>
    </div>
  );
}
