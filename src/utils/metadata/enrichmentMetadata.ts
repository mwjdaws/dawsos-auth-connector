
import { EnrichmentMetadata } from '@/hooks/markdown-editor/ontology-enrichment/types';

/**
 * Helper function to get enrichment metadata from a knowledge source's metadata field
 * 
 * @param metadata The raw metadata object from a knowledge source
 * @returns Typed EnrichmentMetadata object or null if not present
 */
export const getEnrichmentMetadata = (metadata: any): EnrichmentMetadata | null => {
  if (!metadata) return null;
  
  // If the metadata has enrichment-specific fields, it's likely enrichment data
  if (
    metadata.suggested_terms ||
    metadata.related_notes ||
    metadata.enriched_at ||
    metadata.enriched === true
  ) {
    return metadata as EnrichmentMetadata;
  }
  
  return null;
}
