
/**
 * Hook for validating content IDs and checking if content exists
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidContentId } from '@/utils/validation/contentIdValidation';
import { handleError, ErrorLevel } from '@/utils/errors';

interface UseContentValidatorResult {
  isValid: boolean;
  contentExists: boolean;
  errorMessage: string | null;
  isLoading: boolean;
}

/**
 * Hook to validate a content ID and check if it exists in the database
 * 
 * @param contentId - The content ID to validate
 * @returns Validation result object
 */
export function useContentValidator(contentId: string): UseContentValidatorResult {
  const [result, setResult] = useState<UseContentValidatorResult>({
    isValid: false,
    contentExists: false,
    errorMessage: null,
    isLoading: true
  });
  
  useEffect(() => {
    const validateContent = async () => {
      // Reset state for new validation
      setResult(prev => ({ ...prev, isLoading: true }));
      
      // First validate the format of the content ID
      if (!contentId || !isValidContentId(contentId)) {
        setResult({
          isValid: false,
          contentExists: false,
          errorMessage: 'Invalid content ID format',
          isLoading: false
        });
        return;
      }
      
      try {
        // Check if content exists in the database
        const { data, error } = await supabase
          .from('knowledge_sources')
          .select('id')
          .eq('id', contentId)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // PGRST116 is "No rows found" error from PostgREST
            setResult({
              isValid: true,
              contentExists: false,
              errorMessage: 'Content does not exist in the database',
              isLoading: false
            });
          } else {
            handleError(
              error,
              'Error checking if content exists',
              { level: ErrorLevel.WARNING }
            );
            
            setResult({
              isValid: true,
              contentExists: false,
              errorMessage: 'Error checking if content exists',
              isLoading: false
            });
          }
          return;
        }
        
        // Content exists
        setResult({
          isValid: true,
          contentExists: true,
          errorMessage: null,
          isLoading: false
        });
      } catch (error) {
        handleError(
          error,
          'Error validating content',
          { level: ErrorLevel.WARNING }
        );
        
        setResult({
          isValid: false,
          contentExists: false,
          errorMessage: 'Error validating content',
          isLoading: false
        });
      }
    };
    
    validateContent();
  }, [contentId]);
  
  return result;
}

export default useContentValidator;
