
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

export interface OntologySuggestionsResult {
  terms: OntologySuggestion[];
  relatedNotes: RelatedNote[];
}

export interface EnrichmentResult {
  sourceId: string;
  terms: OntologySuggestion[];
  notes: RelatedNote[];
}

export interface UseOntologySuggestionsResult {
  suggestions: {
    terms: OntologySuggestion[];
    relatedNotes: RelatedNote[];
  };
  isLoading: boolean;
  error: Error | null;
  refreshSuggestions: () => Promise<void>;
  applySuggestion: (termId: string, sourceId: string) => Promise<boolean>;
  rejectSuggestion: (termId: string) => Promise<boolean>;
  applyNoteRelation: (noteId: string, sourceId: string) => Promise<boolean>;
  rejectNoteRelation: (noteId: string) => Promise<boolean>;
  analyzeContent: (content: string, title: string, sourceId: string) => Promise<void>;
  applySuggestedTerm: (termId: string, sourceId: string) => Promise<boolean>;
  rejectSuggestedTerm: (termId: string) => Promise<boolean>;
  applyAllSuggestedTerms: (sourceId: string, minConfidence?: number) => Promise<boolean>;
}
