
import { supabase } from '@/integrations/supabase/client';

/**
 * Interface for the agent action data
 */
export interface AgentAction {
  id?: string;
  knowledge_source_id: string;
  agent_name: string;
  action: string;
  confidence?: number;
  success?: boolean;
  error?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

/**
 * Logs an agent action to the database
 * @param action The agent action to log
 * @returns The created agent action record
 */
export async function logAgentAction(action: Omit<AgentAction, 'id' | 'created_at'>): Promise<{ data: AgentAction | null, error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('agent_actions')
      .insert(action)
      .select()
      .single();
    
    if (error) {
      console.error('Error logging agent action:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Exception logging agent action:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Gets agent actions for a specific knowledge source
 * @param knowledgeSourceId The ID of the knowledge source
 * @returns List of agent actions
 */
export async function getAgentActions(knowledgeSourceId: string): Promise<{ data: AgentAction[] | null, error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('agent_actions')
      .select('*')
      .eq('knowledge_source_id', knowledgeSourceId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching agent actions:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Exception fetching agent actions:', error);
    return { data: null, error: error as Error };
  }
}

/**
 * Creates a failure record for an agent action
 * @param agentName The name of the agent
 * @param action The action being performed
 * @param knowledgeSourceId The ID of the knowledge source (optional)
 * @param error The error message
 * @param metadata Additional metadata
 * @returns The created agent action record
 */
export async function logAgentFailure(
  agentName: string,
  action: string,
  error: string,
  knowledgeSourceId?: string,
  metadata?: Record<string, any>
): Promise<{ data: AgentAction | null, error: Error | null }> {
  return logAgentAction({
    knowledge_source_id: knowledgeSourceId || '00000000-0000-0000-0000-000000000000',
    agent_name: agentName,
    action,
    success: false,
    error,
    metadata
  });
}

/**
 * Creates a success record for an agent action
 * @param agentName The name of the agent
 * @param action The action being performed
 * @param knowledgeSourceId The ID of the knowledge source
 * @param confidence Optional confidence score
 * @param metadata Additional metadata
 * @returns The created agent action record
 */
export async function logAgentSuccess(
  agentName: string,
  action: string,
  knowledgeSourceId: string,
  confidence?: number,
  metadata?: Record<string, any>
): Promise<{ data: AgentAction | null, error: Error | null }> {
  return logAgentAction({
    knowledge_source_id: knowledgeSourceId,
    agent_name: agentName,
    action,
    success: true,
    confidence,
    metadata
  });
}
