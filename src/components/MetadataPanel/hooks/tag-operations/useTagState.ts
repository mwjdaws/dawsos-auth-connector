
import { useState } from 'react';
import { UseTagStateProps, UseTagStateResult, Tag } from './types';

/**
 * Hook for managing tag state
 */
export function useTagState({ initialTags = [] }: UseTagStateProps): UseTagStateResult {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [newTag, setNewTag] = useState('');
  
  return {
    tags,
    setTags,
    isLoading,
    setIsLoading,
    error,
    setError,
    newTag,
    setNewTag
  };
}
