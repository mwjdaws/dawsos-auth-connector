
/**
 * Hook to check if content exists
 * 
 * This hook queries the database to verify if a content ID exists.
 * It's useful for validation before performing operations on content.
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { isValidContentId } from '@/utils/validation';

export function useContentExists(contentId: string) {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state when contentId changes
    setExists(null);
    setError(null);
    
    // Skip check for invalid IDs
    if (!isValidContentId(contentId)) {
      setExists(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const checkIfExists = async () => {
      try {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('id')
          .eq('id', contentId)
          .maybeSingle();

        if (!isMounted) return;
        
        if (error) throw error;
        
        // If data is found, the content exists
        setExists(!!data);
      } catch (err) {
        if (!isMounted) return;
        
        const errorObj = err instanceof Error ? err : new Error('Failed to check if content exists');
        setError(errorObj);
        handleError(errorObj, 'Failed to check content existence');
        setExists(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkIfExists();

    return () => {
      isMounted = false;
    };
  }, [contentId]);

  return { exists, isLoading, error };
}
