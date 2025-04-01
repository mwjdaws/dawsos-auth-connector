
export interface OntologySuggestion {
  id: string;
  term: string;
  description?: string | null;
  domain?: string | null;
  confidence?: number;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
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

// Export a type for the return value of the hook
export interface UseOntologySuggestionsResult {
  suggestions: {
    terms: OntologySuggestion[];
    relatedNotes: RelatedNote[];
  };
  isLoading: boolean;
  error: Error | null;
  refreshSuggestions: () => Promise<void>;
  applySuggestion: (termId: string) => Promise<boolean>;
  rejectSuggestion: (termId: string) => Promise<boolean>;
  analyzeContent: (content: string, title: string, sourceId: string) => Promise<void>;
  applySuggestedTerm: (termId: string, sourceId: string) => Promise<boolean>;
  rejectSuggestedTerm: (termId: string) => Promise<boolean>;
  applyNoteRelation: (noteId: string) => Promise<boolean>;
  rejectNoteRelation: (noteId: string) => Promise<boolean>;
  applyAllSuggestedTerms: (sourceId: string, confidenceThreshold?: number) => Promise<boolean>;
}
