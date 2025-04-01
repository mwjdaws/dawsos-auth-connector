
/**
 * Type definitions for ontology-related entities
 */

// Basic ontology term interface
export interface OntologyTerm {
  id: string;
  term: string;
  description: string | null;
  domain?: string | null;
  review_required?: boolean;
  associationId?: string; // Added for AttachedTermsList component
}

// Domain for grouping ontology terms
export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
}

// Represents a link between ontology terms
export interface OntologyTermLink {
  id: string;
  source_term_id: string;
  target_term_id: string;
  link_type: string;
  created_at?: string;
  created_by?: string | null;
}

// Represents a suggestion for an ontology term
export interface OntologySuggestion {
  id: string;
  term: string;
  description: string | null;
  confidence: number;
  source_id: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Related term for graph visualization
export interface RelatedTerm {
  id: string;
  term: string;
  description?: string | null;
  domain?: string | null;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

// Related note for suggestions
export interface RelatedNote {
  id: string;
  title: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}
