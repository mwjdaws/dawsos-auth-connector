
// Basic ontology term interface
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string;
  associationId?: string; // Adding associationId property
  review_required?: boolean;
}

// Related term data structure
export interface RelatedTerm {
  id: string;
  term: string;
  domain?: string;
  description?: string;
  confidence?: number;
  score?: number;
}

// Term suggestions interface
export interface TermSuggestion {
  id: string;
  term: string;
  domain?: string;
  description?: string;
  confidence?: number;
}

// Domain structure
export interface Domain {
  id: string;
  name: string;
  description?: string;
}

// Term relationship types
export enum TermRelationshipType {
  BROADER = 'broader',
  NARROWER = 'narrower',
  RELATED = 'related',
  EQUIVALENT = 'equivalent'
}

// Term relationship structure
export interface TermRelationship {
  id: string;
  sourceTermId: string;
  targetTermId: string;
  type: TermRelationshipType;
  confidence?: number;
}

// Term hierarchy item
export interface TermHierarchyItem {
  id: string;
  term: string;
  domain?: string;
  description?: string;
  children?: TermHierarchyItem[];
  level: number;
}

// Term suggestion count
export interface TermSuggestionCount {
  count: number;
  sourceId: string;
}

// Define export types
export type OntologyTermMap = Record<string, OntologyTerm>;
export type DomainMap = Record<string, Domain>;
export type TermRelationshipMap = Record<string, TermRelationship[]>;
