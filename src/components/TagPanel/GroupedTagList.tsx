
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TagCard } from "./TagCard";
import { safeCallback } from "@/utils/compatibility";

export interface GroupedTagListProps {
  tags: Array<{ id: string; name: string; type_id?: string | null; type_name?: string | null }>;
  isLoading?: boolean;
  onTagClick?: (tag: string) => void;
  refreshTrigger?: number;
}

/**
 * Displays tags grouped by their types with a clean, organized layout
 */
export function GroupedTagList({
  tags,
  isLoading = false,
  onTagClick,
  refreshTrigger = 0
}: GroupedTagListProps) {
  // Group tags by their type
  const groupedTags = useMemo(() => {
    if (!tags || tags.length === 0) {
      return {
        typedTags: {},
        uncategorized: []
      };
    }
    
    const safeTagClickHandler = safeCallback(onTagClick, () => {});
    
    return tags.reduce(
      (result, tag) => {
        const tagName = tag.name;
        
        if (tag.type_id) {
          const typeName = tag.type_name || tag.type_id;
          if (!result.typedTags[typeName]) {
            result.typedTags[typeName] = [];
          }
          result.typedTags[typeName].push(tagName);
        } else {
          result.uncategorized.push(tagName);
        }
        
        return result;
      },
      { typedTags: {}, uncategorized: [] as string[] }
    );
  }, [tags, refreshTrigger, onTagClick]);
  
  // Create a safe click handler
  const handleTagClick = useMemo(() => {
    return safeCallback(onTagClick, () => {});
  }, [onTagClick]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!tags || tags.length === 0) {
    return (
      <div className="text-muted-foreground text-sm italic">
        No tags available.
      </div>
    );
  }
  
  // Render grouped tags
  return (
    <div className="space-y-4">
      {/* Render typed tags */}
      {Object.keys(groupedTags.typedTags).map(
        (typeKey) => (
          <TagCard
            key={typeKey}
            title={typeKey}
            tags={groupedTags.typedTags[typeKey] || []}
            onTagClick={handleTagClick}
          />
        )
      )}
      
      {/* Render uncategorized tags */}
      {groupedTags.uncategorized && groupedTags.uncategorized.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">General</h3>
          <div className="flex flex-wrap gap-1">
            {groupedTags.uncategorized.map(
              (tagName) => (
                <Badge
                  key={tagName}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleTagClick(tagName)}
                >
                  {tagName}
                </Badge>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
