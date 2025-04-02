
import React, { useState } from "react";
import { SyntheticEvent } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { handleError, ErrorLevel, ErrorSource } from "@/utils/errors";

/**
 * Props for the DashboardHeader component
 */
export interface DashboardHeaderProps {
  isRefreshingStats: boolean;
  setIsRefreshingStats: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * DashboardHeader component that displays the header for the dashboard page
 * and provides controls for refreshing statistics
 */
export function DashboardHeader({
  isRefreshingStats,
  setIsRefreshingStats
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  /**
   * Handle refresh button click to update statistics
   */
  const handleRefreshStats = async (e: SyntheticEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to refresh statistics",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsRefreshingStats(true);
      
      // Simulate refreshing stats for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLastRefresh(new Date());
      toast({
        title: "Statistics Refreshed",
        description: "Your dashboard statistics have been updated",
      });
    } catch (error) {
      handleError(error, {
        message: "Failed to refresh statistics",
        level: ErrorLevel.Error,
        source: ErrorSource.Component
      });
    } finally {
      setIsRefreshingStats(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your content, tags, and more
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {lastRefresh && (
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshStats}
          disabled={isRefreshingStats}
          className="flex items-center gap-2"
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshingStats ? 'animate-spin' : ''}`} />
          Refresh Stats
        </Button>
      </div>
    </div>
  );
}
