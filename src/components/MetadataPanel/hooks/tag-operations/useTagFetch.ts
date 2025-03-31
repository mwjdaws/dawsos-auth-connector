
/**
 * useTagFetch Hook
 * 
 * Handles fetching tag data for the MetadataPanel
 */

import { useCallback } from 'react';
import { Tag } from '@/types/tag';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { useTagsQuery } from '@/hooks/metadata';

interface TagFetchOptions {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  retryCount?: number;
}

/**
 * Hook for fetching tags from the database
 * 
 * @param options Configuration options for fetching tags
 * @returns Object with fetch functions and state getters
 */
export const useTagFetch = (options: TagFetchOptions) => {
  const {
    contentId,
    setTags,
    setIsLoading,
    setError,
    retryCount = 2
  } = options;

  // Use react-query for data fetching with automatic caching
  const { data: queryTags, isLoading, error, refetch } = useTagsQuery(contentId, {
    enabled: !!contentId,
    onSuccess: (data) => {
      if (data && Array.isArray(data)) {
        setTags(data);
      }
    },
    onError: (err) => {
      handleError(
        err,
        "Failed to fetch tags",
        { level: "warning", technical: false }
      );
      setError(err instanceof Error ? err.message : 'Unknown error fetching tags');
    }
  });

  /**
   * Fetch tags from the database manually
   * Includes retry logic and error handling
   */
  const fetchTags = useCallback(async (attemptNumber = 0): Promise<Tag[]> => {
    if (!contentId) {
      setError('Invalid content ID provided');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try to use the refetch function from react-query first
      if (refetch) {
        const { data } = await refetch();
        return data || [];
      }

      // Fall back to manual fetching if refetch is not available
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('content_id', contentId)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const fetchedTags = data || [];
      setTags(fetchedTags);
      setIsLoading(false);
      return fetchedTags;
    } catch (err) {
      // Retry logic for transient errors
      if (attemptNumber < retryCount) {
        console.warn(`Error fetching tags, retrying (${attemptNumber + 1}/${retryCount})...`);
        
        // Exponential backoff
        const backoffTime = Math.pow(2, attemptNumber) * 500;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        return fetchTags(attemptNumber + 1);
      }

      // Handle error after retries are exhausted
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tags';
      handleError(
        err,
        "Error fetching tags after multiple attempts",
        { level: "error", technical: true }
      );
      
      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  }, [contentId, refetch, retryCount, setError, setIsLoading, setTags]);

  return {
    fetchTags,
    isLoading,
    error,
    tags: queryTags || []
  };
};
