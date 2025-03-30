
import { useState } from 'react';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import type { Tag } from '@/types';
import { useTagState } from './useTagState';
import { useTagFetch } from './useTagFetch';
import { useTagMutations } from './useTagMutations';

// Define the interface for useTagOperations return value
export interface UseTagOperationsResult {
  newTag: string;
  setNewTag: (value: string) => void;
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  isAddingTag: boolean;
  isDeletingTag: boolean;
  isReordering: boolean;
  fetchTags: () => Promise<Tag[]>;
  refreshTags: () => Promise<void>;
  handleAddTag: () => void;
  handleDeleteTag: (tagId: string) => void;
  reorderTags: (positions: { id: string; position: number }[]) => Promise<void>;
}

export const useTagOperations = (contentId: string): UseTagOperationsResult => {
  const isValid = isValidContentId(contentId);
  const [newTag, setNewTag] = useState('');
  
  // Use the tag state hook
  const {
    tags,
    setTags,
  } = useTagState();

  // Additional state to handle loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use the tag fetch hook
  const { fetchTags } = useTagFetch(contentId);
  
  // Manual refreshTags implementation
  const refreshTags = async () => {
    if (!isValid) return;
    try {
      setIsLoading(true);
      const fetchedTags = await fetchTags();
      setTags(fetchedTags);
      setError(null);
    } catch (err) {
      console.error("Error refreshing tags:", err);
      setError(err instanceof Error ? err : new Error('Failed to refresh tags'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use tag mutations hook
  const {
    addTag: addTagMutation,
    deleteTag: deleteTagMutation,
    reorderTags: reorderTagsMutation,
    isAddingTag,
    isDeletingTag,
    isReordering
  } = useTagMutations({
    contentId,
  });
  
  const handleAddTag = () => {
    if (!newTag.trim() || !isValid) return;
    
    addTagMutation({
      name: newTag,
      contentId
    });
    
    setNewTag('');
  };
  
  const handleDeleteTag = (tagId: string) => {
    if (!isValid) return;
    
    deleteTagMutation({ 
      tagId,
      contentId 
    });
  };
  
  return {
    newTag,
    setNewTag,
    tags,
    isLoading,
    error,
    isAddingTag,
    isDeletingTag,
    isReordering,
    fetchTags,
    refreshTags,
    handleAddTag,
    handleDeleteTag,
    reorderTags: reorderTagsMutation
  };
};
