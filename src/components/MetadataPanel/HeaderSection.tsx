
import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface HeaderSectionProps {
  needsExternalReview: boolean;
  handleRefresh: () => void;
  isLoading: boolean;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  needsExternalReview,
  handleRefresh,
  isLoading
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="flex items-center gap-2">
        <CardTitle>Content Metadata</CardTitle>
        {needsExternalReview && (
          <div className="flex items-center text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Needs Review</span>
          </div>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        <span className="sr-only">Refresh</span>
      </Button>
    </CardHeader>
  );
};
