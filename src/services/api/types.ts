
import { Json } from '@/types/supabase';

/**
 * Knowledge template interface
 */
export interface KnowledgeTemplate {
  id: string;
  name: string;
  content: string;
  is_global: boolean;
  metadata: Json;
  structure: Json;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
}

/**
 * Knowledge source interface
 */
export interface KnowledgeSource {
  id: string;
  title: string;
  content: string;
  template_id: string | null;
  external_source_url: string | null;
  external_content_hash: string | null;
  external_source_checked_at: string | null;
  needs_external_review: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string | null;
  created_by: string | null;
}

/**
 * Knowledge source version interface
 */
export interface KnowledgeSourceVersion {
  id: string;
  source_id: string;
  content: string;
  version_number: number;
  metadata: Json;
  created_at: string | null;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * API response interface
 */
export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

/**
 * Document operation result
 */
export interface DocumentOperationResult {
  success: boolean;
  contentId: string | null;
  error?: any;
}

/**
 * Save draft result
 */
export interface SaveDraftResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Publish result
 */
export interface PublishResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

/**
 * Draft operations context
 */
export interface DraftOperationsContext {
  userId?: string;
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<void>;
}

/**
 * Publish operations context
 */
export interface PublishOperationsContext {
  userId?: string;
}
