
/**
 * Type definitions for agent tasks in the application
 */

declare interface AgentTask {
  id: string;
  agent_name: string;
  action: string;
  knowledge_source_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retry_count: number;
  max_retries: number;
  error_message?: string;
  last_attempt_at?: string;
  next_attempt_at?: string;
  priority?: 'high' | 'medium' | 'low';
  payload?: any;
  created_at: string;
  updated_at: string;
  notified?: boolean; // Add this field which is used in Dashboard.tsx
}

declare interface AgentTasksResponse {
  data: AgentTask[] | null;
  error: any;
}
