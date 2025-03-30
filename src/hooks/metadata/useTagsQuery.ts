
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string;
  type_name?: string;
}

interface UseTagsQueryOptions {
  enabled?: boolean;
  includeTypeInfo?: boolean;
}

/**
 * Hook to fetch tags associated with a content item
 */
export function useTagsQuery(contentId: string, options?: UseTagsQueryOptions) {
  return useQuery({
    queryKey: ['tags', contentId],
    queryFn: async (): Promise<Tag[]> => {
      if (!isValidContentId(contentId)) {
        return [];
      }

      try {
        let query = supabase
          .from('tags')
          .select(
            options?.includeTypeInfo 
              ? 'id, name, content_id, type_id, tag_types(name)' 
              : 'id, name, content_id, type_id'
          )
          .eq('content_id', contentId);

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to include type_name if needed
        return data.map(tag => ({
          id: tag.id,
          name: tag.name,
          content_id: tag.content_id,
          type_id: tag.type_id,
          ...(options?.includeTypeInfo && tag.tag_types 
            ? { type_name: tag.tag_types.name } 
            : {})
        }));
      } catch (err) {
        handleError(
          err instanceof Error ? err : new Error('Failed to fetch tags'),
          'Could not load tags for this content'
        );
        throw err;
      }
    },
    enabled: options?.enabled !== false && isValidContentId(contentId),
    staleTime: 30000 // 30 seconds
  });
}
