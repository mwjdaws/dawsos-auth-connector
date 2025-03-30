
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tag, UseTagFetchOptions, UseTagFetchResult } from './types';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

/**
 * Hook for fetching tags for a content item
 */
export const useTagFetch = ({
  contentId,
  setTags,
  setIsLoading,
  setError
}: UseTagFetchOptions): UseTagFetchResult => {
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState<Error | null>(null);

  /**
   * Fetch tags from the API
   */
  const fetchTags = useCallback(async (): Promise<Tag[]> => {
    if (!isValidContentId(contentId)) {
      setTags([]);
      return [];
    }

    if (setIsLoading) setIsLoading(true);
    else setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, content_id, type_id')
        .eq('content_id', contentId)
        .order('id');

      if (error) throw new Error(error.message);

      // Map to the Tag interface
      const tags: Tag[] = data.map(item => ({
        id: item.id,
        name: item.name,
        content_id: item.content_id,
        type_id: item.type_id,
        type_name: null // We're not joining the type name here
      }));

      setTags(tags);
      return tags;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch tags');
      if (setError) setError(error);
      else setErrorState(error);
      return [];
    } finally {
      if (setIsLoading) setIsLoading(false);
      else setLoading(false);
    }
  }, [contentId, setTags, setIsLoading, setError]);

  return {
    fetchTags,
    isLoading: loading,
    error
  };
};
