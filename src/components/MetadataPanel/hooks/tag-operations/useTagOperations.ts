
import { useState } from 'react';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import type { Tag } from '@/types';
import { useTagState } from './useTagState';
import { useTagFetch } from './useTagFetch';
import { useTagMutations } from './useTagMutations';

export const useTagOperations = (contentId: string) => {
  const isValid = isValidContentId(contentId);
  const [newTag, setNewTag] = useState('');
  
  // Use the tag state hook
  const {
    tags,
    setTags,
    isLoading,
    setIsLoading,
    error,
    setError
  } = useTagState();
  
  // Use the tag fetch hook
  const { fetchTags, refreshTags } = useTagFetch({
    contentId,
    setTags,
    setIsLoading,
    setError
  });
  
  // Use tag mutations hook
  const {
    addTag,
    deleteTag,
    reorderTags,
    isAddingTag,
    isDeletingTag,
    isReordering
  } = useTagMutations({
    contentId,
    tags,
    setTags,
    setError
  });
  
  const handleAddTag = () => {
    if (!newTag.trim() || !isValid) return;
    
    addTag({
      name: newTag
    });
    
    setNewTag('');
  };
  
  const handleDeleteTag = (tagId: string) => {
    if (!isValid) return;
    
    deleteTag({ tagId });
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
    reorderTags
  };
};
