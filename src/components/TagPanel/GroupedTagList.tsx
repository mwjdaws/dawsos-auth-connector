
import React, { useState } from 'react';
import { Tag } from '@/types/tag';
import { TagItem } from './TagItem';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagGroup {
  type: string | null;
  typeId: string | null;
  tags: Tag[];
}

interface GroupedTagListProps {
  tagGroups: TagGroup[];
  editable?: boolean;
  onTagClick?: (tag: Tag) => void;
  onTagDelete?: (tagId: string) => void;
  className?: string;
}

export function GroupedTagList({
  tagGroups,
  editable = false,
  onTagClick,
  onTagDelete,
  className
}: GroupedTagListProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  // Toggle group collapse state
  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Check if a group is collapsed
  const isGroupCollapsed = (groupId: string) => {
    return !!collapsedGroups[groupId];
  };

  // Render a single tag item
  const renderTagItem = (tag: Tag) => {
    return (
      <TagItem
        key={tag.id}
        tag={tag}
        editable={editable}
        onTagClick={onTagClick}
        onTagDelete={onTagDelete}
      />
    );
  };

  // Render a group header
  const renderGroupHeader = (group: TagGroup) => {
    const groupId = group.typeId || 'ungrouped';
    const isCollapsed = isGroupCollapsed(groupId);
    
    return (
      <div 
        className="flex items-center py-1 px-2 rounded-sm hover:bg-muted/50 cursor-pointer"
        onClick={() => toggleGroupCollapse(groupId)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
        )}
        <span className="text-sm font-medium">{group.type || 'Other Tags'}</span>
        <span className="ml-1 text-xs text-muted-foreground">({group.tags.length})</span>
      </div>
    );
  };

  // Render a group and its tags
  const renderGroup = (group: TagGroup, index: number) => {
    const groupId = group.typeId || 'ungrouped';
    const isCollapsed = isGroupCollapsed(groupId);
    
    return (
      <div key={groupId || index} className="mb-2">
        {renderGroupHeader(group)}
        {!isCollapsed && (
          <div className="pl-6 mt-1 flex flex-wrap gap-2">
            {group.tags.map(tag => renderTagItem(tag))}
          </div>
        )}
      </div>
    );
  };

  // If there are no tag groups, render a message
  if (!tagGroups || tagGroups.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground mt-2", className)}>
        No tags available
      </div>
    );
  }

  // For a single group with no type, render tags directly without a header
  if (tagGroups.length === 1 && tagGroups[0].type === null) {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {tagGroups[0].tags.map(tag => renderTagItem(tag))}
      </div>
    );
  }

  // Render all groups
  return (
    <div className={cn("", className)}>
      {tagGroups.map(renderGroup)}
    </div>
  );
}

export default GroupedTagList;
