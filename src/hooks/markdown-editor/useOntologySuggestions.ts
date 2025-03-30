
import { useState } from 'react';
import { handleError } from '@/utils/errors';
import { 
  OntologySuggestion, 
  RelatedNote, 
  EnrichmentResult 
} from './ontology-suggestions/types';
import { 
  analyzeContent as analyzeContentService,
  getAppliedTerms 
} from './ontology-suggestions/suggestionsService';
import { 
  applySuggestedTerm as applyTerm,
  rejectSuggestedTerm as rejectTerm,
  applyAllSuggestedTerms as applyAllTerms
} from './ontology-suggestions/termOperations';
import { 
  applySuggestedLink as applyLink,
  rejectSuggestedLink as rejectLink
} from './ontology-suggestions/linkOperations';

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
      // Call the service to get ontology suggestions
      const data = await analyzeContentService(content, title, sourceId);
      
      if (!data) {
        setIsLoading(false);
        return;
      }
      
      // Get already applied terms to mark them as applied in the UI
      const appliedTermIds = await getAppliedTerms(sourceId);
      
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
    const { success, updatedTerms } = await applyTerm(termId, sourceId, suggestions.terms);
    
    if (success) {
      setSuggestions({
        ...suggestions,
        terms: updatedTerms
      });
    }
    
    return success;
  };
  
  /**
   * Reject a suggested term by marking it as rejected in the UI only
   */
  const rejectSuggestedTerm = (termId: string) => {
    const { success, updatedTerms } = rejectTerm(termId, suggestions.terms);
    
    if (success) {
      setSuggestions({
        ...suggestions,
        terms: updatedTerms
      });
    }
    
    return success;
  };
  
  /**
   * Apply all suggested terms that match certain criteria (for admin/auto mode)
   */
  const applyAllSuggestedTerms = async (sourceId: string, minScore = 60) => {
    const { success, updatedTerms } = await applyAllTerms(sourceId, suggestions.terms, minScore);
    
    if (success) {
      setSuggestions({
        ...suggestions,
        terms: updatedTerms
      });
    }
    
    return success;
  };
  
  /**
   * Apply a suggested link by creating a relationship between documents
   */
  const applySuggestedLink = async (targetId: string, sourceId: string) => {
    const { success, updatedNotes } = await applyLink(targetId, sourceId, suggestions.notes);
    
    if (success) {
      setSuggestions({
        ...suggestions,
        notes: updatedNotes
      });
    }
    
    return success;
  };
  
  /**
   * Reject a suggested link by marking it as rejected in the UI only
   */
  const rejectSuggestedLink = (noteId: string) => {
    const { success, updatedNotes } = rejectLink(noteId, suggestions.notes);
    
    if (success) {
      setSuggestions({
        ...suggestions,
        notes: updatedNotes
      });
    }
    
    return success;
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
