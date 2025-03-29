
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';

interface OntologySuggestion {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  score?: number;
}

interface RelatedNote {
  id: string;
  title: string;
  score?: number;
}

interface EnrichmentResult {
  sourceId: string;
  terms: OntologySuggestion[];
  notes: RelatedNote[];
}

interface EnrichmentOptions {
  autoLink?: boolean;
  saveMetadata?: boolean;
}

export const useOntologyEnrichment = () => {
  /**
   * Enriches content with ontology suggestions by calling the edge function
   * and optionally storing results in the database
   */
  const enrichContentWithOntology = async (
    sourceId: string,
    content: string,
    title: string,
    options: EnrichmentOptions = { autoLink: false, saveMetadata: true }
  ) => {
    if (!sourceId || sourceId.startsWith('temp-') || !content || content.length < 50) {
      console.log('Skipping ontology enrichment for temporary or small content');
      return;
    }

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
        return;
      }
      
      const result = data as EnrichmentResult;
      console.log(`Received ${result.terms.length} term suggestions and ${result.notes.length} note suggestions`);
      
      // Save the enrichment results in metadata if requested
      if (options.saveMetadata) {
        await saveEnrichmentMetadata(sourceId, result);
      }
      
      // Automatically create links if requested
      if (options.autoLink) {
        await createOntologyLinks(sourceId, result);
      }
      
      return result;
    } catch (error) {
      handleError(
        error, 
        "Failed to enrich content with ontology suggestions", 
        { level: "warning", technical: true, silent: true }
      );
    }
  };
  
  /**
   * Save enrichment results as metadata in the knowledge_sources table
   */
  const saveEnrichmentMetadata = async (sourceId: string, enrichmentResult: EnrichmentResult) => {
    try {
      const metadataUpdate = {
        agent_metadata: {
          ontology_enrichment: {
            suggested_terms: enrichmentResult.terms,
            related_notes: enrichmentResult.notes,
            enriched_at: new Date().toISOString(),
            enriched: true
          }
        }
      };
      
      const { error } = await supabase
        .from('knowledge_sources')
        .update(metadataUpdate)
        .eq('id', sourceId);
      
      if (error) {
        console.error('Error saving enrichment metadata:', error);
        throw error;
      }
      
      console.log('Saved enrichment metadata for source:', sourceId);
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
  const createOntologyLinks = async (sourceId: string, enrichmentResult: EnrichmentResult) => {
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
        created_by: null // This would be user ID in authenticated context
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

  return {
    enrichContentWithOntology
  };
};
