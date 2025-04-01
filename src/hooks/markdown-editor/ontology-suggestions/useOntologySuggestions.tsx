
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError, ErrorLevel } from '@/utils/errors';
import { OntologyTerm } from '../types';

interface UseOntologySuggestionsProps {
  sourceId?: string;
}

/**
 * Hook for managing ontology term suggestions
 */
export function useOntologySuggestions({ sourceId }: UseOntologySuggestionsProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OntologyTerm[]>([]);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches ontology term suggestions for the given content
   */
  const fetchOntologySuggestions = useCallback(
    async (content: string, title: string) => {
      if (!content || !title) {
        setSuggestions([]);
        return [];
      }

      setIsLoading(true);
      setError(null);

      try {
        // Call the suggestions edge function
        const { data, error } = await supabase.functions.invoke('suggest-ontology-terms', {
          body: {
            content,
            title
          }
        });

        if (error) {
          throw new Error(`Suggestion error: ${error.message}`);
        }

        // Transform the response to OntologyTerm format
        const termSuggestions: OntologyTerm[] = (data?.suggestions || []).map((suggestion: any) => ({
          id: suggestion.id,
          term: suggestion.term,
          description: suggestion.description || '',
          domain: suggestion.domain,
          review_required: false,
          score: suggestion.score
        }));

        setSuggestions(termSuggestions);
        return termSuggestions;
      } catch (err) {
        handleError(
          err,
          'Failed to fetch ontology term suggestions',
          { level: ErrorLevel.WARNING }
        );
        setError(err instanceof Error ? err : new Error(String(err)));
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [sourceId]
  );

  /**
   * Applies a suggested ontology term to the content
   */
  const applySuggestion = useCallback(
    async (termId: string) => {
      if (!sourceId || !termId) {
        return false;
      }

      try {
        setIsLoading(true);

        // Link the term to the content
        const { error } = await supabase
          .from('knowledge_source_ontology_terms')
          .insert({
            knowledge_source_id: sourceId,
            ontology_term_id: termId,
            review_required: false
          });

        if (error) {
          throw new Error(`Failed to apply suggestion: ${error.message}`);
        }

        // Update the local suggestion list
        setSuggestions(
          suggestions.filter(suggestion => suggestion.id !== termId)
        );

        return true;
      } catch (err) {
        handleError(
          err,
          'Failed to apply ontology term suggestion',
          { level: ErrorLevel.WARNING }
        );
        setError(err instanceof Error ? err : new Error(String(err)));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [sourceId, suggestions]
  );

  /**
   * Rejects a suggested ontology term
   */
  const rejectSuggestion = useCallback(
    (termId: string) => {
      // Simply remove from the suggestions list
      setSuggestions(suggestions.filter(suggestion => suggestion.id !== termId));
      return true;
    },
    [suggestions]
  );

  return {
    suggestions,
    isLoading,
    error,
    fetchOntologySuggestions,
    applySuggestion,
    rejectSuggestion
  };
}

export default useOntologySuggestions;
