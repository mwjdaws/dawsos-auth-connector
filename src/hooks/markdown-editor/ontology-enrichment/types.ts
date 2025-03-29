
export interface OntologySuggestion {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  score?: number;
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
