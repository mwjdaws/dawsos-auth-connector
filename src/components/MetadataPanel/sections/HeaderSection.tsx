
import React from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderSectionProps {
  needsExternalReview: boolean;
  handleRefresh: () => void;
  isLoading: boolean;
  isCollapsible: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

/**
 * Header section for the metadata panel with refresh and collapse controls
 */
export const HeaderSection: React.FC<HeaderSectionProps> = ({
  needsExternalReview,
  handleRefresh,
  isLoading,
  isCollapsible,
  isCollapsed,
  setIsCollapsed
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">Metadata</h2>
        {needsExternalReview && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">External source needs review</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh metadata</span>
        </Button>
        
        {isCollapsible && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isCollapsed ? 'Expand metadata' : 'Collapse metadata'}
            </span>
          </Button>
        )}
      </div>
    </CardHeader>
  );
};
