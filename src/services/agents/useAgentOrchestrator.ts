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
          request.metadata as unknown as Json,
          true // Show toast
        );
      } else if (!result.success && showToast) {
        logFailure(
          request.agentName,
          request.action,
          result.error || 'Unknown error',
          request.knowledgeSourceId,
          request.metadata as unknown as Json,
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
          request.metadata as unknown as Json,
          true
        );
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  };
  
  /**
   * Get the status of a background task
   */
  const getBackgroundTaskStatus = async (taskId: string): Promise<AgentTaskResult> => {
    return agentOrchestrator.getBackgroundTaskStatus(taskId);
  };
  
  /**
   * Get all background tasks for a knowledge source
   */
  const getBackgroundTasksForSource = async (knowledgeSourceId: string): Promise<AgentTaskResult> => {
    return agentOrchestrator.getBackgroundTasksForSource(knowledgeSourceId);
  };
  
  /**
   * Get the current queue status
   */
  const getQueueStatus = async (): Promise<{ queuedTasks: number, runningTasks: number, pendingBackgroundTasks: number }> => {
    return agentOrchestrator.getQueueStatus();
  };
  
  return {
    runTask,
    getBackgroundTaskStatus: agentOrchestrator.getBackgroundTaskStatus.bind(agentOrchestrator),
    getBackgroundTasksForSource: agentOrchestrator.getBackgroundTasksForSource.bind(agentOrchestrator),
    getQueueStatus: agentOrchestrator.getQueueStatus.bind(agentOrchestrator)
  };
}
