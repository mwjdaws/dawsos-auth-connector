
/**
 * Types for ontology-related functionality
 */

// Basic ontology term structure
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
}

// Related term with relationship information
export interface RelatedTerm extends OntologyTerm {
  relationshipType: string;
  relationshipId: string;
}

// Ontology suggestion from AI
export interface OntologySuggestion {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}

// Note relationship suggestion
export interface RelatedNote {
  id: string;
  title?: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}

// Ontology domain definition
export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
}

// Hook result for useOntologySuggestions
export interface UseOntologySuggestionsResult {
  suggestions: OntologySuggestion[];
  relatedNotes: RelatedNote[];
  isLoading: boolean;
  error: Error | null;
  refreshSuggestions: () => void;
  applySuggestion: (termId: string) => Promise<boolean>;
  rejectSuggestion: (termId: string) => Promise<boolean>;
  applyNoteRelation: (noteId: string) => Promise<boolean>;
  rejectNoteRelation: (noteId: string) => Promise<boolean>;
}
