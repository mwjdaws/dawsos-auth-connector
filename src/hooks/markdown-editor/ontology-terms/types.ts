
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
