
import React from "react";

interface DashboardUserInfoProps {
  user: any;
  showDebug: boolean;
  setShowDebug: (value: boolean) => void;
}

export function DashboardUserInfo({ user, showDebug, setShowDebug }: DashboardUserInfoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-muted-foreground mr-2">
        {user ? (
          <span>Logged in as: {user.email}</span>
        ) : (
          <span>Not authenticated (RLS policies may limit data access)</span>
        )}
      </div>
      <button 
        onClick={() => setShowDebug(!showDebug)}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {showDebug ? "Hide Debug Panel" : "Show Debug Panel"}
      </button>
    </div>
  );
}
