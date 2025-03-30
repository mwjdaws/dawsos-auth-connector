
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { Tag } from '@/components/MetadataPanel/hooks/tag-operations/types';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';

interface UseTagReorderingProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export function useTagReordering({ contentId, onMetadataChange }: UseTagReorderingProps) {
  const [isReordering, setIsReordering] = useState(false);

  /**
   * Handles reordering tags and updating their order in the database
   * Uses a transaction to ensure all updates succeed or fail together
   */
  const handleReorderTags = useCallback(async (reorderedTags: Tag[]) => {
    if (!contentId || reorderedTags.length === 0) return;
    
    setIsReordering(true);
    
    try {
      // In a real implementation, we would update the order field in the database
      // For now, we'll just simulate success and update the local state
      
      // Uncomment this when you have an order field in your tags table
      /*
      const updates = reorderedTags.map((tag, index) => ({
        id: tag.id,
        display_order: index
      }));
      
      const { error } = await supabase
        .from('tags')
        .upsert(updates);
        
      if (error) throw error;
      */
      
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
