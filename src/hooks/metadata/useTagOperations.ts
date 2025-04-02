
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types';
import { handleError } from '@/utils/errors';
import { ErrorLevel, ErrorSource } from '@/utils/errors/types';

interface UseTagOperationsProps {
  contentId: string;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

export function useTagOperations({ contentId, tags, setTags }: UseTagOperationsProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  
  /**
   * Add a new tag
   */
  const addTag = useCallback(async ({ name, typeId = null }: { name: string; typeId?: string | null }) => {
    if (!contentId || !name.trim()) return false;
    
    setIsAddingTag(true);
    
    try {
      // Create new tag object
      const newTagData = {
        name: name.trim(),
        content_id: contentId,
        type_id: typeId
      };
      
      // Insert tag into database
      const { data, error } = await supabase
        .from('tags')
        .insert(newTagData)
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Add tag to local state
        setTags([...tags, {
          id: data.id,
          name: data.name,
          content_id: data.content_id,
          type_id: data.type_id,
          type_name: data.type_name,
          display_order: data.display_order || tags.length
        }]);
        
        return true;
      }
      
      return false;
    } catch (err) {
      handleError(
        err,
        {
          message: `Failed to add tag "${name}"`,
          level: ErrorLevel.Warning,
          context: { contentId, tagName: name }
        }
      );
      return false;
    } finally {
      setIsAddingTag(false);
    }
  }, [contentId, tags, setTags]);
  
  /**
   * Delete a tag
   */
  const deleteTag = useCallback(async (tagId: string) => {
    if (!contentId || !tagId) return false;
    
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
      
      return true;
    } catch (err) {
      handleError(
        err,
        {
          message: 'Failed to delete tag',
          level: ErrorLevel.Warning,
          context: { contentId, tagId }
        }
      );
      return false;
    } finally {
      setIsDeletingTag(false);
    }
  }, [contentId, tags, setTags]);
  
  return {
    addTag,
    deleteTag,
    isAddingTag,
    isDeletingTag
  };
}
