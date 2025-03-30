
import { useState, useCallback } from 'react';
import { useAddTagMutation } from '@/hooks/metadata/useTagMutation';
import { Tag, UseTagMutationsProps, UseTagMutationsResult, TagPosition } from './types';

export function useTagMutations({
  contentId,
  setTags,
  tags
}: UseTagMutationsProps): UseTagMutationsResult {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  
  // Use the hook provided by the application
  const { mutateAsync: mutateTag } = useAddTagMutation();
  
  // Add tag mutation
  const addTag = useCallback(async ({ 
    name, 
    contentId, 
    typeId 
  }: { 
    name: string; 
    contentId: string; 
    typeId?: string 
  }): Promise<Tag | null> => {
    if (!name.trim() || !contentId) {
      return null;
    }
    
    try {
      setIsAddingTag(true);
      
      const newApiTag = await mutateTag({ 
        name, 
        contentId,
        typeId: typeId || null
      });
      
      if (!newApiTag) {
        return null;
      }
      
      const newTag: Tag = {
        id: newApiTag.id,
        name: newApiTag.name,
        content_id: newApiTag.content_id || contentId,
        type_id: newApiTag.type_id
      };
      
      setTags(prevTags => [...prevTags, newTag]);
      
      return newTag;
    } catch (error) {
      console.error('Error adding tag:', error);
      return null;
    } finally {
      setIsAddingTag(false);
    }
  }, [contentId, mutateTag, setTags]);
  
  // Delete tag mutation
  const deleteTag = useCallback(async ({ 
    tagId, 
    contentId 
  }: { 
    tagId: string; 
    contentId: string 
  }): Promise<boolean> => {
    if (!tagId || !contentId) {
      return false;
    }
    
    try {
      setIsDeletingTag(true);
      
      // Remove from local state immediately for optimistic UI
      setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
      
      // TODO: Replace with actual API call when available
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      console.error('Error deleting tag:', error);
      return false;
    } finally {
      setIsDeletingTag(false);
    }
  }, [setTags]);
  
  // Reorder tags mutation
  const reorderTags = useCallback(async (tagPositions: TagPosition[]): Promise<boolean> => {
    if (!tagPositions.length) {
      return false;
    }
    
    try {
      setIsReordering(true);
      
      // Map positions to current tags to create new ordered array
      const orderedTags = tagPositions
        .map(pos => {
          const tag = tags.find(t => t.id === pos.id);
          return tag ? { ...tag, position: pos.position } : null;
        })
        .filter((tag): tag is Tag & { position: number } => tag !== null)
        .sort((a, b) => a.position - b.position)
        .map(({ position, ...tag }) => tag); // Remove temporary position property
      
      // Update local state
      setTags(orderedTags);
      
      // TODO: Replace with actual API call when available
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return true;
    } catch (error) {
      console.error('Error reordering tags:', error);
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
