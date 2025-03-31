
/**
 * useContentExists Hook
 * 
 * Checks if content with the given ID exists in the database
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseContentExistsOptions {
  enabled?: boolean;
  staleTime?: number;
  retry?: number;
}

/**
 * Hook to check if content exists in the database
 * 
 * @param contentId Content ID to check
 * @param options Query options
 * @returns Query result with existence information
 */
export function useContentExists(contentId: string | null | undefined, options: UseContentExistsOptions = {}) {
  const {
    enabled = true,
    staleTime = 60000, // Cache for 1 minute by default
    retry = 1
  } = options;
  
  return useQuery({
    queryKey: contentId ? ['content', 'exists', contentId] : ['content', 'exists', 'none'],
    queryFn: async () => {
      if (!contentId) return false;
      
      // Query the database to check if the content exists
      const { count, error } = await supabase
        .from('knowledge_sources')
        .select('id', { count: 'exact', head: true })
        .eq('id', contentId);
      
      if (error) {
        throw error;
      }
      
      return count ? count > 0 : false;
    },
    enabled: Boolean(contentId) && enabled,
    staleTime,
    retry
  });
}
