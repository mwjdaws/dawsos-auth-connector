
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DraggableTagList from '../components/DraggableTagList';
import { Tag } from '@/types';
import { TagPosition } from '@/utils/validation/types';
import { useTagReordering } from '@/hooks/metadata/useTagReordering';

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
  onMetadataChange: () => void;
  className?: string;
}

export function TagsSection({
  tags,
  contentId,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  onMetadataChange,
  className
}: TagsSectionProps) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  // Use the tag reordering hook
  const { reorderTags, isReordering } = useTagReordering({
    contentId,
    onMetadataChange
  });

  // Handle tag reordering
  const handleReorderTags = async (reorderedTags: TagPosition[]) => {
    if (!editable || !contentId) return;
    
    await reorderTags(reorderedTags);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Tags</h3>
      
      <DraggableTagList
        tags={tags}
        onTagClick={() => {}}
        onTagDelete={editable ? onDeleteTag : undefined}
        onTagsReordered={editable ? handleReorderTags : undefined}
        isReordering={isReordering}
      />
      
      {editable && (
        <div className={`flex items-center gap-2 mt-2 ${isInputFocused ? 'opacity-100' : 'opacity-80'}`}>
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Add a tag..."
            className="h-8 text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTag}
            disabled={!newTag.trim()}
            className="h-8 w-8 p-0"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
