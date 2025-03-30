
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckIcon, PlusIcon, TagIcon } from 'lucide-react';
import { Tag, TagsSectionProps } from '../types';
import { DraggableTagList } from '../components/DraggableTagList';
import { TagPosition } from '../hooks/tag-operations/types';

export function TagsSection({
  tags = [],
  editable = false,
  newTag = '',
  setNewTag = () => {},
  onAddTag = async () => {},
  onDeleteTag = async () => {},
  onUpdateTagOrder = () => {}
}: TagsSectionProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    setIsAddingTag(true);
    try {
      await onAddTag();
    } finally {
      setIsAddingTag(false);
    }
  };
  
  const handleReorderTags = async (reorderedTags: TagPosition[]) => {
    // Convert TagPosition[] to Tag[] for backward compatibility
    const newTagOrder = reorderedTags.map(({ id, position }) => {
      const originalTag = tags.find(tag => tag.id === id);
      if (!originalTag) return null;
      return originalTag;
    }).filter((tag): tag is Tag => tag !== null);
    
    onUpdateTagOrder(newTagOrder);
  };
  
  return (
    <div data-testid="tags-section" className="space-y-2">
      <div className="flex items-center gap-1 mb-1 text-sm font-medium">
        <TagIcon className="h-4 w-4" />
        <h3>Tags</h3>
      </div>
      
      {editable && (
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isAddingTag) {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="h-8 text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddTag}
            disabled={!newTag.trim() || isAddingTag}
            className="h-8 px-2"
          >
            {isAddingTag ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <PlusIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      
      {tags.length > 0 ? (
        <DraggableTagList
          tags={tags}
          onDeleteTag={onDeleteTag}
          onReorderTags={handleReorderTags}
          editable={editable}
        />
      ) : (
        <div className="text-sm text-muted-foreground py-2">
          No tags added yet.
        </div>
      )}
    </div>
  );
}
