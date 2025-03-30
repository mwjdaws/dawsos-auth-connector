
/**
 * Content Existence Check Hook
 * 
 * A hook that verifies if content with a given ID exists in the database.
 * Implements proper type guards and validation.
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation';

/**
 * Type guard to check if data is valid content
 * 
 * @param data - Any data to check
 * @returns Type predicate indicating if the data represents valid content
 */
function isValidContent(data: any): data is { id: string } {
  return data && typeof data.id === 'string';
}

/**
 * Hook to check if content with the given ID exists in the database
 * 
 * @param contentId - The ID to check for existence
 * @returns Object containing existence status, loading state, and any error
 */
export function useContentExists(contentId: string) {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkContentExists() {
      if (!isValidContentId(contentId)) {
        if (isMounted) {
          setExists(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        // Use knowledge_sources table which exists in the Supabase schema
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('id')
          .eq('id', contentId)
          .maybeSingle();

        if (error) throw error;

        if (isMounted) {
          setExists(data !== null && isValidContent(data));
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setIsLoading(false);
        }
      }
    }

    checkContentExists();

    return () => {
      isMounted = false;
    };
  }, [contentId]);

  return { exists, isLoading, error };
}
