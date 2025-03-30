
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation/contentIdValidation';

export interface UseContentExistsProps {
  contentId?: string;
  enabled?: boolean;
}

export function useContentExists({ contentId, enabled = true }: UseContentExistsProps) {
  return useQuery({
    queryKey: contentId ? ['content', 'exists', contentId] : null,
    queryFn: async () => {
      if (!contentId || !isValidContentId(contentId)) {
        return false;
      }
      
      const { count, error } = await supabase
        .from('knowledge_sources')
        .select('id', { count: 'exact', head: true })
        .eq('id', contentId);
      
      if (error) {
        console.error('Error checking if content exists:', error);
        return false;
      }
      
      return count > 0;
    },
    enabled: enabled && !!contentId && isValidContentId(contentId)
  });
}
