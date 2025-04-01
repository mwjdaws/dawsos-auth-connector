
import { useState, useCallback } from "react";
import { Tag, TagPosition } from "@/types/tag";
import { handleError } from "@/utils/errors/handle";
import { supabase } from "@/integrations/supabase/client";

interface UseTagReorderingProps {
  contentId: string;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

/**
 * Hook for handling tag reordering
 */
export function useTagReordering({
  contentId,
  tags,
  setTags
}: UseTagReorderingProps) {
  const [isReordering, setIsReordering] = useState(false);
  
  /**
   * Save the reordered tags to the database
   */
  const saveTagOrder = useCallback(async (reorderedTags: Tag[]): Promise<boolean> => {
    if (!contentId || !reorderedTags.length) {
      return false;
    }
    
    setIsReordering(true);
    
    try {
      // Create tag positions
      const tagPositions: TagPosition[] = reorderedTags.map((tag, index) => ({
        id: tag.id,
        position: index
      }));
      
      // Update local state immediately for better UX
      setTags(reorderedTags.map((tag, index) => ({
        ...tag,
        display_order: index
      })));
      
      // Update the database
      const updates = tagPositions.map(position => ({
        id: position.id,
        display_order: position.position
      }));
      
      const { error } = await supabase
        .from('tags')
        .upsert(updates, { onConflict: 'id' });
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      handleError(
        err,
        "Failed to update tag order",
        { level: "warning", context: { contentId } }
      );
      
      return false;
    } finally {
      setIsReordering(false);
    }
  }, [contentId, setTags]);
  
  /**
   * Type guard to ensure the tag has a display_order property
   */
  const hasDisplayOrder = (tag: Tag): tag is Tag & { display_order: number } => {
    return typeof tag.display_order === 'number';
  };
  
  /**
   * Handle reordering of tags
   */
  const handleReorderTags = useCallback(async (reorderedTags: Tag[]): Promise<void> => {
    // Create a copy of the tags and ensure each has a display_order
    const tagsWithOrder = reorderedTags.map((tag, index) => {
      if (hasDisplayOrder(tag)) {
        return tag;
      }
      return {
        ...tag,
        display_order: index
      };
    });
    
    await saveTagOrder(tagsWithOrder);
  }, [saveTagOrder]);
  
  return {
    isReordering,
    handleReorderTags
  };
}

export default useTagReordering;
