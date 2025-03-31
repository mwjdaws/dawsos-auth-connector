
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/tag';
import { TagPosition } from '@/utils/validation/types';
import { handleError } from '@/utils/error-handling';

interface UseTagMutationsProps {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  tags: Tag[];
}

interface AddTagParams {
  name: string;
  contentId: string;
  typeId?: string | null;
  display_order?: number;
}

interface DeleteTagParams {
  tagId: string;
  contentId: string;
}

export const useTagMutations = ({ contentId, setTags, tags }: UseTagMutationsProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  
  /**
   * Add a new tag
   */
  const addTag = async (params: AddTagParams): Promise<Tag | null> => {
    try {
      setIsAddingTag(true);
      
      // Calculate display order if not provided
      const displayOrder = params.display_order !== undefined 
        ? params.display_order 
        : (tags && tags.length > 0) 
          ? Math.max(...tags.map(t => t.display_order || 0)) + 1 
          : 0;
      
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: params.name,
          content_id: params.contentId,
          type_id: params.typeId ?? null, // Use null if typeId is undefined
          display_order: displayOrder
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Update local state with the new tag
      const newTag = data as Tag;
      setTags([...tags, newTag]);
      
      return newTag;
    } catch (error) {
      handleError(
        error,
        `Failed to add tag "${params.name}"`,
        { level: "warning", contentId: params.contentId }
      );
      return null;
    } finally {
      setIsAddingTag(false);
    }
  };
  
  /**
   * Delete a tag
   */
  const deleteTag = async (params: DeleteTagParams): Promise<boolean> => {
    try {
      setIsDeletingTag(true);
      
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', params.tagId)
        .eq('content_id', params.contentId);
      
      if (error) {
        throw error;
      }
      
      // Update local state by removing the deleted tag
      setTags(tags.filter(tag => tag.id !== params.tagId));
      
      return true;
    } catch (error) {
      handleError(
        error,
        "Failed to delete tag",
        { level: "warning", contentId: params.contentId }
      );
      return false;
    } finally {
      setIsDeletingTag(false);
    }
  };
  
  /**
   * Reorder tags by updating their display_order values
   */
  const reorderTags = async (positions: TagPosition[]): Promise<boolean> => {
    try {
      setIsReordering(true);
      
      // Create an array of updates to perform in a transaction
      const updates = positions.map(position => ({
        id: position.id,
        display_order: position.position
      }));
      
      // Update all tags in a single batch operation
      const { error } = await supabase
        .from('tags')
        .upsert(updates, {
          onConflict: 'id'
        });
      
      if (error) {
        throw error;
      }
      
      // Update local state with the new order
      // Create a map of tag ID -> new display_order for fast lookup
      const orderMap = new Map<string, number>();
      positions.forEach(pos => orderMap.set(pos.id, pos.position));
      
      // Apply the new order to the tags
      const updatedTags = tags.map(tag => {
        const newOrder = orderMap.get(tag.id);
        if (newOrder !== undefined) {
          return { ...tag, display_order: newOrder };
        }
        return tag;
      });
      
      setTags(updatedTags);
      
      return true;
    } catch (error) {
      handleError(
        error,
        "Failed to reorder tags",
        { level: "warning", contentId }
      );
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
