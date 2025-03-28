
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Triggers validation of an external source for a knowledge source
 * @param sourceId - UUID of the knowledge source to validate
 * @returns Promise with the validation result
 */
export async function validateExternalSource(sourceId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('check-external-source', {
      body: { knowledgeSourceId: sourceId }
    });
    
    if (error) {
      console.error('External source validation error:', error);
      throw new Error(`Function error: ${error.message}`);
    }
    
    // Log the result to the console for debugging
    console.log(`External source check for ${sourceId}:`, data);
    
    // Return the validation result
    return data;
  } catch (error) {
    console.error('Failed to validate external source:', error);
    toast({
      title: 'Validation Error',
      description: `Failed to validate external source: ${error.message}`,
      variant: 'destructive'
    });
    throw error;
  }
}

/**
 * Manually flags a knowledge source for external review
 * @param sourceId - UUID of the knowledge source to flag
 * @returns Promise resolving to success status
 */
export async function markForExternalReview(sourceId: string) {
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .update({
        needs_external_review: true
      })
      .eq('id', sourceId)
      .select('id, title')
      .single();
    
    if (error) {
      console.error('Error marking for review:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    toast({
      title: 'Success',
      description: `Document "${data.title}" has been marked for external review.`
    });
    
    return true;
  } catch (error) {
    console.error('Failed to mark for external review:', error);
    toast({
      title: 'Error',
      description: `Failed to mark for external review: ${error.message}`,
      variant: 'destructive'
    });
    return false;
  }
}
