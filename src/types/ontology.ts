
/**
 * Ontology Term interface for knowledge management
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  review_required?: boolean;
  domain?: string;
}

/**
 * Ontology Domain interface
 */
export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
}

/**
 * Type guard to check if an object is an OntologyTerm
 */
export function isOntologyTerm(obj: any): obj is OntologyTerm {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.term === 'string' &&
    (obj.description === null || typeof obj.description === 'string')
  );
}

/**
 * Term relation types enum
 */
export enum OntologyRelationType {
  RELATED = 'related',
  PARENT = 'parent',
  CHILD = 'child',
  SYNONYM = 'synonym',
  ANTONYM = 'antonym'
}
