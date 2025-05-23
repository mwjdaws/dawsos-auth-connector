
import { useState, useCallback } from 'react';
import { useTagState } from './useTagState';
import { useTagFetch } from './useTagFetch';
import { useTagMutations } from './useTagMutations';
import { Tag } from '@/types/tag';
import { handleErrorWithOptions } from '@/utils/errors/handleErrorWithOptions';
import { ErrorLevel, ErrorSource } from '@/utils/errors/types';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { UseTagOperationsResult } from './types';

/**
 * Main hook for tag operations that combines state, fetching, and mutations
 * 
 * @param contentId ID of the content to operate on (accepts both UUID and temporary IDs)
 * @returns Object containing tag data and functions to manipulate tags
 */
export const useTagOperations = (contentId: string): UseTagOperationsResult => {
  // Validate the content ID first
  if (contentId && !isValidContentId(contentId)) {
    console.warn(`Invalid content ID format: ${contentId}`);
  }
  
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
  
  /**
   * Fetch tags for the current content ID
   * This is used to refresh tag data when needed
   */
  const handleRefresh = useCallback(async () => {
    try {
      await fetchTags();
    } catch (err) {
      handleErrorWithOptions(err, "Failed to refresh tags", {
        level: ErrorLevel.Warning,
        source: ErrorSource.Hook
      });
    }
  }, [fetchTags]);
  
  /**
   * Add a new tag to the content
   * 
   * @param typeId Optional type ID for the tag
   */
  const handleAddTag = async (typeId?: string | null) => {
    if (!newTag.trim()) return;
    
    // Check if the tag name is valid
    if (newTag.trim().length < 2) {
      handleErrorWithOptions(
        new Error('Tag must be at least 2 characters long'),
        "Tag must be at least 2 characters long",
        {
          level: ErrorLevel.Warning,
          source: ErrorSource.Validation
        }
      );
      return;
    }
    
    try {
      const result = await addTag({ 
        name: newTag, 
        contentId,
        typeId: typeId || null
      });
      
      if (result) {
        setNewTag('');
      }
    } catch (err) {
      handleErrorWithOptions(err, "Failed to add tag", {
        level: ErrorLevel.Warning,
        source: ErrorSource.Hook
      });
    }
  };
  
  /**
   * Delete a tag from the content
   * 
   * @param tagId ID of the tag to delete
   */
  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTag({ tagId, contentId });
    } catch (err) {
      handleErrorWithOptions(err, "Failed to delete tag", {
        level: ErrorLevel.Warning,
        source: ErrorSource.Hook
      });
    }
  };
  
  /**
   * Reorder tags using drag-and-drop
   * Updates the display_order property in the database
   * 
   * @param updatedTags New tag order
   */
  const handleReorderTags = async (updatedTags: Tag[]) => {
    // Convert tags to positions
    const tagPositions = updatedTags.map((tag, index) => ({
      id: tag.id,
      position: index
    }));
    
    try {
      await reorderTags(tagPositions);
    } catch (err) {
      handleErrorWithOptions(err, "Failed to reorder tags", {
        level: ErrorLevel.Warning,
        source: ErrorSource.Hook
      });
    }
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
