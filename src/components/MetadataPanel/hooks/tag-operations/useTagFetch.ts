
import { useState, useCallback } from 'react';
import { useTagsQuery } from '@/hooks/metadata/useTagsQuery';
import { Tag, UseTagFetchProps, UseTagFetchResult, mapApiTagToTag } from './types';

export function useTagFetch({
  contentId,
  setTags,
  setIsLoading,
  setError
}: UseTagFetchProps): UseTagFetchResult {
  // We track loading and error state in the parent useTagState
  // but need local state to manage suspense boundaries
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<Error | null>(null);
  
  const { fetchTags: fetchTagsFromApi } = useTagsQuery(contentId);
  
  const fetchTags = useCallback(async (): Promise<Tag[]> => {
    if (!contentId) {
      return [];
    }
    
    try {
      setIsLoading(true);
      setLocalLoading(true);
      
      const apiTags = await fetchTagsFromApi();
      const formattedTags = apiTags.map(mapApiTagToTag);
      
      setTags(formattedTags);
      return formattedTags;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch tags');
      setError(error);
      setLocalError(error);
      return [];
    } finally {
      setIsLoading(false);
      setLocalLoading(false);
    }
  }, [contentId, fetchTagsFromApi, setTags, setIsLoading, setError]);
  
  return {
    fetchTags,
    isLoading: localLoading,
    error: localError
  };
}
