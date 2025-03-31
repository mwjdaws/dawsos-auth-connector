
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation';
import { toast } from '@/hooks/use-toast';

export interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  type_name?: string | null;
}

// Type guard for parser errors
function isParserError(data: any): data is { message: string } {
  return data && typeof data === 'object' && 'message' in data;
}

// Type guard for valid tags
function isValidTag(tag: any): tag is Tag {
  return (
    tag &&
    typeof tag === 'object' &&
    typeof tag.id === 'string' &&
    typeof tag.name === 'string' &&
    typeof tag.content_id === 'string'
  );
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
        // Handle error with a toast notification
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tags';
        toast({
          title: "Error",
          description: "Could not load tags for this content",
          variant: "destructive"
        });
        throw err;
      }
    },
    enabled: options?.enabled !== false && isValidContentId(contentId),
    staleTime: 30000
  });
}
