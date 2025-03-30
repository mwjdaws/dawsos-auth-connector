
import { useState, useCallback } from 'react';
import { useTagFetch } from './useTagFetch';
import { useTagMutations } from './useTagMutations';
import { useTagState } from './useTagState';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

/**
 * Hook that combines tag fetching, state management, and mutations
 * Provides a comprehensive API for tag operations
 */
export const useTagOperations = (contentId: string) => {
  const { data: tags = [], isLoading, error, refetch } = useTagFetch(contentId);
  const { newTag, setNewTag } = useTagState();
  const { addTagMutation, deleteTagMutation, updateTagOrderMutation, isPending } = useTagMutations(contentId);

  // Handler to add a tag
  const handleAddTag = useCallback(async () => {
    if (!newTag.trim()) {
      toast({
        title: 'Tag name cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidContentId(contentId)) {
      toast({
        title: 'Invalid content ID',
        description: 'Cannot add tags to invalid content',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addTagMutation.mutateAsync({ name: newTag.trim() });
      setNewTag('');
    } catch (err) {
      // Error handling is done in the mutation
    }
  }, [newTag, contentId, addTagMutation, setNewTag]);

  // Handler to delete a tag
  const handleDeleteTag = useCallback(
    async (tagId: string) => {
      if (!isValidContentId(contentId)) {
        toast({
          title: 'Invalid content ID',
          description: 'Cannot remove tags from invalid content',
          variant: 'destructive',
        });
        return;
      }

      try {
        await deleteTagMutation.mutateAsync(tagId);
      } catch (err) {
        // Error handling is done in the mutation
      }
    },
    [contentId, deleteTagMutation]
  );

  // Handler to update tag order
  const handleUpdateTagOrder = useCallback(
    async (reorderedTags: { id: string; position?: number }[]) => {
      if (!isValidContentId(contentId)) {
        handleError(
          new Error('Invalid content ID'),
          'Cannot update tag order for invalid content'
        );
        return;
      }

      try {
        await updateTagOrderMutation.mutateAsync(reorderedTags);
      } catch (err) {
        // Error handling is done in the mutation
      }
    },
    [contentId, updateTagOrderMutation]
  );

  // Handler to manually refresh tags
  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
      toast({
        title: 'Tags refreshed',
        variant: 'default',
      });
    } catch (err) {
      handleError(
        err instanceof Error ? err : new Error('Failed to refresh tags'),
        'Could not refresh tags'
      );
    }
  }, [refetch]);

  return {
    tags,
    isLoading,
    error,
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag,
    handleUpdateTagOrder,
    handleRefresh,
    isPending,
  };
};
