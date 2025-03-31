
import React from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderSectionProps {
  needsExternalReview: boolean;
  handleRefresh: () => void;
  isLoading: boolean;
  isCollapsible: boolean;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

/**
 * Header section for the MetadataPanel with refresh and collapse controls
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
    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
      <div className="flex items-center gap-2">
        <CardTitle className="text-sm font-medium">Content Metadata</CardTitle>
        {needsExternalReview && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Needs Review
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
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
              {isCollapsed ? 'Expand panel' : 'Collapse panel'}
            </span>
          </Button>
        )}
      </div>
    </CardHeader>
  );
};
