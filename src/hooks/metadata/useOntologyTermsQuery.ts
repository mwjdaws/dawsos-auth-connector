
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/utils/query-keys';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/content-validation';

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
    queryKey: sourceId ? queryKeys.ontology.bySourceId(sourceId) : queryKeys.ontology.all,
    queryFn: async () => {
      if (!sourceId) return [];
      
      const { data, error } = await supabase
        .from('ontology_terms')
        .select('id, name, source_id, type')
        .eq('source_id', sourceId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!sourceId && isValidSource && (options?.enabled !== false),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
