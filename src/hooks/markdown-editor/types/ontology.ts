
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
