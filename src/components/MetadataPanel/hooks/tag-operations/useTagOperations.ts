
import { useState, useCallback } from 'react';
import { useTagState } from './useTagState';
import { useTagFetch } from './useTagFetch';
import { useTagMutations } from './useTagMutations';
import type { Tag, UseTagOperationsResult } from './types';

/**
 * Main hook for tag operations that combines state, fetching, and mutations
 */
export const useTagOperations = (contentId: string): UseTagOperationsResult => {
  const { tags, setTags } = useTagState();
  const [newTag, setNewTag] = useState('');
  
  // Set up tag fetching
  const { 
    fetchTags, 
    isLoading, 
    error 
  } = useTagFetch({ 
    contentId, 
    setTags 
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
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    const result = await addTag({ 
      name: newTag, 
      contentId 
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
  const handleReorderTags = async (tagPositions: { id: string; position: number }[]) => {
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
    isReordering
  };
};
