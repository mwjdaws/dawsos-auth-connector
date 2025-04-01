
/**
 * Ontology term interface
 */
export interface OntologyTerm {
  id: string;
  term: string;
  description: string;
  domain?: string | null;
  review_required?: boolean;
  associationId?: string; // Add associationId for compatibility
}

/**
 * Ontology domain interface
 */
export interface OntologyDomain {
  id: string;
  name: string;
  description: string;
}

/**
 * Related term interface
 */
export interface RelatedTerm {
  id: string;
  term: string;
  description: string;
  relation_type: string;
}

/**
 * Term link interface
 */
export interface TermLink {
  source_id: string;
  target_id: string;
  link_type: string;
}

/**
 * Related note interface for connecting knowledge sources
 */
export interface RelatedNote {
  id: string;
  title: string;
  score?: number;
  applied: boolean;
  rejected: boolean;
}

/**
 * Ontology suggestion interface
 */
export interface OntologySuggestion {
  id: string;
  term: string;
  description: string;
  domain?: string | null;
  confidence: number;
  source?: string;
}

/**
 * Check if an ontology term has a valid domain
 * @param term The term to check
 * @returns Whether the term has a valid domain
 */
export function hasValidDomain(term: OntologyTerm): boolean {
  return !!term.domain && term.domain.trim().length > 0;
}

/**
 * Get a list of unique domains from a set of terms
 * @param terms List of ontology terms
 * @returns Array of unique domains
 */
export function getUniqueDomains(terms: OntologyTerm[]): string[] {
  const domains = new Set<string>();
  
  terms.forEach(term => {
    if (term.domain) {
      domains.add(term.domain);
    }
  });
  
  return Array.from(domains).sort();
}

/**
 * Filter terms by a specific domain
 * @param terms List of all terms
 * @param domain Domain to filter by
 * @returns Filtered list of terms
 */
export function filterTermsByDomain(terms: OntologyTerm[], domain: string | null): OntologyTerm[] {
  if (!domain) {
    return terms;
  }
  
  return terms.filter(term => term.domain === domain);
}
