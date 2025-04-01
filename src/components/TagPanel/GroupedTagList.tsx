
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, TagGroup } from '@/types/tag';
import { TagPosition } from '@/types/validation';
import { sortTagsByDisplayOrder } from '@/utils/tag-utils';

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
        
        return (
          <Card key={group.name || 'default'} className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-md">
                {group.name || (group.category ? `${group.category} Tags` : 'Other Tags')}
              </CardTitle>
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
