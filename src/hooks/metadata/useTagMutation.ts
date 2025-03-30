
/**
 * Hook for tag mutations
 * 
 * Provides functions to add, update, and delete tags.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

export function useTagMutations(initialContentId?: string) {
  const queryClient = useQueryClient();

  // Add tag mutation
  const addTag = useMutation({
    mutationFn: async ({ 
      contentId = initialContentId, 
      name, 
      typeId 
    }: { 
      contentId?: string; 
      name: string; 
      typeId?: string;
    }) => {
      if (!contentId) {
        throw new Error('Content ID is required');
      }
      
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      const { data, error } = await supabase
        .from('tags')
        .insert([
          {
            content_id: contentId,
            name: name.trim().toLowerCase(),
            type_id: typeId || null
          }
        ])
        .select();

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: (_, variables) => {
      const contentId = variables.contentId || initialContentId;
      if (contentId) {
        queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      }
      toast({
        title: "Success",
        description: "Tag has been added",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to add tag');
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : 'Failed to add tag',
        variant: "destructive",
      });
    }
  });

  // Delete tag mutation
  const deleteTag = useMutation({
    mutationFn: async ({ 
      tagId, 
      contentId = initialContentId 
    }: { 
      tagId: string; 
      contentId?: string;
    }) => {
      if (!contentId) {
        throw new Error('Content ID is required');
      }
      
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;
      return { tagId, contentId };
    },
    onSuccess: ({ contentId }) => {
      if (contentId) {
        queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      }
      toast({
        title: "Success",
        description: "Tag has been deleted",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to delete tag');
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : 'Failed to delete tag',
        variant: "destructive",
      });
    }
  });

  // Update tag mutation
  const updateTag = useMutation({
    mutationFn: async ({ 
      tagId, 
      name, 
      typeId,
      contentId = initialContentId 
    }: { 
      tagId: string; 
      name?: string; 
      typeId?: string;
      contentId?: string;
    }) => {
      if (!contentId) {
        throw new Error('Content ID is required');
      }
      
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      const updates: Record<string, any> = {};
      if (name !== undefined) updates.name = name.trim().toLowerCase();
      if (typeId !== undefined) updates.type_id = typeId;

      if (Object.keys(updates).length === 0) {
        throw new Error('No updates provided');
      }

      const { data, error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', tagId)
        .select();

      if (error) throw error;
      return { tag: data?.[0], contentId };
    },
    onSuccess: ({ contentId }) => {
      if (contentId) {
        queryClient.invalidateQueries({ queryKey: ['tags', contentId] });
      }
      toast({
        title: "Success",
        description: "Tag has been updated",
      });
    },
    onError: (error) => {
      handleError(error, 'Failed to update tag');
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : 'Failed to update tag',
        variant: "destructive",
      });
    }
  });

  return {
    addTag,
    deleteTag,
    updateTag,
    isAddingTag: addTag.isPending,
    isDeletingTag: deleteTag.isPending,
    isUpdatingTag: updateTag.isPending
  };
}
