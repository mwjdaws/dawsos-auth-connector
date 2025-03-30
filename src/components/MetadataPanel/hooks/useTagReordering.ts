
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TagPosition } from '@/utils/validation/types';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

interface UseTagReorderingProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export const useTagReordering = ({ 
  contentId, 
  onMetadataChange 
}: UseTagReorderingProps) => {
  const [isReordering, setIsReordering] = useState(false);

  /**
   * Reorder tags by position
   */
  const handleReorderTags = async (tagPositions: TagPosition[]) => {
    if (!isValidContentId(contentId) || !tagPositions.length) {
      return;
    }

    setIsReordering(true);
    try {
      // For now, we'll just simulate reordering
      // In a real implementation, this would update the database
      
      // Wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Notify of changes
      if (onMetadataChange) {
        onMetadataChange();
      }
    } catch (error) {
      console.error('Error reordering tags:', error);
    } finally {
      setIsReordering(false);
    }
  };

  return {
    handleReorderTags,
    isReordering
  };
};
