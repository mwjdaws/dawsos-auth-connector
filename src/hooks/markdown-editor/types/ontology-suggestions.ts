
export interface OntologySuggestion {
  id: string;
  term: string;
  description?: string | null;
  domain?: string | null;
  confidence?: number;
}

export interface RelatedNote {
  id: string;
  title?: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}

export interface OntologySuggestionsResult {
  terms: OntologySuggestion[];
  relatedNotes: RelatedNote[];
}
