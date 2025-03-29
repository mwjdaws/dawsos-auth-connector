
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { EnrichmentResult } from './types';

/**
 * Calls the edge function to get ontology suggestions
 */
export const fetchOntologySuggestions = async (
  sourceId: string, 
  content: string, 
  title: string
): Promise<EnrichmentResult | null> => {
  try {
    console.log(`Enriching content with ontology suggestions for source: ${sourceId}`);
    
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
      return null;
    }
    
    console.log(`Received ${(data as EnrichmentResult).terms?.length || 0} term suggestions and ${(data as EnrichmentResult).notes?.length || 0} note suggestions`);
    
    return data as EnrichmentResult;
  } catch (error) {
    handleError(
      error, 
      "Failed to fetch ontology suggestions", 
      { level: "warning", technical: true, silent: true }
    );
    return null;
  }
};
