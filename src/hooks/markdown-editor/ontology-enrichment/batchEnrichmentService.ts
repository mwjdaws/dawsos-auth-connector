
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
    
    // Add request metadata for logging purposes
    const metadata = {
      requestId: `batch-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
      sourceCount: sourceIds.length
    };
    
    const { data, error } = await supabase.functions.invoke('batch-ontology-enrichment', {
      body: { 
        sourceIds,
        metadata
      }
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

// Add a function to check agent task quotas and rate limits
export const checkAgentQuotas = async (agentName: string): Promise<{
  canProcess: boolean;
  rateLimited: boolean;
  quotaExceeded: boolean;
  resetTime?: string;
  message?: string;
}> => {
  try {
    // Call a lightweight edge function to check quotas and rate limits
    const { data, error } = await supabase.functions.invoke('check-agent-quotas', {
      body: { agentName }
    });
    
    if (error) {
      console.error(`Error checking quotas for ${agentName}:`, error);
      // Default to allowing processing if quota check fails
      return {
        canProcess: true,
        rateLimited: false,
        quotaExceeded: false,
        message: `Could not check quotas: ${error.message}`
      };
    }
    
    return data;
  } catch (error) {
    console.error(`Exception checking quotas for ${agentName}:`, error);
    // Default to allowing processing if quota check fails
    return {
      canProcess: true,
      rateLimited: false,
      quotaExceeded: false,
      message: `Exception checking quotas: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
