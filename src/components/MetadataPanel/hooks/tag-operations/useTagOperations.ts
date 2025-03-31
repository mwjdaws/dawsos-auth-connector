
/**
 * useTagOperations Hook
 * 
 * This hook combines tag state management, fetching, and mutations into a single
 * interface for managing tag operations in the MetadataPanel component.
 * 
 * Architecture:
 * - State management: handled by useTagState
 * - Data fetching: handled by useTagFetch
 * - Data mutations: handled by useTagMutations
 * 
 * Features:
 * - Fetching tags for a content item
 * - Adding new tags
 * - Deleting tags
 * - Reordering tags via drag and drop
 * - Loading, error, and operation states
 */

import { useState, useCallback } from 'react';
import { useTagState } from './useTagState';
import { useTagFetch } from './useTagFetch';
import { useTagMutations } from './useTagMutations';
import { UseTagOperationsResult, Tag, TagPosition } from './types';
import { handleError } from '@/utils/error-handling';
import { useValidation } from '@/hooks/markdown-editor/draft-operations/useValidation';

/**
 * Main hook for tag operations that combines state, fetching, and mutations
 * 
 * @param contentId ID of the content to operate on
 * @returns Object containing tag data and functions to manipulate tags
 */
export const useTagOperations = (contentId: string): UseTagOperationsResult => {
  const { tags, setTags, isLoading, setIsLoading, error, setError, newTag, setNewTag } = useTagState({});
  const { isValidTag } = useValidation();
  
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
   * @param tagName Tag text to add
   * @param typeId Optional type ID for the tag
   */
  const handleAddTag = async (tagName: string, typeId?: string | null) => {
    if (!tagName.trim()) return;
    
    // Validate the tag first
    const validation = isValidTag(tagName);
    if (!validation.isValid) {
      handleError(
        new Error(validation.errorMessage || 'Invalid tag'),
        validation.errorMessage || 'Invalid tag',
        { level: "warning", technical: false }
      );
      return;
    }
    
    try {
      const result = await addTag({ 
        name: tagName, 
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
