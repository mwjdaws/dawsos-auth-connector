
/**
 * useTagOperations Hook
 * 
 * This hook combines tag state management, fetching, and mutations into a single
 * interface for managing tag operations in the MetadataPanel component.
 */

import { useState, useCallback } from 'react';
import { useTagState } from './useTagState';
import { useTagFetch } from './useTagFetch';
import { useTagMutations } from './useTagMutations';
import { UseTagOperationsResult, Tag, TagPosition } from './types';
import { handleError } from '@/utils/error-handling';

/**
 * Main hook for tag operations that combines state, fetching, and mutations
 * 
 * @param contentId ID of the content to operate on
 * @returns Object containing tag data and functions to manipulate tags
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
  
  /**
   * Fetch tags for the current content ID
   * This is used to refresh tag data when needed
   */
  const handleRefresh = useCallback(async () => {
    try {
      await fetchTags();
    } catch (err) {
      handleError(
        err,
        "Failed to refresh tags",
        { level: "warning", technical: false }
      );
    }
  }, [fetchTags]);
  
  /**
   * Add a new tag to the content
   * 
   * @param typeId Optional type ID for the tag
   */
  const handleAddTag = async (typeId?: string | null) => {
    if (!newTag.trim()) return;
    
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
      handleError(
        err,
        "Failed to add tag",
        { level: "warning", technical: false }
      );
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
      handleError(
        err,
        "Failed to delete tag",
        { level: "warning", technical: false }
      );
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
    const tagPositions: TagPosition[] = updatedTags.map((tag, index) => ({
      id: tag.id,
      position: index
    }));
    
    try {
      await reorderTags(tagPositions);
    } catch (err) {
      handleError(
        err,
        "Failed to reorder tags",
        { level: "warning", technical: false }
      );
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
    isReordering,
    // Backward compatibility properties
    isTagsLoading: isLoading,
    tagsError: error
  };
};
