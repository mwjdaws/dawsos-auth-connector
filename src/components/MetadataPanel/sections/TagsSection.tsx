
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { TagInput } from "@/components/MarkdownViewer/TagInput";

interface Tag {
  id: string;
  name: string;
  content_id: string;
}

export interface TagsSectionProps {
  tags: Tag[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Tags</h3>
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
                <button 
                  onClick={() => onDeleteTag(tag.id)}
                  className="text-muted-foreground hover:text-foreground ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No tags available</p>
      )}
      
      {editable && (
        <div className="mt-2">
          <TagInput 
            onAddTag={onAddTag} 
            newTag={newTag} 
            setNewTag={setNewTag} 
          />
        </div>
      )}
    </div>
  );
};
