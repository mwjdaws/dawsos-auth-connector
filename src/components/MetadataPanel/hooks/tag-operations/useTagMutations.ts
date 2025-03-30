
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { TagPosition } from '@/utils/validation/types';
import type { Tag } from '@/types';

interface UseTagMutationsProps {
  contentId: string;
}

export interface UseTagMutationsResult {
  addTag: (params: { name: string; contentId?: string }) => Promise<void>;
  deleteTag: (params: { tagId: string; contentId?: string }) => Promise<void>;
  reorderTags: (positions: TagPosition[]) => Promise<void>;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
}

export const useTagMutations = ({ contentId }: UseTagMutationsProps): UseTagMutationsResult => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isDeletingTag, setIsDeletingTag] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const addTag = async ({ name, contentId: overrideContentId }: { name: string; contentId?: string }): Promise<void> => {
    const effectiveContentId = overrideContentId || contentId;
    
    if (!isValidContentId(effectiveContentId) || !name.trim()) {
      return;
    }
    
    try {
      setIsAddingTag(true);
      
      // Add tag to database
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: name.trim(), 
          content_id: effectiveContentId
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
    } catch (err) {
      console.error('Error adding tag:', err);
      throw err;
    } finally {
      setIsAddingTag(false);
    }
  };
  
  const deleteTag = async ({ tagId, contentId: overrideContentId }: { tagId: string; contentId?: string }): Promise<void> => {
    const effectiveContentId = overrideContentId || contentId;
    
    if (!isValidContentId(effectiveContentId) || !tagId) {
      return;
    }
    
    try {
      setIsDeletingTag(true);
      
      // Delete tag from database
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId)
        .eq('content_id', effectiveContentId);
      
      if (error) {
        throw new Error(error.message);
      }
      
    } catch (err) {
      console.error('Error deleting tag:', err);
      throw err;
    } finally {
      setIsDeletingTag(false);
    }
  };
  
  const reorderTags = async (positions: TagPosition[]): Promise<void> => {
    if (!isValidContentId(contentId) || !positions.length) {
      return;
    }
    
    try {
      setIsReordering(true);

      // In a real implementation, this would update tag positions in the database
      // For now, this is a stub implementation
      console.log('Reordering tags:', positions);
      
      // Simulate a delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.error('Error reordering tags:', err);
      throw err;
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
