
import { UseQueryResult } from '@tanstack/react-query';

export interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  associationId?: string; // ID of the association record (for removal)
  review_required?: boolean; // Whether this term needs review
}

export interface RelatedTerm {
  term_id: string; // ID of the term
  term: string;
  description: string;
  domain: string;
  relation_type: string;
}

export interface UseOntologyTermsProps {
  contentId: string;
  includeRelated?: boolean;
}

export interface UseOntologyTermsResult {
  terms: OntologyTerm[];
  relatedTerms: RelatedTerm[];
  isLoading: boolean;
  error: Error | null;
  fetchTerms: () => Promise<void>;
  handleRefresh: () => Promise<void>;
}

export interface UseTermMutationsProps {
  contentId: string;
}

export interface UseTermMutationsResult {
  addTerm: (termId: string, reviewRequired?: boolean) => Promise<boolean>;
  deleteTerm: (associationId: string) => Promise<boolean>;
  createAndAddTerm: (term: string, description?: string, domain?: string) => Promise<string | null>;
  isAdding: boolean;
  isDeleting: boolean;
  error: Error | null;
}
