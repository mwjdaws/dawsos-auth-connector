
export interface OntologySuggestion {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

export interface RelatedNote {
  id: string;
  title: string;
  score?: number;
}

export interface EnrichmentResult {
  sourceId: string;
  terms: OntologySuggestion[];
  notes: RelatedNote[];
}

export interface EnrichmentOptions {
  autoLink?: boolean;
  saveMetadata?: boolean;
  reviewRequired?: boolean;
}

export interface EnrichmentMetadata {
  suggested_terms?: Array<{
    id: string;
    term: string;
    description?: string | null;
    domain?: string | null;
    score?: number | null;
  }>;
  related_notes?: Array<{
    id: string;
    title: string;
    score?: number | null;
  }>;
  enriched_at?: string;
  enriched?: boolean;
  keywords_extracted?: string[];
  analysis_type?: string;
}

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
