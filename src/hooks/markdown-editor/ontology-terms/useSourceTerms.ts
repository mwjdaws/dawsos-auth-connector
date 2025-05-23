
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OntologyTerm } from './types';

/**
 * Hook for fetching ontology terms associated with a knowledge source
 */
export function useSourceTerms(sourceId?: string) {
  return useQuery({
    queryKey: ['ontologyTerms', 'source', sourceId],
    queryFn: async () => {
      if (!sourceId) {
        console.log('No source ID provided to useSourceTerms');
        return [];
      }
      
      console.log(`Fetching ontology terms for source: ${sourceId}`);
      
      // First verify the knowledge source exists
      const { data: sourceCheck, error: sourceError } = await supabase
        .from('knowledge_sources')
        .select('id, title')
        .eq('id', sourceId)
        .single();
        
      if (sourceError) {
        console.error('Error verifying source existence:', sourceError);
        if (sourceError.code === 'PGRST116') {
          console.warn(`Source ID ${sourceId} not found in database`);
        }
      } else {
        console.log(`Found source: ${sourceCheck.title} (${sourceCheck.id})`);
      }
      
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .select(`
          id,
          ontology_term_id,
          ontology_terms:ontology_term_id (
            id, 
            term,
            description,
            domain
          )
        `)
        .eq('knowledge_source_id', sourceId);
        
      if (error) {
        console.error('Error fetching source ontology terms:', error);
        throw error;
      }
      
      console.log(`Found ${data?.length || 0} ontology terms for source ${sourceId}`);
      
      return data?.map(item => ({
        associationId: item.id, // Changed from association_id to associationId to match our interface
        id: item.ontology_terms.id,
        term: item.ontology_terms.term,
        description: item.ontology_terms.description,
        domain: item.ontology_terms.domain
      })) as OntologyTerm[] || [];
    },
    enabled: !!sourceId,
    staleTime: 60000 // 1 minute
  });
}
