
/**
 * Types for ontology-related functionality
 */

// Basic ontology term structure
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  associationId?: string; // Added for compatibility with AttachedTermsList
}

// Related term with relationship information
export interface RelatedTerm extends OntologyTerm {
  relationshipType: string;
  relationshipId: string;
  term_id?: string; // Added for compatibility with RelatedTermsList
  relation_type?: string; // Added for compatibility with RelatedTermsList
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

// OntologySuggestions result
export interface OntologySuggestionsResult {
  terms: OntologySuggestion[];
  relatedNotes: RelatedNote[];
}

// Hook result for useOntologySuggestions
export interface UseOntologySuggestionsResult {
  suggestions: OntologySuggestionsResult;
  isLoading: boolean;
  error: Error | null;
  refreshSuggestions: () => void;
  applySuggestion: (termId: string) => Promise<boolean>;
  rejectSuggestion: (termId: string) => Promise<boolean>;
  applyNoteRelation: (noteId: string) => Promise<boolean>;
  rejectNoteRelation: (noteId: string) => Promise<boolean>;
  // Added for compatibility with OntologySuggestionsPanel
  analyzeContent: (content: string, title: string, sourceId: string) => Promise<void>;
  applySuggestedTerm: (termId: string, sourceId: string) => Promise<boolean>;
  rejectSuggestedTerm: (termId: string) => Promise<boolean>;
  applyAllSuggestedTerms: (sourceId: string, minimumScore?: number) => Promise<boolean>;
}

// Hook props for useOntologyTerms
export interface UseOntologyTermsProps {
  contentId: string;
}

// Hook result for useOntologyTerms
export interface UseOntologyTermsResult {
  terms: OntologyTerm[];
  isLoading: boolean;
  error: Error | null;
  refreshTerms: () => Promise<void>;
  // Added for compatibility with OntologyTermsPanel
  handleRefresh: () => Promise<void>;
}

// Hook props for useTermMutations
export interface UseTermMutationsProps {
  contentId: string;
}

// Hook result for useTermMutations
export interface UseTermMutationsResult {
  addTerm: (termId: string) => Promise<boolean>;
  addTermByName: (termName: string) => Promise<boolean>;
  isAdding: boolean;
  isDeleting: boolean;
  // Added for compatibility with OntologyTermsPanel
  deleteTerm: (termId: string) => Promise<boolean>;
}
