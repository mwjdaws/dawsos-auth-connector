
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { Json } from '@/integrations/supabase/types';
import { EnrichmentResult, EnrichmentMetadata } from './types';

/**
 * Save enrichment results as agent_metadata in the knowledge_sources table
 */
export const saveEnrichmentMetadata = async (sourceId: string, enrichmentResult: EnrichmentResult) => {
  try {
    // Prepare the enrichment data, ensuring it's serializable
    const enrichmentData: EnrichmentMetadata = {
      suggested_terms: enrichmentResult.terms.map(term => ({
        id: term.id,
        term: term.term,
        description: term.description || null,
        domain: term.domain || null,
        score: term.score || null
      })),
      related_notes: enrichmentResult.notes.map(note => ({
        id: note.id,
        title: note.title,
        score: note.score || null
      })),
      enriched_at: new Date().toISOString(),
      enriched: true
    };
    
    const { error } = await supabase
      .from('knowledge_sources')
      .update({ 
        // Cast to Json type to satisfy TypeScript
        agent_metadata: enrichmentData as Json
      })
      .eq('id', sourceId);
    
    if (error) {
      console.error('Error saving enrichment metadata:', error);
      throw error;
    }
    
    console.log('Saved enrichment metadata to agent_metadata for source:', sourceId);
  } catch (error) {
    handleError(
      error, 
      "Failed to save enrichment metadata", 
      { level: "warning", technical: true, silent: true }
    );
  }
};

/**
 * Create links between the knowledge source and ontology terms
 */
export const createOntologyLinks = async (sourceId: string, enrichmentResult: EnrichmentResult, reviewRequired = true) => {
  try {
    // Only process if we have terms to link
    if (!enrichmentResult.terms.length) {
      return;
    }
    
    // Get existing links to avoid duplicates
    const { data: existingLinks, error: fetchError } = await supabase
      .from('knowledge_source_ontology_terms')
      .select('ontology_term_id')
      .eq('knowledge_source_id', sourceId);
    
    if (fetchError) {
      console.error('Error fetching existing ontology links:', fetchError);
      throw fetchError;
    }
    
    // Create a set of existing term IDs
    const existingTermIds = new Set(
      (existingLinks || []).map(link => link.ontology_term_id)
    );
    
    // Filter out terms that are already linked
    const newTerms = enrichmentResult.terms
      .filter(term => !existingTermIds.has(term.id))
      // Only use terms with a reasonably high score
      .filter(term => term.score && term.score > 50);
    
    if (!newTerms.length) {
      console.log('No new ontology terms to link');
      return;
    }
    
    // Create link records
    const linkRecords = newTerms.map(term => ({
      knowledge_source_id: sourceId,
      ontology_term_id: term.id,
      created_at: new Date().toISOString(),
      created_by: null, // This would be user ID in authenticated context
      review_required: reviewRequired
    }));
    
    const { error: insertError } = await supabase
      .from('knowledge_source_ontology_terms')
      .insert(linkRecords);
    
    if (insertError) {
      console.error('Error creating ontology links:', insertError);
      throw insertError;
    }
    
    console.log(`Created ${linkRecords.length} new ontology term links`);
  } catch (error) {
    handleError(
      error, 
      "Failed to create ontology links", 
      { level: "warning", technical: true, silent: true }
    );
  }
};
