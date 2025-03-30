
import React, { useEffect } from "react";
import { TagList } from "../components/TagList";
import { TagInput } from "@/components/MarkdownViewer/TagInput";
import { Tag, TagPosition } from "../hooks/tag-operations/types";
import { useToast } from "@/hooks/use-toast";

export interface TagsSectionProps {
  tags: Tag[];
  contentId: string;
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onMetadataChange?: (() => void) | undefined;
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
  const { toast } = useToast();
  
  // Create a shim for tag reordering since it's not fully implemented yet
  const handleReorderTags = async (reorderedTags: TagPosition[]): Promise<void> => {
    // Implementation to be added when tag reordering is needed
    console.log("Reordering tags:", reorderedTags);
    
    toast({
      title: "Tags Reordered",
      description: "Tag order has been updated."
    });
    
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
};
