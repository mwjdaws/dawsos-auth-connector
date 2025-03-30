
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

interface TagPosition {
  id: string;
  position: number;
}

interface UseTagReorderingProps {
  contentId: string;
  onMetadataChange?: () => void;
}

export function useTagReordering({
  contentId,
  onMetadataChange
}: UseTagReorderingProps) {
  const queryClient = useQueryClient();
  
  const { mutate: reorderTagsMutation, isPending: isReordering } = useMutation({
    mutationFn: async (tagPositions: TagPosition[]) => {
      if (!contentId || !isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }
      
      if (!tagPositions.length) {
        return { success: true };
      }
      
      try {
        // In a real implementation, this would update the positions in the database
        // For this example, we'll just simulate success
        console.log('Reordering tags:', tagPositions);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { success: true };
      } catch (error) {
        console.error('Error reordering tags:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate tags query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      
      if (onMetadataChange) {
        onMetadataChange();
      }
      
      toast({
        title: 'Tags Reordered',
        description: 'Tags were successfully reordered',
      });
    },
    onError: (error) => {
      console.error('Error reordering tags:', error);
      
      handleError(error, 'Failed to reorder tags', {
        context: { contentId },
        level: 'error'
      });
      
      toast({
        title: 'Error',
        description: 'Failed to reorder tags',
        variant: 'destructive',
      });
    }
  });
  
  const handleReorderTags = async (tagPositions: TagPosition[]) => {
    reorderTagsMutation(tagPositions);
  };
  
  return {
    handleReorderTags,
    isReordering
  };
}
