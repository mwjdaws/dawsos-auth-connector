
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/validation';

/**
 * Hook to check if a specific content ID exists in the database
 */
export function useContentExists(contentId?: string) {
  const isValidId = contentId ? isValidContentId(contentId) : false;
  
  return useQuery({
    queryKey: contentId ? ['contentExists', contentId] : ['contentExists', 'invalid'],
    queryFn: async () => {
      try {
        if (!contentId || !isValidId) {
          return false;
        }
        
        const { count, error } = await supabase
          .from('knowledge_sources')
          .select('id', { count: 'exact', head: true })
          .eq('id', contentId);
          
        if (error) {
          throw error;
        }
        
        return count !== null && count > 0;
      } catch (error) {
        handleError(error, "Failed to check if content exists", {
          context: { contentId },
          level: "error"
        });
        return false;
      }
    },
    enabled: isValidId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
