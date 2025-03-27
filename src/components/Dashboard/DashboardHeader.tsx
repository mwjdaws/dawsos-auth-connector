
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderProps {
  contentId: string;
  isRefreshingStats: boolean;
  setIsRefreshingStats: (value: boolean) => void;
}

export function DashboardHeader({ 
  contentId, 
  isRefreshingStats, 
  setIsRefreshingStats 
}: DashboardHeaderProps) {
  const refreshTagStats = async () => {
    try {
      setIsRefreshingStats(true);
      const { error } = await supabase.rpc('refresh_tag_summary_view');
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Statistics Updated",
        description: "Tag usage statistics have been refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing tag statistics:", error);
      toast({
        title: "Error",
        description: "Failed to refresh tag statistics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingStats(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2">
        <TagSummaryWrapper />
      </div>
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Tag Statistics</CardTitle>
              <Button 
                onClick={refreshTagStats} 
                size="sm" 
                variant="outline"
                disabled={isRefreshingStats}
                className="h-8"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshingStats ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <p className="text-muted-foreground text-sm mb-4">
              The tag usage statistics are automatically updated on a schedule.
              The materialized view is refreshed using a Supabase Edge Function.
            </p>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Current Content ID: <span className="font-mono">{contentId}</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add a simple wrapper to handle the TagSummary's Suspense
function TagSummaryWrapper() {
  return <TagSummary />;
}

// Importing at the end to avoid circular dependencies
import { TagSummary } from "@/components/TagSummary";
