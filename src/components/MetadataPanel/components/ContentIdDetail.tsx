
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Info, Copy } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { cn } from '@/lib/utils';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

interface ContentIdDetailProps {
  contentId: string;
  className?: string;
}

/**
 * ContentIdDetail Component
 * 
 * Displays the content ID with copy functionality and validation status
 */
export function ContentIdDetail({ contentId, className }: ContentIdDetailProps) {
  const isValid = isValidContentId(contentId);
  
  // Format the ID for display (truncate if needed)
  const formattedId = contentId && contentId.length > 12
    ? `${contentId.substring(0, 8)}...${contentId.substring(contentId.length - 4)}`
    : contentId;
  
  return (
    <div className={cn("flex items-center text-xs text-muted-foreground space-x-1", className)}>
      <span>ID:</span>
      <div className="flex items-center space-x-1">
        <span className={cn(
          "font-mono",
          !isValid && "text-destructive"
        )}>
          {formattedId || 'None'}
        </span>
        
        {contentId && (
          <CopyButton
            value={contentId}
            size="sm"
            variant="ghost"
            className="h-4 w-4 p-0"
            showToast={true}
            toastMessage="Content ID copied to clipboard"
          />
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                <Info className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {isValid 
                  ? "Valid content ID format" 
                  : "Invalid content ID format"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
