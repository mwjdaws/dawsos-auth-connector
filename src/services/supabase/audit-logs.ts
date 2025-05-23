
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { handleError } from '@/utils/errors';

export type AuditStatus = 'success' | 'error' | 'unchanged' | 'changed';

export interface ExternalLinkAudit {
  id: string;
  knowledge_source_id: string;
  user_id: string | null;
  checked_at: string;
  status: AuditStatus;
  notes: string | null;
  content_hash: string | null;
}

/**
 * Validates that a string is a valid AuditStatus
 */
function isValidAuditStatus(status: string): status is AuditStatus {
  return ['success', 'error', 'unchanged', 'changed'].includes(status);
}

/**
 * Transforms raw database record to typed ExternalLinkAudit
 */
function transformAuditRecord(record: any): ExternalLinkAudit {
  const status = record.status;
  
  if (!isValidAuditStatus(status)) {
    console.warn(`Invalid audit status received: ${status}, defaulting to 'error'`);
  }
  
  return {
    ...record,
    status: isValidAuditStatus(status) ? status : 'error'
  };
}

/**
 * Fetches audit logs for a specific knowledge source
 */
export async function fetchAuditLogs(knowledgeSourceId: string): Promise<ExternalLinkAudit[]> {
  try {
    const { data, error } = await supabase
      .from('external_link_audits')
      .select('*')
      .eq('knowledge_source_id', knowledgeSourceId)
      .order('checked_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform raw data to properly typed records
    return (data || []).map(transformAuditRecord);
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    handleError(error, "Failed to fetch audit logs");
    return [];
  }
}

/**
 * Fetches the latest audit log entry for each knowledge source
 */
export async function fetchLatestAuditLogs(knowledgeSourceIds: string[]): Promise<Record<string, ExternalLinkAudit>> {
  if (!knowledgeSourceIds.length) {
    return {};
  }
  
  try {
    // Create a query to get the latest audit log for each knowledge source
    const { data, error } = await supabase
      .from('external_link_audits')
      .select('*')
      .in('knowledge_source_id', knowledgeSourceIds)
      .order('checked_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Group by knowledge_source_id and take the latest entry
    const latestAudits: Record<string, ExternalLinkAudit> = {};
    
    // Apply transformation to each record before storing
    (data || []).forEach(record => {
      const audit = transformAuditRecord(record);
      if (!latestAudits[audit.knowledge_source_id] || 
          new Date(audit.checked_at) > new Date(latestAudits[audit.knowledge_source_id].checked_at)) {
        latestAudits[audit.knowledge_source_id] = audit;
      }
    });
    
    return latestAudits;
  } catch (error) {
    console.error('Failed to fetch latest audit logs:', error);
    handleError(error, "Failed to fetch latest audit logs");
    return {};
  }
}

/**
 * Creates a new audit log entry
 */
export async function createAuditLog(
  knowledgeSourceId: string,
  status: AuditStatus,
  notes: string | null = null,
  contentHash: string | null = null
): Promise<ExternalLinkAudit | null> {
  try {
    const { data, error } = await supabase
      .from('external_link_audits')
      .insert({
        knowledge_source_id: knowledgeSourceId,
        status,
        notes,
        content_hash: contentHash
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Ensure returned data is properly typed
    return transformAuditRecord(data);
  } catch (error) {
    console.error('Failed to create audit log:', error);
    toast({
      title: 'Error',
      description: 'Failed to create audit log entry',
      variant: 'destructive'
    });
    handleError(error, "Failed to create audit log");
    return null;
  }
}
