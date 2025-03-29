
import { logAgentAction, logAgentFailure } from '@/services/supabase/agent-actions';
import { Json } from '@/integrations/supabase/types';
import { enqueueTask, getTaskStatus, getTasksForSource, getPendingTasksCount } from './taskQueue';
import { AgentTaskRequest, AgentTaskResult } from './types';

/**
 * Submit a task to run in the background job queue
 */
export async function submitBackgroundTask(request: AgentTaskRequest): Promise<AgentTaskResult> {
  try {
    console.log(`[BackgroundTaskHandler] Queueing background task for agent ${request.agentName}`);
    
    // Enqueue the task in the background job system
    const queueResult = await enqueueTask({
      knowledgeSourceId: request.knowledgeSourceId,
      agentName: request.agentName,
      action: request.action,
      priority: request.priority,
      payload: request.metadata
    });
    
    if (!queueResult.success) {
      throw new Error(queueResult.error || 'Failed to enqueue background task');
    }
    
    // Log action for tracking
    await logAgentAction({
      knowledge_source_id: request.knowledgeSourceId,
      agent_name: request.agentName,
      action: `${request.action}:queued`,
      metadata: {
        ...request.metadata,
        backgroundTaskId: queueResult.taskId
      } as unknown as Json
    });
    
    return {
      success: true,
      taskId: `background-${Date.now()}`,
      backgroundTaskId: queueResult.taskId,
      data: {
        message: 'Task queued for background processing',
        taskId: queueResult.taskId
      }
    };
  } catch (error) {
    console.error(`[BackgroundTaskHandler] Error queueing background task:`, error);
    
    await logAgentFailure(
      request.agentName,
      `${request.action}:queue-failed`,
      error instanceof Error ? error.message : String(error),
      request.knowledgeSourceId,
      request.metadata as unknown as Json
    );
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get background task status
 */
export async function getBackgroundTaskStatus(taskId: string): Promise<AgentTaskResult> {
  try {
    const result = await getTaskStatus(taskId);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get task status');
    }
    
    const task = result.task;
    
    return {
      success: true,
      taskId,
      data: {
        status: task.status,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        retryCount: task.retry_count,
        payload: task.payload,
        error: task.error_message
      }
    };
  } catch (error) {
    console.error(`[BackgroundTaskHandler] Error getting task status:`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      taskId
    };
  }
}

/**
 * Get all background tasks for a knowledge source
 */
export async function getBackgroundTasksForSource(knowledgeSourceId: string): Promise<AgentTaskResult> {
  try {
    const result = await getTasksForSource(knowledgeSourceId);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get tasks for knowledge source');
    }
    
    return {
      success: true,
      data: {
        tasks: result.tasks
      }
    };
  } catch (error) {
    console.error(`[BackgroundTaskHandler] Error getting tasks for source:`, error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get current queue status
 */
export async function getQueueStatus(): Promise<number> {
  const pendingResult = await getPendingTasksCount();
  return pendingResult.success ? pendingResult.count : 0;
}
