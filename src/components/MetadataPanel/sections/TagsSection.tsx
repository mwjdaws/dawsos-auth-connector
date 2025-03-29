
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { Tag } from '../types';

interface TagsSectionProps {
  tags: string[] | Tag[];
  editable?: boolean;
  newTag?: string;
  setNewTag?: (value: string) => void;
  onAddTag?: (tag: string) => void;
  onDeleteTag?: (tag: string) => void;
}

export function TagsSection({
  tags,
  editable = false,
  newTag = '',
  setNewTag,
  onAddTag,
  onDeleteTag
}: TagsSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onAddTag && newTag.trim()) {
      e.preventDefault();
      onAddTag(newTag.trim());
    }
  };
  
  const normalizedTags = tags.map(tag => 
    typeof tag === 'string' ? { name: tag } : tag
  );

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
            onClick={() => onAddTag?.(newTag)}
            disabled={!newTag.trim()}
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
              key={tag.name}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag.name}
              {editable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onDeleteTag?.(tag.name)}
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
}
