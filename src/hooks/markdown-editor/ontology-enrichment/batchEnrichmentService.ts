
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';

/**
 * Process a batch of knowledge sources for ontology enrichment
 */
export const batchEnrichSources = async (
  sourceIds: string[]
): Promise<{
  results: Array<{
    id: string;
    terms: Array<any>;
    notes: Array<any>;
  }>;
  errors: Array<{
    id: string;
    error: string;
  }>;
  processingStats: {
    totalProcessed: number;
    successful: number;
    failed: number;
  };
}> => {
  try {
    console.log(`Starting batch enrichment for ${sourceIds.length} sources`);
    
    const { data, error } = await supabase.functions.invoke('batch-ontology-enrichment', {
      body: { sourceIds }
    });
    
    if (error) {
      console.error('Error calling batch-ontology-enrichment:', error);
      throw new Error(`Batch enrichment failed: ${error.message}`);
    }
    
    console.log(`Batch enrichment completed: ${data.results?.length || 0} results, ${data.errors?.length || 0} errors`);
    
    return data;
  } catch (error) {
    handleError(
      error, 
      "Failed to perform batch ontology enrichment", 
      { level: "warning", technical: true }
    );
    
    // Return an empty result structure on error
    return {
      results: [],
      errors: [{
        id: 'global',
        error: error instanceof Error ? error.message : String(error)
      }],
      processingStats: {
        totalProcessed: 0,
        successful: 0,
        failed: 0
      }
    };
  }
};

/**
 * Enrich multiple knowledge sources with ontology suggestions
 */
export const enrichMultipleSources = async (
  sourceIds: string[]
): Promise<{
  success: boolean;
  processed: number;
  successful: number;
  failed: number;
  results: any[];
}> => {
  if (!sourceIds || sourceIds.length === 0) {
    return {
      success: false,
      processed: 0,
      successful: 0,
      failed: 0,
      results: []
    };
  }
  
  try {
    console.log(`Enriching ${sourceIds.length} knowledge sources with ontology suggestions`);
    
    // Call the batch enrichment function directly
    const result = await batchEnrichSources(sourceIds);
    
    return {
      success: true,
      processed: result.processingStats.totalProcessed,
      successful: result.processingStats.successful,
      failed: result.processingStats.failed,
      results: result.results
    };
  } catch (error) {
    console.error('Error in enrichMultipleSources:', error);
    return {
      success: false,
      processed: sourceIds.length,
      successful: 0,
      failed: sourceIds.length,
      results: []
    };
  }
};
