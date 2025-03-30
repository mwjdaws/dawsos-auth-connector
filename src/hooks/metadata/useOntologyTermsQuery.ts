
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation';
import { queryKeys } from '@/utils/query-keys';

export interface OntologyTerm {
  id: string;
  name: string;
  source_id: string;
  type?: string;
  associationId?: string;
}

interface UseOntologyTermsQueryOptions {
  enabled?: boolean;
}

/**
 * Hook for fetching ontology terms associated with content
 * 
 * @param sourceId - The ID of the content to fetch ontology terms for
 * @param options - Additional query options
 * @returns Query result with ontology terms data
 */
export function useOntologyTermsQuery(sourceId?: string, options?: UseOntologyTermsQueryOptions) {
  const isValidSource = sourceId ? isValidContentId(sourceId) : false;
  
  return useQuery<OntologyTerm[]>({
    queryKey: sourceId ? queryKeys.ontologyTerms.byContentId(sourceId) : ['ontologyTerms', 'invalid'],
    queryFn: async () => {
      if (!sourceId) return [];
      
      // Query the knowledge_source_ontology_terms junction table joined with ontology_terms
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .select(`
          id,
          ontology_terms:ontology_term_id (
            id,
            term,
            domain
          )
        `)
        .eq('knowledge_source_id', sourceId);
        
      if (error) throw error;

      // Map the data to match the OntologyTerm interface
      return (data || []).map(item => ({
        id: item.ontology_terms.id,
        name: item.ontology_terms.term,
        source_id: sourceId,
        type: item.ontology_terms.domain,
        associationId: item.id // Include the junction table ID for potential removal operations
      }));
    },
    enabled: !!sourceId && isValidSource && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
