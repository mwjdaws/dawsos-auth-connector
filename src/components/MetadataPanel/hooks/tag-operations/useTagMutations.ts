
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AddTagParams, Tag, TagOperationParams, TagPosition, UseTagMutationsProps, UseTagMutationsResult } from './types';

export function useTagMutations({
  contentId,
  setTags,
  tags
}: UseTagMutationsProps): UseTagMutationsResult {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  
  // Add a new tag
  const addTag = useCallback(async ({ name, contentId: tagContentId, typeId }: AddTagParams): Promise<Tag | null> => {
    if (!name.trim() || !tagContentId) {
      return null;
    }
    
    try {
      setIsAddingTag(true);
      
      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name: name.trim().toLowerCase(),
          content_id: tagContentId,
          type_id: typeId || null
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        return null;
      }
      
      const newTag: Tag = {
        id: data[0].id,
        name: data[0].name,
        content_id: data[0].content_id || '', // Handle null for backward compatibility
        type_id: data[0].type_id
      };
      
      // Update the local tags state
      setTags([...tags, newTag]);
      
      toast({
        title: 'Tag added',
        description: `Added tag "${name}"`,
      });
      
      return newTag;
    } catch (err) {
      console.error('Error adding tag:', err);
      toast({
        title: 'Error',
        description: 'Failed to add tag',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsAddingTag(false);
    }
  }, [tags, setTags]);
  
  // Delete a tag
  const deleteTag = useCallback(async ({ tagId, contentId: tagContentId }: TagOperationParams): Promise<void> => {
    if (!tagId || !tagContentId) {
      return;
    }
    
    try {
      setIsDeletingTag(true);
      
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);
      
      if (error) {
        throw error;
      }
      
      // Update the local tags state
      setTags(tags.filter(tag => tag.id !== tagId));
      
      toast({
        title: 'Tag deleted',
        description: 'Tag was successfully removed',
      });
    } catch (err) {
      console.error('Error deleting tag:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete tag',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingTag(false);
    }
  }, [tags, setTags]);
  
  // Reorder tags
  const reorderTags = useCallback(async (positions: TagPosition[]): Promise<void> => {
    try {
      setIsReordering(true);
      
      // For now, just update the local state based on position
      // A more complete implementation would persist this to the database
      const positionMap = new Map<string, number>();
      positions.forEach(pos => positionMap.set(pos.id, pos.position));
      
      const sortedTags = [...tags].sort((a, b) => {
        const posA = positionMap.get(a.id) || 0;
        const posB = positionMap.get(b.id) || 0;
        return posA - posB;
      });
      
      setTags(sortedTags);
      
      toast({
        title: 'Tags reordered',
        description: 'Tag order updated successfully',
      });
    } catch (err) {
      console.error('Error reordering tags:', err);
      toast({
        title: 'Error',
        description: 'Failed to reorder tags',
        variant: 'destructive',
      });
    } finally {
      setIsReordering(false);
    }
  }, [tags, setTags]);
  
  return {
    addTag,
    deleteTag,
    reorderTags,
    isAddingTag,
    isDeletingTag,
    isReordering
  };
}
