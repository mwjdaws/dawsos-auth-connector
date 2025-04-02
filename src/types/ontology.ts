
/**
 * Ontology type definitions
 */

export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string | null;
  review_required?: boolean;
  associationId?: string; // Added for AttachedTermsList component
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

// For adding compatibility with older code
export interface OntologyTermContent {
  id: string;
  contentId: string;
  termId: string;
  term: {
    id: string;
    name: string;
    description: string | null;
    domainId: string | null;
    domainName: string | null;
  };
}

// For suggestions system
export interface OntologySuggestion {
  id: string;
  term: string; 
  description: string;
  score: number;
  confidence: number;
}

// For related notes/documents system
export interface RelatedNote {
  id: string;
  title?: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}
