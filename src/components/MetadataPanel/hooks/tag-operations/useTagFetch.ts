
/**
 * useTagFetch Hook
 * 
 * Manages the fetching of tags from the API
 */
import { useState, useCallback } from 'react';
import { useTagsQuery } from '@/hooks/metadata/useTagsQuery';
import { Tag } from '@/types/tag';
import { handleErrorSafe } from '@/utils/errors/handle';

interface UseTagFetchOptions {
  initialTags?: Tag[];
  initialLoading?: boolean;
  initialError?: Error | null;
}

interface UseTagsQueryOptions {
  includeTypeInfo?: boolean;
  onError?: (err: Error) => void;
  onSuccess?: (data: Tag[]) => void;
}

export interface UseTagFetchResult {
  tags: Tag[];
  isLoading: boolean;
  error: Error | null;
  fetchTags: () => Promise<Tag[]>;
}

/**
 * Hook for fetching tags
 * 
 * @param contentId The ID of the content to fetch tags for
 * @param options Options for initializing state
 * @returns Object containing tag data, loading state, and fetch function
 */
export const useTagFetch = (
  contentId: string,
  options: UseTagFetchOptions = {}
): UseTagFetchResult => {
  const {
    initialTags = [],
    initialLoading = false,
    initialError = null
  } = options;

  // Local state for tags
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<Error | null>(initialError);

  // Use the query hook with callbacks to update local state
  const tagsQuery = useTagsQuery(contentId, { 
    includeTypeInfo: true,
    onSuccess: (data) => {
      setTags(data as Tag[]);
      setError(null);
    },
    onError: (err) => {
      handleErrorSafe(err, `Failed to fetch tags for content ${contentId}`, {
        level: 'error',
        context: { contentId }
      });
      setError(err instanceof Error ? err : new Error('Failed to fetch tags'));
    }
  });

  // Fetch function that returns a promise with the tags
  const fetchTags = useCallback(async (): Promise<Tag[]> => {
    if (!contentId) {
      return Promise.resolve([]);
    }

    setIsLoading(true);

    try {
      // Force refetch by invalidating the query
      await tagsQuery.refetch();
      
      // The onSuccess callback will update our state
      return tags;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch tags');
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [contentId, tagsQuery, tags]);

  return {
    tags,
    isLoading: isLoading || tagsQuery.isLoading,
    error,
    fetchTags
  };
};
