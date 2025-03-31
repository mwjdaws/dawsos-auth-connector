
/**
 * Hook for tag mutations with proper type handling
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { isValidContentId } from '@/utils/content-validation';
import { toast } from '@/hooks/use-toast';
import { undefinedToNull } from '@/utils/type-conversions';
import { Tag } from '@/types/tag';

// Define tag mutation parameters with proper types
export interface AddTagParams {
  contentId: string;
  name: string;
  typeId?: string | null;
}

export interface DeleteTagParams {
  contentId: string;
  tagId: string;
}

/**
 * Hook for handling tag mutations (add, delete)
 */
export function useTagMutations() {
  const queryClient = useQueryClient();

  // Add tag mutation
  const addTagMutation = useMutation({
    mutationFn: async ({ name, contentId, typeId }: AddTagParams): Promise<Tag> => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: name.trim(),
          content_id: contentId,
          type_id: undefinedToNull(typeId)
        })
        .select()
        .single();

      if (error) throw error;
      return data as Tag;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags', variables.contentId] });
      toast({
        title: 'Tag Added',
        description: 'Tag has been added successfully',
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to add tag', { level: 'error' });
    }
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: async ({ tagId, contentId }: DeleteTagParams): Promise<string> => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;
      return tagId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags', variables.contentId] });
      toast({
        title: 'Tag Removed',
        description: 'Tag has been removed successfully',
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to remove tag', { level: 'error' });
    }
  });

  // Add helper methods to the mutation objects
  const addTag = (params: AddTagParams) => addTagMutation.mutateAsync(params);
  const deleteTag = (params: DeleteTagParams) => deleteTagMutation.mutateAsync(params);
  
  // Return everything including enhanced mutations
  return {
    addTag,
    deleteTag,
    isAddingTag: addTagMutation.isPending,
    isDeletingTag: deleteTagMutation.isPending,
    addTagMutation,
    deleteTagMutation
  };
}
