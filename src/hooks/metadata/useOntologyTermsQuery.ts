
import { useQuery } from '@tanstack/react-query';
import { fetchContentOntologyTerms, OntologyTerm } from '@/utils/api-utils';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/content-validation';

interface UseOntologyTermsQueryOptions {
  enabled?: boolean;
}

/**
 * Hook for fetching ontology terms associated with content
 * 
 * @param contentId - The ID of the content to fetch ontology terms for
 * @param options - Additional query options
 * @returns Query result with ontology terms data
 */
export function useOntologyTermsQuery(contentId?: string, options?: UseOntologyTermsQueryOptions) {
  const isValidContent = contentId ? isValidContentId(contentId) : false;
  
  return useQuery<OntologyTerm[]>({
    queryKey: contentId ? queryKeys.ontologyTerms.byContentId(contentId) : queryKeys.ontologyTerms.all,
    queryFn: () => fetchContentOntologyTerms(contentId!),
    enabled: !!contentId && isValidContent && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
