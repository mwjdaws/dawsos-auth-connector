
/**
 * Source metadata type definitions
 */

export interface SourceMetadata {
  id: string;
  title: string;
  content?: string;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  published: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string | null;
  metadata?: Record<string, any> | null;
}

// Additional utility type for external source operations
export interface ExternalSourceMetadata {
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  last_checked_at?: string | null;
}
