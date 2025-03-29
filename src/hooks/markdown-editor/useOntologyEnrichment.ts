
import { fetchOntologySuggestions } from './ontology-enrichment/edgeFunctionService';
import { saveEnrichmentMetadata, createOntologyLinks } from './ontology-enrichment/enrichmentUtils';
import { EnrichmentOptions } from './ontology-enrichment/types';
import { handleError } from '@/utils/error-handling';

export const useOntologyEnrichment = () => {
  /**
   * Enriches content with ontology suggestions by calling the edge function
   * and optionally storing results in the database
   */
  const enrichContentWithOntology = async (
    sourceId: string,
    content: string,
    title: string,
    options: EnrichmentOptions = { autoLink: false, saveMetadata: true, reviewRequired: true }
  ) => {
    if (!sourceId || sourceId.startsWith('temp-') || !content || content.length < 50) {
      console.log('Skipping ontology enrichment for temporary or small content');
      return;
    }

    try {
      // Call the edge function to get ontology suggestions
      const result = await fetchOntologySuggestions(sourceId, content, title);
      
      if (!result) {
        return null;
      }
      
      // Save the enrichment results in metadata if requested
      if (options.saveMetadata) {
        await saveEnrichmentMetadata(sourceId, result);
      }
      
      // Automatically create links if requested
      if (options.autoLink) {
        await createOntologyLinks(sourceId, result, options.reviewRequired);
      }
      
      return result;
    } catch (error) {
      handleError(
        error, 
        "Failed to enrich content with ontology suggestions", 
        { level: "warning", technical: true, silent: true }
      );
      return null;
    }
  };

  return {
    enrichContentWithOntology
  };
};
