
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/validation';
import { Tag } from './types';

export const useTagFetch = (contentId?: string) => {
  const isValid = contentId ? isValidContentId(contentId) : false;

  const { data: tags, isLoading, error, refetch } = useQuery<Tag[]>({
    queryKey: contentId ? queryKeys.tags.byContentId(contentId) : ['tags', 'invalid'],
    queryFn: async () => {
      try {
        if (!contentId || !isValid) {
          return [];
        }

        const { data, error } = await supabase
          .from('tags')
          .select('*')
          .eq('content_id', contentId)
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        return data as Tag[];
      } catch (err) {
        handleError(err, 'Failed to fetch tags', {
          context: { contentId },
          level: 'error'
        });
        throw err;
      }
    },
    enabled: isValid,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    tags: tags || [],
    isLoading,
    error,
    refetch
  };
};
