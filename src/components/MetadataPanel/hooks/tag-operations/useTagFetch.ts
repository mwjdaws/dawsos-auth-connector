
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

/**
 * Hook to fetch tags for a specific content ID
 */
export const useTagFetch = (contentId: string) => {
  return useQuery({
    queryKey: ['tags', contentId],
    queryFn: async () => {
      if (!isValidContentId(contentId)) {
        throw new Error('Invalid content ID');
      }

      try {
        const { data, error } = await supabase
          .from('tags')
          .select('id, name, type_id, tag_types(name), content_id')
          .eq('content_id', contentId)
          .order('position', { ascending: true });

        if (error) throw error;

        return data.map(tag => ({
          id: tag.id,
          name: tag.name,
          content_id: tag.content_id,
          type_id: tag.type_id,
          type_name: tag.tag_types?.name
        }));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch tags');
        handleError(error, 'Failed to fetch tags');
        throw error;
      }
    },
    enabled: isValidContentId(contentId),
    staleTime: 60000 // 1 minute
  });
};
