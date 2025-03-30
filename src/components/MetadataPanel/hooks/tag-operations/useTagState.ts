
import { useState } from 'react';
import { Tag, UseTagStateProps, UseTagStateResult } from './types';

export function useTagState(props?: UseTagStateProps): UseTagStateResult {
  const initialTags = props?.initialTags || [];
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  return {
    tags,
    setTags,
    isLoading,
    setIsLoading,
    error,
    setError
  };
}
