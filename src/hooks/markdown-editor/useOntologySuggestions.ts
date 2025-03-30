
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OntologySuggestions, OntologySuggestion, RelatedNote } from './types';
import { useAuth } from '@/hooks/useAuth';
import { handleError } from '@/utils/errors';
import { toast } from '@/hooks/use-toast';

export function useOntologySuggestions() {
  const [suggestions, setSuggestions] = useState<OntologySuggestions>({ 
    terms: [], 
    relatedNotes: [] 
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const analyzeContent = useCallback(async (
    content: string, 
    title: string, 
    sourceId: string
  ) => {
    if (!content || !sourceId) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: { content, title, sourceId }
      });

      if (error) {
        throw error;
      }

      setSuggestions(data || { terms: [], relatedNotes: [] });
    } catch (err) {
      handleError(err, "Failed to analyze content for ontology terms", {
        context: { sourceId },
        level: "error"
      });
      
      toast({
        title: "Error",
        description: "Failed to generate ontology suggestions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applySuggestedTerm = useCallback(async (
    termId: string,
    sourceId: string
  ) => {
    if (!termId || !sourceId) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert({
          knowledge_source_id: sourceId,
          ontology_term_id: termId,
          created_by: user?.id || null,
          review_required: false
        });

      if (error) {
        throw error;
      }

      // Update local state to mark as applied
      setSuggestions(prev => ({
        ...prev,
        terms: prev.terms.map(term => 
          term.id === termId 
            ? { ...term, applied: true, rejected: false } 
            : term
        )
      }));

      toast({
        title: "Term Applied",
        description: "The suggested ontology term has been applied"
      });

      return true;
    } catch (err) {
      handleError(err, "Failed to apply ontology term", {
        context: { termId, sourceId },
        level: "error"
      });
      return false;
    }
  }, [user?.id]);

  const rejectSuggestedTerm = useCallback((termId: string) => {
    setSuggestions(prev => ({
      ...prev,
      terms: prev.terms.map(term => 
        term.id === termId 
          ? { ...term, rejected: true, applied: false } 
          : term
      )
    }));
    
    return true;
  }, []);

  const applyAllSuggestedTerms = useCallback(async (
    sourceId: string, 
    confidenceThreshold: number = 70
  ) => {
    try {
      const highConfidenceTerms = suggestions.terms
        .filter(term => 
          !term.applied && 
          !term.rejected && 
          (term.score || 0) >= confidenceThreshold
        );
      
      if (highConfidenceTerms.length === 0) {
        toast({
          title: "No Terms to Apply",
          description: "There are no high-confidence terms to apply"
        });
        return false;
      }
      
      const termEntries = highConfidenceTerms.map(term => ({
        knowledge_source_id: sourceId,
        ontology_term_id: term.id,
        created_by: user?.id || null,
        review_required: false
      }));
      
      const { error } = await supabase
        .from('knowledge_source_ontology_terms')
        .insert(termEntries);
      
      if (error) {
        throw error;
      }
      
      // Update local state to mark all as applied
      setSuggestions(prev => ({
        ...prev,
        terms: prev.terms.map(term => 
          highConfidenceTerms.some(hct => hct.id === term.id)
            ? { ...term, applied: true, rejected: false }
            : term
        )
      }));
      
      toast({
        title: "Terms Applied",
        description: `Applied ${highConfidenceTerms.length} high-confidence terms`
      });
      
      return true;
    } catch (err) {
      handleError(err, "Failed to apply all ontology terms", {
        context: { sourceId },
        level: "error"
      });
      return false;
    }
  }, [suggestions.terms, user?.id]);

  return {
    suggestions,
    isLoading,
    analyzeContent,
    applySuggestedTerm,
    rejectSuggestedTerm,
    applyAllSuggestedTerms
  };
}

export default useOntologySuggestions;
