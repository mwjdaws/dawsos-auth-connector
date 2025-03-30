
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation';
import { queryKeys } from '@/utils/query-keys';

export interface OntologyTerm {
  id: string;
  name: string;
  source_id: string;
  type?: string;
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
    queryKey: sourceId ? ['ontologyTerms', 'bySourceId', sourceId] : ['ontologyTerms', 'all'],
    queryFn: async () => {
      if (!sourceId) return [];
      
      const { data, error } = await supabase
        .from('ontology_terms')
        .select('id, term, source_id, type')
        .eq('source_id', sourceId);
        
      if (error) throw error;

      // Map the data to match the OntologyTerm interface
      return (data || []).map(item => ({
        id: item.id,
        name: item.term, // Map 'term' to 'name'
        source_id: item.source_id,
        type: item.type
      }));
    },
    enabled: !!sourceId && isValidSource && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
