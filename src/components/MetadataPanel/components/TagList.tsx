
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
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
  const handleDelete = async (tag: Tag) => {
    if (!editable) return;
    await onDeleteTag(tag.id);
  };

  const handleReorder = async (reorderedTags: Tag[]) => {
    if (onReorderTags) {
      await onReorderTags(reorderedTags);
    }
  };

  if (tags.length === 0) {
    return <p className="text-sm text-muted-foreground">No tags added yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge 
          key={tag.id} 
          variant="outline" 
          className="gap-1 pr-1 pl-3 py-1"
        >
          <span className="mr-1">{tag.name}</span>
          {editable && (
            <button
              type="button"
              onClick={() => handleDelete(tag)}
              className="h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center"
              aria-label={`Remove ${tag.name} tag`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
};

export default TagList;
