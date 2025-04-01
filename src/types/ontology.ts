
/**
 * Ontology types for the application
 */

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  review_required?: boolean;
  associationId?: string; // Association ID for the term
}

export interface OntologyTermAssociation {
  id: string;
  ontology_term_id: string;
  knowledge_source_id: string;
  created_at?: string;
  created_by?: string;
  review_required?: boolean;
}

export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
  parent_id?: string | null;
}

export interface RelatedTerm {
  id: string;
  term: string;
  description: string;
  similarity: number;
  domain?: string;
}

export interface OntologySuggestion {
  id: string;
  term: string;
  description: string;
  confidence: number;
  domain?: string;
}

export interface RelatedNote {
  id: string;
  title?: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}
