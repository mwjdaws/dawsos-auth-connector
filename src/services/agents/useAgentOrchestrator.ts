
import { useAgentLogger } from '@/hooks/useAgentLogger';
import { Json } from '@/integrations/supabase/types';
import { AgentTaskRequest, AgentTaskResult } from './types';
import { agentOrchestrator } from './agentOrchestrator';

/**
 * Hook for working with the agent orchestrator in React components
 */
export function useAgentOrchestrator() {
  const { logSuccess, logFailure } = useAgentLogger();
  
  /**
   * Run an agent task with UI feedback
   */
  const runTask = async (
    request: AgentTaskRequest, 
    showToast: boolean = true
  ): Promise<AgentTaskResult> => {
    try {
      const result = await agentOrchestrator.submitTask(request);
      
      if (result.success && showToast) {
        logSuccess(
          request.agentName,
          request.action,
          request.knowledgeSourceId,
          result.data?.confidence,
          request.metadata as Record<string, any>,
          true // Show toast
        );
      } else if (!result.success && showToast) {
        logFailure(
          request.agentName,
          request.action,
          result.error || 'Unknown error',
          request.knowledgeSourceId,
          request.metadata as Record<string, any>,
          true // Show toast
        );
      }
      
      return result;
    } catch (error) {
      console.error("Error running agent task:", error);
      
      if (showToast) {
        logFailure(
          request.agentName,
          request.action,
          error instanceof Error ? error.message : String(error),
          request.knowledgeSourceId,
          request.metadata as Record<string, any>,
          true
        );
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  };
  
  return {
    runTask,
    getBackgroundTaskStatus: agentOrchestrator.getBackgroundTaskStatus.bind(agentOrchestrator),
    getBackgroundTasksForSource: agentOrchestrator.getBackgroundTasksForSource.bind(agentOrchestrator),
    getQueueStatus: agentOrchestrator.getQueueStatus.bind(agentOrchestrator)
  };
}
