
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/types/tag';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TagGroup, GroupedTagListProps } from './types';

/**
 * GroupedTagList Component
 * 
 * Displays tags grouped by type or category
 */
export function GroupedTagList({
  tags,
  groups,
  editable = false,
  onTagClick,
  onTagDelete,
  isLoading = false,
  emptyMessage = 'No tags found'
}: GroupedTagListProps) {
  // If no groups are provided or the groups array is empty, just render all tags
  if (!groups || groups.length === 0) {
    return (
      <div className="space-y-4">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : tags.length === 0 ? (
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                editable={editable}
                onTagClick={onTagClick}
                onTagDelete={onTagDelete}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Group tags by their type_id
  const tagsByGroup: Record<string, Tag[]> = {};
  
  // Initialize groups with empty arrays
  groups.forEach((group) => {
    tagsByGroup[group.id] = [];
  });
  
  // Add "Uncategorized" for tags without a type
  tagsByGroup["uncategorized"] = [];
  
  // Sort tags into their respective groups
  tags.forEach((tag) => {
    if (tag.type_id && tagsByGroup[tag.type_id]) {
      tagsByGroup[tag.type_id].push(tag);
    } else {
      tagsByGroup["uncategorized"].push(tag);
    }
  });

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          {/* Render each group */}
          {groups.map((group) => {
            const groupTags = tagsByGroup[group.id] || [];
            if (groupTags.length === 0) return null;
            
            return (
              <div key={group.id} className="space-y-2">
                <h3 className="text-sm font-medium">{group.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {groupTags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      editable={editable}
                      onTagClick={onTagClick}
                      onTagDelete={onTagDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Render uncategorized tags */}
          {tagsByGroup["uncategorized"].length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Uncategorized</h3>
              <div className="flex flex-wrap gap-2">
                {tagsByGroup["uncategorized"].map((tag) => (
                  <TagBadge
                    key={tag.id}
                    tag={tag}
                    editable={editable}
                    onTagClick={onTagClick}
                    onTagDelete={onTagDelete}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Show empty message if no tags */}
          {tags.length === 0 && (
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          )}
        </>
      )}
    </div>
  );
}

// Helper component for rendering individual tag badges
function TagBadge({
  tag,
  editable,
  onTagClick,
  onTagDelete
}: {
  tag: Tag;
  editable?: boolean;
  onTagClick?: (tag: Tag) => void;
  onTagDelete?: (tagId: string) => void;
}) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const handleClick = () => {
    if (onTagClick) onTagClick(tag);
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onTagDelete) return;
    
    setIsDeleting(true);
    try {
      await onTagDelete(tag.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Badge
      variant="secondary"
      className={`cursor-pointer flex items-center ${onTagClick ? 'hover:bg-gray-200' : ''}`}
      onClick={handleClick}
    >
      {tag.name}
      {editable && onTagDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-4 w-4 p-0 ml-1 hover:bg-gray-300 rounded-full"
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </Button>
      )}
    </Badge>
  );
}

// Export as both default and named export for compatibility
export default GroupedTagList;
