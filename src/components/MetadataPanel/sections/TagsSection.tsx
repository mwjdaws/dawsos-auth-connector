
/**
 * TagsSection Component
 * 
 * Displays and manages tags associated with a content source.
 * Uses the DraggableTagList component for tag drag-and-drop reordering.
 */
import React from "react";
import { TagInput } from "@/components/MarkdownViewer/TagInput";
import { TagList } from "../components/TagList";
import { Tag } from "../hooks/tag-operations/types";
import { useTagReordering } from "@/hooks/metadata/useTagReordering";

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
  onMetadataChange?: () => void;
  className?: string;
}

export const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  contentId,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  onMetadataChange,
  className = ""
}) => {
  const { handleReorderTags, isReordering } = useTagReordering({
    contentId,
    onMetadataChange
  });
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Tags</h3>
      
      <TagList
        tags={tags}
        editable={editable && !isReordering}
        onDeleteTag={onDeleteTag}
        onReorderTags={handleReorderTags}
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
