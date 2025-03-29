
import { UseQueryResult } from '@tanstack/react-query';

export interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  associationId?: string; // ID of the association record (for removal)
}

export interface RelatedTerm {
  term_id: string;
  term: string;
  description: string;
  domain: string;
  relation_type: string;
}
