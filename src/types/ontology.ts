
/**
 * Ontology-related type definitions
 */

/**
 * Base interface for an ontology term
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain: string;
  review_required?: boolean;
  associationId?: string;
}

/**
 * Term suggested by the ontology enrichment engine
 */
export interface OntologySuggestion {
  id: string;
  term: string;
  description: string;
  score: number;
  domain?: string;
  applied?: boolean;
  rejected?: boolean;
}

/**
 * Term related to another term in the ontology
 */
export interface RelatedTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  relationship: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

/**
 * Note related to the current content
 */
export interface RelatedNote {
  id: string;
  title: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

/**
 * Domain information for ontology terms
 */
export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
}

/**
 * Association between a knowledge source and an ontology term
 */
export interface OntologyTermAssociation {
  id: string;
  knowledge_source_id: string;
  ontology_term_id: string;
  review_required: boolean;
  created_at?: string;
  created_by?: string;
}
