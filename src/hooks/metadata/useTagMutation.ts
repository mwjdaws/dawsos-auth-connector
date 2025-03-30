
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTag, deleteTag, Tag } from '@/utils/api-utils';
import { queryKeys } from '@/utils/query-keys';
import { toast } from '@/hooks/use-toast';

interface AddTagVariables {
  contentId: string;
  name: string;
  typeId?: string;
}

/**
 * Hook for adding a tag to content
 */
export function useAddTagMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contentId, name, typeId }: AddTagVariables) => 
      addTag(contentId, name, typeId),
    
    onSuccess: (newTag, variables) => {
      // Update the cache with the new tag
      queryClient.setQueryData<Tag[]>(
        queryKeys.tags.byContentId(variables.contentId),
        (oldTags = []) => [...oldTags, newTag]
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.tags.summary
      });
      
      toast({
        title: "Tag Added",
        description: `The tag "${variables.name}" was added successfully.`,
      });
    },
    
    onError: (error: Error) => {
      toast({
        title: "Error Adding Tag",
        description: error.message || "Failed to add tag",
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
    mutationFn: ({ tagId, contentId }: { tagId: string, contentId: string }) => 
      deleteTag(tagId),
    
    onSuccess: (_, variables) => {
      // Update the cache by removing the deleted tag
      queryClient.setQueryData<Tag[]>(
        queryKeys.tags.byContentId(variables.contentId),
        (oldTags = []) => oldTags.filter(tag => tag.id !== variables.tagId)
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.tags.summary
      });
      
      toast({
        title: "Tag Deleted",
        description: "The tag was removed successfully.",
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
 * Combined hook that provides both add and delete mutations
 */
export function useTagMutations() {
  const addTagMutation = useAddTagMutation();
  const deleteTagMutation = useDeleteTagMutation();
  
  return {
    addTag: addTagMutation.mutate,
    deleteTag: deleteTagMutation.mutate,
    isAddingTag: addTagMutation.isPending,
    isDeletingTag: deleteTagMutation.isPending,
    addTagError: addTagMutation.error,
    deleteTagError: deleteTagMutation.error,
  };
}
