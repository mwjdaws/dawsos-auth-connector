
import React from 'react';
import { RefreshCw, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export interface HeaderSectionProps {
  title?: string;
  needsExternalReview: boolean;
  handleRefresh: () => void;
  isCollapsible?: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isLoading?: boolean;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  title = 'Content Metadata',
  needsExternalReview,
  handleRefresh,
  isCollapsible = false,
  isCollapsed,
  setIsCollapsed,
  isLoading = false
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4">
      <div className="flex items-center space-x-2">
        {isCollapsible && (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-5 w-5"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
        <CardTitle className="text-md flex items-center space-x-2">
          <span>{title}</span>
          {needsExternalReview && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Needs Refresh</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The external source has been updated since last check</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardTitle>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRefresh}
        disabled={isLoading}
        className="h-7 w-7"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="sr-only">Refresh metadata</span>
      </Button>
    </CardHeader>
  );
};
