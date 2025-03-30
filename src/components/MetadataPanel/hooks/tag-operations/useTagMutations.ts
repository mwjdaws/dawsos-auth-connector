import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/utils/query-keys';
import { toast } from '@/hooks/use-toast';
// Update import statement to correctly import isValidContentId
import { isValidContentId } from '@/utils/validation';
import { Tag } from './types';

/**
 * Hook for creating a new tag
 */
export function useCreateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentId, name, typeId }: { contentId: string; name: string; typeId?: string }) => {
      const { data, error } = await supabase
        .from('tags')
        .insert([{ content_id: contentId, name, type_id: typeId }])
        .select()
        .single();

      if (error) {
        console.error('Tag creation failed:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (newTag, { contentId }) => {
      // Invalidate and refetch queries related to the content's tags
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.byContentId(contentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.summary });

      toast({
        title: "Tag Created",
        description: `Tag "${newTag.name}" has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Tag",
        description: error.message || "Failed to create tag",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for updating an existing tag
 */
export function useUpdateTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, typeId }: { id: string; name: string; typeId?: string }) => {
      const { data, error } = await supabase
        .from('tags')
        .update({ name, type_id: typeId })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Tag update failed:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (updatedTag) => {
      // Invalidate and refetch queries related to the content's tags
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.byContentId(updatedTag.content_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.summary });

      toast({
        title: "Tag Updated",
        description: `Tag "${updatedTag.name}" has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Updating Tag",
        description: error.message || "Failed to update tag",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for deleting a tag
 */
export function useDeleteTagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, contentId }: { id: string; contentId: string }) => {
      const { data, error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Tag deletion failed:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, { contentId }) => {
      // Invalidate and refetch queries related to the content's tags
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.byContentId(contentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.summary });

      toast({
        title: "Tag Deleted",
        description: "Tag has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Deleting Tag",
        description: error.message || "Failed to delete tag",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for reordering tags
 */
export function useReorderTagsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentId, tagIds }: { contentId: string; tagIds: string[] }) => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      // Fetch existing tags for the content
      const { data: existingTags, error: fetchError } = await supabase
        .from<Tag>('tags')
        .select('*')
        .eq('content_id', contentId);

      if (fetchError) {
        console.error('Failed to fetch existing tags:', fetchError);
        throw new Error(fetchError.message);
      }

      if (!existingTags) {
        throw new Error('No tags found for this content ID');
      }

      // Create a map of tag IDs to their current positions
      const tagPositions: { [key: string]: number } = {};
      existingTags.forEach((tag) => {
        tagPositions[tag.id] = existingTags.findIndex((t) => t.id === tag.id);
      });

      // Update the order value for each tag based on the provided tagIds array
      const updates = tagIds.map((tagId, index) => ({
        id: tagId,
        order: index,
      }));

      // Execute the updates in a single transaction
      const { error: updateError } = await supabase.from('tags').upsert(
        updates.map(({ id, order }) => ({ id, order })),
        { onConflict: 'id' }
      );

      if (updateError) {
        console.error('Tag reordering failed:', updateError);
        throw new Error(updateError.message);
      }

      return { contentId };
    },
    onSuccess: ({ contentId }) => {
      // Invalidate and refetch queries related to the content's tags
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.byContentId(contentId) });
      toast({
        title: "Tags Reordered",
        description: "Tag order has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Reordering Tags",
        description: error.message || "Failed to reorder tags",
        variant: "destructive",
      });
    },
  });
}

/**
 * Custom hook that combines all tag-related mutations
 */
export function useTagMutations() {
  const createTagMutation = useCreateTagMutation();
  const updateTagMutation = useUpdateTagMutation();
  const deleteTagMutation = useDeleteTagMutation();
  const reorderTagsMutation = useReorderTagsMutation();

  return {
    createTag: createTagMutation.mutateAsync,
    updateTag: updateTagMutation.mutateAsync,
    deleteTag: deleteTagMutation.mutateAsync,
    reorderTags: reorderTagsMutation.mutateAsync,
    isCreating: createTagMutation.isPending,
    isUpdating: updateTagMutation.isPending,
    isDeleting: deleteTagMutation.isPending,
    isReordering: reorderTagsMutation.isPending,
  };
}

/**
 * Hook for adding a tag.  This is a wrapper around useCreateTagMutation
 */
export function useAddTagMutation() {
    const createTagMutation = useCreateTagMutation();

    return {
        addTag: createTagMutation.mutateAsync,
        isAdding: createTagMutation.isPending,
    }
}

/**
 * Hook for deleting a tag.  This is a wrapper around useDeleteTagMutation
 */
export function useDeleteTagMutation() {
    const deleteTagMutation = useDeleteTagMutation();

    return {
        deleteTag: deleteTagMutation.mutateAsync,
        isDeleting: deleteTagMutation.isPending,
    }
}
