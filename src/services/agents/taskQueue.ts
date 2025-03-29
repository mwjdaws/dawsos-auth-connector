
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errors';
import { AgentType, TaskPriority } from './agentOrchestrator';

/**
 * Interface for agent task queue request
 */
export interface TaskQueueRequest {
  knowledgeSourceId: string;
  agentName: AgentType;
  action: string;
  priority?: TaskPriority;
  payload?: Record<string, any>;
  maxRetries?: number;
}

/**
 * Interface for task queue result
 */
export interface TaskQueueResult {
  success: boolean;
  taskId?: string;
  error?: string;
}

/**
 * Add a task to the background processing queue
 */
export async function enqueueTask(request: TaskQueueRequest): Promise<TaskQueueResult> {
  try {
    const { knowledgeSourceId, agentName, action, priority = TaskPriority.MEDIUM, payload = {}, maxRetries = 3 } = request;
    
    // Create task record in the agent_tasks table
    const { data, error } = await supabase
      .from('agent_tasks')
      .insert({
        knowledge_source_id: knowledgeSourceId,
        agent_name: agentName,
        status: 'pending',
        retry_count: 0,
        max_retries: maxRetries,
        priority,
        payload: {
          ...payload,
          action,
          queued_at: new Date().toISOString()
        },
        next_attempt_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      taskId: data?.id
    };
  } catch (error) {
    handleError(error, 'Failed to enqueue task');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get the status of a specific task
 */
export async function getTaskStatus(taskId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      task: data
    };
  } catch (error) {
    handleError(error, 'Failed to get task status');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get tasks for a specific knowledge source
 */
export async function getTasksForSource(knowledgeSourceId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('knowledge_source_id', knowledgeSourceId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      tasks: data
    };
  } catch (error) {
    handleError(error, 'Failed to get tasks for knowledge source');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Get pending tasks count
 */
export async function getPendingTasksCount(): Promise<any> {
  try {
    const { count, error } = await supabase
      .from('agent_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      count
    };
  } catch (error) {
    handleError(error, 'Failed to get pending tasks count');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      count: 0
    };
  }
}
