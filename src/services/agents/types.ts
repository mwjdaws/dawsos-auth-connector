
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
