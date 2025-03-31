
/**
 * useContentExists Hook
 * 
 * Checks if content with the given ID exists in the database
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check if content exists in the database
 */
export function useContentExists(contentId: string | null) {
  return useQuery({
    queryKey: contentId ? ['content', 'exists', contentId] : undefined,
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
    enabled: !!contentId,
    staleTime: 60000, // Cache for 1 minute
    retry: 1
  });
}
