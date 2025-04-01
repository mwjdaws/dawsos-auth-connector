
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '@/types/tag';
import { handleError, ErrorLevel } from '@/utils/errors';

interface UseTagFetchProps {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

/**
 * Hook for fetching tags from the database
 */
export const useTagFetch = ({
  contentId,
  setTags,
  setIsLoading,
  setError
}: UseTagFetchProps) => {
  
  /**
   * Fetch tags for a specific content ID
   */
  const fetchTags = useCallback(async () => {
    if (!contentId) {
      setTags([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch tags with optional type info
      const { data, error } = await supabase
        .from('tags')
        .select(`
          id,
          name,
          content_id,
          type_id,
          display_order,
          tag_types(id, name)
        `)
        .eq('content_id', contentId)
        .order('display_order', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      // Transform data to include type_name from the tag_types join
      const formattedTags: Tag[] = data.map(tag => ({
        id: tag.id,
        name: tag.name,
        content_id: tag.content_id,
        type_id: tag.type_id,
        display_order: tag.display_order,
        type_name: tag.tag_types ? tag.tag_types.name : null
      }));
      
      setTags(formattedTags);
    } catch (err) {
      handleError(
        err,
        `Failed to fetch tags for content: ${contentId}`,
        { level: ErrorLevel.WARNING }
      );
      setError(err instanceof Error ? err : new Error(String(err)));
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  }, [contentId, setError, setIsLoading, setTags]);
  
  return {
    fetchTags
  };
};
