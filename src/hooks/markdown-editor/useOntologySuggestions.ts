
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/utils/error-handling';

interface OntologySuggestion {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

interface RelatedNote {
  id: string;
  title: string;
  score?: number;
  applied?: boolean;
  rejected?: boolean;
}

interface EnrichmentResult {
  sourceId: string;
  terms: OntologySuggestion[];
  notes: RelatedNote[];
}

export const useOntologySuggestions = () => {
  const [suggestions, setSuggestions] = useState<EnrichmentResult>({
    sourceId: '',
    terms: [],
    notes: []
  });
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Analyze content to get ontology term and related note suggestions
   */
  const analyzeContent = async (content: string, title: string, sourceId: string) => {
    if (!content || content.length < 20 || !sourceId) {
      console.log('Content too short or sourceId missing');
      return;
    }

    setIsLoading(true);

    try {
      // Call the edge function to get ontology suggestions
      const { data, error } = await supabase.functions.invoke('suggest-ontology-terms', {
        body: { content, title, sourceId }
      });
      
      if (error) {
        console.error('Error calling suggest-ontology-terms function:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('No data returned from suggest-ontology-terms function');
        return;
      }

      console.log('Received enrichment data:', data);
      
      // Get already applied terms to mark them as applied in the UI
      const { data: existingTerms } = await supabase
        .from('knowledge_source_ontology_terms')
        .select('ontology_term_id')
        .eq('knowledge_source_id', sourceId);
      
      const appliedTermIds = new Set((existingTerms || []).map(link => link.ontology_term_id));
      
      // Update the suggestion terms with applied status
      const terms = (data.terms || []).map(term => ({
        ...term,
        applied: appliedTermIds.has(term.id),
        rejected: false
      }));
      
      const notes = (data.notes || []).map(note => ({
        ...note,
        applied: false,
        rejected: false
      }));
      
      setSuggestions({
        sourceId,
        terms,
        notes
      });
      
      return { terms, notes };
    } catch (error) {
      handleError(
        error,
        "Failed to analyze content for ontology suggestions",
        { level: "warning", technical: true, silent: true }
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Apply a suggested term by creating an association between the term and the source
   */
  const applySuggestedTerm = async (termId: string, sourceId: string) => {
    try {
      // Check if this term is already applied
      const updatedTerms = [...suggestions.terms];
      const termIndex = updatedTerms.findIndex(term => term.id === termId);
      
      if (termIndex === -1) {
        console.warn(`Term ${termId} not found in suggestions`);
        return false;
      }
      
      // If already applied, do nothing
      if (updatedTerms[termIndex].applied) {
        return true;
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
      
      setSuggestions({
        ...suggestions,
        terms: updatedTerms
      });
      
      toast({
        title: 'Term Applied',
        description: `Added "${updatedTerms[termIndex].term}" to this document`,
      });
      
      return true;
    } catch (error) {
      handleError(
        error,
        "Failed to apply ontology term suggestion",
        { level: "warning", technical: true }
      );
      return false;
    }
  };
  
  /**
   * Reject a suggested term by marking it as rejected in the UI only
   */
  const rejectSuggestedTerm = (termId: string) => {
    const updatedTerms = [...suggestions.terms];
    const termIndex = updatedTerms.findIndex(term => term.id === termId);
    
    if (termIndex === -1) {
      return false;
    }
    
    updatedTerms[termIndex] = {
      ...updatedTerms[termIndex],
      rejected: true,
      applied: false
    };
    
    setSuggestions({
      ...suggestions,
      terms: updatedTerms
    });
    
    return true;
  };
  
  /**
   * Apply all suggested terms that match certain criteria (for admin/auto mode)
   */
  const applyAllSuggestedTerms = async (sourceId: string, minScore = 60) => {
    try {
      // Get the current user's ID first
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      // Then create the terms to apply
      const termsToApply = suggestions.terms
        .filter(term => !term.applied && !term.rejected && (term.score || 0) >= minScore)
        .map(term => ({
          knowledge_source_id: sourceId,
          ontology_term_id: term.id,
          created_by: userId,
          review_required: false // Admin-applied terms don't need review
        }));
      
      if (termsToApply.length === 0) {
        return true;
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
      const updatedTerms = suggestions.terms.map(term => {
        if (!term.applied && !term.rejected && (term.score || 0) >= minScore) {
          return { ...term, applied: true };
        }
        return term;
      });
      
      setSuggestions({
        ...suggestions,
        terms: updatedTerms
      });
      
      toast({
        title: 'Terms Applied',
        description: `Added ${termsToApply.length} ontology terms to this document`,
      });
      
      return true;
    } catch (error) {
      handleError(
        error,
        "Failed to apply all ontology term suggestions",
        { level: "warning", technical: true }
      );
      return false;
    }
  };
  
  /**
   * Apply a suggested link by creating a relationship between documents
   */
  const applySuggestedLink = async (targetId: string, sourceId: string) => {
    try {
      // Check if this note is already applied
      const updatedNotes = [...suggestions.notes];
      const noteIndex = updatedNotes.findIndex(note => note.id === targetId);
      
      if (noteIndex === -1) {
        console.warn(`Note ${targetId} not found in suggestions`);
        return false;
      }
      
      // If already applied, do nothing
      if (updatedNotes[noteIndex].applied) {
        return true;
      }
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      // Create relationship in database
      const { error } = await supabase
        .from('note_links')
        .insert({
          source_id: sourceId,
          target_id: targetId,
          created_by: userId,
          link_type: 'related'
        });
      
      if (error) {
        if (error.code === '23505') {
          // Ignore unique constraint violations
          console.log('Link already exists between these documents');
        } else {
          console.error('Error applying note link:', error);
          throw error;
        }
      }
      
      // Update UI state
      updatedNotes[noteIndex] = {
        ...updatedNotes[noteIndex],
        applied: true,
        rejected: false
      };
      
      setSuggestions({
        ...suggestions,
        notes: updatedNotes
      });
      
      toast({
        title: 'Link Applied',
        description: `Added link to "${updatedNotes[noteIndex].title}"`,
      });
      
      return true;
    } catch (error) {
      handleError(
        error,
        "Failed to apply note link suggestion",
        { level: "warning", technical: true }
      );
      return false;
    }
  };
  
  /**
   * Reject a suggested link by marking it as rejected in the UI only
   */
  const rejectSuggestedLink = (noteId: string) => {
    const updatedNotes = [...suggestions.notes];
    const noteIndex = updatedNotes.findIndex(note => note.id === noteId);
    
    if (noteIndex === -1) {
      return false;
    }
    
    updatedNotes[noteIndex] = {
      ...updatedNotes[noteIndex],
      rejected: true,
      applied: false
    };
    
    setSuggestions({
      ...suggestions,
      notes: updatedNotes
    });
    
    return true;
  };

  return {
    suggestions,
    isLoading,
    analyzeContent,
    applySuggestedTerm,
    rejectSuggestedTerm,
    applyAllSuggestedTerms,
    applySuggestedLink,
    rejectSuggestedLink
  };
};
