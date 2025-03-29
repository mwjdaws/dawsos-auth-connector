
import { logAgentAction, logAgentSuccess, logAgentFailure } from '@/services/supabase/agent-actions';
import { Json } from '@/integrations/supabase/types';
import { executeAgentTask } from './agentImplementations';
import { AgentTaskRequest, AgentTaskResult } from './types';

/**
 * Execute an agent task and handle logging
 */
export async function executeTask(request: AgentTaskRequest): Promise<AgentTaskResult> {
  const taskId = `${request.agentName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    // Log the start of task execution
    await logAgentAction({
      knowledge_source_id: request.knowledgeSourceId,
      agent_name: request.agentName,
      action: request.action,
      metadata: request.metadata as Record<string, any> as Json
    });
    
    console.log(`[TaskExecutor] Starting task ${taskId} for agent ${request.agentName}`);
    
    // Track task execution time
    const startTime = Date.now();
    
    // Execute the appropriate agent based on type
    const result = await executeAgentTask(request);
    
    const executionTime = Date.now() - startTime;
    
    // Log successful completion
    if (result.success) {
      await logAgentSuccess(
        request.agentName,
        request.action,
        request.knowledgeSourceId,
        result.data?.confidence,
        request.metadata as Record<string, any>
      );
    } else {
      // Log failure
      await logAgentFailure(
        request.agentName,
        request.action,
        result.error || 'Unknown error',
        request.knowledgeSourceId,
        request.metadata as Record<string, any>
      );
    }
    
    return {
      ...result,
      taskId,
      executionTime
    };
  } catch (error) {
    console.error(`[TaskExecutor] Error in task ${taskId}:`, error);
    
    // Log the error
    await logAgentFailure(
      request.agentName,
      request.action,
      error instanceof Error ? error.message : String(error),
      request.knowledgeSourceId,
      request.metadata as Record<string, any>
    );
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      taskId
    };
  }
}
