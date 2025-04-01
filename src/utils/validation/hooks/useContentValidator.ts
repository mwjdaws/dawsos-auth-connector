
import { useQuery } from '@tanstack/react-query';
import { validateContentId, isValidContentId } from '../contentIdValidation';
import { supabase } from '@/integrations/supabase/client';
import { ContentIdValidationResult } from '../types';

/**
 * Custom hook to validate content IDs and check if they exist in the database
 * 
 * @param contentId The content ID to validate
 * @returns ValidationResult object with validation details
 */
export function useContentValidator(contentId: string): ContentIdValidationResult {
  // First validate the format without a database check
  const formatValidation = validateContentId(contentId);
  
  // If the format is invalid, return early
  if (!formatValidation.isValid) {
    return formatValidation;
  }
  
  // Use React Query to check existence if the format is valid
  const { data: exists = false, isLoading } = useQuery({
    queryKey: contentId ? ['contentExists', contentId] : null,
    queryFn: async () => {
      // Skip DB check for temporary IDs (they won't be in the DB)
      if (contentId.startsWith('temp-')) {
        return false;
      }
      
      try {
        const { count, error } = await supabase
          .from('knowledge_sources')
          .select('id', { count: 'exact', head: true })
          .eq('id', contentId);
        
        if (error) {
          console.error('Error checking content existence:', error);
          return false;
        }
        
        return count > 0;
      } catch (err) {
        console.error('Failed to check content existence:', err);
        return false;
      }
    },
    enabled: isValidContentId(contentId) && !contentId.startsWith('temp-'),
    staleTime: 60000, // Cache for 1 minute
  });
  
  // Return the combined validation result
  return {
    isValid: formatValidation.isValid,
    contentExists: exists,
    errorMessage: null,
    resultType: "contentId"
  };
}

export default useContentValidator;
