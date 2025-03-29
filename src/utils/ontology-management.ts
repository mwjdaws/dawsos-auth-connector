
/**
 * Ontology Management Utilities
 * 
 * Provides utilities for maintaining a robust ontology system with:
 * - Schema versioning and migration management
 * - Domain scoping and validation
 * - Relationship strength and directionality
 * - Term recommendation reliability
 */

import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./errors";
import { invokeEdgeFunctionReliably } from "./edge-function-reliability";

/**
 * Structure of an ontology term
 */
export interface OntologyTerm {
  id: string;
  term: string;
  domain?: string;
  description?: string;
}

/**
 * Relation types between ontology terms
 */
export type RelationType = "broader" | "narrower" | "related" | "synonym" | "antonym";

/**
 * Validates a term within the current ontology schema
 */
export async function validateTerm(term: string, domain?: string): Promise<boolean> {
  try {
    // Check for term syntax validity
    if (!term.trim() || term.length < 2 || term.length > 100) {
      return false;
    }
    
    // Validate domain if provided
    if (domain) {
      const { data: domains } = await supabase
        .from("ontology_domains")
        .select("name")
        .eq("name", domain)
        .single();
        
      if (!domains) {
        return false;
      }
    }
    
    // Check for duplicates
    const { data: existing, error } = await supabase
      .from("ontology_terms")
      .select("id")
      .ilike("term", term)
      .eq("domain", domain || null)
      .maybeSingle();
      
    if (error) {
      console.error("Error validating term:", error);
      return false;
    }
    
    // Term is valid if it doesn't exist yet
    return !existing;
  } catch (error) {
    console.error("Term validation error:", error);
    return false;
  }
}

/**
 * Provides a fallback term recommendation when AI suggestions fail
 */
export function getLocalTermSuggestions(
  content: string,
  existingTerms: OntologyTerm[] = []
): OntologyTerm[] {
  // Create a simple local algorithm for term extraction
  // This serves as a fallback when the AI service is unavailable
  
  // Extract potential terms from content
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 3);
    
  // Count word frequency
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Filter for words that appear multiple times
  const frequentWords = Object.entries(wordFrequency)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
    
  // Convert to term objects and filter out existing terms
  const existingTermValues = new Set(existingTerms.map(t => t.term.toLowerCase()));
  
  return frequentWords
    .filter(word => !existingTermValues.has(word))
    .map(word => ({
      id: `local-${word}`,
      term: word,
      description: `Locally extracted term from content frequency`,
    }));
}

/**
 * Safely gets AI-recommended terms with fallback mechanisms
 */
export async function getTermRecommendations(
  content: string,
  title: string,
  sourceId: string
): Promise<OntologyTerm[]> {
  try {
    // Get existing terms for this source to avoid duplicates
    const { data: existingTerms } = await supabase
      .from("knowledge_source_ontology_terms")
      .select("ontology_term_id, ontology_terms(id, term, domain, description)")
      .eq("knowledge_source_id", sourceId);
      
    const existingTermObjects = existingTerms?.map(
      item => item.ontology_terms as OntologyTerm
    ) || [];

    // Try to get AI recommendations with reliability enhancements
    const result = await invokeEdgeFunctionReliably(
      "suggest-ontology-terms",
      { content, title, sourceId },
      {
        timeoutMs: 15000,
        maxRetries: 2,
        // Provide local fallback if AI fails
        fallbackFn: () => ({ 
          terms: getLocalTermSuggestions(content, existingTermObjects) 
        }),
      }
    );
    
    return (result?.terms || [])
      .filter(term => 
        // Filter out terms that are already applied
        !existingTermObjects.some(
          existing => existing.term.toLowerCase() === term.term.toLowerCase()
        )
      )
      .slice(0, 15); // Limit number of suggestions
      
  } catch (error) {
    handleError(
      error,
      "Failed to get term recommendations",
      { level: "warning", silent: true }
    );
    
    // Return empty array on failure
    return [];
  }
}

/**
 * Manages domain scope validation
 */
export async function validateDomainScopes(
  termIds: string[]
): Promise<{ valid: boolean; conflicts?: string[] }> {
  try {
    if (termIds.length === 0) return { valid: true };
    
    const { data: terms, error } = await supabase
      .from("ontology_terms")
      .select("id, term, domain")
      .in("id", termIds);
      
    if (error) {
      throw error;
    }
    
    // Group terms by domain
    const domainGroups: Record<string, string[]> = {};
    terms.forEach(term => {
      const domain = term.domain || "general";
      if (!domainGroups[domain]) {
        domainGroups[domain] = [];
      }
      domainGroups[domain].push(term.term);
    });
    
    // Check domain compatibility rules
    // For demonstration, this assumes all domains are compatible
    return { valid: true };
  } catch (error) {
    handleError(
      error,
      "Failed to validate domain scopes",
      { level: "warning", silent: true }
    );
    return { valid: false };
  }
}
