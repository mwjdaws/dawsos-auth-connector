
/**
 * Content-related type definitions
 */

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  template_id?: string | null;
  created_at?: string;
  updated_at?: string;
  user_id: string;
  published?: boolean;
  external_source_url?: string | null;
  external_source_checked_at?: string | null;
  external_content_hash?: string | null;
  needs_external_review?: boolean;
}

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  schema?: any;
}
