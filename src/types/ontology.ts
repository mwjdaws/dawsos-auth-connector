
/**
 * Ontology System Types
 * 
 * Types for the ontology system that classifies and organizes knowledge
 */

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain: string;
  review_required?: boolean;
}

export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
}

export interface RelatedTerm {
  id: string;
  term: string;
  description: string;
  domain: string;
  relationship_type: string;
  confidence?: number;
}

export interface OntologyTermLink {
  source_id: string;
  target_id: string;
  link_type: string;
  created_at?: string;
  created_by?: string | null;
}

export interface OntologyMap {
  terms: OntologyTerm[];
  links: OntologyTermLink[];
}

export interface OntologySuggestion {
  id: string;
  term: string;
  description: string;
  confidence: number;
  domain?: string;
}
