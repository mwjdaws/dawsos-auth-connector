
/**
 * Type definitions for ontology-related entities
 */

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
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
  domain?: string;
  relationshipType?: string;
  relationshipId?: string;
  term_id?: string; // For backward compatibility
  relation_type?: string; // For backward compatibility
}
