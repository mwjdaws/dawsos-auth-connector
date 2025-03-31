
/**
 * HeaderSection Component
 * 
 * Renders the header section of the MetadataPanel with title, refresh button, and optional
 * collapse/expand functionality. Also displays a visual indicator when content needs review.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";

export interface HeaderSectionProps {
  needsExternalReview?: boolean;
  handleRefresh?: () => void;
  isLoading?: boolean;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: (value: boolean) => void;
  className?: string;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  needsExternalReview = false,
  handleRefresh,
  isLoading = false,
  isCollapsible = false,
  isCollapsed = false,
  setIsCollapsed,
  className = ""
}) => {
  return (
    <CardHeader className={`flex flex-row items-center justify-between pb-2 ${className}`}>
      <div className="flex items-center gap-2">
        <CardTitle>Content Metadata</CardTitle>
        {needsExternalReview && (
          <div className="flex items-center text-yellow-600 dark:text-yellow-500">
            <AlertTriangle className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Needs Review</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isCollapsible && setIsCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-0 h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
        {handleRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        )}
      </div>
    </CardHeader>
  );
};
