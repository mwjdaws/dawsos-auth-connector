
import React from "react";
import { Badge } from "@/components/ui/badge";
import { LoadingState, ErrorState } from "@/components/ui/shared-states";

interface TagListProps {
  tags: { name: string; id?: string }[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  knowledgeSourceId?: string;
  onTagClick?: (tag: string) => void;
}

export function TagList({ 
  tags, 
  isLoading, 
  error, 
  onRetry,
  knowledgeSourceId,
  onTagClick
}: TagListProps) {
  if (isLoading) {
    return <LoadingState variant="skeleton" text="Loading tags..." />;
  }
  
  if (error) {
    return (
      <ErrorState 
        error={error} 
        title="Failed to load tags" 
        retry={onRetry} 
      />
    );
  }
  
  if (!tags.length) {
    return (
      <div className="p-4 text-center border rounded-md bg-background">
        <p className="text-muted-foreground">No tags generated yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Generated Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge 
            key={tag.id || index}
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
            onClick={() => onTagClick?.(tag.name)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
      
      {knowledgeSourceId && (
        <p className="text-xs text-muted-foreground">
          Source ID: {knowledgeSourceId}
        </p>
      )}
    </div>
  );
}
