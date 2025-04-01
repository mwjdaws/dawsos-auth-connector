
/**
 * Type definitions for source metadata
 */

export interface SourceMetadata {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  created_by: string | null;
  template_id: string | null;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  published: boolean;
  metadata?: Record<string, any> | null;
}

/**
 * Converts raw database data to a SourceMetadata object
 */
export function toSourceMetadata(data: any): SourceMetadata | null {
  if (!data) return null;
  
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    user_id: data.user_id,
    created_by: data.created_by,
    template_id: data.template_id,
    external_source_url: data.external_source_url,
    external_source_checked_at: data.external_source_checked_at,
    external_content_hash: data.external_content_hash,
    needs_external_review: data.needs_external_review || false,
    published: data.published || false,
    metadata: data.metadata
  };
}

/**
 * Represents external source metadata
 */
export interface ExternalSourceMetadata {
  external_source_url: string | null;
  needs_external_review: boolean;
  external_source_checked_at: string | null;
}
