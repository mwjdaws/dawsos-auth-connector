
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag } from '@/types/tag';
import { TagGroup } from './hooks/useTagGroups'; 

// Helper function to sort tags by display_order
function sortTagsByDisplayOrder(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => {
    // Default to 0 if display_order is not defined
    const orderA = a.display_order || 0;
    const orderB = b.display_order || 0;
    return orderA - orderB;
  });
}

interface GroupedTagListProps {
  tagGroups: TagGroup[];
  onTagClick?: (tag: string) => void;
  onTagDelete?: (tagId: string) => void;
  editable?: boolean;
  isLoading?: boolean;
  isDeletingTag?: boolean;
}

/**
 * GroupedTagList Component
 * 
 * Displays tags grouped by their categories or types.
 */
export function GroupedTagList({
  tagGroups,
  onTagClick,
  onTagDelete,
  editable = false,
  isLoading = false,
  isDeletingTag = false
}: GroupedTagListProps) {
  if (isLoading) {
    return <TagListSkeleton />;
  }

  if (!tagGroups || tagGroups.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-md">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground py-2">
            No tags have been added yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tagGroups.map((group) => {
        // Ensure we have tags in the group
        if (!group.tags || group.tags.length === 0) return null;
        
        // Sort tags by display order
        const sortedTags = sortTagsByDisplayOrder(group.tags);
        
        // Use group.name if available, or fallback to category-based naming
        const displayName = group.name || (group.category ? `${group.category} Tags` : 'Other Tags');
        
        return (
          <Card key={group.id} className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-md">{displayName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sortedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => onTagClick && onTagClick(tag.name)}
                  >
                    {tag.name}
                    {editable && onTagDelete && (
                      <button
                        className="ml-1 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTagDelete(tag.id);
                        }}
                        disabled={isDeletingTag}
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function TagListSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-14" />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-18" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
