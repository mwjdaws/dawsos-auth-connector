
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
  
  // Direct query hook for backward compatibility
  const tagsQuery = useTagsQuery(contentId);
  
  const fetchTags = useCallback(async (): Promise<Tag[]> => {
    if (!contentId) {
      return [];
    }
    
    try {
      setIsLoading(true);
      setLocalLoading(true);
      
      // Use the fetchTags method from the query when available
      if (tagsQuery.fetchTags) {
        const apiTags = await tagsQuery.fetchTags();
        const formattedTags = apiTags.map(mapApiTagToTag);
        setTags(formattedTags);
        return formattedTags;
      }
      
      // Fallback to using the data from the query
      if (tagsQuery.data) {
        const formattedTags = tagsQuery.data.map(mapApiTagToTag);
        setTags(formattedTags);
        return formattedTags;
      }
      
      // If all else fails, return empty array
      return [];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch tags');
      setError(error);
      setLocalError(error);
      return [];
    } finally {
      setIsLoading(false);
      setLocalLoading(false);
    }
  }, [contentId, tagsQuery, setTags, setIsLoading, setError]);
  
  return {
    fetchTags,
    isLoading: localLoading,
    error: localError
  };
}
