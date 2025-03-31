
/**
 * TagsSection Component
 * 
 * Displays tags and provides functionality to add and remove them.
 * Uses the TagList component for tag display and supports drag-and-drop reordering.
 */
import React, { useCallback } from "react";
import { TagInput } from "@/components/MarkdownViewer/TagInput";
import { TagList } from "../components/TagList";
import { Tag, TagPosition } from "@/types/tag";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  // Handle tag reordering with proper database update
  const handleReorderTags = useCallback(async (reorderedTags: Tag[]) => {
    // Convert to TagPosition type for compatibility
    const positions: TagPosition[] = reorderedTags.map((tag, index) => ({
      id: tag.id,
      position: index
    }));
    
    console.log("Reordering tags:", positions);
    
    // Save the new tag order to the database
    try {
      // Update each tag's display_order in the database
      const updates = positions.map(pos => 
        supabase
          .from('tags')
          .update({ display_order: pos.position })
          .eq('id', pos.id)
      );
      
      // Execute all updates in parallel
      await Promise.all(updates);
      
      // Notify about successful reordering
      toast({
        title: "Tags Reordered",
        description: "Tag order has been updated",
      });
      
      // Trigger metadata change callback if provided
      if (onMetadataChange) {
        onMetadataChange();
      }
    } catch (error) {
      console.error("Error saving tag order:", error);
      toast({
        title: "Error",
        description: "Failed to save tag order",
        variant: "destructive"
      });
    }
  }, [contentId, onMetadataChange]);
  
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

// For backward compatibility (can be removed in the future once all imports are updated)
export const TagsContent = TagsSection;
