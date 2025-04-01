
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
  user_id: string | null;
  published?: boolean;
  external_source_url?: string | null;
  external_source_checked_at?: string | null;
  external_content_hash?: string | null;
  needs_external_review?: boolean;
  metadata?: Record<string, any> | null;
}

export interface KnowledgeSourceVersion {
  id: string;
  source_id: string;
  content: string;
  version_number: number;
  created_at: string | null;
  metadata?: Record<string, any> | null;
}

export interface ContentType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  schema?: any;
}
