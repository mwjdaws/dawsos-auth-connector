
/**
 * Ontology Types
 */

/**
 * Base ontology term interface
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description: string | null;
  domain: string | null;
}

/**
 * Ontology term with additional relationship information
 */
export interface RelatedOntologyTerm extends OntologyTerm {
  relation_type: string;
}

/**
 * Ontology term with review status for knowledge sources
 */
export interface KnowledgeSourceOntologyTerm extends OntologyTerm {
  review_required: boolean;
}

/**
 * Type for ontology domain categorization
 */
export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
}

/**
 * Type for relationship between ontology terms
 */
export interface OntologyRelationship {
  id: string;
  term_id: string;
  related_term_id: string;
  relation_type: string;
}

/**
 * Payload for assigning an ontology term
 */
export interface AssignOntologyTermPayload {
  ontologyTermId: string;
  knowledgeSourceId: string;
  reviewRequired?: boolean;
}

/**
 * Payload for removing an ontology term
 */
export interface RemoveOntologyTermPayload {
  ontologyTermId: string;
  knowledgeSourceId: string;
}

/**
 * Result of ontology term operation
 */
export interface OntologyTermOperationResult {
  success: boolean;
  term?: OntologyTerm | null;
  error?: string | null;
}

/**
 * Convert from API model to frontend OntologyTerm model
 */
export function convertApiTermToOntologyTerm(apiTerm: any): OntologyTerm {
  return {
    id: apiTerm.id,
    term: apiTerm.term,
    description: apiTerm.description || null,
    domain: apiTerm.domain || null
  };
}

/**
 * Convert from API model to KnowledgeSourceOntologyTerm model
 */
export function convertToKnowledgeSourceTerm(apiTerm: any): KnowledgeSourceOntologyTerm {
  return {
    ...convertApiTermToOntologyTerm(apiTerm),
    review_required: apiTerm.review_required || false
  };
}
