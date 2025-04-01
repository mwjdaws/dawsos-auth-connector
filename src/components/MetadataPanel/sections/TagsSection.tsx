
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Tag as TagIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tag } from '@/types/tag';

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<boolean>;
  onDeleteTag: (tagId: string) => Promise<boolean>;
  onMetadataChange?: () => void;
  className?: string;
}

/**
 * TagsSection Component
 * 
 * Displays and manages tags for a content item
 */
export function TagsSection({
  tags,
  contentId,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  onMetadataChange,
  className = ''
}: TagsSectionProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      onAddTag();
    }
  };
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Tags</h3>
        {editable && (
          <span className="text-xs text-muted-foreground">
            {tags.length} tags
          </span>
        )}
      </div>
      
      {editable && (
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            className="h-8 text-sm"
            onKeyPress={handleKeyPress}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddTag()}
            disabled={!newTag.trim()}
          >
            Add
          </Button>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1.5">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="inline-flex items-center gap-1 px-2 py-0.5"
            >
              {tag.name}
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onDeleteTag(tag.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))
        ) : (
          <div className="text-sm text-muted-foreground flex items-center gap-1.5">
            <TagIcon className="h-3.5 w-3.5" />
            <span>No tags</span>
          </div>
        )}
      </div>
    </div>
  );
}
