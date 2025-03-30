
import { useQuery } from '@tanstack/react-query';
import { checkContentExists } from '@/utils/api-utils';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/content-validation';

/**
 * Hook to check if content exists in the database
 */
export function useContentExists(contentId?: string, options = {}) {
  return useQuery({
    queryKey: contentId ? [...queryKeys.metadata.byId(contentId), 'exists'] : null,
    queryFn: () => contentId ? checkContentExists(contentId) : false,
    enabled: !!contentId && isValidContentId(contentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
}
