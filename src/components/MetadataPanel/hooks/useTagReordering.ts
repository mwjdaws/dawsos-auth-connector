
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag, TagPosition } from '@/types';
import { handleError, ErrorLevel } from '@/utils/errors';

interface UseTagReorderingProps {
  contentId: string;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  onMetadataChange?: () => void;
}

/**
 * Hook for handling tag reordering operations
 */
export const useTagReordering = ({
  contentId,
  tags,
  setTags,
  onMetadataChange
}: UseTagReorderingProps) => {
  const [isReordering, setIsReordering] = useState(false);
  
  /**
   * Convert tag array to positions array
   */
  const getTagPositions = useCallback((updatedTags: Tag[]): TagPosition[] => {
    return updatedTags.map((tag, index) => ({
      id: tag.id,
      position: index
    }));
  }, []);
  
  /**
   * Reorder tags using drag-and-drop
   * Updates the display_order property in the database
   */
  const reorderTags = useCallback(async (updatedTags: Tag[]) => {
    if (!updatedTags.length || !contentId) return false;
    
    setIsReordering(true);
    
    try {
      // Update the display_order of all affected tags in database
      const tagPositions = getTagPositions(updatedTags);
      
      // Update each tag individually
      for (const position of tagPositions) {
        const { error } = await supabase
          .from('tags')
          .update({ display_order: position.position })
          .eq('id', position.id)
          .eq('content_id', contentId);
        
        if (error) throw error;
      }
      
      // Update the local state with the new order
      setTags(updatedTags);
      
      // Notify about metadata changes
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      return true;
    } catch (err) {
      handleError(
        err,
        'Failed to reorder tags',
        { 
          level: ErrorLevel.WARNING,
          category: 'tags',
          context: { contentId }
        }
      );
      return false;
    } finally {
      setIsReordering(false);
    }
  }, [contentId, setTags, getTagPositions, onMetadataChange]);
  
  return {
    isReordering,
    reorderTags
  };
};
