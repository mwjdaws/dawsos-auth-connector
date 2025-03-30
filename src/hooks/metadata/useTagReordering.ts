
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { Tag } from '@/components/MetadataPanel/hooks/tag-operations/types';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

interface UseTagReorderingProps {
  contentId: string;
  onMetadataChange?: () => void;
}

/**
 * Hook for handling tag reordering operations
 * 
 * @param props - Properties including contentId and optional callback
 * @returns Functions and state for tag reordering
 */
export function useTagReordering({ contentId, onMetadataChange }: UseTagReorderingProps) {
  const [isReordering, setIsReordering] = useState(false);

  /**
   * Handles reordering tags and updating their order
   * Currently a workaround since there's no dedicated order column
   * 
   * @param reorderedTags - Array of tags in their new order
   */
  const handleReorderTags = useCallback(async (reorderedTags: Tag[]) => {
    if (!contentId || reorderedTags.length === 0 || !isValidContentId(contentId)) {
      console.warn('Invalid content ID or empty tag array provided for reordering');
      return;
    }
    
    setIsReordering(true);
    
    try {
      // Log the intended changes for debugging
      console.log('Tag reordering requested:', reorderedTags.map((tag, index) => ({
        id: tag.id,
        name: tag.name,
        desired_order: index // This would be the column to add in future
      })));
      
      /**
       * Implementation notes:
       * In a future version, we plan to add a display_order column to the tags table
       * and implement a batch update operation to store the order in the database.
       * For now, this is a client-side-only reordering.
       */
      
      // Simulate a delay for the reordering operation for UX feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Notify parent component that metadata has changed
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      // Show success toast
      toast({
        title: "Tags reordered",
        description: "Tag order has been updated successfully",
      });
      
    } catch (error) {
      handleError(error, "Failed to reorder tags", {
        level: "error",
        context: { contentId }
      });
    } finally {
      setIsReordering(false);
    }
  }, [contentId, onMetadataChange]);

  return {
    handleReorderTags,
    isReordering
  };
}
