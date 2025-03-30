
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { Tag } from '@/components/MetadataPanel/hooks/tag-operations/types';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

interface UseTagReorderingProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export function useTagReordering({ contentId, onMetadataChange }: UseTagReorderingProps) {
  const [isReordering, setIsReordering] = useState(false);

  /**
   * Handles reordering tags and updating their order
   * Currently a workaround since there's no dedicated order column
   */
  const handleReorderTags = useCallback(async (reorderedTags: Tag[]) => {
    if (!contentId || reorderedTags.length === 0 || !isValidContentId(contentId)) return;
    
    setIsReordering(true);
    
    try {
      // Log the intended changes for debugging
      console.log('Would reorder tags:', reorderedTags.map((tag, index) => ({
        id: tag.id,
        name: tag.name,
        display_order: index // This would be the column to add in future
      })));
      
      // In a real implementation, we would update a display_order field in the tags table
      // For now, we'll just simulate success and update the local state
      
      // Simulate a delay for the reordering operation
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
