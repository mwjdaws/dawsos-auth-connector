
/**
 * Types related to ontology terms and relationships
 */

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  associationId?: string; // ID of the association between content and term
  review_required?: boolean;
}

export interface RelatedTerm {
  term_id: string;
  term: string;
  description: string;
  domain?: string;
  relation_type: string;
}

export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
}

export interface TermAssociation {
  id: string;
  knowledge_source_id: string;
  ontology_term_id: string;
  created_at?: string;
  created_by?: string;
  review_required: boolean;
}

/**
 * Interface for the result of useOntologySuggestions hook
 */
export interface UseOntologySuggestionsResult {
  suggestions: {
    terms: Array<{
      id: string;
      term: string;
      description?: string;
      domain?: string;
      score?: number;
      applied?: boolean;
      rejected?: boolean;
    }>;
    relatedNotes: Array<{
      id: string;
      title?: string;
      score?: number;
      applied: boolean;
      rejected: boolean;
    }>;
  };
  isLoading: boolean;
  error: Error | null;
  refreshSuggestions: () => Promise<void>;
  applySuggestion: (termId: string) => Promise<boolean>;
  rejectSuggestion: (termId: string) => Promise<boolean>;
  applyNoteRelation: (noteId: string) => Promise<boolean>;
  rejectNoteRelation: (noteId: string) => Promise<boolean>;
  analyzeContent: (content: string, title: string, sourceId: string) => Promise<void>;
  applySuggestedTerm: (termId: string, sourceId: string) => Promise<boolean>;
  rejectSuggestedTerm: (termId: string) => Promise<boolean>;
  applyAllSuggestedTerms: (sourceId: string, confidenceThreshold?: number) => Promise<boolean>;
}
