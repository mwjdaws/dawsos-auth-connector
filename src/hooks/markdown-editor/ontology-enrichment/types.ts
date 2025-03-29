
/**
 * Ontology Suggestion Types
 */

// Basic suggestion type for ontology terms
export interface OntologySuggestion {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

// Related note type
export interface RelatedNote {
  id: string;
  title: string;
  score?: number;
}

/**
 * Enrichment Types
 */

// Result returned from enrichment process
export interface EnrichmentResult {
  sourceId: string;
  terms: OntologySuggestion[];
  notes: RelatedNote[];
}

// Options for the enrichment process
export interface EnrichmentOptions {
  autoLink?: boolean;
  saveMetadata?: boolean;
  reviewRequired?: boolean;
}

/**
 * Metadata Types
 */

// Term entry in metadata
export interface EnrichmentMetadataTerm {
  id: string;
  term: string;
  description?: string | null;
  domain?: string | null;
  score?: number | null;
}

// Related note entry in metadata
export interface EnrichmentMetadataNote {
  id: string;
  title: string;
  score?: number | null;
}

// Complete metadata structure
export interface EnrichmentMetadata {
  suggested_terms?: EnrichmentMetadataTerm[];
  related_notes?: EnrichmentMetadataNote[];
  enriched_at?: string;
  enriched?: boolean;
  keywords_extracted?: string[];
  analysis_type?: string;
}

/**
 * Helper Functions
 */

/**
 * Helper function to get enrichment metadata from a knowledge source's metadata field
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
