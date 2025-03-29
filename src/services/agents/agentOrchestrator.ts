import { useAgentLogger } from '@/hooks/useAgentLogger';
import { logAgentAction, logAgentSuccess, logAgentFailure } from '@/services/supabase/agent-actions';
import { enrichSingleSource } from '@/services/api/enrichment';
import { Json } from '@/integrations/supabase/types';
import { enqueueTask, getTaskStatus, getTasksForSource, getPendingTasksCount } from './taskQueue';

/**
 * Supported agent types in the system
 */
export enum AgentType {
  ONTOLOGY_ENRICHMENT = 'ontology-enrichment',
  TAG_SUGGESTION = 'tag-suggestion',
  EXTERNAL_SOURCE_VALIDATOR = 'external-source-validator',
  CONTENT_SUMMARIZER = 'content-summarizer'
}

/**
 * Agent task priority levels
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Interface for agent task requests
 */
export interface AgentTaskRequest {
  knowledgeSourceId: string;
  agentName: AgentType;
  action: string;
  priority?: TaskPriority;
  metadata?: Record<string, any>;
  timeout?: number;
  runInBackground?: boolean;
}

/**
 * Interface for agent task responses
 */
export interface AgentTaskResult {
  success: boolean;
  data?: any;
  error?: string;
  taskId?: string;
  executionTime?: number;
  backgroundTaskId?: string;
}

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
      const result = await this.executeAgentTask(request);
      
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
        } as Json
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
   * Execute a specific agent task based on the agent type
   */
  private async executeAgentTask(request: AgentTaskRequest): Promise<AgentTaskResult> {
    switch (request.agentName) {
      case AgentType.ONTOLOGY_ENRICHMENT:
        return this.executeOntologyEnrichment(request);
        
      case AgentType.TAG_SUGGESTION:
        return this.executeTagSuggestion(request);
        
      case AgentType.EXTERNAL_SOURCE_VALIDATOR:
        return this.executeExternalSourceValidation(request);
        
      case AgentType.CONTENT_SUMMARIZER:
        return this.executeContentSummarization(request);
        
      default:
        throw new Error(`Unknown agent type: ${request.agentName}`);
    }
  }

  /**
   * Execute ontology enrichment task
   */
  private async executeOntologyEnrichment(request: AgentTaskRequest): Promise<AgentTaskResult> {
    try {
      const applyOntologyTerms = request.metadata?.applyOntologyTerms === true;
      
      const result = await enrichSingleSource(
        request.knowledgeSourceId, 
        applyOntologyTerms
      );
      
      if (!result || !result.success) {
        return {
          success: false,
          error: "Failed to enrich content"
        };
      }
      
      return {
        success: true,
        data: {
          suggestionsCount: result.suggestionsCount,
          sourceId: result.sourceId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Execute tag suggestion task
   */
  private async executeTagSuggestion(request: AgentTaskRequest): Promise<AgentTaskResult> {
    // This is a placeholder for actual tag suggestion implementation
    // You can add specific implementation when tag generation API is available
    console.log("[AgentOrchestrator] Tag suggestion not fully implemented");
    
    try {
      // Simulate a tag suggestion operation
      const mockTags = ["knowledge", "ontology", "content", "repository"];
      
      // Wait to simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: {
          tags: mockTags,
          confidence: 0.85
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Execute external source validation task
   */
  private async executeExternalSourceValidation(request: AgentTaskRequest): Promise<AgentTaskResult> {
    // This is a placeholder for actual external source validation
    console.log("[AgentOrchestrator] External source validation not fully implemented");
    
    try {
      // Simulate validation process
      const url = request.metadata?.url as string;
      
      if (!url) {
        return {
          success: false,
          error: "No URL provided for validation"
        };
      }
      
      // Simulate validation check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isValid = url.startsWith("https://");
      
      return {
        success: isValid,
        data: {
          url,
          isValid,
          statusCode: isValid ? 200 : 400,
          validatedAt: new Date().toISOString()
        },
        error: isValid ? undefined : "URL must use HTTPS protocol"
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Execute content summarization task
   */
  private async executeContentSummarization(request: AgentTaskRequest): Promise<AgentTaskResult> {
    // This is a placeholder for actual content summarization
    console.log("[AgentOrchestrator] Content summarization not fully implemented");
    
    try {
      // Simulate summarization process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        data: {
          summary: "This is a placeholder summary of the content.",
          confidence: 0.78,
          wordCount: 10
        }
      };
    } catch (error) {
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

/**
 * Hook for working with the agent orchestrator in React components
 */
export function useAgentOrchestrator() {
  const orchestrator = AgentOrchestrator.getInstance();
  const { logSuccess, logFailure } = useAgentLogger();
  
  /**
   * Run an agent task with UI feedback
   */
  const runTask = async (
    request: AgentTaskRequest, 
    showToast: boolean = true
  ): Promise<AgentTaskResult> => {
    try {
      const result = await orchestrator.submitTask(request);
      
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
    return orchestrator.getBackgroundTaskStatus(taskId);
  };
  
  /**
   * Get all background tasks for a knowledge source
   */
  const getBackgroundTasksForSource = async (knowledgeSourceId: string): Promise<AgentTaskResult> => {
    return orchestrator.getBackgroundTasksForSource(knowledgeSourceId);
  };
  
  /**
   * Get the current queue status
   */
  const getQueueStatus = async (): Promise<{ queuedTasks: number, runningTasks: number, pendingBackgroundTasks: number }> => {
    return orchestrator.getQueueStatus();
  };
  
  return {
    runTask,
    getBackgroundTaskStatus,
    getBackgroundTasksForSource,
    getQueueStatus
  };
}

// Export singleton instance for direct usage
export const agentOrchestrator = AgentOrchestrator.getInstance();
