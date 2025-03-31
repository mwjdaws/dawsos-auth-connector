
import { useState } from 'react';
import { Tag } from '@/types/tag';

export interface UseTagStateProps {
  initialTags?: Tag[];
  initialLoading?: boolean;
  initialError?: Error | null;
  initialNewTag?: string;
}

export interface UseTagStateResult {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
  newTag: string;
  setNewTag: (newTag: string) => void;
}

/**
 * Hook for managing tag state
 * 
 * @param props Initial state properties
 * @returns Tag state and setters
 */
export const useTagState = ({
  initialTags = [],
  initialLoading = false,
  initialError = null,
  initialNewTag = ''
}: UseTagStateProps = {}): UseTagStateResult => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<Error | null>(initialError);
  const [newTag, setNewTag] = useState<string>(initialNewTag);
  
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
};
