
/**
 * Type definitions for ontology suggestions functionality
 */

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
  applied?: boolean;
  rejected?: boolean;
}

export interface EnrichmentResult {
  sourceId: string;
  terms: OntologySuggestion[];
  notes: RelatedNote[];
}
