
import { useCallback } from 'react';
import { Tag } from '@/types/tag';
import { handleError } from '@/utils/errors/handle';

interface UseTagFetchProps {
  contentId: string;
  setTags: (tags: Tag[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

/**
 * Hook for fetching tags from the API
 */
export const useTagFetch = ({
  contentId,
  setTags,
  setIsLoading,
  setError
}: UseTagFetchProps) => {
  
  /**
   * Fetch tags for the current content
   */
  const fetchTags = useCallback(async (): Promise<Tag[]> => {
    if (!contentId) {
      return [];
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock response data
      const mockTags: Tag[] = [
        { id: '1', name: 'React', content_id: contentId, display_order: 0, type_id: null },
        { id: '2', name: 'TypeScript', content_id: contentId, display_order: 1, type_id: null },
        { id: '3', name: 'Tailwind', content_id: contentId, display_order: 2, type_id: null }
      ];
      
      setTags(mockTags);
      return mockTags;
    } catch (err) {
      // Handle error properly
      const error = err instanceof Error ? err : new Error('Unknown error fetching tags');
      setError(error);
      
      handleError(
        error,
        "Failed to fetch tags",
        { level: "warning", context: { contentId } }
      );
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [contentId, setTags, setIsLoading, setError]);
  
  return {
    fetchTags
  };
};
