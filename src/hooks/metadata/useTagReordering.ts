
/**
 * Hook for managing tag reordering
 * 
 * This hook provides a consistent interface for handling tag reordering
 * operations, including optimistic updates and server synchronization.
 */
import { useCallback, useState } from 'react';
import { Tag } from '@/types/tag';
import { isValidContentId } from '@/utils/content-validation';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';

interface UseTagReorderingProps {
  contentId: string;
  tags: Tag[];
  onSuccess?: () => void;
}

export function useTagReordering({
  contentId,
  tags: initialTags,
  onSuccess
}: UseTagReorderingProps) {
  const [isReordering, setIsReordering] = useState(false);
  const [localTags, setLocalTags] = useState<Tag[]>(initialTags);
  
  // Update local tags when props change
  useState(() => {
    setLocalTags(initialTags);
  });
  
  /**
   * Reorder tags and update in database
   */
  const reorderTags = useCallback(async (reorderedTags: Tag[]) => {
    if (!isValidContentId(contentId)) {
      toast({
        title: "Invalid Content ID",
        description: "Cannot reorder tags for invalid content",
        variant: "destructive"
      });
      return false;
    }
    
    // Apply optimistic update
    setLocalTags(reorderedTags);
    setIsReordering(true);
    
    try {
      // Prepare the positions for update
      const positions = reorderedTags.map((tag, index) => ({
        id: tag.id,
        position: index
      }));
      
      // Update each tag in parallel
      const updatePromises = positions.map(pos => 
        supabase
          .from('tags')
          .update({ display_order: pos.position })
          .eq('id', pos.id)
      );
      
      await Promise.all(updatePromises);
      
      // Notify success
      toast({
        title: "Tags Reordered",
        description: "The tag order has been saved",
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      // Revert optimistic update on error
      setLocalTags(initialTags);
      
      handleError(
        error, 
        "Failed to update tag order", 
        { level: "warning", category: "tags" }
      );
      
      return false;
    } finally {
      setIsReordering(false);
    }
  }, [contentId, initialTags, onSuccess]);
  
  return {
    tags: localTags,
    setTags: setLocalTags,
    reorderTags,
    isReordering
  };
}
