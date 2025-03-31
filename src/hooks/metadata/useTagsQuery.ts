
/**
 * Hook for fetching tags with proper type handling
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation';
import { toast } from '@/hooks/use-toast';
import { Tag, isValidTag, mapApiTagToTag } from '@/types/tag';

// Type guard for parser errors
function isParserError(data: any): boolean {
  return data && typeof data === 'object' && 'message' in data;
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
          ? 'tags.id, tags.name, tags.content_id, tags.type_id, tags.display_order, tag_types(name)' 
          : 'tags.id, tags.name, tags.content_id, tags.type_id, tags.display_order';
        
        const { data, error } = await supabase
          .from('tags')
          .select(selectClause)
          .eq('content_id', contentId)
          .order('display_order', { ascending: true })
          .order('name', { ascending: true });

        if (error) throw error;
        if (!data) return [];
        
        if (isParserError(data)) {
          const errorMsg = data.message ? String(data.message) : 'Unknown parser error';
          throw new Error(`Parser error: ${errorMsg}`);
        }

        return data.filter(item => {
          // Basic type check before attempting to create a Tag
          if (!item || typeof item !== 'object') return false;
          
          // Convert to Tag and validate
          const tag = mapApiTagToTag(item);
          return isValidTag(tag);
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

// Export the Tag type for convenience
export type { Tag } from '@/types/tag';
