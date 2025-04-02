
/**
 * Ontology-related Types
 * 
 * Type definitions for ontology terms, domains, and relationships
 */

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain: string;
  associationId?: string;
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
  domain: string;
  similarity: number;
  applied: boolean;
  rejected: boolean;
}

export interface OntologyAssociation {
  id: string;
  knowledge_source_id: string;
  ontology_term_id: string;
  review_required: boolean;
  created_at?: string;
  created_by?: string | null;
}

export interface TermSuggestion {
  id?: string;
  term: string;
  description?: string;
  domain?: string;
  confidence?: number;
  applied: boolean;
  rejected: boolean;
}

export interface OntologyRelationship {
  term1_id: string;
  term2_id: string;
  relationship_type: string;
  strength: number;
}

export interface OntologySuggestion {
  id: string;
  term: string;
  description?: string | null;
  domain?: string | null;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

export interface RelatedNote {
  id: string;
  title: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}
