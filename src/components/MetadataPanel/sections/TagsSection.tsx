
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TagList } from '../components/TagList';
import { Tag } from '@/types/tag';

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onReorderTags?: (tags: Tag[]) => Promise<void>;
  onMetadataChange?: () => void;
  className?: string;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  contentId,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  onReorderTags,
  onMetadataChange = () => {},
  className = "",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTag(null);
      if (onMetadataChange) onMetadataChange();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Create a handler that only calls onReorderTags if it exists
  const handleReorderTags = async (tagsToReorder: Tag[]): Promise<void> => {
    if (onReorderTags) {
      await onReorderTags(tagsToReorder);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">Tags</h3>

      {editable && (
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={newTag}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag..."
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newTag.trim() || isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </form>
      )}

      <TagList 
        tags={tags} 
        editable={editable} 
        onDeleteTag={onDeleteTag} 
        onReorderTags={onReorderTags ? handleReorderTags : undefined}
      />
    </div>
  );
};

export default TagsSection;
