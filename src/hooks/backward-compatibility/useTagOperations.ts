
/**
 * This is a backward compatibility layer for the tag operations hooks
 * It ensures that code written for the old API can still work with the new hooks.
 */
import { useState, useEffect, useCallback } from 'react';
import { useTagsQuery } from '../metadata/useTagsQuery';
import { useTagMutations } from '../metadata/useTagMutation';
import { Tag } from '@/types/tag';
import { toast } from '../use-toast';
import { isValidContentId } from '@/utils/content-validation';
import { handleError } from '@/utils/error-handling';

/**
 * useTagOperations hook (compatibility layer)
 */
export function useTagOperations(contentId: string) {
  // State
  const [newTag, setNewTag] = useState('');
  
  // Fetch tags with React Query
  const { 
    data: tags = [], 
    isLoading, 
    error, 
    refetch: fetchTags 
  } = useTagsQuery(contentId);
  
  // Tag mutations
  const { 
    addTag, 
    deleteTag, 
    updateTagOrder,
    isAddingTag,
    isDeletingTag,
    isUpdatingOrder
  } = useTagMutations(contentId);
  
  // Validate content ID
  const isValidContent = isValidContentId(contentId);
  
  /**
   * Add a tag handler
   */
  const handleAddTag = useCallback(async (typeId?: string | null) => {
    if (!newTag.trim() || !isValidContent) {
      if (!isValidContent) {
        toast({
          title: "Invalid Content ID",
          description: "Cannot add tag to invalid content",
          variant: "destructive"
        });
      }
      return;
    }
    
    try {
      await addTag({
        name: newTag.trim(),
        contentId,
        typeId: typeId ?? null
      });
      
      setNewTag('');
    } catch (err) {
      handleError(
        err,
        "Failed to add tag",
        { level: "warning", technical: false }
      );
    }
  }, [newTag, contentId, isValidContent, addTag]);
  
  /**
   * Delete a tag handler
   */
  const handleDeleteTag = useCallback(async (tagId: string) => {
    if (!isValidContent) {
      toast({
        title: "Invalid Content ID",
        description: "Cannot delete tag from invalid content",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await deleteTag({ tagId, contentId });
    } catch (err) {
      handleError(
        err,
        "Failed to delete tag",
        { level: "warning", technical: false }
      );
    }
  }, [contentId, isValidContent, deleteTag]);
  
  /**
   * Refresh tags data
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
   * Reorder tags with proper database update
   */
  const handleReorderTags = useCallback(async (reorderedTags: Tag[]) => {
    if (!contentId || reorderedTags.length === 0) return;
    
    // Convert to positions array
    const positions = reorderedTags.map((tag, index) => ({
      id: tag.id,
      position: index
    }));
    
    try {
      await updateTagOrder(positions);
    } catch (err) {
      handleError(
        err,
        "Failed to reorder tags",
        { level: "warning", technical: false }
      );
    }
  }, [contentId, updateTagOrder]);
  
  // Return the compatibility API
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
    isReordering: isUpdatingOrder,
    
    // Backward compatibility properties
    isTagsLoading: isLoading,
    tagsError: error
  };
}

// Default export for compatibility
export default useTagOperations;
