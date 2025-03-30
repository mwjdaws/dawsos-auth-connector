
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import type { Tag } from '@/types';

export interface UseTagFetchResult {
  fetchTags: () => Promise<Tag[]>;
  isLoading: boolean;
  error: Error | null;
}

export const useTagFetch = (contentId: string): UseTagFetchResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTags = async (): Promise<Tag[]> => {
    if (!isValidContentId(contentId)) {
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tags')
        .select('id, name, content_id, type_id, type_name')
        .eq('content_id', contentId)
        .order('name');

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Convert database data to Tag objects, ensuring null values are handled
      const tags: Tag[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        content_id: item.content_id || contentId, // Use contentId as fallback
        type_id: item.type_id,
        type_name: item.type_name
      }));

      return tags;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch tags';
      setError(new Error(errorMessage));
      console.error('Error fetching tags:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchTags,
    isLoading,
    error
  };
};
