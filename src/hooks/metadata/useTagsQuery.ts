
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
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
        // Determine what to select based on includeTypeInfo option
        const selectClause = options?.includeTypeInfo 
          ? 'tags.id, tags.name, tags.content_id, tags.type_id, tag_types(name)' 
          : 'tags.id, tags.name, tags.content_id, tags.type_id';
        
        const { data, error } = await supabase
          .from('tags')
          .select(selectClause)
          .eq('content_id', contentId)
          .order('name', { ascending: true });

        if (error) throw error;

        // Transform data to include type_name if type info was requested
        return data.map(tag => {
          const baseTag: Tag = {
            id: tag.id,
            name: tag.name,
            content_id: tag.content_id,
            type_id: tag.type_id
          };
          
          // Only add type_name if we requested tag types and it exists
          if (options?.includeTypeInfo && tag.tag_types) {
            return {
              ...baseTag,
              type_name: tag.tag_types.name 
            };
          }
          
          return baseTag;
        });
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
