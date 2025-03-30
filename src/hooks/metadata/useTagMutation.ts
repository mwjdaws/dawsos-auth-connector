
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

// Add tag mutation
export function useAddTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      contentId, 
      name,
      typeId 
    }: { 
      contentId?: string; 
      name: string;
      typeId?: string;
    }) => {
      if (!contentId || !name.trim() || !isValidContentId(contentId)) {
        throw new Error('Invalid content ID or tag name');
      }

      const { data, error } = await supabase
        .from('tags')
        .insert([{ 
          name: name.trim().toLowerCase(), 
          content_id: contentId,
          type_id: typeId 
        }])
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('Failed to add tag');
      }

      return data[0];
    },
    onSuccess: (_, variables) => {
      // Invalidate tags query to trigger refetch
      if (variables.contentId) {
        queryClient.invalidateQueries({ 
          queryKey: ['tags', variables.contentId] 
        });
      }

      toast({
        title: 'Tag Added',
        description: `Added tag "${variables.name}"`,
      });
    },
    onError: (error, variables) => {
      console.error('Error adding tag:', error, variables);
      
      handleError(error, 'Failed to add tag', {
        context: { 
          contentId: variables.contentId,
          tagName: variables.name 
        },
        level: 'error'
      });

      toast({
        title: 'Error',
        description: 'Failed to add tag',
        variant: 'destructive',
      });
    }
  });
}

// Delete tag mutation
export function useDeleteTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      tagId, 
      contentId 
    }: { 
      tagId: string; 
      contentId?: string;
    }) => {
      if (!tagId) {
        throw new Error('Tag ID is required');
      }

      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;

      return { tagId, contentId };
    },
    onSuccess: (result) => {
      // Invalidate tags query to trigger refetch if we have a contentId
      if (result.contentId) {
        queryClient.invalidateQueries({ 
          queryKey: ['tags', result.contentId] 
        });
      }

      toast({
        title: 'Tag Deleted',
        description: 'Tag was successfully removed',
      });
    },
    onError: (error, variables) => {
      console.error('Error deleting tag:', error, variables);
      
      handleError(error, 'Failed to delete tag', {
        context: { 
          tagId: variables.tagId,
          contentId: variables.contentId
        },
        level: 'error'
      });

      toast({
        title: 'Error',
        description: 'Failed to delete tag',
        variant: 'destructive',
      });
    }
  });
}
