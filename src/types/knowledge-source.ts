
/**
 * Knowledge Source Types
 * 
 * Types for knowledge sources and related metadata
 */

export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  template_id: string | null;
  external_source_url: string | null;
  external_source_checked_at: string | null;
  external_content_hash: string | null;
  needs_external_review: boolean;
  user_id: string | null;
  published: boolean;
  published_at: string | null;
}

export interface KnowledgeSourceMetadata {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  template_id: string | null;
  external_source_url: string | null;
  published: boolean;
  published_at: string | null;
}
