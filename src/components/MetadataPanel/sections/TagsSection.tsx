
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tag } from '../hooks/tag-operations/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TagType {
  id: string;
  name: string;
}

interface TagsSectionProps {
  tags: Tag[];
  tagTypes?: TagType[];
  editable?: boolean;
  newTag?: string;
  selectedTypeId?: string;
  setSelectedTypeId?: (value: string) => void;
  setNewTag?: (value: string) => void;
  onAddTag?: (typeId?: string) => void;
  onDeleteTag?: (tagId: string) => void;
  isFetchingTypes?: boolean;
}

/**
 * Displays and manages a collection of content tags, optionally allowing
 * editing capabilities with tag type selection
 * 
 * @param props - Component props
 * @returns TagsSection component
 */
export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  tagTypes = [],
  editable = false,
  newTag = '',
  selectedTypeId,
  setSelectedTypeId,
  setNewTag,
  onAddTag,
  onDeleteTag,
  isFetchingTypes = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onAddTag && newTag?.trim()) {
      e.preventDefault();
      onAddTag(selectedTypeId);
    }
  };
  
  // Group tags by type_id for better organization
  const groupedTags: Record<string, Tag[]> = {};
  
  // First, group tags by their type_id
  tags.forEach(tag => {
    const typeKey = tag.type_id || 'untyped';
    if (!groupedTags[typeKey]) {
      groupedTags[typeKey] = [];
    }
    groupedTags[typeKey].push(tag);
  });
  
  // Get type names for display
  const getTypeName = (typeId: string) => {
    const foundType = tagTypes.find(type => type.id === typeId);
    return foundType ? foundType.name : 'Other';
  };

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
          
          {tagTypes.length > 0 && setSelectedTypeId && (
            <Select
              value={selectedTypeId}
              onValueChange={setSelectedTypeId}
              disabled={isFetchingTypes}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tag type" />
              </SelectTrigger>
              <SelectContent>
                {tagTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button 
            size="sm" 
            onClick={() => onAddTag?.(selectedTypeId)}
            disabled={!newTag?.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}
      
      {Object.keys(groupedTags).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedTags).map(([typeId, typeTags]) => (
            <div key={typeId} className="space-y-2">
              {typeId !== 'untyped' && (
                <h4 className="text-xs font-medium text-muted-foreground">
                  {getTypeName(typeId)}
                </h4>
              )}
              <div className="flex flex-wrap gap-2">
                {typeTags.map((tag) => (
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
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No tags</p>
      )}
    </div>
  );
}

export default TagsSection;
