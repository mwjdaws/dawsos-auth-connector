
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface ExternalSourceControlsProps {
  contentId: string;
  onValidate: () => void;
  onToggleReviewFlag: () => void;
  needsReview: boolean;
}

/**
 * Controls for validating and managing external source metadata
 */
export const ExternalSourceControls: React.FC<ExternalSourceControlsProps> = ({
  contentId,
  onValidate,
  onToggleReviewFlag,
  needsReview
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs h-8"
        onClick={onValidate}
      >
        <CheckCircle className="mr-1 h-3 w-3" />
        Validate Source
      </Button>
      
      <Button 
        variant={needsReview ? "default" : "outline"} 
        size="sm" 
        className={`text-xs h-8 ${needsReview ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
        onClick={onToggleReviewFlag}
      >
        <AlertTriangle className="mr-1 h-3 w-3" />
        {needsReview ? "Clear Review Flag" : "Mark for Review"}
      </Button>
    </div>
  );
};
