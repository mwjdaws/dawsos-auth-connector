
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, X } from 'lucide-react';
import { Tag } from '@/types/tag';

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag?: string;
  setNewTag?: (value: string) => void;
  onAddTag?: (typeId?: string | null) => Promise<void>;
  onDeleteTag?: (tagId: string) => Promise<void>;
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
  newTag = '',
  setNewTag = () => {},
  onAddTag = async () => {},
  onDeleteTag = async () => {},
  onMetadataChange,
  className
}: TagsSectionProps) {
  // State for tracking loading operations
  const [addingTag, setAddingTag] = React.useState(false);
  const [deletingTagId, setDeletingTagId] = React.useState<string | null>(null);
  const [localNewTag, setLocalNewTag] = useState(newTag);
  
  // Handle local state updates
  const handleLocalTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalNewTag(value);
    setNewTag(value);
  };
  
  // Handler for adding a new tag
  const handleAddTag = async () => {
    if (!localNewTag || addingTag) return;
    
    setAddingTag(true);
    try {
      await onAddTag();
      if (onMetadataChange) onMetadataChange();
      setLocalNewTag('');
      setNewTag('');
    } finally {
      setAddingTag(false);
    }
  };
  
  // Handler for deleting a tag
  const handleDeleteTag = async (tagId: string) => {
    setDeletingTagId(tagId);
    try {
      await onDeleteTag(tagId);
      if (onMetadataChange) onMetadataChange();
    } finally {
      setDeletingTagId(null);
    }
  };
  
  // Handle Enter key in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Tags</h3>
      
      {/* Tag input field */}
      {editable && (
        <div className="flex space-x-2 mb-3">
          <Input
            value={localNewTag}
            onChange={handleLocalTagChange}
            onKeyPress={handleKeyPress}
            placeholder="Add a tag..."
            disabled={addingTag}
            className="h-8 text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddTag}
            disabled={!localNewTag || addingTag}
            className="h-8 px-2"
          >
            {addingTag ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      
      {/* Tag display */}
      <div className="flex flex-wrap gap-2">
        {tags.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No tags added yet.
          </p>
        ) : (
          tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span>{tag.name}</span>
              {editable && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTag(tag.id)}
                  disabled={deletingTagId === tag.id}
                  className="h-4 w-4 p-0 ml-1"
                >
                  {deletingTagId === tag.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </Button>
              )}
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}

export default TagsSection;
