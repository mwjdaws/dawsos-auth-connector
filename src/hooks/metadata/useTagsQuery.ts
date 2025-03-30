
/**
 * Tag Query Hook
 * 
 * A specialized hook for fetching tags associated with a content item.
 * Handles error conditions, data validation, and transformation.
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

/**
 * Tag data structure returned from the database
 */
interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  type_name?: string;
}

/**
 * Raw tag data with type information from the database join
 */
interface RawTagData {
  id: string;
  name: string;
  content_id: string;
  type_id?: string | null;
  tag_types?: {
    name: string;
  } | null;
  [key: string]: any; // Allow for additional properties from the database
}

/**
 * Configuration options for the useTagsQuery hook
 */
interface UseTagsQueryOptions {
  enabled?: boolean;
  includeTypeInfo?: boolean;
}

/**
 * Type guard to check if an object is a valid tag
 * This is crucial for filtering out invalid data or parser errors
 * 
 * @param tag - Any object to check
 * @returns Type predicate indicating if the object is a valid RawTagData
 */
function isValidTag(tag: any): tag is RawTagData {
  return (
    tag &&
    typeof tag.id === 'string' &&
    typeof tag.name === 'string' &&
    typeof tag.content_id === 'string'
  );
}

/**
 * Hook to fetch tags associated with a content item
 * 
 * @param contentId - The ID of the content to fetch tags for
 * @param options - Configuration options for the query
 * @returns Query result with typed Tag array data
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

        if (!data || !Array.isArray(data)) return [];

        // Transform data to include type_name if type info was requested
        // Use the isValidTag type guard to filter out any parser errors or invalid data
        return data
          .filter(isValidTag) 
          .map(tag => {
            const baseTag: Tag = {
              id: tag.id,
              name: tag.name,
              content_id: tag.content_id,
              type_id: tag.type_id
            };
            
            // Only add type_name if we requested tag types and tag_types exists
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
