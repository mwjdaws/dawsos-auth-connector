
import React from 'react';
import { RefreshCw, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface HeaderSectionProps {
  title: string;
  handleRefresh?: () => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
  isCollapsed: boolean;
  needsExternalReview?: boolean;
  className?: string;
}

export function HeaderSection({
  title,
  handleRefresh,
  setIsCollapsed,
  isCollapsed,
  needsExternalReview = false,
  className
}: HeaderSectionProps) {
  return (
    <Card className={cn("mb-4", className)}>
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <CardTitle className="text-lg font-medium">
            {title}
          </CardTitle>
          {needsExternalReview && (
            <div className="ml-2 tooltip" data-tip="External source has been updated">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {handleRefresh && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleRefresh}
              aria-label="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

export default HeaderSection;
