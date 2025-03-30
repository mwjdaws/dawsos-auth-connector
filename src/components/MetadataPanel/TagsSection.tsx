
/**
 * TagsSection Component
 * 
 * Displays tags and provides functionality to add and remove them.
 * Uses the extracted TagList component for better modularization.
 */
import React from "react";
import { TagInput } from "@/components/MarkdownViewer/TagInput";
import { TagList } from "./components/TagList";
import { Tag } from "./hooks/tag-operations/types";

export interface TagsSectionProps {
  tags: Tag[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
  className?: string;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  className = ""
}) => {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Tags</h3>
      
      <TagList
        tags={tags}
        editable={editable}
        onDeleteTag={onDeleteTag}
      />
      
      {editable && (
        <div className="mt-2">
          <TagInput 
            onAddTag={onAddTag} 
            newTag={newTag} 
            setNewTag={setNewTag} 
            aria-label="Add a new tag"
          />
        </div>
      )}
    </div>
  );
};
