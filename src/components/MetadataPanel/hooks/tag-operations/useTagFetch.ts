
/**
 * useTagFetch Hook
 * 
 * Provides functions to fetch tag data for a content item.
 */
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/tag';
import { handleError } from '@/utils/errors/handle';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

interface UseTagFetchProps {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

/**
 * Hook for fetching tag data from the database
 * 
 * @param props Properties for tag fetching
 * @returns Object with tag fetching functions
 */
export const useTagFetch = ({
  contentId,
  setTags,
  setIsLoading,
  setError
}: UseTagFetchProps) => {
  
  /**
   * Fetch all tags for the content
   */
  const fetchTags = useCallback(async () => {
    // Validate contentId first
    if (!contentId || !isValidContentId(contentId)) {
      console.warn(`Cannot fetch tags: Invalid content ID format: ${contentId}`);
      setTags([]);
      return [];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch tags from the database
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, content_id, type_id, type_name, display_order')
        .eq('content_id', contentId)
        .order('display_order', { ascending: true });
      
      // Handle database error
      if (error) {
        throw error;
      }
      
      // Update tags state
      const fetchedTags = data as Tag[];
      setTags(fetchedTags);
      setIsLoading(false);
      
      return fetchedTags;
    } catch (err) {
      // Handle error with our error system
      handleError(
        err,
        `Failed to fetch tags for content: ${contentId}`,
        { 
          level: 'warning',
          source: 'database',
          technical: false,
          context: { contentId }
        }
      );
      
      // Update error state
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      setTags([]);
      
      return [];
    }
  }, [contentId, setTags, setIsLoading, setError]);
  
  return {
    fetchTags
  };
};
