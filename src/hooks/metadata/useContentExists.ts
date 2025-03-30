
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation';

/**
 * Hook to check if a content ID exists in the database
 */
export function useContentExists(contentId?: string) {
  const [exists, setExists] = useState<boolean>(false);
  const [isValidId, setIsValidId] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkContentExists = async () => {
      if (!contentId) {
        setExists(false);
        setIsValidId(false);
        setIsLoading(false);
        return;
      }

      // First check if ID is valid format
      const isValid = isValidContentId(contentId);
      setIsValidId(isValid);

      if (!isValid) {
        setExists(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('id')
          .eq('id', contentId)
          .maybeSingle();

        if (error) throw error;
        
        setExists(!!data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking if content exists:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setExists(false);
        setIsLoading(false);
      }
    };

    checkContentExists();
  }, [contentId]);

  return { exists, isValidId, isLoading, error };
}
