
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag } from '@/types/tag';

export interface TagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (tagId: string) => Promise<void>;
  onReorderTags?: (tags: Tag[]) => Promise<void>;
}

export const TagList: React.FC<TagListProps> = ({ 
  tags, 
  editable, 
  onDeleteTag,
  onReorderTags 
}) => {
  // Safety check for null/undefined tags
  if (!tags || tags.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No tags added yet.
      </div>
    );
  }

  const handleDeleteTag = async (tagId: string) => {
    if (editable) {
      await onDeleteTag(tagId);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="flex items-center gap-1 py-1"
        >
          <span>{tag.name}</span>
          {editable && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-2"
              onClick={() => handleDeleteTag(tag.id)}
              aria-label={`Remove tag ${tag.name}`}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Badge>
      ))}
    </div>
  );
};
