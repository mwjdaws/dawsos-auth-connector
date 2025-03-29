
import { useAgentLogger } from '@/hooks/useAgentLogger';
import { logAgentAction, logAgentSuccess, logAgentFailure } from '@/services/supabase/agent-actions';
import { enrichSingleSource } from '@/services/api/enrichment';
import { Json } from '@/integrations/supabase/types';

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
      // Log the start of task execution
      await logAgentAction({
        knowledge_source_id: request.knowledgeSourceId,
        agent_name: request.agentName,
        action: request.action,
        metadata: request.metadata as Json
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
          { 
            ...request.metadata, 
            executionTime,
            result: result.data 
          } as Json
        );
      } else {
        // Log failure
        await logAgentFailure(
          request.agentName,
          request.action,
          result.error || 'Unknown error',
          request.knowledgeSourceId,
          { 
            ...request.metadata, 
            executionTime 
          } as Json
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
        request.metadata as Json
      );
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        taskId
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
   * Get current queue status
   */
  public getQueueStatus(): { queuedTasks: number, runningTasks: number } {
    return {
      queuedTasks: this.taskQueue.size,
      runningTasks: this.runningTasks.size
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
          { ...request.metadata, executionTime: result.executionTime },
          true // Show toast
        );
      } else if (!result.success && showToast) {
        logFailure(
          request.agentName,
          request.action,
          result.error || 'Unknown error',
          request.knowledgeSourceId,
          { ...request.metadata, executionTime: result.executionTime },
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
          request.metadata,
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
    getQueueStatus: orchestrator.getQueueStatus.bind(orchestrator)
  };
}

// Export singleton instance for direct usage
export const agentOrchestrator = AgentOrchestrator.getInstance();
