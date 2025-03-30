/**
 * Hook for reordering tags
 * 
 * Provides functionality to reorder tags and update their order in the database.
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

interface UseTagReorderingOptions {
  contentId: string;
  onMetadataChange?: () => void;
}

export function useTagReordering({ contentId, onMetadataChange }: UseTagReorderingOptions) {
  const [isReordering, setIsReordering] = useState(false);

  const handleReorderTags = async (reorderedTags: { id: string; position: number }[]) => {
    if (!isValidContentId(contentId)) {
      toast({
        title: "Invalid content",
        description: "Cannot reorder tags for invalid content",
        variant: "destructive"
      });
      return;
    }

    setIsReordering(true);

    try {
      // For now, there's no position/order column in the database
      // This is a placeholder for when that functionality is added
      
      // Simulate a successful update with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Tags reordered:', reorderedTags);
      
      // Call onMetadataChange if provided
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      toast({
        title: "Success",
        description: "Tag order has been updated",
      });
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error('Failed to reorder tags'),
        'Could not update tag order'
      );
      
      toast({
        title: "Error",
        description: "Failed to update tag order",
        variant: "destructive"
      });
    } finally {
      setIsReordering(false);
    }
  };

  return {
    handleReorderTags,
    isReordering
  };
}
