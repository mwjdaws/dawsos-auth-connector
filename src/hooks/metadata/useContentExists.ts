
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation';

/**
 * Hook to check if content with the given ID exists in the database
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
          setExists(!!data);
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
