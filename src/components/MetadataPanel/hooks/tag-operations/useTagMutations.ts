
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/tag';
import { handleError, ErrorLevel } from '@/utils/errors';
import { useAuth } from '@/hooks/useAuth';

interface UseTagMutationsProps {
  contentId: string;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

export interface TagPosition {
  id: string;
  position: number;
}

/**
 * Hook for tag mutation operations (add, delete, reorder)
 */
export const useTagMutations = ({ 
  contentId, 
  tags, 
  setTags 
}: UseTagMutationsProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const { user } = useAuth();
  
  /**
   * Add a new tag to the content
   */
  const addTag = useCallback(async ({ name, contentId, typeId }: { name: string; contentId: string; typeId: string | null; }) => {
    if (!name.trim() || !contentId) return false;
    
    setIsAddingTag(true);
    
    try {
      // Get the highest display order to place the new tag at the end
      const maxOrderTag = tags.reduce(
        (max, tag) => tag.display_order > max ? tag.display_order : max, 
        0
      );
      
      // Insert the new tag
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: name.trim(),
          content_id: contentId,
          type_id: typeId,
          display_order: maxOrderTag + 1
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the new tag to the state, ensuring it has a type_name
      const newTag: Tag = {
        ...data,
        type_name: '' // Add default type_name if needed
      };
      
      setTags([...tags, newTag]);
      
      return true;
    } catch (err) {
      handleError(
        err,
        `Failed to add tag "${name}"`,
        { level: ErrorLevel.Warning }
      );
      return false;
    } finally {
      setIsAddingTag(false);
    }
  }, [contentId, setTags, tags]);
  
  /**
   * Delete a tag from the content
   */
  const deleteTag = useCallback(async ({ tagId, contentId }: { tagId: string; contentId: string; }) => {
    if (!tagId || !contentId) return false;
    
    setIsDeletingTag(true);
    
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('content_id', contentId);
      
      if (error) throw error;
      
      // Remove the deleted tag from the state
      setTags(tags.filter(tag => tag.id !== tagId));
      
      return true;
    } catch (err) {
      handleError(
        err,
        `Failed to delete tag`,
        { level: ErrorLevel.Warning }
      );
      return false;
    } finally {
      setIsDeletingTag(false);
    }
  }, [contentId, setTags, tags]);
  
  /**
   * Reorder tags using drag-and-drop
   * Updates the display_order property in the database
   */
  const reorderTags = useCallback(async (tagPositions: TagPosition[]) => {
    if (!tagPositions?.length || !contentId) return false;
    
    setIsReordering(true);
    
    try {
      // Update the display_order of all affected tags directly with individual updates
      const updates = tagPositions.map(item => ({
        id: item.id,
        display_order: item.position,
        content_id: contentId
      }));
      
      // Update each tag individually since the batch RPC may not be available
      for (const update of updates) {
        const { error } = await supabase
          .from('tags')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
          .eq('content_id', update.content_id);
        
        if (error) throw error;
      }
      
      // Update the local state with the new order
      const updatedTags = [...tags].map(tag => {
        const position = tagPositions.find(pos => pos.id === tag.id);
        return position 
          ? { ...tag, display_order: position.position }
          : tag;
      }).sort((a, b) => a.display_order - b.display_order);
      
      setTags(updatedTags);
      
      return true;
    } catch (err) {
      handleError(
        err,
        `Failed to reorder tags`,
        { level: ErrorLevel.Warning }
      );
      return false;
    } finally {
      setIsReordering(false);
    }
  }, [contentId, setTags, tags]);
  
  return {
    addTag,
    deleteTag,
    reorderTags,
    isAddingTag,
    isDeletingTag,
    isReordering
  };
};
