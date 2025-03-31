
import React from 'react';
import { RefreshCw, Flag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { validateExternalSource, markForExternalReview, clearExternalReviewFlag } from '@/services/supabase/external-source-validator';

interface ExternalSourceControlsProps {
  contentId: string;
  onValidate?: () => void;
  onToggleReviewFlag?: () => void;
  needsReview?: boolean;
}

export function ExternalSourceControls({ 
  contentId, 
  onValidate, 
  onToggleReviewFlag,
  needsReview = false
}: ExternalSourceControlsProps) {
  const [isValidating, setIsValidating] = React.useState(false);
  
  const handleValidate = async () => {
    setIsValidating(true);
    try {
      await validateExternalSource(contentId);
      if (onValidate) {
        onValidate();
      }
    } catch (error) {
      console.error('Failed to validate external source:', error);
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleToggleReviewFlag = async () => {
    try {
      if (needsReview) {
        await clearExternalReviewFlag(contentId);
      } else {
        await markForExternalReview(contentId);
      }
      if (onToggleReviewFlag) {
        onToggleReviewFlag();
      }
    } catch (error) {
      console.error('Failed to toggle review flag:', error);
    }
  };
  
  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleValidate}
              disabled={isValidating}
            >
              <RefreshCw className={`h-4 w-4 ${isValidating ? "animate-spin" : ""}`} />
              <span className="sr-only">Validate external source</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Validate external source</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleReviewFlag}
            >
              {needsReview ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Flag className="h-4 w-4 text-amber-600" />
              )}
              <span className="sr-only">
                {needsReview ? "Clear review flag" : "Mark for review"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{needsReview ? "Clear review flag" : "Mark for review"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
