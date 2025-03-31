
/**
 * useTagState Hook
 * 
 * Manages the state for tags within the MetadataPanel
 */

import { useState } from 'react';
import { Tag } from '@/types/tag';

interface TagStateOptions {
  initialTags?: Tag[];
  initialLoading?: boolean;
  initialError?: string | null;
  initialNewTag?: string;
}

/**
 * Hook for managing tag state
 * 
 * @param options Configuration options for initializing tag state
 * @returns Object containing tag state and setter functions
 */
export const useTagState = (options: TagStateOptions = {}) => {
  const {
    initialTags = [],
    initialLoading = false,
    initialError = null,
    initialNewTag = ''
  } = options;

  // State for tag data
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(initialError);
  const [newTag, setNewTag] = useState<string>(initialNewTag);

  // Reset all state
  const resetState = () => {
    setTags(initialTags);
    setIsLoading(initialLoading);
    setError(initialError);
    setNewTag(initialNewTag);
  };

  // Reset error state
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    tags,
    setTags,
    isLoading,
    setIsLoading,
    error,
    setError,
    newTag,
    setNewTag,

    // Utility functions
    resetState,
    clearError
  };
};
