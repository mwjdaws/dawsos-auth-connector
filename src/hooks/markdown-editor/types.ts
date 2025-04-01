
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  review_required?: boolean;
  associationId?: string;
}

export interface RelatedTerm {
  term_id: string;
  term: string;
  relation_type: string;
  domain?: string;
  description?: string;
}

// Re-export the OntologyTerm type so components can import it from here
export type { OntologyTerm };
