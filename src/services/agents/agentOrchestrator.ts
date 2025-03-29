
import { executeTask } from './taskExecutor';
import { submitBackgroundTask, getBackgroundTaskStatus, getBackgroundTasksForSource, getQueueStatus } from './backgroundTaskHandler';
import { AgentTaskRequest, AgentTaskResult } from './types';

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
    try {
      // Check if task should run in the background
      if (request.runInBackground) {
        return await submitBackgroundTask(request);
      }
      
      // Execute the task directly
      return await executeTask(request);
    } catch (error) {
      console.error(`[AgentOrchestrator] Error handling task:`, error);
      
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
    return getBackgroundTaskStatus(taskId);
  }

  /**
   * Get all background tasks for a knowledge source
   */
  public async getBackgroundTasksForSource(knowledgeSourceId: string): Promise<AgentTaskResult> {
    return getBackgroundTasksForSource(knowledgeSourceId);
  }

  /**
   * Get current queue status
   */
  public async getQueueStatus(): Promise<{ queuedTasks: number, runningTasks: number, pendingBackgroundTasks: number }> {
    const pendingBackgroundTasks = await getQueueStatus();
    
    return {
      queuedTasks: this.taskQueue.size,
      runningTasks: this.runningTasks.size,
      pendingBackgroundTasks
    };
  }
}

// Export singleton instance for direct usage
export const agentOrchestrator = AgentOrchestrator.getInstance();
