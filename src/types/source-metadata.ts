
/**
 * Source Metadata Types
 * 
 * Types for storing metadata about knowledge sources
 */

export interface SourceMetadata {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  template_id: string | null;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  published: boolean;
  published_at: string | null;
}

export interface ExternalSourceMetadata {
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
}
