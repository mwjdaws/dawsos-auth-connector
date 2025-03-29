
import React from "react";
import { AlertCircle, Bug } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Bug size={16} />
              {showDebug ? "Hide Debug Panel" : "Show Debug Panel"}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle the Debug Panel to explore database entries and check system health</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
