
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, History } from "lucide-react";

interface ItemActionsProps {
  itemId: string;
  itemTitle: string;
  needsReview: boolean;
  hasExternalSource: boolean;
  isRefreshing: boolean;
  onValidateSource: (id: string) => Promise<void>;
  onToggleReviewFlag: (id: string, currentValue: boolean) => Promise<void>;
  onViewHistory: (id: string, title: string) => void;
}

export function ItemActions({
  itemId,
  itemTitle,
  needsReview,
  hasExternalSource,
  isRefreshing,
  onValidateSource,
  onToggleReviewFlag,
  onViewHistory
}: ItemActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onToggleReviewFlag(itemId, needsReview)}
      >
        {needsReview ? "Mark as Reviewed" : "Flag for Review"}
      </Button>
      
      {hasExternalSource && (
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => onValidateSource(itemId)}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            "Validate URL"
          )}
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewHistory(itemId, itemTitle)}
      >
        <History className="h-4 w-4 mr-1" />
        View History
      </Button>
    </div>
  );
}
