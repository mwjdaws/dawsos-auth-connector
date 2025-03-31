
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AddTagParams, DeleteTagParams, Tag, TagPosition, UseTagMutationsProps, UseTagMutationsResult } from './types';

export function useTagMutations({
  contentId,
  setTags,
  tags
}: UseTagMutationsProps): UseTagMutationsResult {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  
  // Add a new tag
  const addTag = useCallback(async (params: AddTagParams): Promise<boolean> => {
    const { name, contentId: tagContentId, typeId } = params;
    
    if (!name.trim() || !tagContentId) {
      return false;
    }
    
    try {
      setIsAddingTag(true);
      
      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name: name.trim().toLowerCase(),
          content_id: tagContentId,
          type_id: typeId || null,
          display_order: tags.length // Add at the end by default
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (!data || data.length === 0) {
        return false;
      }
      
      const newTag: Tag = {
        id: data[0].id,
        name: data[0].name,
        content_id: data[0].content_id,
        type_id: data[0].type_id,
        display_order: data[0].display_order || 0
      };
      
      // Update the local tags state
      setTags([...tags, newTag]);
      
      toast({
        title: 'Tag added',
        description: `Added tag "${name}"`,
      });
      
      return true;
    } catch (err) {
      console.error('Error adding tag:', err);
      toast({
        title: 'Error',
        description: 'Failed to add tag',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsAddingTag(false);
    }
  }, [tags, setTags]);
  
  // Delete a tag
  const deleteTag = useCallback(async (params: DeleteTagParams): Promise<boolean> => {
    const { tagId, contentId: tagContentId } = params;
    
    if (!tagId || !tagContentId) {
      return false;
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
      
      return true;
    } catch (err) {
      console.error('Error deleting tag:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete tag',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeletingTag(false);
    }
  }, [tags, setTags]);
  
  // Reorder tags
  const reorderTags = useCallback(async (positions: TagPosition[]): Promise<boolean> => {
    try {
      setIsReordering(true);
      
      // Update each tag's display_order in the database
      const updates = positions.map(pos => 
        supabase
          .from('tags')
          .update({ display_order: pos.position })
          .eq('id', pos.id)
      );
      
      // Execute all updates in parallel
      await Promise.all(updates);
      
      // Update local state
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
      
      return true;
    } catch (err) {
      console.error('Error reordering tags:', err);
      toast({
        title: 'Error',
        description: 'Failed to reorder tags',
        variant: 'destructive',
      });
      return false;
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
