
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { toast } from '@/hooks/use-toast';
import { isValidContentId } from '@/utils/validation';

/**
 * Interface for tag data used in mutations
 */
interface TagData {
  contentId: string;
  name: string;
  typeId?: string;
}

/**
 * Interface for tag deletion parameters
 */
interface TagDeleteParams {
  tagId: string;
  contentId: string;
}

/**
 * Interface for tag reordering parameters
 */
interface TagReorderParams {
  contentId: string;
  newOrder: { id: string; name: string }[];
}

/**
 * Provides mutation operations for tags (add, delete, reorder)
 * 
 * @param contentId - Optional default content ID to use
 * @returns Object containing mutation functions and states
 */
export function useTagMutations(contentId?: string) {
  const queryClient = useQueryClient();
  
  // Add a new tag
  const addTagMutation = useMutation({
    mutationFn: async ({ name, contentId: tagContentId, typeId }: TagData) => {
      const effectiveContentId = tagContentId || contentId;
      
      if (!effectiveContentId || !isValidContentId(effectiveContentId)) {
        throw new Error('Invalid content ID');
      }
      
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: name.trim().toLowerCase(),
          content_id: effectiveContentId,
          type_id: typeId
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      if (contentId) {
        queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      }
      toast({
        title: "Tag Added",
        description: "The tag was successfully added",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to add tag');
    }
  });
  
  // Delete a tag
  const deleteTagMutation = useMutation({
    mutationFn: async ({ tagId, contentId: tagContentId }: TagDeleteParams) => {
      const effectiveContentId = tagContentId || contentId;
      
      if (!effectiveContentId || !isValidContentId(effectiveContentId)) {
        throw new Error('Invalid content ID');
      }
      
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);
        
      if (error) throw error;
      return { tagId };
    },
    onSuccess: () => {
      // Invalidate relevant queries
      if (contentId) {
        queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      }
      toast({
        title: "Tag Removed",
        description: "The tag was successfully removed",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to remove tag');
    }
  });
  
  // Reorder tags - Implementation for future feature
  const reorderTagsMutation = useMutation({
    mutationFn: async ({ contentId: tagContentId, newOrder }: TagReorderParams) => {
      const effectiveContentId = tagContentId || contentId;
      
      if (!effectiveContentId || !isValidContentId(effectiveContentId)) {
        throw new Error('Invalid content ID');
      }
      
      // Log intended changes for debugging/development
      console.log('Tag reordering requested:', newOrder.map((tag, index) => ({
        id: tag.id,
        name: tag.name,
        desired_order: index // This would be the field to add in the future
      })));
      
      /**
       * Future implementation options:
       * 1. Add a display_order column to the tags table
       * 2. Create a separate tag_positions table to store ordering information
       * 
       * Currently, this is a client-side only reordering with no persistence.
       */
      
      return { contentId: effectiveContentId, newOrder };
    },
    onSuccess: () => {
      // Invalidate relevant queries
      if (contentId) {
        queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      }
      toast({
        title: "Tags Reordered",
        description: "Tag order was successfully updated",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to reorder tags');
    }
  });
  
  return {
    addTag: addTagMutation.mutate,
    deleteTag: deleteTagMutation.mutate,
    reorderTags: reorderTagsMutation.mutate,
    isAddingTag: addTagMutation.isPending,
    isDeletingTag: deleteTagMutation.isPending,
    isReorderingTags: reorderTagsMutation.isPending,
    addTagError: addTagMutation.error,
    deleteTagError: deleteTagMutation.error,
    reorderTagsError: reorderTagsMutation.error
  };
}
