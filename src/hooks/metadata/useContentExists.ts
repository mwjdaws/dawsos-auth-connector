
import { useQuery } from '@tanstack/react-query';
import { checkContentExists } from '@/utils/api-utils';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/content-validation';

/**
 * Hook to check if content exists in the database
 * 
 * @param contentId - The ID of the content to check
 * @returns Query result with boolean indicating existence
 */
export function useContentExists(contentId?: string) {
  const isValidContent = contentId ? isValidContentId(contentId) : false;
  
  return useQuery<boolean>({
    queryKey: ['contentExists', contentId],
    queryFn: () => checkContentExists(contentId!),
    enabled: !!contentId && isValidContent,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
