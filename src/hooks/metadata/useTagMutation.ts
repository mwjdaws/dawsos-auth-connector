
/**
 * Hook for tag mutations with proper type handling
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { handleError } from '@/utils/error-handling';
import { isValidContentId, tryParseContentIdAsUUID } from '@/utils/content-validation';
import { toast } from '@/hooks/use-toast';
import { Tag } from '@/types/tag';

// Define tag mutation parameters with proper types
export interface AddTagParams {
  contentId: string;
  name: string;
  typeId?: string | null;
  display_order?: number;
}

export interface DeleteTagParams {
  contentId: string;
  tagId: string;
}

export interface UpdateTagOrderParams {
  contentId: string;
  tagPositions: { id: string; position: number }[];
}

/**
 * Hook for handling tag mutations (add, delete, reorder)
 */
export function useTagMutations(contentId?: string) {
  const queryClient = useQueryClient();
  const validContentId = contentId && isValidContentId(contentId) ? contentId : undefined;

  // Add tag mutation
  const addTagMutation = useMutation({
    mutationFn: async ({ name, contentId, typeId, display_order }: AddTagParams): Promise<Tag> => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      // Convert temporary IDs to UUID if possible
      const dbContentId = tryParseContentIdAsUUID(contentId) || contentId;

      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: name.trim(),
          content_id: dbContentId,
          type_id: typeId === undefined ? null : typeId,
          display_order: display_order || 0
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert operation');
      
      return {
        id: data.id,
        name: data.name,
        content_id: data.content_id,
        type_id: data.type_id,
        display_order: data.display_order || 0
      } as Tag;
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

  // Update tag order mutation
  const updateTagOrderMutation = useMutation({
    mutationFn: async ({ tagPositions, contentId }: UpdateTagOrderParams): Promise<boolean> => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      // Update each tag's display_order in sequence
      const updates = tagPositions.map(position => 
        supabase
          .from('tags')
          .update({ display_order: position.position })
          .eq('id', position.id)
      );
      
      // Execute all updates in parallel
      await Promise.all(updates);
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags', variables.contentId] });
      toast({
        title: 'Tags Reordered',
        description: 'Tag order has been updated successfully',
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to update tag order', { level: 'error' });
    }
  });

  // Add helper methods for simpler API
  const addTag = (params: AddTagParams) => {
    return addTagMutation.mutateAsync({
      ...params,
      contentId: params.contentId || contentId || ''
    });
  };
  
  const deleteTag = (params: DeleteTagParams | string) => {
    // Support both object params and just the tagId string for convenience
    const tagId = typeof params === 'string' ? params : params.tagId;
    const targetContentId = typeof params === 'string' 
      ? validContentId || '' 
      : params.contentId || validContentId || '';
      
    return deleteTagMutation.mutateAsync({ 
      tagId, 
      contentId: targetContentId 
    });
  };
  
  const updateTagOrder = (tagPositions: { id: string; position: number }[]) => {
    if (!validContentId) {
      console.error('Cannot update tag order: No valid content ID provided');
      return Promise.reject('No valid content ID');
    }
    
    return updateTagOrderMutation.mutateAsync({
      tagPositions,
      contentId: validContentId
    });
  };
  
  // Return everything including enhanced mutations
  return {
    addTag,
    deleteTag,
    updateTagOrder,
    isAddingTag: addTagMutation.isPending,
    isDeletingTag: deleteTagMutation.isPending,
    isUpdatingOrder: updateTagOrderMutation.isPending,
    addTagMutation,
    deleteTagMutation,
    updateTagOrderMutation
  };
}

// For backward compatibility
export const useAddTagMutation = useTagMutations;
export const useTagMutation = useTagMutations;
