
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/error-handling';
import { toast } from '@/hooks/use-toast';
import { OntologySuggestion } from './types';

/**
 * Apply a suggested term by creating an association between the term and the source
 */
export const applySuggestedTerm = async (
  termId: string, 
  sourceId: string,
  terms: OntologySuggestion[]
): Promise<{ success: boolean; updatedTerms: OntologySuggestion[] }> => {
  try {
    // Check if this term is already applied
    const updatedTerms = [...terms];
    const termIndex = updatedTerms.findIndex(term => term.id === termId);
    
    if (termIndex === -1) {
      console.warn(`Term ${termId} not found in suggestions`);
      return { success: false, updatedTerms };
    }
    
    // If already applied, do nothing
    if (updatedTerms[termIndex].applied) {
      return { success: true, updatedTerms };
    }
    
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    // Create association in database
    const { error } = await supabase
      .from('knowledge_source_ontology_terms')
      .insert({
        knowledge_source_id: sourceId,
        ontology_term_id: termId,
        created_by: userId,
        review_required: false // Mark as not requiring review since user explicitly approved it
      });
    
    if (error) {
      if (error.code === '23505') {
        // Ignore unique constraint violations
        console.log('Term already associated with this source');
      } else {
        console.error('Error applying ontology term:', error);
        throw error;
      }
    }
    
    // Update UI state
    updatedTerms[termIndex] = {
      ...updatedTerms[termIndex],
      applied: true,
      rejected: false
    };
    
    toast({
      title: 'Term Applied',
      description: `Added "${updatedTerms[termIndex].term}" to this document`,
    });
    
    return { success: true, updatedTerms };
  } catch (error) {
    handleError(
      error,
      "Failed to apply ontology term suggestion",
      { level: "warning", technical: true }
    );
    return { success: false, updatedTerms: terms };
  }
};

/**
 * Reject a suggested term by marking it as rejected in the UI only
 */
export const rejectSuggestedTerm = (
  termId: string,
  terms: OntologySuggestion[]
): { success: boolean; updatedTerms: OntologySuggestion[] } => {
  const updatedTerms = [...terms];
  const termIndex = updatedTerms.findIndex(term => term.id === termId);
  
  if (termIndex === -1) {
    return { success: false, updatedTerms };
  }
  
  updatedTerms[termIndex] = {
    ...updatedTerms[termIndex],
    rejected: true,
    applied: false
  };
  
  return { success: true, updatedTerms };
};

/**
 * Apply all suggested terms that match certain criteria (for admin/auto mode)
 */
export const applyAllSuggestedTerms = async (
  sourceId: string,
  terms: OntologySuggestion[],
  minScore = 60
): Promise<{ success: boolean; updatedTerms: OntologySuggestion[] }> => {
  try {
    // Get the current user's ID first
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    // Then create the terms to apply
    const termsToApply = terms
      .filter(term => !term.applied && !term.rejected && (term.score || 0) >= minScore)
      .map(term => ({
        knowledge_source_id: sourceId,
        ontology_term_id: term.id,
        created_by: userId,
        review_required: false // Admin-applied terms don't need review
      }));
    
    if (termsToApply.length === 0) {
      return { success: true, updatedTerms: terms };
    }
    
    // Insert all terms at once
    const { error } = await supabase
      .from('knowledge_source_ontology_terms')
      .insert(termsToApply);
    
    if (error) {
      console.error('Error applying all ontology terms:', error);
      throw error;
    }
    
    // Update UI state for all applied terms
    const updatedTerms = terms.map(term => {
      if (!term.applied && !term.rejected && (term.score || 0) >= minScore) {
        return { ...term, applied: true };
      }
      return term;
    });
    
    toast({
      title: 'Terms Applied',
      description: `Added ${termsToApply.length} ontology terms to this document`,
    });
    
    return { success: true, updatedTerms };
  } catch (error) {
    handleError(
      error,
      "Failed to apply all ontology term suggestions",
      { level: "warning", technical: true }
    );
    return { success: false, updatedTerms: terms };
  }
};
