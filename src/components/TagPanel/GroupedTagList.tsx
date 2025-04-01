
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tag, TagGroup } from '@/types/tag';
import { GroupedTagListProps } from './types';

/**
 * Component for displaying tags grouped by tag type
 */
const GroupedTagList: React.FC<GroupedTagListProps> = ({
  tags,
  groups,
  editable = false,
  onTagClick,
  onTagDelete,
  isLoading = false,
  emptyMessage = 'No tags found'
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Toggle a group's expanded state
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Check if a group is expanded
  const isExpanded = (groupId: string) => {
    return expandedGroups[groupId] !== false; // Default to expanded
  };

  // If loading, show skeleton UI
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
      </div>
    );
  }

  // If no tags, show empty message
  if (!tags || tags.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {groups.map(group => {
        const groupTags = tags.filter(tag => 
          tag.type_id === group.id
        );

        if (groupTags.length === 0) return null;

        return (
          <div key={group.id} className="space-y-1">
            <div 
              className="flex items-center space-x-1 cursor-pointer" 
              onClick={() => toggleGroup(group.id)}
            >
              <h4 className="text-xs font-medium uppercase text-muted-foreground">
                {group.name}
              </h4>
              <span className="text-xs text-muted-foreground">({groupTags.length})</span>
            </div>

            {isExpanded(group.id) && (
              <div className="flex flex-wrap gap-1">
                {groupTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className={cn(
                      "flex items-center gap-1 py-1 px-2 cursor-pointer",
                      onTagClick && "hover:bg-primary/10"
                    )}
                    style={{
                      backgroundColor: tag.color ? `${tag.color}20` : undefined,
                      borderColor: tag.color || undefined
                    }}
                    onClick={() => onTagClick && onTagClick(tag)}
                  >
                    <span>{tag.name}</span>
                    {editable && onTagDelete && (
                      <XCircle
                        className="h-3 w-3 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTagDelete(tag.id);
                        }}
                      />
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupedTagList;
