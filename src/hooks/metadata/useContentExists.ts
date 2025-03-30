
/**
 * useContentExists Hook
 * 
 * Custom hook that checks if a content ID exists in the database.
 * This helps prevent operations on non-existent content.
 * 
 * @param contentId - The ID of the content to check
 * @returns Query result with boolean indicating if content exists
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/validation';

interface UseContentExistsOptions {
  enabled?: boolean;
}

export function useContentExists(contentId?: string, options?: UseContentExistsOptions) {
  const isValidContent = contentId ? isValidContentId(contentId) : false;
  
  return useQuery<boolean>({
    queryKey: contentId ? queryKeys.knowledgeSources.exists(contentId) : ['content-exists', 'invalid'],
    queryFn: async () => {
      if (!contentId) return false;
      
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('id')
        .eq('id', contentId)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking if content exists:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!contentId && isValidContent && (options?.enabled !== false),
    staleTime: 60 * 1000, // 1 minute
  });
}
