
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/tag';
import { handleError } from '@/utils/errors';
import { ErrorLevel, ErrorSource } from '@/utils/errors/types';

interface UseTagOperationsProps {
  contentId: string;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

export interface UseTagOperationsResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  newTag: string;
  setNewTag: (name: string) => void;
  handleAddTag: (typeId?: string | null) => Promise<void>;
  handleDeleteTag: (tagId: string) => Promise<void>;
  handleReorderTags: (updatedTags: Tag[]) => Promise<void>;
  handleRefresh: () => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
  // Legacy/backward compatibility properties
  isTagsLoading: boolean;
  tagsError: Error | null;
}

/**
 * Main hook for tag operations that combines state, fetching, and mutations
 * 
 * @param contentId ID of the content to operate on (accepts both UUID and temporary IDs)
 * @returns Object containing tag data and functions to manipulate tags
 */
export const useTagOperations = (contentId: string): UseTagOperationsResult => {
  // Hook implementation here (using useState, useCallback, etc.)
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  
  // Fetch tags from the database
  const fetchTags = useCallback(async () => {
    if (!contentId) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('content_id', contentId)
        .order('display_order');
      
      if (error) throw error;
      
      setTags(data || []);
    } catch (err) {
      handleError(
        err,
        {
          message: "Failed to fetch tags",
          level: ErrorLevel.Warning,
          source: ErrorSource.Hook,
          context: { contentId }
        }
      );
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);
  
  // Add a new tag to the content
  const handleAddTag = useCallback(async (typeId?: string | null) => {
    if (!newTag.trim()) return;
    
    // Check if the tag name is valid
    if (newTag.trim().length < 2) {
      handleError(
        new Error('Tag must be at least 2 characters long'),
        {
          message: 'Tag must be at least 2 characters long',
          level: ErrorLevel.Warning,
          source: ErrorSource.Validation,
          context: { contentId, tagName: newTag }
        }
      );
      return;
    }
    
    setIsAddingTag(true);
    
    try {
      // Create new tag object
      const newTagData = {
        name: newTag.trim(),
        content_id: contentId,
        type_id: typeId || null
      };
      
      // Insert tag into database
      const { data, error } = await supabase
        .from('tags')
        .insert(newTagData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        setTags([...tags, {
          ...data,
          type_name: null // Ensure type_name is set
        }]);
        setNewTag('');
      }
    } catch (err) {
      handleError(
        err,
        {
          message: `Failed to add tag "${newTag}"`,
          level: ErrorLevel.Warning,
          source: ErrorSource.Hook,
          context: { contentId, tagName: newTag }
        }
      );
    } finally {
      setIsAddingTag(false);
    }
  }, [contentId, newTag, tags]);
  
  // Delete a tag from the content
  const handleDeleteTag = useCallback(async (tagId: string) => {
    if (!contentId || !tagId) return;
    
    setIsDeletingTag(true);
    
    try {
      // Delete from database
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('content_id', contentId);
      
      if (error) throw error;
      
      // Remove from local state
      setTags(tags.filter(tag => tag.id !== tagId));
    } catch (err) {
      handleError(
        err,
        {
          message: "Failed to delete tag",
          level: ErrorLevel.Warning,
          source: ErrorSource.Hook,
          context: { contentId, tagId }
        }
      );
    } finally {
      setIsDeletingTag(false);
    }
  }, [contentId, tags]);
  
  // Reorder tags using drag-and-drop
  const handleReorderTags = useCallback(async (updatedTags: Tag[]) => {
    if (!contentId) return;
    
    setIsReordering(true);
    
    try {
      // Update positions based on the order of updatedTags
      const tagPositions = updatedTags.map((tag, index) => ({
        id: tag.id,
        position: index
      }));
      
      // Update each tag individually
      for (const position of tagPositions) {
        const { error } = await supabase
          .from('tags')
          .update({ display_order: position.position })
          .eq('id', position.id)
          .eq('content_id', contentId);
        
        if (error) throw error;
      }
      
      // Update local state with new order
      setTags(updatedTags);
    } catch (err) {
      handleError(
        err,
        {
          message: "Failed to reorder tags",
          level: ErrorLevel.Warning,
          source: ErrorSource.Hook,
          context: { contentId }
        }
      );
    } finally {
      setIsReordering(false);
    }
  }, [contentId]);
  
  // Refresh tags
  const handleRefresh = useCallback(async () => {
    try {
      await fetchTags();
    } catch (err) {
      handleError(
        err,
        {
          message: "Failed to refresh tags",
          level: ErrorLevel.Warning,
          source: ErrorSource.Hook,
          context: { contentId }
        }
      );
    }
  }, [contentId, fetchTags]);
  
  // Load tags on mount
  useCallback(() => {
    if (contentId) {
      fetchTags();
    }
  }, [contentId, fetchTags]);
  
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
    // Legacy properties for backward compatibility
    isTagsLoading: isLoading,
    tagsError: error
  };
};
