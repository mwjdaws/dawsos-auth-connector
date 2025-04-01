
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

// Add more types as needed
export interface DocumentOperationResult {
  success: boolean;
  contentId: string | null;
  error?: any;
}

export interface SaveDraftResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

export interface PublishResult {
  success: boolean;
  documentId: string | null;
  error?: any;
}

export interface DraftOperationsContext {
  userId?: string;
  createVersion?: (documentId: string, content: string, metadata?: any) => Promise<void>;
}

export interface PublishOperationsContext {
  userId?: string;
}
