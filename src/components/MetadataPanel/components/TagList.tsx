
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/types/tag';

interface TagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (tagId: string) => Promise<void>;
  onReorderTags?: (tags: Tag[]) => Promise<void>;
}

/**
 * Displays a list of tags with delete functionality if editable
 */
export const TagList: React.FC<TagListProps> = ({
  tags,
  editable,
  onDeleteTag,
  onReorderTags
}) => {
  if (tags.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No tags available</p>
    );
  }
  
  // Sort tags by display_order if available
  const sortedTags = [...tags].sort((a, b) => {
    const orderA = a.display_order ?? 0;
    const orderB = b.display_order ?? 0;
    return orderA - orderB;
  });
  
  return (
    <div className="flex flex-wrap gap-2">
      {sortedTags.map((tag) => (
        <Badge 
          key={tag.id} 
          variant="secondary"
          className="flex items-center gap-1"
        >
          {tag.name}
          {editable && (
            <button 
              onClick={() => onDeleteTag(tag.id)}
              className="text-muted-foreground hover:text-foreground ml-1"
              aria-label={`Remove tag ${tag.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
};
