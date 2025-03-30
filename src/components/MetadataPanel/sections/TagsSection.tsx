
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
 *   contentId="content-123"
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
import { TagList } from "../components/TagList";
import { useTagReordering } from "@/hooks/metadata";

interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable?: boolean;
  newTag?: string;
  setNewTag?: (value: string) => void;
  onAddTag?: () => void;
  onDeleteTag?: (tagId: string) => void;
  onMetadataChange?: () => void;
  className?: string;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  contentId,
  editable = false,
  newTag = '',
  setNewTag,
  onAddTag,
  onDeleteTag,
  onMetadataChange,
  className
}) => {
  const { handleReorderTags } = useTagReordering({
    contentId,
    onMetadataChange
  });

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
      
      <TagList
        tags={tags}
        editable={editable}
        onDeleteTag={onDeleteTag || (() => {})}
        onReorderTags={handleReorderTags}
      />
    </div>
  );
};

export default TagsSection;
