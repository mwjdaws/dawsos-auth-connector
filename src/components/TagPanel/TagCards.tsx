
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useTagGroups } from "./hooks/useTagGroups";
import { TagCardsList } from "./TagCardsList";
import { TagCardsLoading } from "./TagCardsLoading";
import { TagCardsEmpty } from "./TagCardsEmpty";
import { TagCardsError } from "./TagCardsError";

interface TagCardsProps {
  title?: string;
  tags?: string[];
  onTagClick?: (tag: string) => void;
}

export function TagCards({ title, tags, onTagClick }: TagCardsProps) {
  const { tagGroups, isLoading, error, handleRefresh } = useTagGroups();

  // If we have explicit tags provided, use those instead of fetched groups
  if (tags && title) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
              onClick={() => onTagClick?.(tag)}
              style={{ cursor: onTagClick ? 'pointer' : 'default' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

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
