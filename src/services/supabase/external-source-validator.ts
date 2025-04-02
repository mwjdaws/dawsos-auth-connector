
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { handleError } from '@/utils/errors';
import { ErrorLevel } from '@/utils/errors/types';
import { createAuditLog } from './audit-logs';

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
      // Record error in audit log
      await createAuditLog(
        sourceId,
        'error',
        `Function error: ${error.message}`,
        null
      );
      throw new Error(`Function error: ${error.message}`);
    }
    
    // Log the result to the console for debugging
    console.log(`External source check for ${sourceId}:`, data);
    
    // Create an audit log entry based on the result
    if (data.success) {
      await createAuditLog(
        sourceId,
        data.needsReview ? 'changed' : 'unchanged',
        data.message,
        data.auditRecord?.newContentHash || null
      );
    } else {
      await createAuditLog(
        sourceId,
        'error',
        data.message,
        null
      );
    }
    
    // Return the validation result
    return data;
  } catch (error) {
    console.error('Failed to validate external source:', error);
    toast({
      title: 'Validation Error',
      description: `Failed to validate external source: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: 'destructive'
    });
    handleError(error, "Failed to validate external source.", {
      level: ErrorLevel.Error
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
    
    // Create an audit log entry
    await createAuditLog(
      sourceId,
      'changed',
      'Manually marked for review',
      null
    );
    
    toast({
      title: 'Success',
      description: `Document "${data.title}" has been marked for external review.`
    });
    
    return true;
  } catch (error) {
    console.error('Failed to mark for external review:', error);
    toast({
      title: 'Error',
      description: `Failed to mark for external review: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: 'destructive'
    });
    handleError(error, "Failed to mark content for external review.", {
      level: ErrorLevel.Error
    });
    return false;
  }
}

/**
 * Clears the external review flag for a knowledge source
 * @param sourceId - UUID of the knowledge source to update
 * @returns Promise resolving to success status
 */
export async function clearExternalReviewFlag(sourceId: string) {
  try {
    const { data, error } = await supabase
      .from('knowledge_sources')
      .update({
        needs_external_review: false
      })
      .eq('id', sourceId)
      .select('id, title')
      .single();
    
    if (error) {
      console.error('Error clearing review flag:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    // Create an audit log entry
    await createAuditLog(
      sourceId,
      'success',
      'Manually cleared review flag',
      null
    );
    
    toast({
      title: 'Success',
      description: `Document "${data.title}" has been cleared from external review.`
    });
    
    return true;
  } catch (error) {
    console.error('Failed to clear review flag:', error);
    toast({
      title: 'Error',
      description: `Failed to clear review flag: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: 'destructive'
    });
    handleError(error, "Failed to clear external review flag.", {
      level: ErrorLevel.Error
    });
    return false;
  }
}
