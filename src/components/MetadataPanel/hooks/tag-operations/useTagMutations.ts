
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tag, UseTagMutationsProps, UseTagMutationsResult } from './types';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

/**
 * Hook for tag mutations (add, delete, reorder)
 */
export const useTagMutations = ({
  contentId,
  setTags,
  tags = []
}: UseTagMutationsProps): UseTagMutationsResult => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  /**
   * Add a new tag
   */
  const addTag = async ({ name, contentId, type_id = null }: { name: string; contentId: string; type_id?: string | null }): Promise<Tag | null> => {
    if (!isValidContentId(contentId) || !name.trim()) {
      return null;
    }

    setIsAddingTag(true);
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: name.trim(),
          content_id: contentId,
          type_id
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      const newTag: Tag = {
        id: data.id,
        name: data.name,
        content_id: data.content_id,
        type_id: data.type_id,
        type_name: null
      };

      setTags(prevTags => [...prevTags, newTag]);
      return newTag;
    } catch (err) {
      console.error('Error adding tag:', err);
      return null;
    } finally {
      setIsAddingTag(false);
    }
  };

  /**
   * Delete a tag
   */
  const deleteTag = async ({ tagId, contentId }: { tagId: string; contentId: string }): Promise<boolean> => {
    if (!isValidContentId(contentId) || !tagId) {
      return false;
    }

    setIsDeletingTag(true);
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .match({ id: tagId, content_id: contentId });

      if (error) throw new Error(error.message);

      setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
      return true;
    } catch (err) {
      console.error('Error deleting tag:', err);
      return false;
    } finally {
      setIsDeletingTag(false);
    }
  };

  /**
   * Reorder tags
   */
  const reorderTags = async (tagPositions: { id: string; position: number }[]): Promise<boolean> => {
    if (!isValidContentId(contentId) || tagPositions.length === 0) {
      return false;
    }

    setIsReordering(true);
    try {
      // In a real implementation, we would update tag positions in the database
      // For now, we'll just sort the tags in memory
      const posMap = new Map(tagPositions.map(p => [p.id, p.position]));
      
      setTags(prevTags => {
        // First sort by the provided positions
        const sortedTags = [...prevTags];
        sortedTags.sort((a, b) => {
          const posA = posMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
          const posB = posMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;
          return posA - posB;
        });
        return sortedTags;
      });
      
      return true;
    } catch (err) {
      console.error('Error reordering tags:', err);
      return false;
    } finally {
      setIsReordering(false);
    }
  };

  return {
    addTag,
    deleteTag,
    reorderTags,
    isAddingTag,
    isDeletingTag,
    isReordering
  };
};
