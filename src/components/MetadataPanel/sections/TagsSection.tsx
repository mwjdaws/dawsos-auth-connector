
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tag } from '../types';

interface TagsSectionProps {
  tags: any[];
  editable?: boolean;
  newTag?: string;
  setNewTag?: (value: string) => void;
  onAddTag?: () => void;
  onDeleteTag?: (tagId: string) => void;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  editable = false,
  newTag = '',
  setNewTag,
  onAddTag,
  onDeleteTag
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onAddTag && newTag?.trim()) {
      e.preventDefault();
      onAddTag();
    }
  };
  
  const normalizedTags = tags?.map(tag => 
    typeof tag === 'string' ? { name: tag, id: tag } : tag
  ) || [];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Tags</h3>
      
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
            onClick={onAddTag}
            disabled={!newTag?.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}
      
      {normalizedTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {normalizedTags.map((tag) => (
            <Badge 
              key={tag.id || tag.name}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag.name}
              {editable && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onDeleteTag?.(tag.id || tag.name)}
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
