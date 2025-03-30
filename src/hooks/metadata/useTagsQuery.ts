
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

export interface TagQueryOptions {
  enabled?: boolean;
}

export function useTagsQuery(contentId?: string, options: TagQueryOptions = {}) {
  return useQuery({
    queryKey: contentId ? ['tags', contentId] : null,
    queryFn: async () => {
      if (!contentId || !isValidContentId(contentId)) {
        return [];
      }
      
      try {
        const { data, error } = await supabase
          .from('tags')
          .select('id, name, content_id, type_id, tag_types:type_id (name)')
          .eq('content_id', contentId);
        
        if (error) throw error;
        
        return (data || []).map(tag => {
          // Handle the case where tag might have ParserError properties
          // by defensive programming
          const processedTag: Tag = {
            id: typeof tag.id === 'string' ? tag.id : '',
            name: typeof tag.name === 'string' ? tag.name : '',
            content_id: typeof tag.content_id === 'string' ? tag.content_id : '',
            type_id: typeof tag.type_id === 'string' ? tag.type_id : null
          };
          
          // Safely handle the tag_types property
          if (tag.tag_types && typeof tag.tag_types === 'object') {
            processedTag.type_name = typeof tag.tag_types.name === 'string' 
              ? tag.tag_types.name 
              : null;
          }
          
          return processedTag;
        });
      } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }
    },
    enabled: options.enabled !== undefined ? options.enabled : !!contentId && isValidContentId(contentId)
  });
}
