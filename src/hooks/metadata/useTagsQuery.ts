
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation';

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  type_name?: string | null;
}

export function useTagsQuery(contentId: string, options?: { enabled?: boolean; includeTypeInfo?: boolean; }) {
  return useQuery({
    queryKey: ['tags', contentId],
    queryFn: async (): Promise<Tag[]> => {
      if (!isValidContentId(contentId)) {
        return [];
      }

      try {
        const selectClause = options?.includeTypeInfo 
          ? 'tags.id, tags.name, tags.content_id, tags.type_id, tag_types(name)' 
          : 'tags.id, tags.name, tags.content_id, tags.type_id';
        
        const { data, error } = await supabase
          .from('tags')
          .select(selectClause)
          .eq('content_id', contentId)
          .order('name', { ascending: true });

        if (error) throw error;
        if (!data || !Array.isArray(data)) {
          if (isParserError(data)) {
            throw new Error(`Parser error: ${data.message}`);
          }
          return [];
        }

        return data.filter(isValidTag).map(tag => {
          const baseTag: Tag = {
            id: tag.id,
            name: tag.name,
            content_id: tag.content_id,
            type_id: tag.type_id
          };
          if (options?.includeTypeInfo && tag.tag_types) {
            return { ...baseTag, type_name: tag.tag_types.name };
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
    staleTime: 30000
  });
}
