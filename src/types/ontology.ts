
/**
 * Ontology type definitions
 */

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string | null;
  review_required?: boolean;
}

export interface RelatedTerm {
  id: string;
  term: string;
  relationType: string;
}

export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
}

export interface OntologyRelationship {
  id: string;
  term_id: string;
  related_term_id: string;
  relation_type: string;
}
