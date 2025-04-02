
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeaderSectionProps {
  title: string;
  handleRefresh: () => void;
  setIsCollapsed: (value: boolean) => void;
  isCollapsed: boolean;
  needsExternalReview: boolean;
}

export function HeaderSection({
  title,
  handleRefresh,
  setIsCollapsed,
  isCollapsed,
  needsExternalReview
}: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {needsExternalReview && (
          <Badge variant="warning">Review Required</Badge>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          aria-label="Refresh metadata"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle panel"
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

export default HeaderSection;
