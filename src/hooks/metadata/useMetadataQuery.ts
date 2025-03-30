
import { useQuery } from '@tanstack/react-query';
import { fetchSourceMetadata, SourceMetadata } from '@/utils/api-utils';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/content-validation';

interface UseMetadataQueryOptions {
  enabled?: boolean;
}

/**
 * Hook for fetching metadata for a content source
 * 
 * @param contentId - The ID of the content to fetch metadata for
 * @param options - Additional query options
 * @returns Query result with metadata
 */
export function useMetadataQuery(contentId?: string, options?: UseMetadataQueryOptions) {
  const isValidContent = contentId ? isValidContentId(contentId) : false;
  
  return useQuery<SourceMetadata | null>({
    queryKey: contentId ? queryKeys.metadata.source(contentId) : null,
    queryFn: () => fetchSourceMetadata(contentId!),
    enabled: !!contentId && isValidContent && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
