
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CopyButton } from '@/components/ui/copy-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useContentIdValidation } from '@/hooks/validation/useContentIdValidation';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface ContentIdDetailProps {
  contentId: string;
  isLoading?: boolean;
  showCopyButton?: boolean;
  onCopy?: () => void;
  className?: string;
}

/**
 * Component to display content ID with optional validation information
 */
export function ContentIdDetail({
  contentId,
  isLoading = false,
  showCopyButton = true,
  onCopy,
  className = ''
}: ContentIdDetailProps) {
  // Validate content ID
  const {
    isValid,
    isUuid,
    isTemporary,
    errorMessage
  } = useContentIdValidation();
  
  // Set validity based on user validation
  const validationResult = isValid ? isContentIdValidation(contentId) : null;
  
  // Format ID for display
  const formattedId = formatContentId(contentId);
  
  // Determine status badge
  const statusBadge = getStatusBadge(isValid, isTemporary, isUuid);
  
  if (isLoading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium mb-1 flex items-center">
              Content ID {statusBadge}
              {errorMessage && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-destructive ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{errorMessage}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="text-sm font-mono text-muted-foreground break-all">
              {formattedId}
            </div>
          </div>
          
          {showCopyButton && (
            <CopyButton 
              value={contentId} 
              onCopy={onCopy}
              size="sm"
              variant="ghost"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to check if the content ID is valid
function isContentIdValidation(contentId: string): boolean {
  // Simple validation - check if string is not empty
  return Boolean(contentId && contentId.trim() !== '');
}

// Helper to format content ID for display
function formatContentId(contentId: string): string {
  if (!contentId) return 'No ID provided';
  
  // If it's a UUID, format it with hyphens for readability
  if (contentId.length === 32 && !contentId.includes('-')) {
    return [
      contentId.slice(0, 8),
      contentId.slice(8, 12),
      contentId.slice(12, 16),
      contentId.slice(16, 20),
      contentId.slice(20)
    ].join('-');
  }
  
  return contentId;
}

// Helper to determine status badge
function getStatusBadge(isValid: boolean, isTemporary?: boolean, isUuid?: boolean) {
  if (!isValid) {
    return <Badge variant="destructive" className="ml-2 text-xs">Invalid</Badge>;
  }
  
  if (isTemporary) {
    return <Badge variant="secondary" className="ml-2 text-xs">Temporary</Badge>;
  }
  
  if (isUuid) {
    return <Badge variant="default" className="ml-2 text-xs">UUID</Badge>;
  }
  
  return null;
}

export default ContentIdDetail;
