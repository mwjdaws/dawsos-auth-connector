
import React, { useState } from 'react';
import { Tag } from '@/types/tag';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TagList } from '../components/TagList';

export interface TagsSectionProps {
  tags: Tag[];
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onReorderTags?: (reorderedTags: Tag[]) => Promise<void>;
  editable?: boolean;
  isAddingTag?: boolean;
  isDeletingTag?: boolean;
  isReordering?: boolean;
}

export function TagsSection({
  tags,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  onReorderTags,
  editable = false,
  isAddingTag = false,
  isDeletingTag = false,
  isReordering = false
}: TagsSectionProps) {
  const [selectedTagType, setSelectedTagType] = useState<string | null>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isAddingTag && newTag.trim()) {
      e.preventDefault();
      onAddTag(selectedTagType);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Tags</h3>
      
      {editable && (
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAddingTag}
              className="text-sm"
            />
          </div>
          
          <Button
            onClick={() => onAddTag(selectedTagType)}
            disabled={!newTag.trim() || isAddingTag}
            size="sm"
          >
            {isAddingTag ? 'Adding...' : 'Add'}
          </Button>
        </div>
      )}
      
      <TagList 
        tags={tags} 
        editable={editable} 
        onDeleteTag={onDeleteTag}
        onReorderTags={onReorderTags}
      />
      
      {isDeletingTag && (
        <div className="text-xs text-muted-foreground">
          Removing tag...
        </div>
      )}
      
      {isReordering && (
        <div className="text-xs text-muted-foreground">
          Saving new tag order...
        </div>
      )}
    </div>
  );
}
