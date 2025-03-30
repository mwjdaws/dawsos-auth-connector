
/**
 * TagsSection Component
 * 
 * Displays and manages tags associated with a content source.
 * Provides UI for viewing, adding, and removing tags.
 * 
 * @example
 * ```tsx
 * <TagsSection
 *   tags={tags}
 *   editable={true}
 *   newTag={newTag}
 *   setNewTag={setNewTag}
 *   onAddTag={handleAddTag}
 *   onDeleteTag={handleDeleteTag}
 * />
 * ```
 */
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tag } from '../hooks/tag-operations/types';

interface TagsSectionProps {
  tags: Tag[];
  editable?: boolean;
  newTag?: string;
  setNewTag?: (value: string) => void;
  onAddTag?: () => void;
  onDeleteTag?: (tagId: string) => void;
  className?: string;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  editable = false,
  newTag = '',
  setNewTag,
  onAddTag,
  onDeleteTag,
  className
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onAddTag && newTag?.trim()) {
      e.preventDefault();
      onAddTag();
    }
  };

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Tags</h3>
      
      {editable && (
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => setNewTag?.(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          
          <Button 
            size="sm" 
            onClick={() => onAddTag?.()}
            disabled={!newTag?.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}
      
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge 
              key={tag.id} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag.name}
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onDeleteTag?.(tag.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No tags</p>
      )}
    </div>
  );
};

export default TagsSection;
