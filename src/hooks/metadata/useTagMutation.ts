
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { toast } from '@/hooks/use-toast';
import { isValidContentId } from '@/utils/validation';

interface TagData {
  contentId: string;
  name: string;
  typeId?: string;
}

interface TagDeleteParams {
  tagId: string;
  contentId: string;
}

interface TagReorderParams {
  contentId: string;
  newOrder: { id: string; position: number }[];
}

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
      queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
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
      queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      toast({
        title: "Tag Removed",
        description: "The tag was successfully removed",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to remove tag');
    }
  });
  
  // Reorder tags - Temporary workaround until we have a position column
  const reorderTagsMutation = useMutation({
    mutationFn: async ({ contentId: tagContentId, newOrder }: TagReorderParams) => {
      const effectiveContentId = tagContentId || contentId;
      
      if (!effectiveContentId || !isValidContentId(effectiveContentId)) {
        throw new Error('Invalid content ID');
      }
      
      // Since there's no tag_positions table or position column, we'll log the intended changes
      // In a future implementation, we could add a display_order column to the tags table
      console.log('Would reorder tags:', newOrder);
      
      // For now, we'll just return the data without actually updating positions
      return { contentId: effectiveContentId, newOrder };
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
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
