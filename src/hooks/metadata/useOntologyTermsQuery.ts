
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/utils/query-keys';
import { isValidContentId } from '@/utils/validation';

interface UseOntologyTermsQueryOptions {
  enabled?: boolean;
}

/**
 * Hook for fetching ontology terms associated with content
 * 
 * @param contentId - The ID of the content to fetch terms for
 * @param options - Additional query options
 * @returns Query result with terms data
 */
export function useOntologyTermsQuery(contentId?: string, options?: UseOntologyTermsQueryOptions) {
  const isValidContent = contentId ? isValidContentId(contentId) : false;
  
  return useQuery({
    queryKey: contentId ? ['ontologyTerms', contentId] : ['ontologyTerms', 'all'],
    queryFn: async () => {
      if (!contentId || !isValidContent) {
        return [];
      }

      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .select(`
          id,
          ontology_term_id,
          review_required,
          ontology_terms:ontology_term_id(
            id,
            term,
            domain,
            description
          )
        `)
        .eq('knowledge_source_id', contentId);

      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        termId: item.ontology_term_id,
        reviewRequired: item.review_required,
        term: item.ontology_terms?.term,
        domain: item.ontology_terms?.domain,
        description: item.ontology_terms?.description
      }));
    },
    enabled: !!contentId && isValidContent && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
