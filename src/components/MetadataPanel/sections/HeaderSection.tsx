
import React from 'react';
import { ChevronDown, ChevronUp, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderSectionProps {
  title?: string;
  lastUpdated?: string;
  handleRefresh: () => void;
  setIsCollapsed: (value: boolean) => void;
  isCollapsed: boolean;
  needsExternalReview: boolean;
  isLoading?: boolean;
}

export function HeaderSection({
  title = "Metadata",
  lastUpdated,
  handleRefresh,
  setIsCollapsed,
  isCollapsed,
  needsExternalReview = false,
  isLoading = false
}: HeaderSectionProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {needsExternalReview && (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Review Required</span>
          </Badge>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          aria-label="Refresh metadata"
          className="h-8 w-8 p-0"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle panel"
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
