
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logAgentSuccess, logAgentFailure } from '@/services/supabase/agent-actions';

/**
 * Hook for logging agent actions
 */
export function useAgentLogger() {
  const { toast } = useToast();

  /**
   * Log a successful agent action
   */
  const logSuccess = useCallback(async (
    agentName: string,
    action: string,
    knowledgeSourceId: string,
    confidence?: number,
    metadata?: Record<string, any>,
    showToast = false
  ) => {
    try {
      const { data, error } = await logAgentSuccess(
        agentName,
        action,
        knowledgeSourceId,
        confidence,
        metadata
      );
      
      if (error) {
        console.error(`Failed to log ${agentName} success:`, error);
        return false;
      }
      
      if (showToast) {
        toast({
          title: `${agentName} completed successfully`,
          description: action,
        });
      }
      
      return true;
    } catch (err) {
      console.error(`Error logging ${agentName} success:`, err);
      return false;
    }
  }, [toast]);

  /**
   * Log a failed agent action
   */
  const logFailure = useCallback(async (
    agentName: string,
    action: string,
    error: string,
    knowledgeSourceId?: string,
    metadata?: Record<string, any>,
    showToast = true
  ) => {
    try {
      const { data, error: logError } = await logAgentFailure(
        agentName,
        action,
        error,
        knowledgeSourceId,
        metadata
      );
      
      if (logError) {
        console.error(`Failed to log ${agentName} failure:`, logError);
        return false;
      }
      
      if (showToast) {
        toast({
          title: `${agentName} failed`,
          description: error || action,
          variant: "destructive",
        });
      }
      
      return true;
    } catch (err) {
      console.error(`Error logging ${agentName} failure:`, err);
      return false;
    }
  }, [toast]);

  return {
    logSuccess,
    logFailure
  };
}
