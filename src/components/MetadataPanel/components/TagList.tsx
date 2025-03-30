
/**
 * TagList Component
 * 
 * Displays a list of tags with the ability to delete them if editable.
 * Extracted from the larger TagsSection for better modularity.
 */
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Tag } from "../hooks/tag-operations/types";

interface TagListProps {
  tags: Tag[];
  editable: boolean;
  onDeleteTag: (tagId: string) => void;
  className?: string;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  editable,
  onDeleteTag,
  className = ""
}) => {
  if (tags.length === 0) {
    return <p className="text-sm text-muted-foreground">No tags available</p>;
  }
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Badge 
          key={tag.id} 
          variant="secondary"
          className="flex items-center gap-1"
        >
          {tag.name}
          {editable && (
            <button 
              onClick={() => onDeleteTag(tag.id)}
              className="text-muted-foreground hover:text-foreground ml-1"
              aria-label={`Remove tag ${tag.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
};
