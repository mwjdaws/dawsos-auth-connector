
import { OntologyTerm, RelatedTerm, OntologySuggestion, RelatedNote } from '@/types/ontology';

export interface UseOntologySuggestionsResult {
  suggestions: OntologySuggestion[];
  isLoading: boolean;
  error: Error | null;
  fetchSuggestions: (content: string) => Promise<OntologySuggestion[]>;
  applySuggestion: (suggestion: OntologySuggestion) => Promise<void>;
  rejectSuggestion: (suggestion: OntologySuggestion) => Promise<void>;
  reset: () => void;
}

export interface UseOntologyTermsResult {
  terms: OntologyTerm[];
  relatedTerms: RelatedTerm[];
  isLoading: boolean;
  error: Error | null;
  fetchTerms: () => Promise<OntologyTerm[]>;
  addTerm: (term: string, description?: string) => Promise<void>;
  removeTerm: (termId: string) => Promise<void>;
}

export interface UseRelatedNotesResult {
  relatedNotes: RelatedNote[];
  isLoading: boolean;
  error: Error | null;
  fetchRelatedNotes: () => Promise<RelatedNote[]>;
  applyRelatedNote: (noteId: string) => Promise<void>;
  rejectRelatedNote: (noteId: string) => Promise<void>;
}

// Make sure we export the base types for convenience including the OntologyDomain type
export type { OntologyTerm, RelatedTerm, OntologySuggestion, RelatedNote };

// Domain type
export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
  parent_id?: string | null;
}
