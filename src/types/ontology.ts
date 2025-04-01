
/**
 * Type definitions for ontology-related entities
 */

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string | null;
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
  domain?: string | null;
  relationshipType?: string;
  relationshipId?: string;
  term_id?: string; // For backward compatibility
  relation_type?: string; // For backward compatibility
}

export interface OntologyTermRelationship {
  id: string;
  term_id: string;
  related_term_id: string;
  relation_type: string;
}

export interface RelatedNote {
  id: string;
  title?: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}
