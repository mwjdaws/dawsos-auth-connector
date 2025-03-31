
/**
 * TagsSection Component
 * 
 * Displays tags and provides functionality to add and remove them.
 * Uses the TagList component for tag display
 */
import React from "react";
import { TagInput } from "@/components/MarkdownViewer/TagInput";
import { TagList } from "../components/TagList";
import { Tag, TagPosition } from "@/types/tag";

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
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
  // Handle tag reordering with proper types
  const handleReorderTags = (reorderedTags: Tag[]) => {
    // Convert to TagPosition type for compatibility
    const positions: TagPosition[] = reorderedTags.map((tag, index) => ({
      id: tag.id,
      position: index
    }));
    
    console.log("Reordering tags:", positions);
    
    if (onMetadataChange) {
      onMetadataChange();
    }
  };
  
  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Tags</h3>
      
      <TagList
        tags={tags}
        editable={editable}
        onDeleteTag={onDeleteTag}
        onReorderTags={handleReorderTags}
      />
      
      {editable && (
        <div className="mt-2">
          <TagInput 
            onAddTag={() => onAddTag(null)} 
            newTag={newTag} 
            setNewTag={setNewTag} 
            aria-label="Add a new tag"
          />
        </div>
      )}
    </div>
  );
}

// For backward compatibility
export const TagsContent = TagsSection;
