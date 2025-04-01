
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError, ErrorLevel } from '@/utils/errors';

interface OntologySuggestion {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  confidence: number;
}

interface UseOntologySuggestionsProps {
  sourceId?: string;
  content?: string;
}

/**
 * Hook for getting ontology term suggestions based on content
 */
export function useOntologySuggestions({
  sourceId,
  content
}: UseOntologySuggestionsProps = {}) {
  const [suggestions, setSuggestions] = useState<OntologySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches ontology suggestions based on content
   */
  const fetchSuggestions = useCallback(
    async (text: string) => {
      if (!text || text.trim().length < 10) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Call the suggestions edge function
        const { data, error } = await supabase.functions.invoke('get-ontology-suggestions', {
          body: {
            text,
            sourceId
          }
        });

        if (error) {
          throw new Error(`Suggestions error: ${error.message}`);
        }

        setSuggestions(data?.suggestions || []);
        return data?.suggestions;
      } catch (err) {
        handleError(
          err,
          'Failed to get ontology term suggestions',
          { level: ErrorLevel.WARNING }
        );
        setError(err instanceof Error ? err : new Error(String(err)));
        setSuggestions([]);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [sourceId]
  );

  // Auto-fetch suggestions when content changes significantly
  useEffect(() => {
    if (content && content.length > 50) {
      // Debounce to avoid too many requests
      const timer = setTimeout(() => {
        fetchSuggestions(content);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [content, fetchSuggestions]);

  /**
   * Applies a suggested term to the content
   */
  const applySuggestion = useCallback(
    async (suggestionId: string) => {
      if (!sourceId || !suggestionId) return false;
      
      try {
        const { error } = await supabase.functions.invoke('apply-ontology-suggestion', {
          body: {
            sourceId,
            suggestionId
          }
        });

        if (error) throw new Error(error.message);
        
        // Remove the applied suggestion from the list
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
        return true;
      } catch (err) {
        handleError(
          err,
          `Failed to apply ontology suggestion: ${suggestionId}`,
          { level: ErrorLevel.WARNING }
        );
        return false;
      }
    },
    [sourceId]
  );

  /**
   * Rejects a suggested term
   */
  const rejectSuggestion = useCallback(
    (suggestionId: string) => {
      setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    },
    []
  );

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
    applySuggestion,
    rejectSuggestion
  };
}

export default useOntologySuggestions;
