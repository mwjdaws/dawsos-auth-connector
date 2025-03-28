
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useTagGroups } from "./hooks/useTagGroups";
import { TagCardsList } from "./TagCardsList";
import { TagCardsLoading } from "./TagCardsLoading";
import { TagCardsEmpty } from "./TagCardsEmpty";
import { TagCardsError } from "./TagCardsError";

export function TagCards() {
  const { tagGroups, isLoading, error, handleRefresh } = useTagGroups();

  if (isLoading) {
    return <TagCardsLoading />;
  }

  if (error) {
    return <TagCardsError error={error} onRetry={handleRefresh} />;
  }

  if (tagGroups.length === 0) {
    return <TagCardsEmpty onRefresh={handleRefresh} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      <TagCardsList tagGroups={tagGroups} />
    </div>
  );
}
