
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { EnrichmentResult } from './types';

/**
 * Analyze content to get ontology term and related note suggestions
 */
export const analyzeContent = async (
  content: string, 
  title: string, 
  sourceId: string
): Promise<EnrichmentResult | undefined> => {
  if (!content || content.length < 20 || !sourceId) {
    console.log('Content too short or sourceId missing');
    return;
  }

  try {
    // Call the edge function to get ontology suggestions
    const { data, error } = await supabase.functions.invoke('suggest-ontology-terms', {
      body: { content, title, sourceId }
    });
    
    if (error) {
      console.error('Error calling suggest-ontology-terms function:', error);
      throw error;
    }
    
    if (!data) {
      console.warn('No data returned from suggest-ontology-terms function');
      return;
    }

    console.log('Received enrichment data:', data);
    
    return data as EnrichmentResult;
  } catch (error) {
    handleError(
      error,
      "Failed to analyze content for ontology suggestions",
      { level: "warning", technical: true, silent: true }
    );
  }
};

/**
 * Get already applied terms for a knowledge source
 */
export const getAppliedTerms = async (sourceId: string): Promise<Set<string>> => {
  try {
    const { data: existingTerms } = await supabase
      .from('knowledge_source_ontology_terms')
      .select('ontology_term_id')
      .eq('knowledge_source_id', sourceId);
    
    return new Set((existingTerms || []).map(link => link.ontology_term_id));
  } catch (error) {
    console.error('Error fetching applied terms:', error);
    return new Set();
  }
};
