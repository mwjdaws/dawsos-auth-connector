
import { useQuery } from '@tanstack/react-query';
import { fetchContentTags, Tag } from '@/utils/api-utils';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/content-validation';

interface UseTagsQueryOptions {
  enabled?: boolean;
}

/**
 * Hook for fetching tags associated with content
 * 
 * @param contentId - The ID of the content to fetch tags for
 * @param options - Additional query options
 * @returns Query result with tags data
 */
export function useTagsQuery(contentId?: string, options?: UseTagsQueryOptions) {
  const isValidContent = contentId ? isValidContentId(contentId) : false;
  
  return useQuery<Tag[]>({
    queryKey: contentId ? queryKeys.tags.byContentId(contentId) : queryKeys.tags.all,
    queryFn: () => fetchContentTags(contentId!),
    enabled: !!contentId && isValidContent && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
