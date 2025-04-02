
import React from 'react';
import { ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HeaderSectionProps {
  contentId: string;
  title?: string;
  isPublished?: boolean;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  isLoading?: boolean;
  hasValidationErrors?: boolean;
  onToggleCollapse?: () => void;
  onRefresh?: () => void;
}

export function HeaderSection({
  contentId,
  title = 'Metadata',
  isPublished,
  isCollapsible = false,
  isCollapsed = false,
  isLoading = false,
  hasValidationErrors = false,
  onToggleCollapse,
  onRefresh
}: HeaderSectionProps) {
  return (
    <Card className="border-b rounded-t-lg rounded-b-none">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {title}
            {isPublished && (
              <Badge variant="outline" className="ml-2">Published</Badge>
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            {onRefresh && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRefresh}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh</span>
              </Button>
            )}
            
            {isCollapsible && onToggleCollapse && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleCollapse}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className={`h-4 w-4 ${isCollapsed ? 'rotate-180' : ''}`} />
                <span className="sr-only">
                  {isCollapsed ? 'Expand' : 'Collapse'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {hasValidationErrors && (
        <Alert variant="destructive" className="mx-4 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Some metadata fields have validation errors.
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
