
import { supabase, handleError, ApiError, parseSupabaseErrorCode } from './base';

/**
 * Starts the batch enrichment process for knowledge sources that haven't been enriched yet
 */
export const triggerBatchEnrichment = async (batchSize: number = 10, applyOntologyTerms: boolean = true) => {
  try {
    const { data, error } = await supabase.functions.invoke('batch-enrich-content', {
      body: { batchSize, applyOntologyTerms }
    });
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    return data;
  } catch (error) {
    handleError(error, "Failed to trigger batch enrichment");
    throw error;
  }
};

/**
 * Enriches a single knowledge source with ontology suggestions
 */
export const enrichSingleSource = async (sourceId: string, applyOntologyTerms: boolean = false) => {
  try {
    // First fetch the knowledge source to get its content and title
    const { data: source, error: fetchError } = await supabase
      .from('knowledge_sources')
      .select('title, content')
      .eq('id', sourceId)
      .single();
    
    if (fetchError) throw new ApiError(fetchError.message, parseSupabaseErrorCode(fetchError));
    if (!source) throw new Error(`Knowledge source with ID ${sourceId} not found`);
    
    // Call the suggest-ontology-terms function to get term suggestions
    const { data: suggestionsData, error: suggestionsError } = await supabase.functions.invoke(
      'suggest-ontology-terms',
      { body: { sourceId, content: source.content, title: source.title } }
    );
    
    if (suggestionsError) throw new ApiError(suggestionsError.message, parseSupabaseErrorCode(suggestionsError));
    
    // Prepare metadata for ontology enrichment
    const enrichmentMetadata = {
      enriched: true,
      enriched_at: new Date().toISOString(),
      suggested_terms: suggestionsData?.terms || [],
      related_notes: suggestionsData?.notes || [],
      analysis_type: "ontology_term_suggestions",
      processed_content_size: source.content.length
    };
    
    // Update the knowledge source with enriched metadata
    const { error: updateError } = await supabase
      .from('knowledge_sources')
      .update({ metadata: enrichmentMetadata })
      .eq('id', sourceId);
    
    if (updateError) throw new ApiError(updateError.message, parseSupabaseErrorCode(updateError));
    
    // If requested, apply ontology terms with good confidence scores
    if (applyOntologyTerms && suggestionsData?.terms) {
      const goodTerms = suggestionsData.terms
        .filter(term => term.score && term.score > 70);
      
      if (goodTerms.length > 0) {
        // Get existing term links to avoid duplicates
        const { data: existingLinks } = await supabase
          .from('knowledge_source_ontology_terms')
          .select('ontology_term_id')
          .eq('knowledge_source_id', sourceId);
        
        const existingTermIds = new Set(
          (existingLinks || []).map(link => link.ontology_term_id)
        );
        
        // Filter out terms that are already linked
        const newTerms = goodTerms.filter(term => !existingTermIds.has(term.id));
        
        if (newTerms.length > 0) {
          // Create link records
          const linkRecords = newTerms.map(term => ({
            knowledge_source_id: sourceId,
            ontology_term_id: term.id,
            created_at: new Date().toISOString(),
            review_required: false // Auto-approve high confidence terms
          }));
          
          const { error: linkError } = await supabase
            .from('knowledge_source_ontology_terms')
            .insert(linkRecords);
          
          if (linkError) throw new ApiError(linkError.message, parseSupabaseErrorCode(linkError));
        }
      }
    }
    
    return { success: true, sourceId, suggestionsCount: suggestionsData?.terms?.length || 0 };
  } catch (error) {
    handleError(error, `Failed to enrich knowledge source with ID: ${sourceId}`);
    throw error;
  }
};

/**
 * Enriches multiple knowledge sources with ontology suggestions
 */
export const enrichMultipleSources = async (sourceIds: string[], applyOntologyTerms: boolean = false) => {
  try {
    const { data, error } = await supabase.functions.invoke('batch-ontology-enrichment', {
      body: { sourceIds, applyOntologyTerms }
    });
    
    if (error) throw new ApiError(error.message, parseSupabaseErrorCode(error));
    
    return {
      success: true,
      processed: data.processingStats?.totalProcessed || 0,
      successful: data.processingStats?.successful || 0,
      failed: data.processingStats?.failed || 0,
      results: data.results || []
    };
  } catch (error) {
    handleError(error, "Failed to enrich multiple knowledge sources");
    throw error;
  }
};
