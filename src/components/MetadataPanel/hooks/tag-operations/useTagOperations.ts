
import { useState, useCallback } from 'react';
import { useTagState } from './useTagState';
import { useTagFetch } from './useTagFetch';
import { useTagMutations } from './useTagMutations';
import { UseTagOperationsProps, UseTagOperationsResult, TagPosition, Tag } from './types';

/**
 * Main hook for tag operations that combines state, fetching, and mutations
 */
export const useTagOperations = (contentId: string): UseTagOperationsResult => {
  const { tags, setTags, isLoading, setIsLoading, error, setError, newTag, setNewTag } = useTagState({});
  
  // Set up tag fetching
  const { 
    fetchTags,
  } = useTagFetch({ 
    contentId, 
    setTags,
    setIsLoading,
    setError
  });
  
  // Set up tag mutations
  const { 
    addTag, 
    deleteTag, 
    reorderTags, 
    isAddingTag, 
    isDeletingTag, 
    isReordering 
  } = useTagMutations({
    contentId,
    setTags,
    tags
  });
  
  // Fetch tags on initial load
  const handleRefresh = useCallback(async () => {
    await fetchTags();
  }, [fetchTags]);
  
  // Handle adding a tag
  const handleAddTag = async (typeId?: string | null) => {
    if (!newTag.trim()) return;
    
    const result = await addTag({ 
      name: newTag, 
      contentId,
      typeId: typeId || null
    });
    
    if (result) {
      setNewTag('');
    }
  };
  
  // Handle deleting a tag
  const handleDeleteTag = async (tagId: string) => {
    await deleteTag({ tagId, contentId });
  };
  
  // Handle reordering tags
  const handleReorderTags = async (tagPositions: TagPosition[]) => {
    await reorderTags(tagPositions);
  };
  
  return {
    tags,
    isLoading,
    error,
    newTag,
    setNewTag,
    handleAddTag,
    handleDeleteTag,
    handleReorderTags,
    handleRefresh,
    isAddingTag,
    isDeletingTag,
    isReordering,
    // Backward compatibility properties
    isTagsLoading: isLoading,
    tagsError: error
  };
};
