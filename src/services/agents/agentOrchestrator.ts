
import { useAgentLogger } from '@/hooks/useAgentLogger';
import { logAgentAction, logAgentSuccess, logAgentFailure } from '@/services/supabase/agent-actions';
import { Json } from '@/integrations/supabase/types';
import { enqueueTask, getTaskStatus, getTasksForSource, getPendingTasksCount } from './taskQueue';
import { executeAgentTask } from './agentImplementations';
import { AgentTaskRequest, AgentTaskResult, AgentType, TaskPriority } from './types';

/**
 * Agent Orchestrator class that centrally manages agent tasks
 */
export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private taskQueue: Map<string, AgentTaskRequest>;
  private runningTasks: Set<string>;
  private maxConcurrentTasks: number;

  /**
   * Private constructor (singleton pattern)
   */
  private constructor() {
    this.taskQueue = new Map();
    this.runningTasks = new Set();
    this.maxConcurrentTasks = 3; // Default max concurrent tasks
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  /**
   * Set maximum concurrent tasks
   */
  public setMaxConcurrentTasks(max: number): void {
    this.maxConcurrentTasks = max;
  }

  /**
   * Submit a task to the agent orchestrator
   */
  public async submitTask(request: AgentTaskRequest): Promise<AgentTaskResult> {
    const taskId = `${request.agentName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Check if task should run in the background
      if (request.runInBackground) {
        return await this.submitBackgroundTask(request);
      }
      
      // Log the start of task execution
      await logAgentAction({
        knowledge_source_id: request.knowledgeSourceId,
        agent_name: request.agentName,
        action: request.action,
        metadata: request.metadata as unknown as Json
      });
      
      console.log(`[AgentOrchestrator] Starting task ${taskId} for agent ${request.agentName}`);
      
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
          request.metadata as unknown as Json
        );
      } else {
        // Log failure
        await logAgentFailure(
          request.agentName,
          request.action,
          result.error || 'Unknown error',
          request.knowledgeSourceId,
          request.metadata as unknown as Json
        );
      }
      
      return {
        ...result,
        taskId,
        executionTime
      };
    } catch (error) {
      console.error(`[AgentOrchestrator] Error in task ${taskId}:`, error);
      
      // Log the error
      await logAgentFailure(
        request.agentName,
        request.action,
        error instanceof Error ? error.message : String(error),
        request.knowledgeSourceId,
        request.metadata as unknown as Json
      );
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        taskId
      };
    }
  }

  /**
   * Submit a task to run in the background job queue
   */
  private async submitBackgroundTask(request: AgentTaskRequest): Promise<AgentTaskResult> {
    try {
      console.log(`[AgentOrchestrator] Queueing background task for agent ${request.agentName}`);
      
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
      console.error(`[AgentOrchestrator] Error queueing background task:`, error);
      
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
  public async getBackgroundTaskStatus(taskId: string): Promise<AgentTaskResult> {
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
      console.error(`[AgentOrchestrator] Error getting task status:`, error);
      
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
  public async getBackgroundTasksForSource(knowledgeSourceId: string): Promise<AgentTaskResult> {
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
      console.error(`[AgentOrchestrator] Error getting tasks for source:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Get current queue status
   */
  public async getQueueStatus(): Promise<{ queuedTasks: number, runningTasks: number, pendingBackgroundTasks: number }> {
    const pendingResult = await getPendingTasksCount();
    
    return {
      queuedTasks: this.taskQueue.size,
      runningTasks: this.runningTasks.size,
      pendingBackgroundTasks: pendingResult.success ? pendingResult.count : 0
    };
  }
}

// Export singleton instance for direct usage
export const agentOrchestrator = AgentOrchestrator.getInstance();
