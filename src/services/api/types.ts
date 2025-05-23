
import { Json } from '@/types/supabase';

/**
 * Knowledge template interface
 */
export interface KnowledgeTemplate {
  id: string;
  name: string;
  content: string;
  structure: Json;
  metadata: Json;
  user_id: string | null;
  is_global: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * Knowledge source interface
 */
export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  user_id?: string | null;
  created_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  template_id?: string | null;
  external_source_url?: string | null;
  external_content_hash?: string | null;
  external_source_checked_at?: string | null;
  needs_external_review?: boolean;
  published?: boolean;
  published_at?: string | null;
  metadata?: Json | null;
}

/**
 * Document operation result interface
 */
export interface DocumentOperationResult {
  success: boolean;
  contentId: string | null;
  documentId?: string | null; // Add documentId field for compatibility
  error?: any;
}

/**
 * Publish operation result interface
 */
export interface PublishResult {
  success: boolean;
  documentId: string | null;
  contentId?: string | null; // Add contentId field for compatibility
  error?: any;
}

/**
 * Knowledge source version interface
 */
export interface KnowledgeSourceVersion {
  id: string;
  source_id: string | null;
  version_number: number;
  content: string;
  metadata: Json | null;
  created_at: string | null;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Pagination result
 */
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    count: number;
  };
}

/**
 * Simplified KnowledgeSource for UI components
 */
export interface KnowledgeSourceUI {
  id: string;
  title: string;
  content: string;
}

/**
 * Version metadata structure
 */
export interface VersionMetadata {
  reason?: string;
  published?: boolean;
  isAutoSave?: boolean;
  [key: string]: any;
}
