
import { useMemo } from 'react';
import { validateContentId } from '../contentIdValidation';
import { ContentIdValidationResult } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook to validate a content ID and check if it exists
 * 
 * @param contentId The content ID to validate
 * @returns ContentIdValidationResult indicating validity and existence
 */
export function useContentValidator(contentId: string): ContentIdValidationResult {
  // Basic validation
  const basicValidation = useMemo(() => 
    validateContentId(contentId),
    [contentId]
  );
  
  // Check existence in database
  const { data: contentExists, isLoading } = useQuery({
    queryKey: basicValidation.isValid ? ['contentExists', contentId] : null,
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('knowledge_sources')
          .select('id', { count: 'exact', head: true })
          .eq('id', contentId);
          
        if (error) throw error;
        return !!count && count > 0;
      } catch (err) {
        console.error('Error checking content existence:', err);
        return false;
      }
    },
    enabled: basicValidation.isValid && contentId.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Return complete validation result
  return useMemo(() => {
    if (!basicValidation.isValid) {
      return basicValidation;
    }
    
    return {
      ...basicValidation,
      contentExists: contentExists === undefined ? false : contentExists,
      isLoading
    };
  }, [basicValidation, contentExists, isLoading]);
}
