
/**
 * Base API utilities and types
 */
import { handleApiError } from '@/utils/error-handling';

// Export ApiError as a type
export type { ApiError } from '@/utils/errors/types';

// Base API response interface
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// API request options interface
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  cache?: RequestCache;
  signal?: AbortSignal;
}

// Create a base fetch function
export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    handleApiError(error instanceof Error ? error : new Error(String(error)), {
      source: 'api',
      level: 'error',
    });
    throw error;
  }
}
