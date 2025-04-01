
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag, TagGroup } from '@/types/tag';
import { X, Tag as TagIcon, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GroupedTagListProps {
  tags: Tag[];
  groups: TagGroup[];
  editable?: boolean;
  onTagClick?: (tag: Tag) => void;
  onTagDelete?: (tagId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function GroupedTagList({
  tags,
  groups,
  editable = false,
  onTagClick,
  onTagDelete,
  isLoading = false,
  emptyMessage = "No tags available"
}: GroupedTagListProps) {
  // Helper to render a tag badge
  const renderTag = (tag: Tag) => (
    <div key={tag.id} className="flex items-center">
      <Badge
        variant={tag.color ? "outline" : "secondary"}
        className={cn(
          "mr-1 mb-1",
          tag.color && `border-${tag.color}-400 text-${tag.color}-600 bg-${tag.color}-50`,
          "hover:bg-accent cursor-pointer"
        )}
        onClick={() => onTagClick?.(tag)}
      >
        {tag.name}
        {editable && onTagDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              onTagDelete(tag.id);
            }}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag.name}</span>
          </Button>
        )}
      </Badge>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-wrap mt-1">
        {Array(4).fill(0).map((_, index) => (
          <Skeleton key={index} className="h-5 w-16 mr-1 mb-1 rounded-full" />
        ))}
      </div>
    );
  }

  // Show empty state
  if ((!tags || tags.length === 0) && (!groups || groups.length === 0)) {
    return (
      <div className="mt-2 text-sm text-muted-foreground">{emptyMessage}</div>
    );
  }

  // Determine if we should use groups or flat tags
  const useGroups = groups && groups.length > 0;
  const ungroupedTags = useGroups 
    ? tags.filter(tag => !groups.some(group => group.tags.some(t => t.id === tag.id)))
    : tags;

  return (
    <div className="mt-1">
      {/* Render grouped tags */}
      {useGroups && groups.map(group => (
        group.tags.length > 0 && (
          <div key={group.id} className="mb-2">
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <TagIcon className="h-3 w-3 mr-1" />
              <span>{group.name}</span>
            </div>
            <div className="flex flex-wrap">
              {group.tags.map(renderTag)}
            </div>
          </div>
        )
      ))}

      {/* Render ungrouped tags */}
      {ungroupedTags.length > 0 && (
        <div className={useGroups ? "mt-2" : "mt-1"}>
          {useGroups && (
            <div className="text-xs text-muted-foreground mb-1">
              <span>Other Tags</span>
            </div>
          )}
          <div className="flex flex-wrap">
            {ungroupedTags.map(renderTag)}
          </div>
        </div>
      )}
    </div>
  );
}
