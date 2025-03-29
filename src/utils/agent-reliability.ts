
/**
 * Agent Reliability Utilities
 * 
 * Provides utilities for enhancing agent task reliability:
 * - Structured retry logic
 * - Result validation
 * - Error handling and recovery
 * - Task tracking and resumption
 */

import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./errors";
import { invokeEdgeFunctionReliably } from "./edge-function-reliability";

/**
 * Agent task status
 */
export type AgentTaskStatus = 
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "retry_scheduled"
  | "notified"; // Add notified status

/**
 * Agent task priority
 */
export type AgentTaskPriority = "high" | "medium" | "low";

/**
 * Interface for agent task execution options
 */
export interface AgentTaskOptions {
  agentName: string;
  action: string;
  knowledgeSourceId?: string;
  metadata?: Record<string, any>;
  priority?: AgentTaskPriority;
  maxRetries?: number;
  runInBackground?: boolean;
}

/**
 * Interface for agent task execution result
 */
export interface AgentTaskResult {
  success: boolean;
  taskId?: string;
  data?: any;
  error?: string;
  executionTime?: number;
}

/**
 * Creates and submits an agent task with reliability enhancements
 */
export async function executeAgentTask(
  options: AgentTaskOptions
): Promise<AgentTaskResult> {
  const {
    agentName,
    action,
    knowledgeSourceId,
    metadata = {},
    priority = "medium",
    maxRetries = 3,
    runInBackground = false,
  } = options;

  try {
    // For tasks that should run in the background, create a task record and submit
    if (runInBackground) {
      const { data: taskData, error } = await supabase
        .from("agent_tasks")
        .insert({
          agent_name: agentName,
          // action field might not exist, use payload to store it
          payload: {
            ...metadata,
            action,
            priority,
            maxRetries,
          },
          status: "pending",
          priority,
          max_retries: maxRetries,
          knowledge_source_id: knowledgeSourceId,
        })
        .select("id")
        .single();
        
      if (error) throw error;
      
      // Trigger the task processor
      await invokeEdgeFunctionReliably(
        "process-agent-tasks",
        { trigger: "manual" },
        { showErrorToast: false }
      );
      
      return {
        success: true,
        taskId: taskData?.id,
        data: { message: "Task submitted for background processing" },
      };
    }
    
    // For immediate execution
    const result = await invokeEdgeFunctionReliably(
      "execute-agent-task",
      {
        agentName,
        action,
        knowledgeSourceId,
        metadata,
      },
      {
        maxRetries,
        timeoutMs: 30000, // Longer timeout for agent tasks
      }
    );
    
    // Check if result has data and confidence properties
    const confidence = result && typeof result === 'object' && 'data' in result && 
      typeof result.data === 'object' && result.data && 'confidence' in result.data ? 
      result.data.confidence : undefined;
    
    // Log the successful execution
    await logAgentSuccess(agentName, action, knowledgeSourceId, confidence, metadata);
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    // Log the failure
    const errorMessage = error instanceof Error ? error.message : String(error);
    await logAgentFailure(agentName, action, errorMessage, knowledgeSourceId, metadata);
    
    handleError(
      error,
      `Agent task failed: ${action}`,
      { level: "error", context: { agentName, action, knowledgeSourceId } }
    );
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Logs a successful agent action
 */
export async function logAgentSuccess(
  agentName: string,
  action: string,
  knowledgeSourceId?: string,
  confidence?: number,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabase
      .from("agent_actions")
      .insert({
        agent_name: agentName,
        action,
        knowledge_source_id: knowledgeSourceId,
        confidence,
        metadata,
        success: true,
      });
  } catch (error) {
    console.error("Failed to log agent success:", error);
    // Don't throw for logging failures
  }
}

/**
 * Logs a failed agent action
 */
export async function logAgentFailure(
  agentName: string,
  action: string,
  error: string,
  knowledgeSourceId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabase
      .from("agent_actions")
      .insert({
        agent_name: agentName,
        action,
        knowledge_source_id: knowledgeSourceId,
        metadata,
        success: false,
        error,
      });
  } catch (err) {
    console.error("Failed to log agent failure:", err);
    // Don't throw for logging failures
  }
}

/**
 * Gets the status of a background agent task
 */
export async function getAgentTaskStatus(taskId: string): Promise<{
  status: AgentTaskStatus;
  retryCount: number;
  lastAttempt?: Date;
  nextAttempt?: Date;
  error?: string;
  result?: any;
}> {
  try {
    const { data, error } = await supabase
      .from("agent_tasks")
      .select("*")
      .eq("id", taskId)
      .single();
      
    if (error) throw error;
    
    // Safely access payload data with type checking
    let resultData = undefined;
    if (data.payload && typeof data.payload === 'object') {
      if ('result' in data.payload) {
        resultData = data.payload.result;
      }
    }
    
    return {
      status: data.status as AgentTaskStatus,
      retryCount: data.retry_count,
      lastAttempt: data.last_attempt_at ? new Date(data.last_attempt_at) : undefined,
      nextAttempt: data.next_attempt_at ? new Date(data.next_attempt_at) : undefined,
      error: data.error_message,
      result: resultData,
    };
  } catch (error) {
    handleError(
      error,
      "Failed to get agent task status",
      { level: "warning", silent: true }
    );
    
    return {
      status: "failed",
      retryCount: 0,
      error: "Failed to fetch task status",
    };
  }
}
