
/**
 * API-related type definitions
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retryCount?: number;
  abortSignal?: AbortSignal;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}
